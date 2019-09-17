#include <stdlib.h>

extern "C" {
void arc(double x, double y);
void setWidth(int);
void setHeight(int);
void setFillStyle(const char*, size_t);
void fillRect(int x, int y, int w, int h);
void beginPath();
void arc(int x, int y, int radius, float startAngle, float endAngle);
void fill();
}

int main() {
    setWidth(640);
    setHeight(640);
    const char hex[] = "0123456789abcdef";
    char buf[5] = "#008";
    for (int y = 0; y < 16; ++y) {
        for (int x = 0; x < 16; ++x) {
            buf[1] = hex[x];
            buf[2] = hex[y];
            setFillStyle(buf, 5);
            beginPath();
            arc(x * 20 + 10, y * 20 + 10, 9, 0, 2*3.1415);
            fill();
        }
    }
}

/*

f64 x = 100, y = 100;
f64 dx = 0.000005, dy = 0.000005;
f64 sw = 30, sh = 30;

void __attribute__((__visibility__("default"))) frame_loop(double ms) {
    // c.requestAnimationFrame();
    c.setFillStyle("white");
    c.fillRect(0, 0, w, h);

    c.setLineWidth(6);
    c.setFont("90px impact");
    c.setFillStyle("white");
    c.setStrokeStyle("black");
    c.strokeText("HELLO, WORLD", x, y);
    c.fillText("HELLO, WORLD", x, y);
    
    x += dx * ms;
    y += dy * ms;
    
    if (x < sw || x > w - sw) dx = -dx;
    if (y < sh || y > h - sh) dy = -dy;
}

*/
