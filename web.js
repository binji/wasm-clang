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
  exec: editor => { compileLinkRun(editor.getValue()); }
});

Terminal.applyAddon(fit);

const term = new Terminal({convertEol: true, disableStdin: true, fontSize: 20});
term.open($('#output'));

term.fit(); // TODO call this on resize


/// Compile stuff
async function readBuffer(filename) {
  const response = await fetch(filename);
  return response.arrayBuffer();
}

function hostWrite(s) {
  term.write(s);
}

const memfs = new MemFS(hostWrite);
const ready = memfs.ready.then(async () => {
  const tar = new Tar(await readBuffer('sysroot.tar'));
  tar.untar(memfs);
  console.log('Done untarring sysroot.');
});
