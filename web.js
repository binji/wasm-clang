const initialProgram =
`#include <canvas.h>

int main() {
    canvas_setWidth(1000);
    canvas_setHeight(800);

    canvas_setFillStyleZ("white");
    canvas_fillRect(0, 0, 1000, 800);

    canvas_setFillStyleZ("black");
    canvas_setFontZ("100px impact");
    canvas_fillTextZ("Hello, World!", 250, 450);
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
