# Clang/LLD in WebAssembly

This is the demo for my CppCon 2019 talk! I'll update with a link to the video when it is live.

Thing should work, but it's still very much alpha demoware. Go to https://binji.github.io/wasm-clang to see it in action.

Most of the JavaScript code can be found here. If you're interested in the implementation of the in-memory filesystem, take a look at https://github.com/binji/llvm-project/tree/master/binji.

# Directory structure

## Shared utilities

- `clang`: clang compiler, compiled to wasm w/ WASI
- `lld`: lld linker, compiled to wasm w/ WASI
- `main`.css
- `memfs`: WASI implementation of in-memory filesystem,
- `shared.js`: shared utilities for all tools (web and d8)
- `shared\_web.js`: shared utilities for all web tools (asm.html, index.html, etc.)
- `sysroot.tar`: C++ standard headers and libraries
- `service_worker.js`: Service worker used by all web pages
- `worker.js`: Dedicated work used to compile/run

## Assemble 6502 code

- `6502.html`
- `6502.js`
- `vasm6502\_oldstyle`: [vasm assembler](http://sun.hasenbraten.de/vasm/) compiled to wasm w/ WASI

## Compile C++ code to x86/wasm assembly

- `asm.html`
- `asm.js`

## Compile C++ code in d8 (v8's console shell)

- `d8.js`

## Compile and run C++ code

- `index.html`
- `web.js`
