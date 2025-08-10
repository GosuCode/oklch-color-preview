# OKLCH Color Preview

A Visual Studio Code extension that provides inline color previews for OKLCH color values in your code. See your colors come to life with real-time previews as you type!

## ✨ Features

- **Inline Color Previews**: See color swatches next to OKLCH color values
- **Real-time Updates**: Previews update automatically as you edit your code
- **Multiple File Types**: Works with CSS, SCSS, Less, JavaScript, and TypeScript files
- **Full OKLCH Support**: Handles all OKLCH color formats including:
  - Standard colors: `oklch(0.5 0.2 45)`
  - Grayscale colors: `oklch(0.5 0 0)`
  - Alpha transparency: `oklch(0.5 0.2 45 / 50%)`
- **Automatic Activation**: Activates when you open supported file types

## 🚀 Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "OKLCH Color Preview"
4. Click Install

## 📖 Usage

Simply open any file with OKLCH color values and you'll see color previews appear inline:

```css
:root {
  --primary: oklch(0.922 0 0); /* Shows white preview */
  --background: oklch(0.145 0 0); /* Shows dark gray preview */
  --accent: oklch(0.488 0.243 264.376); /* Shows blue preview */
  --overlay: oklch(0 0 0 / 50%); /* Shows transparent black preview */
}
```

## 🎨 Supported OKLCH Formats

| Format         | Example                   | Description                 |
| -------------- | ------------------------- | --------------------------- |
| **Standard**   | `oklch(0.5 0.2 45)`       | Lightness, Chroma, Hue      |
| **Grayscale**  | `oklch(0.5 0 0)`          | Lightness only (Chroma = 0) |
| **With Alpha** | `oklch(0.5 0.2 45 / 50%)` | Includes transparency       |
| **Spaced**     | `oklch(0.5  0.2  45)`     | Flexible spacing            |

## 🔧 How It Works

The extension:

1. Scans your document for OKLCH color values using regex patterns
2. Converts OKLCH colors to RGB using the [culori](https://github.com/evercoder/culori) color library
3. Displays inline color swatches with the converted colors
4. Updates in real-time as you edit your code

## 📁 Supported File Types

- CSS (`.css`)
- SCSS (`.scss`)
- Less (`.less`)
- JavaScript (`.js`)
- TypeScript (`.ts`)
- JSX (`.jsx`)
- TSX (`.tsx`)

## 🛠️ Development

### Building from Source

```bash
git clone https://github.com/GosuCode/oklch-color-preview.git
cd oklch-color-preview
npm install
npm run compile
```

### Running Tests

```bash
npm run test
npm run lint
npm run check-types
```

### Packaging

```bash
npm install -g vsce
vsce package
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Built with [VS Code Extension API](https://code.visualstudio.com/api)
- Color conversion powered by [culori](https://github.com/evercoder/culori)
- Inspired by the need for better OKLCH color support in VS Code

## 📞 Support

If you encounter any issues or have feature requests:

- [Open an issue](https://github.com/GosuCode/oklch-color-preview/issues)
- [Submit a feature request](https://github.com/GosuCode/oklch-color-preview/issues/new)

---

**Made with ❤️ for the VS Code community**
