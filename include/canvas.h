#ifndef CANVAS_H_
#define CANVAS_H_

#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <string_view>

typedef double f64;
typedef uint32_t Handle;

enum FillRule {
  FILL_RULE_NONZERO,
  FILL_RULE_EVENODD,
};

enum LineCap {
  LINE_CAP_BUTT,
  LINE_CAP_ROUND,
  LINE_CAP_SQUARE,
};

enum LineJoin {
  LINE_JOIN_BEVEL,
  LINE_JOIN_ROUND,
  LINE_JOIN_MITER,
};

enum TextAlign {
  TEXT_ALIGN_LEFT,
  TEXT_ALIGN_RIGHT,
  TEXT_ALIGN_CENTER,
  TEXT_ALIGN_START,
  TEXT_ALIGN_END,
};

enum TextBaseline {
  TEXT_BASELINE_TOP,
  TEXT_BASELINE_HANGING,
  TEXT_BASELINE_MIDDLE,
  TEXT_BASELINE_ALPHABETIC,
  TEXT_BASELINE_IDEOGRAPHIC,
  TEXT_BASELINE_BOTTOM,
};

extern "C" {

void canvas_requestAnimationFrame();
void canvas_destroyHandle(Handle);

// Canvas attributes
void canvas_setWidth(int);
void canvas_setHeight(int);

// CanvasRenderingContext2D methods
void canvas_arc(f64 x, f64 y, f64 radius, f64 start_angle, f64 end_angle,
                bool anticlockwise);
void canvas_arcTo(f64 x1, f64 y1, f64 x2, f64 y2, f64 radius);
void canvas_beginPath();
void canvas_bezierCurveTo(f64 cp1x, f64 cp1y, f64 cp2x, f64 cp2y, f64 x, f64 y);
void canvas_clearRect(f64 x, f64 y, f64 w, f64 h);
void canvas_clip(enum FillRule);
void canvas_closePath();
Handle canvas_createImageData(int w, int h);
void canvas_ellipse(f64 x, f64 y, f64 radius_x, f64 radius_y, f64 rotation,
                    f64 start_angle, f64 end_angle, bool anticlockwise);
void canvas_fill(enum FillRule);
void canvas_fillRect(f64 x, f64 y, f64 w, f64 h);
void canvas_fillText(const char *buf, size_t len, f64 x, f64 y);
void canvas_lineTo(f64 x, f64 y);
f64 canvas_measureText(const char* buf, size_t len);
void canvas_moveTo(f64 x, f64 y);
void canvas_putImageData(Handle imageData, f64 x, f64 y);
void canvas_quadraticCurveTo(f64 cpx, f64 cpy, f64 x, f64 y);
void canvas_rect(f64 x, f64 y, f64 w, f64 h);
void canvas_rotate(f64 angle);
void canvas_save();
void canvas_scale(f64 x, f64 y);
void canvas_setTransform(f64 a, f64 b, f64 c, f64 d, f64 e, f64 f);
void canvas_stroke();
void canvas_strokeRect(f64 x, f64 y, f64 w, f64 h);
void canvas_strokeText(const char *buf, size_t len, f64 x, f64 y);
void canvas_transform(f64 a, f64 b, f64 c, f64 d, f64 e, f64 f);
void canvas_translate(f64 x, f64 y);

// CanvasRenderingContext2D properties
void canvas_setFillStyle(const char *buf, size_t);
void canvas_setFont(const char *buf, size_t);
void canvas_setGlobalAlpha(f64);
void canvas_setLineCap(enum LineCap);
void canvas_setLineDashOffset(f64);
void canvas_setLineJoin(enum LineJoin);
void canvas_setLineWidth(f64);
void canvas_setMiterLimit(f64);
void canvas_setShadowBlur(f64);
void canvas_setShadowColor(const char *buf, size_t);
void canvas_setShadowOffsetX(f64);
void canvas_setShadowOffsetY(f64);
void canvas_setStrokeStyle(const char *buf, size_t);
void canvas_setTextAlign(enum TextAlign);
void canvas_setTextBaseline(enum TextBaseline);

// ImageData methods
void canvas_imageDataSetData(Handle imageData, const void *buffer,
                             uint32_t offsetInBytes, uint32_t sizeInBytes);
}

// null-terminated string helpers.
static inline void canvas_fillTextZ(const char *buf, f64 x, f64 y) {
  canvas_fillText(buf, strlen(buf), x, y);
}

static inline void canvas_strokeTextZ(const char *buf, f64 x, f64 y) {
  canvas_strokeText(buf, strlen(buf), x, y);
}

static inline void canvas_setFillStyleZ(const char *buf) {
  canvas_setFillStyle(buf, strlen(buf));
}

static inline void canvas_setFontZ(const char *buf) {
  canvas_setFont(buf, strlen(buf));
}

static inline void canvas_setShadowColorZ(const char *buf) {
  canvas_setShadowColor(buf, strlen(buf));
}

static inline void canvas_setStrokeStyleZ(const char *buf) {
  canvas_setStrokeStyle(buf, strlen(buf));
}

// helpers
static inline void canvas_fillCircle(f64 x, f64 y, f64 radius) {
  canvas_beginPath();
  canvas_arc(x, y, radius, 0, 2 * 3.1415926, 0);
  canvas_fill(FILL_RULE_NONZERO);
}

static inline void canvas_strokeCircle(f64 x, f64 y, f64 radius) {
  canvas_beginPath();
  canvas_arc(x, y, radius, 0, 2 * 3.1415926, 0);
  canvas_stroke();
}

static inline uint32_t RGB(uint8_t r, uint8_t g, uint8_t b) {
  return 0xff000000 | ((b << 16) | (g << 8) | r);
}

static inline uint32_t RGBA(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
  return (a << 24) | (b << 16) | (g << 8) | r;
}


// C++ wrapper class.
class ImageData {
 public:
  const Handle handle;
  const int width;
  const int height;
  uint32_t *const data;

  explicit ImageData(int width, int height)
      : handle(canvas_createImageData(width, height)), width(width),
        height(height), data(new uint32_t[width * height]) {}

  ~ImageData() {
    delete[] data;
    canvas_destroyHandle(handle);
  }

  void commit() {
    canvas_imageDataSetData(handle, data, 0, width * height * sizeof(uint32_t));
  }

  ImageData(const ImageData&) = delete;
  ImageData& operator=(const ImageData&) = delete;
};

class Canvas {
 public:
  const int width;
  const int height;

  explicit Canvas(int width, int height) : width(width), height(height) {
    canvas_setWidth(width);
    canvas_setHeight(height);
  }

  void requestAnimationFrame() { canvas_requestAnimationFrame(); }

  // CanvasRenderingContext2D methods
  void arc(f64 x, f64 y, f64 radius, f64 start_angle, f64 end_angle,
           bool anticlockwise = false) {
    canvas_arc(x, y, radius, start_angle, end_angle, anticlockwise);
  }

  void arcTo(f64 x1, f64 y1, f64 x2, f64 y2, f64 radius) {
    canvas_arcTo(x1, y1, x2, y2, radius);
  }

  void beginPath() { canvas_beginPath(); }

  void bezierCurveTo(f64 cp1x, f64 cp1y, f64 cp2x, f64 cp2y, f64 x, f64 y) {
    canvas_bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }

  void clearRect(f64 x, f64 y, f64 w, f64 h) { canvas_clearRect(x, y, w, h); }

  void clip(enum FillRule fillrule) { canvas_clip(fillrule); }

  void closePath() { canvas_closePath(); }

  void ellipse(f64 x, f64 y, f64 radius_x, f64 radius_y, f64 rotation,
               f64 start_angle, f64 end_angle, bool anticlockwise = false) {
    canvas_ellipse(x, y, radius_x, radius_y, rotation, start_angle, end_angle,
                   anticlockwise);
  }

  void fill(enum FillRule fillrule) { canvas_fill(fillrule); }

  void fillRect(f64 x, f64 y, f64 w, f64 h) { canvas_fillRect(x, y, w, h); }

  void fillText(std::string_view text, f64 x, f64 y) {
    canvas_fillText(text.data(), text.size(), x, y);
  }

  void lineTo(f64 x, f64 y) { canvas_lineTo(x, y); }

  f64 measureText(std::string_view text) {
    return canvas_measureText(text.data(), text.size());
  }

  void moveTo(f64 x, f64 y) { canvas_moveTo(x, y); }

  void putImageData(const ImageData& imageData, f64 dx, f64 dy) {
    canvas_putImageData(imageData.handle, dx, dy);
  }

  void quadraticCurveTo(f64 cpx, f64 cpy, f64 x, f64 y) {
    canvas_quadraticCurveTo(cpx, cpy, x, y);
  }

  void rect(f64 x, f64 y, f64 w, f64 h) { canvas_rect(x, y, w, h); }

  void rotate(f64 angle) { canvas_rotate(angle); }

  void save() { canvas_save(); }

  void scale(f64 x, f64 y) { canvas_scale(x, y); }

  void setTransform(f64 a, f64 b, f64 c, f64 d, f64 e, f64 f) {
    canvas_setTransform(a, b, c, d, e, f);
  }

  void stroke() { canvas_stroke(); }

  void strokeRect(f64 x, f64 y, f64 w, f64 h) { canvas_strokeRect(x, y, w, h); }

  void strokeText(std::string_view text, f64 x, f64 y) {
    canvas_strokeText(text.data(), text.size(), x, y);
  }

  void transform(f64 a, f64 b, f64 c, f64 d, f64 e, f64 f) {
    canvas_transform(a, b, c, d, e, f);
  }

  void translate(f64 x, f64 y) { canvas_translate(x, y); }

  // CanvasRenderingContext2D properties
  void setFillStyle(std::string_view value) {
    canvas_setFillStyle(value.data(), value.size());
  }

  void setFont(std::string_view value) {
    canvas_setFont(value.data(), value.size());
  }

  void setGlobalAlpha(f64 value) { canvas_setGlobalAlpha(value); }

  void setLineCap(enum LineCap value) { canvas_setLineCap(value); }

  void setLineDashOffset(f64 value) { canvas_setLineDashOffset(value); }

  void setLineJoin(enum LineJoin value) { canvas_setLineJoin(value); }

  void setLineWidth(f64 value) { canvas_setLineWidth(value); }

  void setMiterLimit(f64 value) { canvas_setMiterLimit(value); }

  void setShadowBlur(f64 value) { canvas_setShadowBlur(value); }

  void setShadowColor(std::string_view value) {
    canvas_setShadowColor(value.data(), value.size());
  }

  void setShadowOffsetX(f64 value) { canvas_setShadowOffsetX(value); }

  void setShadowOffsetY(f64 value) { canvas_setShadowOffsetY(value); }

  void setStrokeStyle(std::string_view value) {
    canvas_setStrokeStyle(value.data(), value.size());
  }

  void setTextAlign(enum TextAlign value) { canvas_setTextAlign(value); }

  void setTextBaseline(enum TextBaseline value) {
    canvas_setTextBaseline(value);
  }
};

#endif // CANVAS_H_
