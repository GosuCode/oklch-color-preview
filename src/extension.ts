import * as vscode from 'vscode';
import * as culori from 'culori';

export function activate(context: vscode.ExtensionContext) {
	const decorationTypeCache: vscode.TextEditorDecorationType[] = [];

	function updateDecorations(editor: vscode.TextEditor) {
		decorationTypeCache.forEach(d => d.dispose());
		decorationTypeCache.length = 0;

		const text = editor.document.getText();
		const regex = /oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi;

		let match;
		while ((match = regex.exec(text))) {
			const startPos = editor.document.positionAt(match.index);
			const endPos = editor.document.positionAt(match.index + match[0].length);
			const range = new vscode.Range(startPos, endPos);

			// Parse OKLCH components (handle percentage values)
			const L = match[1].includes('%') ? parseFloat(match[1].replace('%', '')) / 100 : parseFloat(match[1]);
			const C = match[2].includes('%') ? parseFloat(match[2].replace('%', '')) / 100 : parseFloat(match[2]);
			const h = match[3].includes('%') ? parseFloat(match[3].replace('%', '')) / 100 : parseFloat(match[3]);
			const alpha = match[4] ? parseFloat(match[4].replace('%', '')) / 100 : 1;

			// Convert OKLCH to sRGB
			const oklchColor = { l: L, c: C, h: h, mode: 'oklch' as const };
			const rgb = culori.rgb(oklchColor);

			if (!rgb || rgb.r === null) {
				continue; // skip invalid colors
			}

			// Convert rgb [0-1] to CSS rgba() and clamp out-of-gamut values
			const r = Math.max(0, Math.min(255, Math.round(rgb.r * 255)));
			const g = Math.max(0, Math.min(255, Math.round(rgb.g * 255)));
			const b = Math.max(0, Math.min(255, Math.round(rgb.b * 255)));

			const cssColor = alpha < 1 ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;

			// Check if color was out of gamut (clamped)
			const originalR = Math.round(rgb.r * 255);
			const originalG = Math.round(rgb.g * 255);
			const originalB = Math.round(rgb.b * 255);
			const wasClamped = originalR < 0 || originalR > 255 || originalG < 0 || originalG > 255 || originalB < 0 || originalB > 255;

			// Create a more visible border based on the color
			const isDark = (r + g + b) / 3 < 128;
			let borderColor = isDark ? '#fff' : '#000';

			// Use a special border for out-of-gamut colors
			if (wasClamped) {
				borderColor = '#ff6b6b'; // Red border to indicate clamped colors
			}

			const decorationType = vscode.window.createTextEditorDecorationType({
				before: {
					contentText: ' ',
					backgroundColor: cssColor,
					margin: '0 4px 0 0',
					width: '12px',
					height: '12px',
					border: `1px solid ${borderColor}`
				}
			});

			editor.setDecorations(decorationType, [{ range }]);
			decorationTypeCache.push(decorationType);
		}
	}

	if (vscode.window.activeTextEditor) {
		updateDecorations(vscode.window.activeTextEditor);
	}

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(event => {
			if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
				updateDecorations(vscode.window.activeTextEditor);
			}
		}),
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				updateDecorations(editor);
			}
		})
	);
}

export function deactivate() { }
