#include <stdio.h>

struct S { char c; int col = 0; };

void color(int n) { printf("\x1b[%dm", n); }
void newline() { putchar('\n'); }

template <typename F>
void times(int n, F&& f) {
    for (int i = 0; i < n; ++i) f(i);
}

void row(int n, S s) {
    color(s.col);
    times(n, [&](int i){ putchar(s.c); });
}

void spaces(int n) { row(n, S{' '}); }

template <typename F, typename G>
void shape(int n, F&& off, G&& on, S s) {
    times(n, [&](int i) {
        spaces(off(i));
        row(on(i), s);
        newline();
    });
}

void up_tri(int off, int h, S s) {
    shape(h,
        [&](auto i){ return off + h - i; },
        [&](auto i){ return 2*i-1; },
        s
    );
}

void down_tri(int off, int h, S s) {
    shape(h,
        [&](auto i){ return off + i; },
        [&](auto i){ return 2 * (h - i)-1; },
        s
    );
}

void block(int off, int w, int h, S s) {
    shape(h,
        [&](auto i){ return off; },
        [&](auto i){ return w; },
        s
    );
}

void tree(int off, int h, S s1, S s2) {
    up_tri(off, h, s1);
    int w = 2 * (h / 4) + 1;
    block(off + (h - 1) - w / 2, w, 2 * h / 3, s2);
}

void diamond(int off, int h, S s) {
    up_tri(off, h, s);
    down_tri(off, h, s);
}

int main() {
    // tree(10, 5, S{'#', 32}, S{'|', 91});
    diamond(10, 5, S{'$', 94});
}
