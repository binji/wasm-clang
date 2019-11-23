// Copied from:
// https://developers.google.com/web/fundamentals/primers/service-workers/
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

const CACHE_NAME = 'v4';
const expectedCaches = [CACHE_NAME];

const cdn = 'https://cdnjs.cloudflare.com/ajax/libs';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        `${cdn}/ace/1.4.5/ace.js`,
        `${cdn}/ace/1.4.5/keybinding-emacs.js`,
        `${cdn}/ace/1.4.5/keybinding-sublime.js`,
        `${cdn}/ace/1.4.5/keybinding-vim.js`,
        `${cdn}/ace/1.4.5/mode-assembly_x86.js`,
        `${cdn}/ace/1.4.5/mode-c_cpp.js`,
        `${cdn}/golden-layout/1.5.9/css/goldenlayout-base.css`,
        `${cdn}/golden-layout/1.5.9/css/goldenlayout-light-theme.css`,
        `${cdn}/golden-layout/1.5.9/goldenlayout.min.js`,
        `${cdn}/jquery/3.4.1/jquery.min.js`,
        `${cdn}/xterm/3.14.5/addons/fit/fit.min.js`,
        `${cdn}/xterm/3.14.5/xterm.min.css`,
        `${cdn}/xterm/3.14.5/xterm.min.js`,
        './',
        './6502.html',
        './6502.js',
        './asm.html',
        './asm.js',
        './index.html',
        './main.css',
        './memfs',
        './shared.js',
        './shared_web.js',
        './web.js',
        './worker.js',
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  // delete any caches that aren't in expectedCaches
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) {
          return caches.delete(key);
        }
      })
    ))
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        console.log(`got uncached ${event.request.url}`);
        return fetch(event.request).then(function(response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 ||
              response.type !== 'basic') {
            return response;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          var responseToCache = response.clone();

          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    )
});
