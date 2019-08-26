/// UI stuff
const $ = document.querySelector.bind(document);
const editor = ace.edit('input');

editor.session.setMode('ace/mode/c_cpp');
editor.setKeyboardHandler('ace/keyboard/vim');
editor.setOption('fontSize', 20);

editor.session.on('change', debounceLazy(compileToAssembly, 100));

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
