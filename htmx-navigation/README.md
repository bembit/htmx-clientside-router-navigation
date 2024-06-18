## HTMX Client-Side Routing / Navigation

Simple client-side navigation with [HTMX](https://htmx.org/).

- Built for my specific, edge use cases, purely for client-side HTMX.
- Managing popstate.
- Don't leave the page by pressing the back button.
- Endure refresh.

### How

- Checks for anchors with attribute hx-ext="router" on load and on htmx:afterSettle.

### Setup

- Add the JavaScript file and HTMX.
```HTML
<script src="https://unpkg.com/htmx.org@2.0.0-alpha1/dist/htmx.min.js" defer></script>
<script src="/router-url.js" defer></script>
```

- Set up the anchors, navigation items with hx-ext="router".
- Set the hx-target to your HTML element of choice. I'm going with #main.
- Target specific HTML elements to swap with hx-select for full page URL navigation.
```HTML
<a hx-get="/home.html" hx-ext="router" hx-select=".wrapper" hx-target="#main">Home</a>
```

- Optional - Can add custom page titles.
```HTML
<a hx-get="/pricing.html" hx-ext="router" hx-select=".wrapper" hx-target="#main">Pricing</a>
```

### Key diffrences are:
- Adds / to the URL.
- Setup is for grabbing components.
```javascript
if (url && (url !== history.state.url) && validRoutes.includes(url)) {
	history.pushState({ url: url, target: targetSelector }, "", "/");
	document.title = pageTitle;
}
```

- Adds the full url.
- No cache, state, storage. Setup needs full HTML pages to handle fallback.
```javascript
if (url && (url !== window.location.pathname) && validRoutes.includes(url)) {
	history.pushState({ url: url, target: targetSelector }, "", url);
	document.title = pageTitle;
}
```