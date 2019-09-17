int fib(int n) {
    return n < 2 ? n : fib(n-1) + fib(n-2);
}

int fib2(int n, int a = 0, int b = 1) {
    return n == 0 ? a : fib2(n-1, b, a + b);
}

int fib3(int n) {
    int a = 0, b = 1;
    while (n-- > 0) {
        b = a + b;
        a = b - a;
    }
    return a;
}

int fib(int n) {
    int a = 0, b = 1;
    while (n-- > 0) {
        asm(
        "local.get %1\n"
        "local.get %0\n"
        "local.get %1\n"
        "i32.add\n"
        "local.set %1\n"
        "local.set %0\n"
        : "+r" (a), "+r" (b));
    }
    return a;
}
