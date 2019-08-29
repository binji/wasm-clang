const initialProgram =
`int fac(int n) {
    if (n < 1) return 1;
    return n * fac(n - 1);
}
`;

const compile = debounceLazy(async () => {
  const input = `test.cc`;
  const contents = editor.getValue();
  await api.compileToAssembly(input, contents);
}, 100);

editor.session.on('change', compile);
editor.setValue(initialProgram);
editor.clearSelection();

compile();
