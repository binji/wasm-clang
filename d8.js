load('shared.js');

async function readBuffer(filename) {
  return readbuffer(filename);
}

function hostWrite(s) {
  console.log(s);
}

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

const memfs = new MemFS(hostWrite);
const ready = memfs.ready.then(async () => {
  const tar = new Tar(await readBuffer('sysroot.tar'));
  tar.untar(memfs);
  console.log('Done untarring sysroot.');
});

(async function() {
  testRunner.waitUntilDone();
  try {
    await compileLinkRun(contents);
  } catch (e) {
    console.log(e.stack);
  } finally {
    testRunner.notifyDone();
  }
})();
