const initialProgram =
`int fac(int n) {
    if (n < 1) return 1;
    return n * fac(n - 1);
}
`;

// Golden Layout
const layout = new GoldenLayout({
  content: [{
    type: 'row',
    content: [{
      type: 'component',
      componentName: 'editor',
    }, {
      type: 'component',
      componentName: 'terminal',
    }]
  }]
}, $('#layout'));

layout.registerComponent('editor', EditorComponent);
layout.registerComponent('terminal', TerminalComponent);

layout.init();

// Toolbar stuff
let triple = 'x86_64';
function setTriple(newTriple) { triple = newTriple; compile(); }

let opt = '2';
function setOpt(newOpt) { opt = newOpt; compile(); }

$('#triple').on('input', event => setTriple(event.target.value));
$('#opt').on('input', event => setOpt(event.target.value));


const compile = debounceLazy(async () => {
  const input = `test.cc`;
  const contents = editor.getValue();
  await api.compileToAssembly({input, contents, triple, opt});
}, 100);

layout.on('initialised', event => {
  editor.session.on('change', compile);
  editor.setValue(initialProgram);
  editor.clearSelection();

  compile();
});
