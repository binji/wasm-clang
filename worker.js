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

self.importScripts('shared.js');

let api;
let port;
let canvas;
let ctx2d;

const apiOptions = {
  async readBuffer(filename) {
    const response = await fetch(filename);
    return response.arrayBuffer();
  },

  async compileStreaming(filename) {
    // TODO: make compileStreaming work. It needs the server to use the
    // application/wasm mimetype.
    if (false && WebAssembly.compileStreaming) {
      return WebAssembly.compileStreaming(fetch(filename));
    } else {
      const response = await fetch(filename);
      return WebAssembly.compile(await response.arrayBuffer());
    }
  },

  hostWrite(s) { port.postMessage({id : 'write', data : s}); }
};

let currentApp = null;

const onAnyMessage = async event => {
  switch (event.data.id) {
  case 'constructor':
    port = event.data.data;
    port.onmessage = onAnyMessage;
    api = new API(apiOptions);
    break;

  case 'setShowTiming':
    api.showTiming = event.data.data;
    break;

  case 'compileToAssembly': {
    const responseId = event.data.responseId;
    let output = null;
    let transferList;
    try {
      output = await api.compileToAssembly(event.data.data);
    } finally {
      port.postMessage({id : 'runAsync', responseId, data : output},
                       transferList);
    }
    break;
  }

  case 'compileTo6502': {
    const responseId = event.data.responseId;
    let output = null;
    let transferList;
    try {
      output = await api.compileTo6502(event.data.data);
    } finally {
      port.postMessage({id : 'runAsync', responseId, data : output},
                       transferList);
    }
    break;
  }

  case 'compileLinkRun':
    if (currentApp) {
      console.log('First, disallowing rAF from previous app.');
      // Stop running rAF on the previous app, if any.
      currentApp.allowRequestAnimationFrame = false;
    }
    currentApp = await api.compileLinkRun(event.data.data);
    console.log(`finished compileLinkRun. currentApp = ${currentApp}.`);
    break;

  case 'postCanvas':
    canvas = event.data.data;
    ctx2d = canvas.getContext('2d');
    break;
  }
};

self.onmessage = onAnyMessage;
