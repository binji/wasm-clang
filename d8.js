/*
 * Copyright 2020 WebAssembly Community Group participants
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

load('shared.js');

class WriteBuffer {
  constructor() {
    this.buffer = '';
  }

  write(str) {
    this.buffer += str;
    while (true) {
      const newline = this.buffer.indexOf('\n');
      if (newline === -1) {
        break;
      }
      print(this.buffer.slice(0, newline));
      this.buffer = this.buffer.slice(newline + 1);
    }
  }

  flush() {
    if (this.buffer.length > 0) {
      print(this.buffer);
      this.buffer = '';
    }
  }
}

const writeBuffer = new WriteBuffer();

const api = new API({
  async readBuffer(name) { return readbuffer(name); },
  async compileStreaming(name) {
    return WebAssembly.compile(readbuffer(name));
  },
  hostWrite(s) { writeBuffer.write(s); }
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
    writeBuffer.flush();
    testRunner.notifyDone();
  }
})();
