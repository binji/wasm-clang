// Warn on close. It's easy to accidentally hit Ctrl+W.
window.addEventListener('beforeunload', event => {
  event.preventDefault();
  event.returnValue = '';
});

window.addEventListener('resize', event => layout.updateSize());

let editor;
const run = debounceLazy(editor => api.compileLinkRun(editor.getValue()), 100);
const setKeyboard = name => editor.setKeyboardHandler(`ace/keyboard/${name}`);

// Toolbar stuff
$('#keyboard').on('input', event => setKeyboard(event.target.value));

function EditorComponent(container, state) {
  editor = ace.edit(container.getElement()[0]);
  editor.session.setMode('ace/mode/c_cpp');
  editor.setKeyboardHandler('ace/keyboard/vim');
  editor.setOption('fontSize', 20);

  container.on('resize', debounceLazy(event => editor.resize(), 20));
}

let term;
Terminal.applyAddon(fit);
function TerminalComponent(container, state) {
  container.on('open', event => {
    term = new Terminal({convertEol: true, disableStdin: true, fontSize: 20});
    term.open(container.getElement()[0]);
    term.fit();
  });
  container.on('resize', debounceLazy(event => term.fit(), 20));
}

let canvas;
function CanvasComponent(container, state) {
  const canvasEl = document.createElement('canvas');
  canvasEl.className = 'canvas';
  container.getElement()[0].appendChild(canvasEl);
  api.postCanvas(canvasEl.transferControlToOffscreen());
}

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

  postCanvas(offscreenCanvas) {
    this.port.postMessage({id : 'postCanvas', data : offscreenCanvas},
                          [ offscreenCanvas ]);
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
