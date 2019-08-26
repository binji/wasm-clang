/// UI stuff
const $ = document.querySelector.bind(document);

const editor = ace.edit('input');

editor.session.setMode('ace/mode/c_cpp');
editor.setKeyboardHandler('ace/keyboard/vim');
editor.setOption('fontSize', 20);

editor.commands.addCommand({
  name: 'run',
  bindKey: {win: 'Ctrl+Enter', mac: 'Command+Enter'},
  exec: debounceLazy(editor => api.compileLinkRun(editor.getValue()), 100)
});

editor.setValue(`#include <stdio.h>
int fac(int n) {
    if (n < 1) return 1;
    return n * fac(n - 1);
}

int main() {
    for (int i = 1; i <= 10; ++i) {
        printf("fac(%d) = %d\\n", i, fac(i));
    }
}`);
editor.clearSelection();


Terminal.applyAddon(fit);
const term = new Terminal({convertEol: true, disableStdin: true, fontSize: 20});
term.open($('#output'));
term.fit();

Split({
  rowGutters: [{track: 1, element: $('.gutter')}],
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
