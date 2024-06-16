(function() {
    console.log('router-url.js loaded, initial routes from index added');
    var validRoutes = updateRoutes();
    
    function updateRoutes() {
        extractedRoutes = Array.from(document.querySelectorAll('a[hx-ext="router"]')).map(anchor => anchor.getAttribute('hx-get'));
        baseRoutes = ['/'];
        validRoutes = [...new Set([...baseRoutes, ...extractedRoutes])];
        console.log('updateRoutes function', validRoutes);
        return validRoutes;
    }
    
    window.addEventListener('htmx:afterSettle', updateRoutes, console.log('afterSettle event reruns updateRoutes'));

    htmx.defineExtension('router', {
        onEvent: function(name, evt) {
            if (name === "htmx:configRequest") {
                var target = evt.detail.elt;
                var url = target.getAttribute('hx-get');
                var targetSelector = target.getAttribute('hx-target');
                var pageTitle = target.getAttribute('data-page-title') || document.title;
                // would ideally check if route is the same as the current one
                if (url && (url !== window.location.pathname) && validRoutes.includes(url)) {
                    history.pushState({ url: url, target: targetSelector }, "", url);
                    document.title = pageTitle;
                }
            }
        }
    });

    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.url) {
            if (validRoutes.includes(event.state.url)) {
                htmx.ajax('GET', event.state.url);
            } 
        }
    });

    if (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index' || window.location.pathname === '/index.html') {
        history.replaceState({url: '/', target: 'body'}, "", '/');
    }

})();
