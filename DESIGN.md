# GoNow — Chrome Extension Design Document

## Goal

Provide a fast, keyboard-driven way to navigate to bookmarked URLs using Chrome's omnibox (address bar), similar to corporate go/links. The user types `` ` `` followed by a space in the address bar, then types a keyword to instantly navigate to a registered URL.

URLs support a single template placeholder (`{}`), enabling parameterized navigation.

## Requirements

### Omnibox Behavior

- Keyword to activate the extension: `` ` `` (backtick)
- After typing `` ` `` and a space, the omnibox activates and the user types a keyword to navigate to the registered URL.
- `?` is the separator between keyword and placeholder value.
- Keywords may contain `/` and Unicode characters.
- If the URL contains `{}` and a value is provided after `?`, substitute it in.
- If the URL contains `{}` but no `?value` is provided, navigate to the URL with `{}` removed.
- If the URL has no `{}`, navigate to it directly (any `?value` is ignored).
- Suggestions are shown as the user types, matched against registered keywords.

**Examples:**

| Input | Keyword | URL Template | Navigates To |
|---|---|---|---|
| `` ` mail `` | `mail` | `https://gmail.com` | `https://gmail.com` |
| `` ` wiki?React `` | `wiki` | `https://en.wikipedia.org/wiki/{}` | `https://en.wikipedia.org/wiki/React` |
| `` ` docs/api `` | `docs/api` | `https://example.com/api/reference` | `https://example.com/api/reference` |
| `` ` gh/search?rust+lang `` | `gh/search` | `https://github.com/search?q={}` | `https://github.com/search?q=rust+lang` |

### Popup UI

- Small icon to the right of the omnibox (browser action).
- Clicking it shows the list of all registered keywords and their URLs.
- User can add new entries (keyword + URL template).
- User can edit existing entries in place.
- User can delete existing entries.
- User can sort the list alphabetically in ascending or descending order.
- A `?` icon linking to the Chrome Web Store extension page.
- A GitHub icon linking to the GitHub repository.

### Import / Export

- Export all registered links as a file (JSON).
- Import links from a previously exported JSON file.

### Unicode Support

- Keywords and placeholder values must support full Unicode (e.g., `日本語`, `café`).

## Architecture

### Components

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Omnibox   │────▶│ Background        │────▶│ chrome.storage │
│   (input)   │     │ (service worker) │     │    .sync       │
└─────────────┘     └──────────────────┘     └───────────────┘
                                                     ▲
┌─────────────┐                                      │
│  Popup UI   │──────────────────────────────────────┘
│ (manage +   │
│  import/    │
│  export)    │
└─────────────┘
```

1. **Background Service Worker** (`background.js`) — Listens to omnibox events, resolves keywords against storage, performs template substitution, and navigates.
2. **Popup UI** (`popup.html`, `popup.css`, `popup.js`) — Lists registered links, supports add/delete, and provides import/export buttons.
3. **Storage** (`chrome.storage.sync`) — Persists links as key-value pairs, synced across devices via the user's Google account.

### Data Model

Links are stored as a flat object in `chrome.storage.sync`:

```json
{
  "links": {
    "mail": "https://gmail.com",
    "wiki": "https://en.wikipedia.org/wiki/{}",
    "gh/search": "https://github.com/search?q={}",
    "docs/api": "https://example.com/api/reference"
  }
}
```

The export format is the same JSON structure.

## Design Choices

| Decision | Choice | Rationale |
|---|---|---|
| Manifest version | V3 | V2 is deprecated; V3 is the current standard |
| Omnibox keyword | `` ` `` | Short, single keystroke, rarely conflicts with normal input |
| Keyword/value separator | `?` | Allows `/` in keywords; `?` is intuitive as a query delimiter |
| Placeholder syntax | `{}` | Simple, familiar (Python/Rust format strings), only one per URL |
| Storage | `chrome.storage.sync` | Cross-device sync, no backend needed, 100KB limit is sufficient |
| UI framework | Vanilla HTML/CSS/JS | No build step, minimal complexity, easy to contribute to |
| Matching | Prefix match on suggestions | Typing `wi` suggests `wiki`; fast and intuitive |

## Scope

### v1

- Omnibox integration with prefix-matched suggestions
- Template substitution via `keyword?value`
- Popup UI for listing, adding, and deleting links
- Import/export as JSON
- Sync storage across devices
- Edit-in-place for existing entries

### Out of Scope (for now)

- Default starter links on first install
- Multiple placeholders per URL
- Usage analytics or frecency-based sorting
- Link sharing between users
