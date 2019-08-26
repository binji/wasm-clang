/// UI stuff
function debounce(f, wait) {
  let lastTime = 0;
  let timeoutId = -1;
  let running = false;
  const wrapped = async function(...args) {
    let time = +new Date();
    if (running || time - lastTime < wait) {
      if (timeoutId == -1) {
        timeoutId = setTimeout(wrapped, (lastTime + wait) - time);
      }
      return;
    }
    if (timeoutId != -1)
      clearTimeout(timeoutId);
    timeoutId = -1;
    lastTime = time;
    running = true;
    try {
      await f(...args);
    } finally {
      running = false;
    }
  };
  return wrapped;
}

const $ = document.querySelector.bind(document);
const editor = ace.edit('input');

editor.session.setMode('ace/mode/c_cpp');
editor.setKeyboardHandler('ace/keyboard/vim');
editor.setOption('fontSize', 20);

editor.session.on('change', debounce(compileToAssembly, 100));

editor.setValue(`int fac(int n) {
    if (n < 1) return 1;
    return n * fac(n - 1);
}`);
editor.clearSelection();

Terminal.applyAddon(fit);

const term = new Terminal({convertEol: true, disableStdin: true, fontSize: 20});
term.open($('#output'));
term.fit();

Split({
  rowGutters: [{track: 1, element: $('.gutter')}],
  onDrag: () => {
    term.fit();
    editor.resize();
  }
});

const api = new API({
  async readBuffer(filename) {
    const response = await fetch(filename);
    return response.arrayBuffer();
  },

  hostWrite(s) { term.write(s); }
});

async function compileToAssembly() {
  const input = `test.cc`;
  const contents = editor.getValue();
  await api.compileToAssembly(input, contents);
}

compileToAssembly();
