# tools/

Build-time helpers that are not part of the site bundle.

## og-image.html

Source for `public/og-image.png`, the social share card used by the
`og:image` / `twitter:image` tags in `index.html`.

Edit the HTML, then re-render it at exactly 1200×630 with headless Chrome:

```bash
chrome --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=8000 \
  --screenshot=public/og-image.png \
  file:///absolute/path/to/tools/og-image.html
```

On Windows the binary is usually at
`C:\Program Files\Google\Chrome\Application\chrome.exe`.

The `--virtual-time-budget` flag matters: it gives the Google Fonts
stylesheet time to load, otherwise the card renders in fallback fonts.

Re-render this whenever the headline facts change (year, employer, stack)
so link previews don't go stale.
