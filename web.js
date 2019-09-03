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

// Canvas stuff
const canvasEl = $('#canvas');
function showCanvas(show) {
  $('#terminal').hidden = !show;
  canvasEl.hidden = show;
  term.fit();
}

api.postCanvas(canvasEl.transferControlToOffscreen());

// Toolbar stuff
$('#run').addEventListener('click', event => run(editor));
$('#showCanvas')
    .addEventListener('click', event => showCanvas(!event.target.checked));

// Editor stuff
editor.commands.addCommand({
  name: 'run',
  bindKey: {win: 'Ctrl+Enter', mac: 'Command+Enter'},
  exec: run
});
editor.setValue(initialProgram);
editor.clearSelection();
