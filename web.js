const $ = document.querySelector.bind(document);

const initialProgram =
`#include <stdio.h>

int fac(int n) {
    if (n < 1) return 1;
    return n * fac(n - 1);
}

int main() {
    for (int i = 1; i <= 10; ++i) {
        printf("fac(%d) = %d\\n", i, fac(i));
    }
}
`;

// Warn on close. It's easy to accidentally hit Ctrl+W.
window.addEventListener('beforeunload', event => {
  event.preventDefault();
  event.returnValue = '';
});

const run = debounceLazy(editor => api.compileLinkRun(editor.getValue()), 100);
const setKeyboard = name => editor.setKeyboardHandler(`ace/keyboard/${name}`);

// Toolbar stuff
$('#run').addEventListener('click', event => run(editor));
$('#vim').addEventListener('click', event => setKeyboard('vim'));
$('#emacs').addEventListener('click', event => setKeyboard('emacs'));
$('#sublime').addEventListener('click', event => setKeyboard('sublime'));

// Editor stuff
const editor = ace.edit('input');
editor.session.setMode('ace/mode/c_cpp');
editor.setKeyboardHandler('ace/keyboard/vim');
editor.setOption('fontSize', 20);
editor.commands.addCommand({
  name: 'run',
  bindKey: {win: 'Ctrl+Enter', mac: 'Command+Enter'},
  exec: run
});
editor.setValue(initialProgram);
editor.clearSelection();

// Terminal stuff
Terminal.applyAddon(fit);
const term = new Terminal({convertEol: true, disableStdin: true, fontSize: 20});
term.open($('#output'));
term.fit();

// Splitter
Split({
  rowGutters: [{track: 2, element: $('.gutter')}],
  onDrag: debounceLazy(() => {
    term.fit();
    editor.resize();
  }, 10)
});

/// Compile stuff
const api = new API({
  async readBuffer(filename) {
    const response = await fetch(filename);
    return response.arrayBuffer();
  },

  hostWrite(s) { term.write(s); }
});
