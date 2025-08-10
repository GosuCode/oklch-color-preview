import * as vscode from 'vscode';
import * as culori from 'culori';

export function activate(context: vscode.ExtensionContext) {
	const decorationTypeCache: vscode.TextEditorDecorationType[] = [];

	function updateDecorations(editor: vscode.TextEditor) {
		decorationTypeCache.forEach(d => d.dispose());
		decorationTypeCache.length = 0;

		const text = editor.document.getText();
		const regex = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi;

		let match;
		while ((match = regex.exec(text))) {
			const startPos = editor.document.positionAt(match.index);
			const endPos = editor.document.positionAt(match.index + match[0].length);
			const range = new vscode.Range(startPos, endPos);

			// Parse OKLCH components
			const L = parseFloat(match[1]);
			const C = parseFloat(match[2]);
			const h = parseFloat(match[3]);
			const alpha = match[4] ? parseFloat(match[4].replace('%', '')) / 100 : 1;

			// Convert OKLCH to sRGB
			const oklchColor = { l: L, c: C, h: h, mode: 'oklch' as const };
			const rgb = culori.rgb(oklchColor);

			if (!rgb || rgb.r === null) {
				continue; // skip invalid colors
			}

			// Convert rgb [0-1] to CSS rgba()
			const r = Math.round(rgb.r * 255);
			const g = Math.round(rgb.g * 255);
			const b = Math.round(rgb.b * 255);

			// Clamp values between 0-255
			if ([r, g, b].some(c => c < 0 || c > 255)) {
				continue;
			}

			const cssColor = alpha < 1 ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;

			// Debug logging for problematic colors
			if (L === 0 && C === 0) {
				console.log(`OKLCH Debug - L:${L}, C:${C}, h:${h}, alpha:${alpha}`);
				console.log(`RGB: r:${r}, g:${g}, b:${b}`);
				console.log(`CSS Color: ${cssColor}`);
			}

			// Create a more visible border based on the color
			const isDark = (r + g + b) / 3 < 128;
			const borderColor = isDark ? '#fff' : '#000';

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
