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

const LAYOUT_CONFIG_KEY = 'layoutConfig6502';

const initialProgram =
` .org $8000

reset:
 lda #$ff
 sta $6000

 lda #$50
 sta $6000

loop:
 ror
 sta $6000
 jmp loop

 .org $fffc
 .word reset
 .word 0
`;

let asmEditor = null;
function AsmEditorComponent(container, state) {
  asmEditor = ace.edit(container.getElement()[0]);
  asmEditor.session.setMode('ace/mode/assembly_x86');
  asmEditor.setOption('fontSize', `${state.fontSize || 18}px`);
  asmEditor.setReadOnly(true);

  container.on('fontSizeChanged', fontSize => {
    container.extendState({fontSize});
    asmEditor.setFontSize(`${fontSize}px`);
  });
  container.on('resize', debounceLazy(event => asmEditor.resize(), 20));
  container.on('destroy', event => {
    if (asmEditor) {
      asmEditor.destroy();
      asmEditor = null;
    }
  });
}

// Golden Layout
let layout = null;

function initLayout() {
  const defaultLayoutConfig = {
    settings: {
      showCloseIcon: false,
      showPopoutIcon: false,
    },
    content: [{
      type: 'row',
      content: [{
        type: 'component',
        componentName: 'editor',
        componentState: {fontSize: 18, value: initialProgram},
      }, {
        type: 'column',
        content: [{
          type: 'component',
          componentName: 'terminal',
          componentState: {fontSize: 18},
        }, {
          type: 'component',
          componentName: 'asmEditor',
          componentState: {fontSize: 18},
        }]
      }]
    }]
  };

  layout = new Layout({
    configKey: LAYOUT_CONFIG_KEY,
    defaultLayoutConfig,
  });

  layout.on('initialised', event => {
    editor.session.on('change', compile);
    compile();
  });

  layout.registerComponent('asmEditor', AsmEditorComponent);
  layout.init();
}

function resetLayout() {
  localStorage.removeItem(LAYOUT_CONFIG_KEY);
  if (layout) {
    layout.destroy();
    layout = null;
  }
  initLayout();
}


// Toolbar stuff
/*
let triple = 'x86_64';
function setTriple(newTriple) { triple = newTriple; compile(); }

let opt = '2';
function setOpt(newOpt) { opt = newOpt; compile(); }

$('#triple').on('input', event => setTriple(event.target.value));
$('#opt').on('input', event => setOpt(event.target.value));
*/
$('#reset').on('click', event => { if (confirm('really reset?')) resetLayout() });

blobUrl = null;
$('#download').on('click', async event => {
  const input = 'test.s';
  const output = 'test.out';
  const contents = editor.getValue();
  const flags = ['-dotdir', '-Fbin'];
  const outputBuf =
      await api.compileTo6502({input, output, contents, flags});
  if (outputBuf) {
    const u8 = new Uint8Array(outputBuf);
    const blob = new Blob([u8]);

    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }
    blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.querySelector('#downloadLink');
    downloadLink.setAttribute('href', blobUrl);
    downloadLink.click();
  }
});


const compile = debounceLazy(async () => {
  const input = 'test.s';
  const output = 'test.out';
  const contents = editor.getValue();
  const flags = ['-dotdir'];
  const outputBuf =
      await api.compileTo6502({input, output, contents, flags});
  let str = '';
  if (outputBuf) {
    const u8 = new Uint8Array(outputBuf);
    str = readStr(u8, 0, u8.length);
  }
  if (asmEditor) {
    asmEditor.setValue(str);
    asmEditor.clearSelection();
  }
  document.querySelector('#download').disabled = !outputBuf;
}, 100);


initLayout();
