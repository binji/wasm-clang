#include <cstdint>
#include <random>
#include <vector>

#include <canvas_main.h>

std::default_random_engine re{0};

const int w = 600;
const int h = 450;
Canvas c{w, h};
ImageData image{w, h};

std::vector<uint8_t> pixels(w * h);

const std::vector<uint32_t> palette = {
    0xff070707, 0xff07071f, 0xff070f2f, 0xff070f47, 0xff071757, 0xff071f67,
    0xff071f77, 0xff07278f, 0xff072f9f, 0xff073faf, 0xff0747bf, 0xff0747c7,
    0xff074fdf, 0xff0757df, 0xff0757df, 0xff075fd7, 0xff075fd7, 0xff0f67d7,
    0xff0f6fcf, 0xff0f77cf, 0xff0f7fcf, 0xff1787cf, 0xff1787c7, 0xff178fc7,
    0xff1f97c7, 0xff1f9fbf, 0xff1f9fbf, 0xff27a7bf, 0xff27a7bf, 0xff2fafbf,
    0xff2fafb7, 0xff2fb7b7, 0xff37b7b7, 0xff6fcfcf, 0xff9fdfdf, 0xffc7efef,
    0xffffffff,
};

 
void setup() {
  for (int x = 0; x < w; ++x) {
    pixels[(h - 1) * w + x] = 36;
  }
}

void loop(double now, double elapsed) {
  std::uniform_int_distribution<int> dist{0, 2};
  
  for (int x = 1; x < w - 1; ++x) {
    for (int y = 1; y < h; ++y) {
      uint8_t pixel = pixels[y * w + x];
      if (pixel != 0) {
        int rand_idx = dist(re);
        pixels[(y - 1) * w + (x - rand_idx + 1)] = pixel - (rand_idx & 1);
      } else {
        pixels[(y - 1) * w + x] = 0;
      }
    }
  }

  for (int i = 0; i < w * h; ++i) {
    image.data[i] = palette[pixels[i]];
  }
  image.commit();
  c.putImageData(image, 0, 0);
}
