/// UI stuff
Split(['#input', '#output']);

const $ = document.querySelector.bind(document);
const editor = ace.edit('input');

editor.session.setMode('ace/mode/c_cpp');
editor.setKeyboardHandler('ace/keyboard/vim');
editor.setOption('fontSize', 20);

editor.commands.addCommand({
  name: 'run',
  bindKey: {win: 'Ctrl+Enter', mac: 'Command+Enter'},
  exec: editor => { api.compileLinkRun(editor.getValue()); }
});

Terminal.applyAddon(fit);

const term = new Terminal({convertEol: true, disableStdin: true, fontSize: 20});
term.open($('#output'));

term.fit(); // TODO call this on resize


/// Compile stuff
const api = new API({
  async readBuffer(filename) {
    const response = await fetch(filename);
    return response.arrayBuffer();
  },

  hostWrite(s) { term.write(s); }
});
