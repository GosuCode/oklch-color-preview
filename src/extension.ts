import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const decorationTypeCache: vscode.TextEditorDecorationType[] = [];

	function updateDecorations(editor: vscode.TextEditor) {
		// Clear previous decorations
		decorationTypeCache.forEach(d => d.dispose());
		decorationTypeCache.length = 0;

		const text = editor.document.getText();
		const regex = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/gi;
		const decorations: vscode.DecorationOptions[] = [];

		let match;
		while ((match = regex.exec(text))) {
			const startPos = editor.document.positionAt(match.index);
			const endPos = editor.document.positionAt(match.index + match[0].length);
			const range = new vscode.Range(startPos, endPos);

			// Convert to CSS color string
			const colorString = match[0];

			const decorationType = vscode.window.createTextEditorDecorationType({
				before: {
					contentText: ' ',
					backgroundColor: colorString,
					margin: '0 4px 0 0',
					width: '12px',
					height: '12px',
					border: '1px solid #ccc'
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
