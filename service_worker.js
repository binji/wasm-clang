// Copied from:
// https://developers.google.com/web/fundamentals/primers/service-workers/
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

const expectedCaches = ['v3'];

const cdn = 'https://cdnjs.cloudflare.com/ajax/libs';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v3').then(cache => {
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
        './asm.html',
        './asm.js',
        './clang',
        './index.html',
        './lld',
        './main.css',
        './memfs',
        './shared.js',
        './shared_web.js',
        './sysroot.tar',
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
        return fetch(event.request);
      }
    )
  );
});
