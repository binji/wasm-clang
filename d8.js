load('shared.js');

const api = new API({
  async readBuffer(name) { return readbuffer(name); },
  async compileStreaming(name) {
    return WebAssembly.compile(readbuffer(name));
  },
  hostWrite(s) { console.log(s); }
});

const contents = `
#include <stdio.h>

int fib(int n) {
  if (n < 2) return n;
  return fib(n-1) + fib(n-2);
}

int main() {
  printf("fib(10) = %d\\n", fib(10));
}
`;

(async function() {
  testRunner.waitUntilDone();
  try {
    await api.compileLinkRun(contents);
  } catch (e) {
    console.log(e.stack);
  } finally {
    testRunner.notifyDone();
  }
})();
