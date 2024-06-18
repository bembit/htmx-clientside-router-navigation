// HTMX which request.
// after request should handle the after fetch
// configrequest is enough to fire before and update as long as it's client side only.
// since it only works from injected links.

// trimmed url works, but on refresh we loose the path since it's no longer tracking /folder/index.html
// can we force on refresh the url? since that's the full value. 

// 1. we either push the full url /folder/index.html and just show the partial.
// 2. or we revert back from this url trimming and deal with the folder/folder/folder issue.
// 3. now refreshing the page screws it up too

// meta title and stuff not seo friendly anyway

// set a normal comp, with content as index.html as a variation. that would work.

// aha, they use localstorage htmx-history-cache to remember my main comp at "/"
// makes sense for page refreshes too
// can we really not requery te main?

// CHECK fallback body attribute? does it take the whole html inside the body?

// also. write a hx-push-url as a non separate comp. but everything to index.
    
    // how would I make the routes?
    // do I even need to?
    // how to handle FPR?
    // add localstorage?

    // url mapping?
    const urlMappings = {
        './components/': '/',
        './views/': '/views/',
        './partials/': '/partials/'
        //
    };

    // Function to trim the URL based on the configuration object
    function trimUrl(url) {
        for (const [prefix, replacement] of Object.entries(urlMappings)) {
            if (url.startsWith(prefix)) {
                return url.replace(prefix, replacement);
            }
        }
        // Return the original URL if no mapping is found
        return url;
    }


    // this is tricky
    // need to think about how to handle the urls
    function trimUrl(url) {
        if (url.startsWith('./')) {
          url = url.substring(2);
        }
        // return the part of the URL after the first "/" after "./"
        return '/' + url.split('/').pop();
    }

    function makeAbsoluteUrl(url) {
        const link = document.createElement('a');
        link.href = url;
        console.log(url);
        console.log(link.href);
        return link.href;
        console.log(link.pathname);
        return link.pathname;
    }

    const absoluteUrl = makeAbsoluteUrl(url);




    if (url === '/components/main.html') {
        history.pushState({url: "/", target: targetSelector}, "", "/");
        console.log('pushState', url);
    }

    // this fallback to / as /index
    if (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index', window.location.pathname === '/index.html') {
        history.replaceState({url: '/', target: 'body', title: 'HTMX Playground'}, "", '/');
    }



    
    // kewl approach
    window.addEventListener('beforeunload', function (event) {
        console.log('Page is about to be refreshed or closed');
        sessionStorage.setItem('isReloaded', 'true');
    });
    
    window.addEventListener('load', function() {
        if (sessionStorage.getItem('isReloaded') === 'true') {
            console.log('Page was reloaded');
            sessionStorage.removeItem('isReloaded');
        } else {
            console.log('First load or internal navigation');
        }
    });
    


    function isValidURL(url) {
        try {
            const parsedURL = new URL(url, window.location.origin);
            return parsedURL.origin === window.location.origin;
        } catch {
            return false;
        }
    }

// like a 404 test?

    const allowedPaths = ['/allowed-path1', '/allowed-path2']; 
    if (!allowedPaths.includes(parsedURL.pathname)) {
        return false;
    }

    if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
        return false;
    }

    function sanitizeURL(url) {
        try {
            const parsedURL = new URL(url, window.location.origin);
            
            // Ensure the URL belongs to the same origin
            if (parsedURL.origin !== window.location.origin) {
                return null;
            }
            
            // Remove query parameters
            parsedURL.search = '';
            
            // Ensure the URL does not use any potentially harmful schemes
            if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
                return null;
            }
            
            return parsedURL.toString();
        } catch {
            return null;
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


    // let allowedPaths;
    if (target.getAttribute('hx-ext') === 'router') {
        allowedPaths = [target.getAttribute('hx-get')];
    } else {
        allowedPaths = [];
    }


    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('lastUrl', window.location.href);
    });

    // how would I retrigger the hx-get specificly? replace / and fetch hx-get pair of that anchor

        // i could save the last urls hx-routers hx-get. whats the initiator of the view.
        // then forward to "/"
        // then I could htmx.ajax get the component.
        // unclear history replace state ? or push needed?
        // then clear the storage. 



    // Check the last URL on page load
    window.addEventListener('load', function() {
        const lastUrl = sessionStorage.getItem('lastUrl');

        // Check if the current URL is different from the last URL and if it's a refresh
        if (lastUrl && lastUrl !== window.location.href) {
            // Clear the session storage to prevent looping
            sessionStorage.removeItem('lastUrl');
            
            // Redirect to the root URL
            window.location.replace('/');
        }
    });


    // good concept but no
    window.addEventListener('beforeunload', function () {
        console.log('Page is about to be refreshed or closed');
        const currentPath = window.location.pathname;
        const currentTitle = document.title;
        sessionStorage.setItem('currentPath', currentPath);
        sessionStorage.setItem('currentTitle', currentTitle);
        console.log(sessionStorage);
    });

    window.addEventListener('load', function() {
        const currentPath = sessionStorage.getItem('currentPath');
        const currentTitle = sessionStorage.getItem('currentTitle');
        if (currentPath && currentTitle) {
            console.log('Page was reloaded');

            console.log('currentPath', currentPath);
            console.log('currentTitle', currentTitle);

            window.location.replace('/');
            console.log(window.location.pathname);
            history.replaceState({url: '/', target: 'body'}, "", '/');
            // window.history.replaceState({url: currentPath, target: 'html', title: currentTitle}, currentTitle, currentPath);

            console.log(sessionStorage);
            sessionStorage.removeItem('currentPath');
            sessionStorage.removeItem('currentTitle');
            console.log('session cleaned');
        } else {
            console.log('First load or internal navigation');
        }
    });


    window.addEventListener('beforeunload', function() {
        const lastUrl = sessionStorage.setItem('lastUrl', window.location.href);

        // Check if the current URL is different from the last URL and if it's a refresh
        if (lastUrl) {
            // Clear the session storage to prevent looping
            // sessionStorage.removeItem('lastUrl');
            
            // Redirect to the root URL
            // window.location.replace('/');
            history.replaceState({url: '/', target: 'body'}, "", '/');

        }
    });

    // still not accessable on refresh


    function cacheHeadAndScripts() {
        const headContent = document.head.innerHTML;
        sessionStorage.setItem('cachedHead', headContent);
    }

    // Function to restore the head from cache
    function restoreHeadFromCache() {
        const cachedHead = sessionStorage.getItem('cachedHead');
        if (cachedHead) {
            document.head.innerHTML = cachedHead;
        }
    }

    // Check if the page is loaded due to a refresh
    (function() {
        const lastUrl = sessionStorage.getItem('lastUrl');

        if (lastUrl && window.location.pathname === lastUrl) {
            // If the current URL is the same as the last URL, redirect to the root
            sessionStorage.removeItem('lastUrl');
            window.location.replace('/');
        } else {
            // Otherwise, save the current URL as the last URL
            sessionStorage.setItem('lastUrl', window.location.pathname);
        }
    })();

    // Restore the head content if available
    restoreHeadFromCache();


    window.addEventListener('popstate', function(event) {
        if (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index' || window.location.pathname === '/index.html') {
            history.replaceState({ url: '/', target: 'body' }, "", '/');
        }

        if (event.state && event.state.url) {
            const target = event.state.target;
            if (validRoutes.includes(event.state.url)) {
                htmx.ajax('GET', event.state.url, { target: target });
            } else {
                htmx.ajax('GET', '/error.html', { target: 'body' });
            }
        } else {
            htmx.ajax('GET', '/error.html', { target: 'body' });
        }
    });

    // Initial page load handling
    const initialUrl = window.location.pathname;
    if (!validRoutes.includes(initialUrl)) {
        htmx.ajax('GET', '/error.html', { target: 'body' });
    }

    window.addEventListener('popstate', function(event) {
        // Fallback to / as /index
        if (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index' || window.location.pathname === '/index.html') {
            history.replaceState({ url: '/', target: 'body' }, "", '/');
        }

        if (event.state && event.state.url) {
            const target = event.state.target;
            if (validRoutes.includes(event.state.url)) {
                htmx.ajax('GET', event.state.url, { target: target });
            } else {
                // Handle 404 by loading the 404 component
                htmx.ajax('GET', '/error.html', { target: 'body' });
            }
        }
    });


    window.addEventListener('popstate', function(event) {
        // var swappable = document.getElementById('main');
        // console.log(swappable);
        if (event.state && event.state.url) {
            // var target = event.state.target;
            // we need the swappable .wrapper to the main
            // the hx-select needed here too
            // var swap = swappable ? swappable : 'body';
            if (validRoutes.includes(event.state.url)) {
                // console.log(target);
                // console.log(swap);
                htmx.ajax('GET', event.state.url, { 
                    // target: target,
                    // hxSelect: swap
                });
            } 
        }
    });

    // more reading on validations and removing dupes.
    (function() {
        window.addEventListener('htmx:afterSettle', function() {
            var extractedRoutes = Array.from(document.querySelectorAll('a[hx-ext="router"]')).map(anchor => anchor.getAttribute('hx-get'));
            var baseRoutes = ['/'];
            var validRoutes = [...baseRoutes, ...extractedRoutes];
            console.log(validRoutes);
                function checkForDuplicates(array) {
                    return array.filter((value, index) => array.indexOf(value) === index);
                }
            validRoutes = checkForDuplicates(validRoutes);
            console.log(validRoutes);
    
            htmx.defineExtension('router', {
                onEvent: function(name, evt) {
                    if (name === "htmx:configRequest") {
                        var target = evt.detail.elt;
                        var url = target.getAttribute('hx-get');
                        var targetSelector = target.getAttribute('hx-target');
                        var pageTitle = target.getAttribute('data-page-title') || document.title;
                        if (url && validRoutes.includes(url)) {
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
        });
        
    })();
    


    // continue here

    (function() {
        var validRoutes = [];	
        function updateRoutes() {
            var extractedRoutes = Array.from(document.querySelectorAll('a[hx-ext="router"]')).map(anchor => anchor.getAttribute('hx-get'));
            var baseRoutes = ['/'];
            var validRoutes = [...baseRoutes, ...extractedRoutes];
            console.log(validRoutes);
            return validRoutes;
        }
        window.addEventListener('htmx:afterSettle', updateRoutes);
        // would ideally check if route is the same as the current one
        htmx.defineExtension('router', {
            onEvent: function(name, evt) {
                if (name === "htmx:configRequest") {
                    var target = evt.detail.elt;
                    var url = target.getAttribute('hx-get');
                    var targetSelector = target.getAttribute('hx-target');
                    var pageTitle = target.getAttribute('data-page-title') || document.title;
                    if (url && validRoutes.includes(url)) {
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
    

    (function() {
        console.log('router-url.js loaded, initial routes from index added');
        var validRoutes = updateRoutes();
        
        function updateRoutes() {
            extractedRoutes = Array.from(document.querySelectorAll('a[hx-ext="router"]')).map(anchor => anchor.getAttribute('hx-get'));
            baseRoutes = ['/'];
            // validRoutes = [...baseRoutes, ...extractedRoutes];
            validRoutes = [...new Set([...baseRoutes, ...extractedRoutes])];
            console.log('updateRoutes function', validRoutes);
            return validRoutes;
        }
    
        // function checkForDuplicates(array) {
        //     return array.filter((value, index) => array.indexOf(value) === index);
        // }
    
        // var validRoutes = checkForDuplicates(validRoutes);
        // console.log('last one after duplicate check', validRoutes);
        
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
    