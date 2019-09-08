const initialProgram =
`#include <canvas.h>
#include <stdint.h>

const int w = 1000;
const int h = 800;
Canvas c{w, h};
ImageData image{w, h};

int main() {
    for (int y = 0; y < h; ++y) {
        for (int x = 0; x < w; ++x) {
            image.data[y * w + x] = RGB(x | y, 0, 0);
        }
    }
    image.commit();
    c.putImageData(image, 0, 0);

    const char* msg = "x | y";
    c.setFillStyle("white");
    c.setFont("bold 200px sans");
    c.fillText(msg, (w - c.measureText(msg)) / 2, (h + 100) / 2);
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
