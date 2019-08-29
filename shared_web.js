const $ = document.querySelector.bind(document);

// Warn on close. It's easy to accidentally hit Ctrl+W.
window.addEventListener('beforeunload', event => {
  event.preventDefault();
  event.returnValue = '';
});

const run = debounceLazy(editor => api.compileLinkRun(editor.getValue()), 100);
const setKeyboard = name => editor.setKeyboardHandler(`ace/keyboard/${name}`);

// Toolbar stuff
$('#keyboard').addEventListener('input', event => setKeyboard(event.target.value));
$('#split').addEventListener('input', event => setSplit(event.target.value));

// Editor stuff
const editor = ace.edit('input');
editor.session.setMode('ace/mode/c_cpp');
editor.setKeyboardHandler('ace/keyboard/vim');
editor.setOption('fontSize', 20);

// Terminal stuff
Terminal.applyAddon(fit);
const term = new Terminal({convertEol: true, disableStdin: true, fontSize: 20});
term.open($('#output'));
term.fit();

// Splitter
let splitter;

function setSplit(direction) {
  const gutterEl = $('.gutter');
  const allEl = $('#all');
  allEl.className = direction;
  allEl.setAttribute('style', '');

  if (splitter) splitter.destroy();

  const onDrag = debounceLazy(() => {
    term.fit();
    editor.resize();
  }, 16);

  options = {onDrag};
  if (direction === 'horiz') {
    options.columnGutters = [{track: 1, element: gutterEl}];
  } else {
    options.rowGutters = [{track: 2, element: gutterEl}];
  }
  splitter = Split(options);
  onDrag();
}
setSplit('horiz');

/// Compile stuff
const api = new API({
  async readBuffer(filename) {
    const response = await fetch(filename);
    return response.arrayBuffer();
  },

  async compileStreaming(filename) {
    // TODO: make compileStreaming work. It needs the server to use the
    // application/wasm mimetype.
    if (false && WebAssembly.compileStreaming) {
      return WebAssembly.compileStreaming(fetch(filename));
    } else {
      const response = await fetch(filename);
      return WebAssembly.compile(await response.arrayBuffer());
    }
  },

  hostWrite(s) { term.write(s); }
});
