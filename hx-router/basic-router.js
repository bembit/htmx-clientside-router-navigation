(function() {
    htmx.defineExtension('router', {
        onEvent: function(name, evt) {
            if (name === "htmx:configRequest") {
                // the anchor with the hx-ext="router" attribute
                const target = evt.detail.elt;
                const url = target.getAttribute('hx-get');
                // keep track of where to render, return
                const targetSelector = target.getAttribute('hx-target');
                if (url) {
                    console.log(target);
                    console.log('url', url);
                    history.pushState({url: url, target: targetSelector}, "", url);
                }
            }
        }
    });
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.url) {
            const target = event.state.target;
            htmx.ajax('GET', event.state.url, { target: target });
        }
        // fallback to / as /index
        if (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index' || window.location.pathname === '/index.html') {
            history.replaceState({url: '/', target: 'body'}, "", '/');
        }
    });
})();
