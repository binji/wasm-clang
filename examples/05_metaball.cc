#include <cmath>
#include <cstdint>
#include <random>
#include <vector>

#include <canvas_main.h>

std::default_random_engine re{0};
std::uniform_int_distribution<float> dist_x(50, 450);
std::uniform_int_distribution<float> dist_y(50, 350);
std::uniform_int_distribution<float> dist_dx(-0.8, 0.8);
std::uniform_int_distribution<float> dist_dy(-0.8, 0.8);
std::uniform_int_distribution<float> dist_r(50, 100);

const int blobCount = 10;
const int w = 500;
const int h = 400;
Canvas c{w, h};
ImageData image{w, h};

struct Blob {
  Blob()
      : x{dist_x(re)}, y{dist_y(re)}, dx{dist_dx(re)}, dy{dist_dy(re)},
        r{dist_r(re)} {}

  float x, dx, y, dy, r;
};

std::vector<Blob> blobs{blobCount};

void setup() {
}

void move(float &x, float &dx, float r, float canvas_r) {
  float sum = x + dx;
  if (std::abs(canvas_r - sum) > (canvas_r - r)) {
    dx = -dx;
  }
  x = sum;
}

void loop(double now, double elapsed) {
  for (auto& blob: blobs) {
    move(blob.x, blob.dx, blob.r, w / 2);
    move(blob.y, blob.dy, blob.r, h / 2);
  }

  auto clamp = [](float mn, float x, float mx) {
    return std::max(std::min(mx, x), mn);
  };
  auto square = [](auto x) { return x * x; };
  auto lerp = [](uint32_t a, float t, uint32_t b) {
    return static_cast<uint32_t>(a * (1 - t) + b * t);
  };

  for (int y = 0; y < h; ++y) {
    for (int x = 0; x < w; ++x) {
      float sum = 0;
      for (auto& blob: blobs) {
        sum += square(blob.r) / (square(x - blob.x) + square(y - blob.y));
      }
      float t = clamp(0, sum - 1, 1);
      image.data[y * w + x] =
          0xff000000 |
          RGB(lerp(0xd4, t, 0x73), lerp(0x19, t, 0xd4), lerp(0x5d, t, 0x19));
    }
  }
  image.commit();
  c.putImageData(image, 0, 0);
}
