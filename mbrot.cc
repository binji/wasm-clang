#include <stdio.h>
#include <complex>
#include <vector>
#include <string>

using namespace std;

using D = double;
using I = int;
using P = complex<D>;

const int W = 75;
const int H = 39;
const I MaxI = 256;

struct C { int col, c; };

vector<C> makeColors() {
    const vector<int> colors = {31, 32, 33, 34, 35, 36, 37, 38};
    const char chars[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    vector<C> result;
    result.push_back(C{0, ' '});
    for (int i = 0; i < 52; ++i) {
        result.push_back(C{
            colors[i % colors.size()],
            chars[i % sizeof(chars)]
        });
    }
    return result;
}

const vector<C> Cs = makeColors();

void clear() { printf("\x1b[2J"); }
string color(int n) { return string("\x1b[") + to_string(n) + "m"; }

I eval(P z) {
    P c = z;
    I i;
    for (i = 0; i < MaxI && norm(z) < 2; ++i) { z = z*z + c; }
    return i;
}

C getC(P z) { return Cs[eval(z) * Cs.size() / (MaxI + 1)]; }

D lerp(D a, D z, D t) { return a * (1 - t) + z * t; }

P getP(D CX, D CY, D S, int x, int y) {
    const D L = CX - S * 0.5;
    const D R = CX + S * 0.5;
    const D T = CY - S * 0.5;
    const D B = CY + S * 0.5;
    const D nx = D(x) / W;
    const D ny = D(y) / H;
    return P{lerp(L, R, nx), lerp(T, B, ny)};
}

void draw(D CX, D CY, D S) {
    string s = "";
    for (int h = 0; h < H; ++h) {
        for (int w = 0; w < W; ++w) {
            auto c = getC(getP(CX, CY, S, w, h));
            s += color(c.col);
            s += c.c;
        }
        s += '\n';
    }
    puts(s.c_str());
}

int main() {
    D CX = -0.73;
    D CY = 0.19;
    D S = 0.0000005;

    clear();
    draw(CX, CY, S);
}
