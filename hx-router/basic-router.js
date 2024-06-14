(function() {
    const validRoutes = Array.from(document.querySelectorAll('a[hx-ext="router"]')).map(anchor => anchor.getAttribute('hx-get'));
    validRoutes.push('/');
    console.log('validRoutes', validRoutes);
    htmx.defineExtension('router', {
        onEvent: function(name, evt) {
            if (name === "htmx:configRequest") {
                const target = evt.detail.elt;
                const url = target.getAttribute('hx-get');
                const targetSelector = target.getAttribute('hx-target');
                const pageTitle = target.getAttribute('data-page-title') || document.title;

                if (url && validRoutes.includes(url)) {
                    console.log(target);
                    console.log('url', url);
                    history.pushState({ url: url, target: targetSelector }, "", "/");
                    document.title = pageTitle;
                }
            }
        }
    });
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.url) {
            const target = event.state.target;
            if (validRoutes.includes(event.state.url)) {
                htmx.ajax('GET', event.state.url, { target: target });
            } 
        }
    });
})();
