const LAYOUT_CONFIG_KEY = 'layoutConfigAsm';

const initialProgram =
`int fac(int n) {
    if (n < 1) return 1;
    return n * fac(n - 1);
}
`;

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
        componentState: {value: initialProgram},
      }, {
        type: 'stack',
        content: [{
          type: 'component',
          componentName: 'terminal',
        }]
      }]
    }]
  };

  let layoutConfig = localStorage.getItem(LAYOUT_CONFIG_KEY);
  if (layoutConfig) {
    layoutConfig = JSON.parse(layoutConfig);
  } else {
    layoutConfig = defaultLayoutConfig;
  }
  layout = new GoldenLayout(layoutConfig, $('#layout'));

  layout.on('initialised', event => {
    editor.session.on('change', compile);
    compile();
  });

  layout.on('stateChanged', debounceLazy(() => {
    const state = JSON.stringify(layout.toConfig());
    localStorage.setItem(LAYOUT_CONFIG_KEY, state);
  }, 500));

  layout.registerComponent('editor', EditorComponent);
  layout.registerComponent('terminal', TerminalComponent);
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
let triple = 'x86_64';
function setTriple(newTriple) { triple = newTriple; compile(); }

let opt = '2';
function setOpt(newOpt) { opt = newOpt; compile(); }

$('#reset').on('click', event => { if (confirm('really reset?')) resetLayout() });
$('#triple').on('input', event => setTriple(event.target.value));
$('#opt').on('input', event => setOpt(event.target.value));


const compile = debounceLazy(async () => {
  const input = `test.cc`;
  const contents = editor.getValue();
  await api.compileToAssembly({input, contents, triple, opt});
}, 100);


initLayout();
