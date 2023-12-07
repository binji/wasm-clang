# Clang/LLD in WebAssembly

This is the demo for my CppCon 2019 talk! You can view the talk on [youtube](https://www.youtube.com/watch?v=5N4b-rU-OAA)

Thing should work, but it's still very much alpha demoware. Go to https://binji.github.io/wasm-clang to see it in action.

Most of the JavaScript code can be found here. If you're interested in the implementation of the in-memory filesystem, take a look at https://github.com/binji/llvm-project/tree/master/binji.

Some notes on how I built this, sorry that they are relatively sparse: https://gist.github.com/binji/b7541f9740c21d7c6dac95cbc9ea6fca

# Directory structure

## Shared utilities

- `clang`: clang compiler, compiled to wasm w/ WASI
- `lld`: lld linker, compiled to wasm w/ WASI
- `main`.css
- `memfs`: WASI implementation of in-memory filesystem,
- `shared.js`: shared utilities for all tools (web and d8)
- `shared_web.js`: shared utilities for all web tools (asm.html, index.html, etc.)
- `sysroot.tar`: C++ standard headers and libraries
- `service_worker.js`: Service worker used by all web pages
- `worker.js`: Dedicated work used to compile/run

## Assemble 6502 code

- `6502.html`
- `6502.js`
- `vasm6502_oldstyle`: [vasm assembler](http://sun.hasenbraten.de/vasm/) compiled to wasm w/ WASI

## Compile C++ code to x86/wasm assembly

- `asm.html`
- `asm.js`

## Compile C++ code in d8 (v8's console shell)

- `d8.js`

## Compile and run C++ code

- `index.html`
- `web.js`
