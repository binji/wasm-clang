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

class WorkerAPI {
  constructor() {
    this.worker = new Worker('worker.js');
    const channel = new MessageChannel();
    this.port = channel.port1;
    this.port.onmessage = this.onmessage.bind(this);

    const remotePort = channel.port2;
    this.worker.postMessage({id: 'constructor', data: remotePort},
                            [remotePort]);
  }

  terminate() {
    this.worker.terminate();
  }

  compileToAssembly(options) {
    this.port.postMessage({id: 'compileToAssembly', data: options});
  }

  compileLinkRun(contents) {
    this.port.postMessage({id: 'compileLinkRun', data: contents});
  }

  onmessage(event) {
    switch (event.data.id) {
      case 'write':
        term.write(event.data.data);
        break;
    }
  }
}

const api = new WorkerAPI();
