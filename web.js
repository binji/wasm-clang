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

// Toolbar stuff
$('#run').addEventListener('click', event => run(editor));

editor.commands.addCommand({
  name: 'run',
  bindKey: {win: 'Ctrl+Enter', mac: 'Command+Enter'},
  exec: run
});
editor.setValue(initialProgram);
editor.clearSelection();
