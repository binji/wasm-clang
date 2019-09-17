#ifndef CANVAS_MAIN_H_
#define CANVAS_MAIN_H_

#include <canvas.h>

void setup();
void loop(double timeSec, double elapsedSec);

// TODO: move this into a library.
int main() {
  const int RAF_PROC_EXIT_CODE = 0xC0C0A;
  setup();
  canvas_requestAnimationFrame();
  return RAF_PROC_EXIT_CODE;
}

#define WASM_EXPORT __attribute__((__visibility__("default")))

extern "C" WASM_EXPORT void canvas_loop(double msec) {
  static bool first = true;
  static double lastSec = 0;
  double sec = msec / 1000.0;
  if (first) {
    lastSec = sec;
    first = false;
  }
  canvas_requestAnimationFrame();
  loop(sec, sec - lastSec);
  lastSec = sec;
}

#undef WASM_EXPORT

#endif // CANVAS_MAIN_H_
