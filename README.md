# GoNow

Assign short aliases for your URLs.

## Install

1. Clone this repo:
   ```bash
   git clone https://github.com/se-ok/gonow
   ```
2. Go to `chrome://extensions` (or `edge://extensions` for Edge)
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `gonow` folder

## Quickstart

1. Click the extension icon ![icon](icons/icon16.png) and add a link, e.g. keyword `docs`, URL `https://docs.google.com`
2. Type a backtick (`` ` ``) and Space in the address bar, then your keyword:
   ```
   ` docs  →  opens https://docs.google.com
   ```

## Usage

**Unicode keywords** — any characters except `?` (reserved for parameters) are allowed, e.g. `/` to categorize:
```
` work/jira  →  opens https://mycompany.atlassian.net
```

**Parameterized URLs** — use `{}` as a placeholder, pass a value with `?`:
```
Saved URL:  https://github.com/search?q={}
` gh?react  →  opens https://github.com/search?q=react
```


## Privacy

- **storage** — saves keyword-URL pairs via Chrome sync storage
- **search** — falls back to default search engine for unmatched keywords

No data is sent externally.

## Attribution

Icon: [Pointer icons created by Alfredo Creates - Flaticon](https://www.flaticon.com/free-icons/pointer)
