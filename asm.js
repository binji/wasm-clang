const $ = document.querySelector.bind(document);

const initialProgram =
`int fac(int n) {
    if (n < 1) return 1;
    return n * fac(n - 1);
}
`;

// Warn on close. It's easy to accidentally hit Ctrl+W.
window.addEventListener('beforeunload', event => {
  event.preventDefault();
  event.returnValue = '';
});

const compile = debounceLazy(async () => {
  const input = `test.cc`;
  const contents = editor.getValue();
  await api.compileToAssembly(input, contents);
}, 100);

const setKeyboard = name => editor.setKeyboardHandler(`ace/keyboard/${name}`);

// Toolbar stuff
$('#vim').addEventListener('click', event => setKeyboard('vim'));
$('#emacs').addEventListener('click', event => setKeyboard('emacs'));
$('#sublime').addEventListener('click', event => setKeyboard('sublime'));

// Editor stuff
const editor = ace.edit('input');
editor.session.setMode('ace/mode/c_cpp');
editor.setKeyboardHandler('ace/keyboard/vim');
editor.setOption('fontSize', 20);
editor.session.on('change', compile);
editor.setValue(initialProgram);
editor.clearSelection();

// Terminal stuff
Terminal.applyAddon(fit);
const term = new Terminal({convertEol: true, disableStdin: true, fontSize: 20});
term.open($('#output'));
term.fit();

Split({
  rowGutters: [{track: 2, element: $('.gutter')}],
  onDrag: () => {
    term.fit();
    editor.resize();
  }
});

// Compile stuff
const api = new API({
  async readBuffer(filename) {
    const response = await fetch(filename);
    return response.arrayBuffer();
  },

  hostWrite(s) { term.write(s); }
});

compile();
