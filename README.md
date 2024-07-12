## HTMX Client-Side Routing / Navigation prototype

### Simple client-side navigation with [HTMX](https://htmx.org/).

#### Might clean up and finish. 3.774% chance.

- Built for my specific edge cases, purely for client-side HTMX to be used for landing pages, smaller static sites.
- Managing popstate.
- Don't leave the page by pressing the back button.
- Survive a full page refresh.
- No local storage, no session storage.

### How

- Checks for unique anchors with the attribute hx-ext="router" on DOMcontentload.
- And on htmx:afterSettle in case a component is loaded that has more anchors. 

<!-- ### Demos: 
URL: https://url-xxxxxx-htmx-navigation-demo.pages.dev/

NO URL: https://nourl-xxxxxx-htmx-navigation-demo.pages.dev/ -->

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
<a hx-get="/home.html" hx-ext="router" data-page-title="Home" hx-target="#main">Home</a>
```

### router-nourl.js
- Keeps "/" as the URL.
- Swapping components, SPA, routless.

### router-url.js
- Adds the full url.
- No state, storage.
- Setup needs full HTML pages to handle refresh fallback.
- Swapping components with hx-select.