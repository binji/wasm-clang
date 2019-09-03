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

// Golden Layout
const layout = new GoldenLayout({
  content: [{
    type: 'row',
    content: [{
      type: 'component',
      componentName: 'editor',
    }, {
      type: 'stack',
      content: [{
        type: 'component',
        componentName: 'terminal',
      }, {
        type: 'component',
        componentName: 'canvas',
      }]
    }]
  }]
}, $('#layout'));

layout.registerComponent('editor', EditorComponent);
layout.registerComponent('terminal', TerminalComponent);
layout.registerComponent('canvas', CanvasComponent);

layout.init();

// Toolbar stuff
$('#run').on('click', event => run(editor));

layout.on('initialised', event => {
  // Editor stuff
  editor.commands.addCommand({
    name: 'run',
    bindKey: {win: 'Ctrl+Enter', mac: 'Command+Enter'},
    exec: run
  });
  editor.setValue(initialProgram);
  editor.clearSelection();
});
