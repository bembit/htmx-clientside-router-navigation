(function() {
    var validRoutes = updateRoutes();
    function updateRoutes() {
        var extractedRoutes = Array.from(document.querySelectorAll('a[hx-ext="router"]')).map(anchor => anchor.getAttribute('hx-get'));
        var baseRoutes = ['/'];
        var validRoutes = [...baseRoutes, ...extractedRoutes];
        console.log('updateRoutes function', validRoutes);
        return validRoutes;
    }
    function checkForDuplicates(array) {
        return array.filter((value, index) => array.indexOf(value) === index);
    }
    var validRoutes = checkForDuplicates(validRoutes);
    console.log('last one after duplicate check', validRoutes);
    // window.addEventListener('htmx:afterSettle', updateRoutes, console.log('this one from the afterSettle event',validRoutes));
    window.addEventListener('htmx:afterSettle', updateRoutes, console.log('this one from the afterSettle event',validRoutes));
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
