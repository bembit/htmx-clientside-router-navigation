(function() {
    console.log('router.js loaded');

    if (!window.htmx) {
        console.error('HTMX is not loaded!');
        return;
    }

    htmx.defineExtension('router', {
        onEvent: function(name, evt) {
            if (name === "htmx:configRequest") {
                const target = evt.detail.elt;
                // revisit this
                const url = 
                (target.getAttribute('hx-get')
                || target.getAttribute('href'))
                || target.getAttribute('hx-post')
                || target.getAttribute('hx-put')
                || target.getAttribute('hx-delete');
                
                const targetSelector = target.getAttribute('hx-target');
                // custom attributes for meta tags ?
                const pageTitle = target.getAttribute('hx-page-title') || document.title;

                if (url) {
                    console.log(target);
                    console.log('url', url);
                    history.pushState({url: url, target: targetSelector}, "", url);
                    console.log('evt.detail.url', evt.detail.url);
                    document.title = pageTitle;
                }
            }
        }
    });

    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.url) {
            
            const target = event.state.target;
            const pageTitle = event.state.title;

            console.log('target', target);
            console.log('title', event.state.title);
            console.log('popstate', event.state.url);
            
            // page title needs to be updated in popstate too, in the DOM
            htmx.ajax('GET', event.state.url, { target: target, title: pageTitle});
            // document.title = pageTitle;
        }
        // this fallback to / as /index
        if (window.location.pathname === '/' || window.location.pathname === '') {
            history.replaceState({url: '/', target: 'main', title: 'HTMX Playground'}, "", '/');
        }
    });

})();
