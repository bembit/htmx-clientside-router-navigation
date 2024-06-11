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
                if (url) {
                    console.log(target);
                    console.log('url', url);
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
    
    window.addEventListener('beforeunload', function () {
        console.log('Page is about to be refreshed or closed');
        const currentPath = window.location.pathname;
        const currentTitle = document.title;
        const fullContent = document.documentElement;
        sessionStorage.setItem('currentPath', currentPath);
        sessionStorage.setItem('currentTitle', currentTitle);
        sessionStorage.setItem('fullContent', fullContent);
        console.log(sessionStorage);
        console.log('fullContent', fullContent);
    });

    window.addEventListener('load', function() {
        if (sessionStorage.getItem('currentPath')) {
            console.log('Page was reloaded');
            const currentPath = sessionStorage.getItem('currentPath');
            const currentTitle = sessionStorage.getItem('currentTitle');
            const fullContent = sessionStorage.getItem('fullContent');

            if (currentPath && fullContent) {
                window.history.replaceState({url: currentPath, target: 'html', title: currentTitle}, currentTitle, currentPath);
                document.documentElement = fullContent;
            }

            sessionStorage.removeItem('currentPath');
            sessionStorage.removeItem('currentTitle');
            sessionStorage.removeItem('fullContent');
            console.log(sessionStorage);
        } else {
            console.log('First load or internal navigation');
        }
    });

    window.addEventListener('popstate', handlePopState);
})();
