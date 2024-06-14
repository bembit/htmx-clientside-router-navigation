## HTMX Client-Side Routing / Navigation

Simple client-side navigation with [HTMX](https://htmx.org/).

There will be N branches with different use cases.

### Why?

- Built for my specific, edge use cases, purely for client-side HTMX.
- Managing popstate.
- Don't leave the page by pressing the back button.

### Yeah but why not in vanilla JS?

- I had to make sure it's not just an easily reusable thing, like without HTMX.

### How?

- Will add demo link here later.
- And some missing features of HTMX as a library, like neon colors, gradients. 

### Setup

#### Main branch
- No urls for now, it can't handle refreshes.

#### Add the javascript file and HTMX.
```HTML
<script src="https://unpkg.com/htmx.org@1.9.12" integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2" crossorigin="anonymous" defer></script>
<script src="/hx-router/basic-router.js" defer></script>
```

#### Set up the anchors, navigation items with hx-ext="router".
#### Set the hx-target to your HTML element of choice. I'm going with #main.
```HTML
    <a hx-get="/home.html" hx-ext="router" hx-target="#main">Home</a>
    <a hx-get="/about.html" hx-ext="router" hx-target="#main">About</a>
    <a hx-get="/contact.html" hx-ext="router" hx-target="#main">Contact</a>
    <a hx-get="/pricing.html" hx-ext="router" hx-target="#main">Pricing</a>
```

#### Optional - Can add custom page titles.
```HTML
	<header>
		<a hx-get="/home.html" hx-ext="router" data-page-title="Home" hx-target="#main">Home</a>
		<a hx-get="/about.html" hx-ext="router" data-page-title="About" hx-target="#main">About</a>
		<a hx-get="/contact.html" hx-ext="router" data-page-title="Contact" hx-target="#main">Contact</a>
		<a hx-get="/pricing.html" hx-ext="router" data-page-title="Pricing" hx-target="#main">Pricing</a>
	</header>
```