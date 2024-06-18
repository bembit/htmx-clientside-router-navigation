(function() {
    var validRoutes = [];
    var baseRoutes = ['/'];
    var origin = window.location.origin;
    function checkURL(url) {
        try {
            var parsedUrl = new URL(url, origin);
            return parsedUrl.origin === origin && parsedUrl.pathname.startsWith('/');
        } catch (error) {
            return false;
        }
    }
    // history event state
    function checkState(state) {
        return state && typeof state === 'object' && checkURL(state.url) && typeof state.target === 'string';
    }
    function pushState(state, title, url) {
        if (checkState(state) && validRoutes.includes(url)) {
            history.pushState(state, title, url);
        }
    }
    function replaceState(state, title, url) {
        if (checkState(state) && validRoutes.includes(url)) {
            history.replaceState(state, title, url);
        }
    }
    function updateRoutes() {
        extractedRoutes = Array.from(document.querySelectorAll('a[hx-ext="router"]'))
            .map(anchor => anchor.getAttribute('hx-get'))
            .filter(url => checkURL(url));
            
        validRoutes = [...new Set([...baseRoutes, ...extractedRoutes])];
        return validRoutes;
    }
    window.addEventListener('htmx:afterSettle', function() {
        updateRoutes();
        console.log(validRoutes);
    });
    // handle page refresh without extra htmx comps to be settled 
    window.addEventListener('DOMContentLoaded', function() {
        updateRoutes();
        console.log(validRoutes);
        // handle the initial page here.
        var initialPath = window.location.pathname;
        if (['/', '', '/index', '/index.html'].includes(initialPath)) {
            replaceState({ url: '/', target: 'body' }, "", '/');
        }
    });
    
    htmx.defineExtension('router', {
        onEvent: function(name, evt) {
            if (name === "htmx:configRequest") {
                var target = evt.detail.elt;
                var url = target.getAttribute('hx-get');
                var targetSelector = target.getAttribute('hx-target');
                // do I even want pageTitle in the url based routing?
                var pageTitle = target.getAttribute('data-page-title') || document.title;
                console.log(pageTitle);
                if (url && (url !== window.location.pathname) && validRoutes.includes(url)) {
                    var state = { url: url, target: targetSelector };
                    console.log(state, pageTitle, url);
                    pushState(state, pageTitle, url);
                    document.title = pageTitle;
                }
            }
        }
    });

    window.addEventListener('popstate', function(event) {
        if (checkState(event.state) && validRoutes.includes(event.state.url)) {
            htmx.ajax('GET', event.state.url);
        } 
    });

})();
