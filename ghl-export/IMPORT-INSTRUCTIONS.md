# GHL Import Instructions — Data Driver Single-File Export

## What This Is

`index.html` is a fully self-contained, single-file export of the Data Driver site. Everything
(HTML structure, CSS, JavaScript, React runtime) is bundled into one file. The only external
dependency is Google Fonts, loaded via CDN link in the `<head>`.

---

## How to Add This to a GHL Funnel or Website Page

### Option A — Custom Code Block (Recommended for Funnels)

1. Open your GHL funnel or website page in the page builder.
2. Add a **Custom Code** element to the page.
3. Paste the ENTIRE contents of `index.html` into the custom code block.
4. Set the element to **full width**.
5. Disable the GHL header and footer for this page (Page Settings > Header/Footer > Off).
6. Save and publish.

### Option B — Custom HTML Page (Recommended for Website Pages)

1. In GHL, go to Sites > Websites (or Funnels).
2. Create a new page or edit an existing one.
3. In Page Settings, enable **Custom Code / Head Code**.
4. Paste the full contents of `index.html` directly as the page body/code.
5. Set the page layout to full-width, no sidebar.

---

## Recommended Page Settings

| Setting | Value |
|---------|-------|
| Layout | Full width |
| Header | Hidden / Off |
| Footer | Hidden / Off |
| Padding | 0 (let the site control its own spacing) |
| Background | None (site sets its own background) |
| Max Width | None / 100% |

---

## External Resources

The file is self-contained EXCEPT for Google Fonts:

```
https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@400;500;600;700&display=swap
```

This is loaded automatically from the `<head>` of the file. If the environment blocks Google
Fonts (rare), fonts will fall back to system sans-serif and the layout will still function.

---

## What's Hardcoded in the Bundle

| Item | Value |
|------|-------|
| iMessage Relay endpoint | `https://imessage-relay.up.railway.app/api/capture-and-verify` |
| SMS number | `+17322070788` |
| Sandy Live Avatar URL | `https://liveavatar-ghl-agent-production.up.railway.app` |
| Stripe checkout | Replaced with toast ("coming soon") — no live Stripe calls |

---

## GHL Issues Fixed in This Export

1. **iMessage relay endpoint** — Real endpoint retained as-is.
2. **Stripe checkout** — Stubbed out with a toast notification instead of a live API call.
3. **SMS number placeholder** — `+1XXXXXXXXXX` replaced with `+17322070788`.
4. **Sandy Live Avatar URL** — Real URL retained as-is.
5. **Manus analytics** — Not present in bundle (confirmed clean).
6. **Auth references** — No `useAuth`, `trpc.auth`, or `isAuthenticated` in bundle.

---

## Troubleshooting

- **Blank page**: Check browser console. The `<div id="root"></div>` must be present and the
  inline `<script>` must not be stripped by GHL's sanitizer. Try pasting into a Raw HTML block
  instead of a rich-text editor.
- **Styles missing**: Confirm the `<style>` block was not stripped. Use a Raw HTML / Custom Code
  element, not a text element.
- **Form not submitting**: Verify the GHL environment allows outbound POST requests to
  `imessage-relay.up.railway.app`. No proxy needed — the bundle calls it directly.
