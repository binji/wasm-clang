const LAYOUT_CONFIG_KEY = 'layoutConfig';

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
let layout = null;

function initLayout() {
  const defaultLayoutConfig = {
    settings: {
      showCloseIcon: false,
      showPopoutIcon: false,
    },
    content: [{
      type: 'row',
      content: [{
        type: 'component',
        componentName: 'editor',
        componentState: {fontSize: 18, value: initialProgram},
      }, {
        type: 'stack',
        content: [{
          type: 'component',
          componentName: 'terminal',
          componentState: {fontSize: 18},
        }, {
          type: 'component',
          componentName: 'canvas',
        }]
      }]
    }]
  };

  layout = new Layout({
    configKey: LAYOUT_CONFIG_KEY,
    defaultLayoutConfig,
  });

  layout.on('initialised', event => {
    // Editor stuff
    editor.commands.addCommand({
      name: 'run',
      bindKey: {win: 'Ctrl+Enter', mac: 'Command+Enter'},
      exec: run
    });
  });

  layout.registerComponent('canvas', CanvasComponent);
  layout.init();
}

function resetLayout() {
  localStorage.removeItem('layoutConfig');
  if (layout) {
    layout.destroy();
    layout = null;
  }
  initLayout();
}

// Toolbar stuff
$('#reset').on('click', event => { if (confirm('really reset?')) resetLayout() });
$('#run').on('click', event => run(editor));


initLayout();
