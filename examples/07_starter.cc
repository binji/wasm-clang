#include <canvas_main.h>

const int w = 1000;
const int h = 800;
Canvas c{w, h};
ImageData image{w, h};

void setup() {
  for (int y = 0; y < h; ++y) {
    for (int x = 0; x < w; ++x) {
      image.data[y * w + x] = RGB(x | y, 0, 0);
    }
  }
  image.commit();
  c.putImageData(image, 0, 0);

  const char *msg = "x | y";
  c.setFillStyle("white");
  c.setFont("bold 200px sans");
  c.fillText(msg, (w - c.measureText(msg)) / 2, (h + 100) / 2);
}

void loop(double now, double elapsed) {
}
