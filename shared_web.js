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
$('#showTiming').on('click', event => { api.setShowTiming(event.target.checked); });

function EditorComponent(container, state) {
  editor = ace.edit(container.getElement()[0]);
  editor.session.setMode('ace/mode/c_cpp');
  editor.setKeyboardHandler('ace/keyboard/vim');
  editor.setOption('fontSize', 20);
  editor.setValue(state.value ? state.value : '');
  editor.clearSelection();

  editor.on('change', debounceLazy(event => {
    container.extendState({value: editor.getValue()});
  }, 500));

  container.on('resize', debounceLazy(event => editor.resize(), 20));
  container.on('destroy', event => {
    if (editor) {
      editor.destroy();
      editor = null;
    }
  });
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
  container.on('destroy', event => {
    if (term) {
      term.destroy();
      term = null;
    }
  });
}

let canvas;
function CanvasComponent(container, state) {
  const canvasEl = document.createElement('canvas');
  canvasEl.className = 'canvas';
  container.getElement()[0].appendChild(canvasEl);
  // TODO: Figure out how to proxy canvas calls. I started to work on this, but
  // it's trickier than I thought to handle things like rAF. I also don't think
  // it's possible to handle ctx2d.measureText.
  if (canvasEl.transferControlToOffscreen) {
    api.postCanvas(canvasEl.transferControlToOffscreen());
  } else {
    const w = 800;
    const h = 600;
    canvasEl.width = w;
    canvasEl.height = h;
    const ctx2d = canvasEl.getContext('2d');
    const msg = 'offscreenCanvas is not supported :(';
    ctx2d.font = 'bold 35px sans';
    ctx2d.fillStyle = 'black';
    const x = (w - ctx2d.measureText(msg).width) / 2;
    const y = (h + 20) / 2;
    ctx2d.fillText(msg, x, y);
  }
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

  setShowTiming(value) {
    this.port.postMessage({id: 'setShowTiming', data: value});
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


// ServiceWorker stuff
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./service_worker.js')
  .then(reg => {
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(error => {
    console.log('Registration failed with ' + error);
  });
}
