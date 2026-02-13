# GoNow

Fast, keyboard-driven navigation to bookmarked URLs via the Chrome omnibox.

Type `` ` `` in the address bar, then a keyword to instantly jump to your saved links.

## Usage

1. Type `` ` `` in the address bar to activate GoNow
2. Type a keyword — matching links appear as suggestions
3. Press Enter to navigate

**Parameterized URLs:** Save a URL with `{}` as a placeholder (e.g. `https://github.com/search?q={}`), then pass a value with `?`:

```
` gh?react
→ https://github.com/search?q=react
```

## Managing Links

Click the extension icon to open the popup where you can:

- **Add** a keyword + URL pair
- **Edit** or **Delete** existing links
- **Sort** alphabetically
- **Import/Export** links as JSON for backup or sharing

## Install (Developer Mode)

1. Clone or download this repo:
   ```bash
   git clone https://github.com/nicobako/gonow.git
   ```
2. Open your Chrome-based browser (Chrome, Edge, Brave, Arc, etc.)
3. Navigate to the extensions page:
   - **Chrome/Brave/Arc:** `chrome://extensions`
   - **Edge:** `edge://extensions`
4. Enable **Developer mode** (toggle in the top-right corner)
5. Click **Load unpacked**
6. Select the cloned `gonow` folder
7. The GoNow icon should appear in your toolbar — click it to start adding links
8. Type `` ` `` in the address bar to verify the omnibox trigger works

## Files

| File | Purpose |
|---|---|
| `manifest.json` | Extension config (Manifest V3) |
| `background.js` | Omnibox listener and navigation |
| `popup.html/css/js` | Link management UI |

## Privacy

GoNow requires two permissions:

- **storage** — to save your keyword-URL pairs via Chrome's sync storage
- **search** — to fall back to your default search engine when a keyword doesn't match

No data is collected or sent to any external server.

## Attribution

Icon: [Pointer icons created by Alfredo Creates - Flaticon](https://www.flaticon.com/free-icons/pointer)
