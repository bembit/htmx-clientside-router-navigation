(function() {
    function sanitizeURL(url) {
        try {
            const parsedURL = new URL(url, window.location.origin);
            //URL belongs to the same origin
            if (parsedURL.origin !== window.location.origin) {
                return null;
            }
            // query parameters
            parsedURL.search = '';
            // https only for prod
            if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
                return null;
            }
            console.log('parsedURL', parsedURL);
            return parsedURL.toString();
        } catch {
            return null;
        }
    }
    htmx.defineExtension('router', {
        onEvent: function(name, evt) {
            if (name === "htmx:configRequest") {
                // the anchor with the hx-ext="router" attribute
                const target = evt.detail.elt;
                var url = target.getAttribute('hx-get');
                
                // keep track of where to render, return
                const targetSelector = target.getAttribute('hx-target');
                const pageTitle = target.getAttribute('data-page-title') || document.title;

                url = sanitizeURL(url);

                const allowedPaths = target.getAttribute('hx-ext') === 'router' ? [target.getAttribute('hx-get')] : [];

                console.log('allowedPaths', allowedPaths);
                
                if (!url.includes(allowedPaths)) {
                    console.log(url)
                    console.log('not allowed');
                    return false;
                }

                if (url.includes(allowedPaths)) {
                    console.log(target);
                    console.log('url', url);
                    console.log('allowedPaths', allowedPaths);
                    history.pushState({url: url, target: targetSelector}, "", url);
                    document.title = pageTitle;
                }
            }
        }
    });
    function handlePopState(event) {
        if (event.state && event.state.url) {
            const target = event.state.target;
            htmx.ajax('GET', event.state.url, { target: target });
        }
        // fallback to / as /index
        if (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index' || window.location.pathname === '/index.html') {
            history.replaceState({url: '/', target: 'body'}, "", '/');
        }
    }
    window.addEventListener('popstate', handlePopState);
})();
