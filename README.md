## HTMX Client-Side Routing / Navigation

This is a simple library for client-side routing with [HTMX](https://htmx.org/).

More like a navigation tbh.

There are X branches with different features and different use cases.

### Why?

- Built for my specific edge use cases, purely for client-side HTMX.
- Managing popstate render.

It's quite nice to have simple SPA like static sites with HTMX. No dealing with fetch, render. All I was missing is a bit of "routing" to handle the URLs, and popstate. Don't leave the page accidentally.

### Yeah but why not in vanilla JS?

- I had to make sure it's not just an easily reusable thing, like without HTMX.

### How?

- Added a small demo.
- And some missing features of htmx as a library, like neon colors, gradients. 

### Setup

- Add the javascript file and HTMX.
```HTML
<script src="https://unpkg.com/htmx.org@1.9.12" integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2" crossorigin="anonymous" defer></script>
<script src="/hx-router/basic-router.js" defer></script>
```

- Set up the anchors, navigation items.
- Add hx-push-url="/" to the home/main/index initiator.
- Set the hx-target to your HTML element of choice. I'm going with #main.
```HTML
    <a hx-get="/home.html" hx-ext="router" hx-target="#main">Home</a>
    <a hx-get="/about.html" hx-ext="router" hx-target="#main">About</a>
    <a hx-get="/contact.html" hx-ext="router" hx-target="#main">Contact</a>
    <a hx-get="/pricing.html" hx-ext="router" hx-target="#main">Pricing</a>
```

Optional - Can add custom page titles.
```HTML
	<header>
		<a hx-get="/home.html" hx-ext="router" data-page-title="Home" hx-target="#main">Home</a>
		<a hx-get="/about.html" hx-ext="router" data-page-title="About" hx-target="#main">About</a>
		<a hx-get="/contact.html" hx-ext="router" data-page-title="Contact" hx-target="#main">Contact</a>
		<a hx-get="/pricing.html" hx-ext="router" data-page-title="Pricing" hx-target="#main">Pricing</a>
	</header>
```