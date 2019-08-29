const initialProgram =
`int fac(int n) {
    if (n < 1) return 1;
    return n * fac(n - 1);
}
`;

let triple = 'x86_64';
function setTriple(newTriple) {
  triple = newTriple;
  compile();
}

$('#triple').addEventListener('click', event => setTriple(event.target.value));

const compile = debounceLazy(async () => {
  const input = `test.cc`;
  const contents = editor.getValue();
  await api.compileToAssembly({input, contents, triple});
}, 100);

editor.session.on('change', compile);
editor.setValue(initialProgram);
editor.clearSelection();

compile();
