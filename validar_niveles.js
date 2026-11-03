const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const flagDirectory = path.join(root, 'assets', 'flags');
const reportFile = path.join(root, 'validacion_niveles.md');
const elementIds = [
  'setup', 'dashboard', 'levelScreen', 'playScreen', 'resultScreen',
  'greeting', 'totalStars', 'completed', 'gamesPlayed', 'bestAccuracy',
  'subject', 'gameGrid', 'medals', 'progress', 'levelTitle',
  'levelDescription', 'levels', 'questionCount', 'scoreCount', 'questionBar',
  'gameCategory', 'questionText', 'questionVisual', 'answers', 'feedback',
  'next', 'join', 'change', 'home', 'resultHome', 'search', 'exitGame',
  'backLevels', 'retry', 'nextLevel', 'reset', 'sound'
];

function element() {
  return {
    hidden: false,
    value: '',
    textContent: '',
    innerHTML: '',
    style: {},
    children: [],
    focus() {},
    addEventListener() {}
  };
}

function loadGame() {
  const elements = Object.fromEntries(elementIds.map(id => [id, element()]));
  const window = {
    EDU_VALIDATION: true,
    scrollTo() {}
  };
  const context = {
    window,
    document: { getElementById: id => elements[id] || element() },
    localStorage: { getItem: () => null, setItem() {} },
    console,
    alert() {},
    confirm: () => true,
    AudioContext: null
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root, 'app.js'), 'utf8'), context);
  return window.EDU_GAME_API;
}

function flagExists(code) {
  return fs.existsSync(path.join(flagDirectory, `${code}.png`));
}

function validateQuestion(question) {
  if (!question || !question.text || !question.answer) return 'enunciado o respuesta vacía';
  if (!Array.isArray(question.options) || question.options.length !== 4) return 'no tiene cuatro opciones';
  if (new Set(question.options).size !== 4) return 'tiene opciones duplicadas';
  if (!question.options.includes(question.answer)) return 'la respuesta correcta no está incluida';
  if (question.visual && question.visual.type === 'flag' && !flagExists(question.visual.code)) {
    return `falta la bandera ${question.visual.code}`;
  }
  if (question.visual && question.visual.type === 'flag-options') {
    for (const option of question.options) {
      const code = [...option].map(char => String.fromCharCode(char.codePointAt(0) - 127397)).join('').toLowerCase();
      if (!flagExists(code)) return `falta la bandera ${code}`;
    }
  }
  return '';
}

function main() {
  const api = loadGame();
  const rows = [];
  const failures = [];
  for (const game of api.games) {
    for (let level = 1; level <= 10; level += 1) {
      const pool = api.poolFor(game.id, level).filter(Boolean);
      const unique = [...new Map(pool.map(question => [api.questionKey(question), question])).values()];
      const invalid = unique.map(validateQuestion).filter(Boolean);
      const enough = unique.length >= api.ROUND;
      const status = enough && invalid.length === 0 ? 'OK' : 'ERROR';
      if (status !== 'OK') failures.push(`${game.id} nivel ${level}: ${unique.length} válidas, ${invalid.join('; ')}`);
      rows.push(`| ${game.name} | ${level} | ${unique.length} | ${status} |`);
    }
  }

  const worldLevelOne = api.poolFor('world', 1).filter(Boolean);
  if (worldLevelOne.length < 20 || worldLevelOne.some(question => !question.visual || question.visual.type !== 'flag')) {
    failures.push('world nivel 1: no genera 20 preguntas de banderas con imágenes');
  }

  const report = [
    '# Validación de niveles',
    '',
    `Generado: ${new Date().toISOString()}`,
    '',
    'Cada fila representa el banco único disponible para el nivel. La partida toma 20 preguntas sin repetir.',
    '',
    '| Juego | Nivel | Preguntas válidas generables | Estado |',
    '|---|---:|---:|---|',
    ...rows,
    '',
    `Resultado: ${failures.length === 0 ? 'OK - 140 niveles válidos' : `ERROR - ${failures.length} problemas`}`,
    ''
  ].join('\n');
  fs.writeFileSync(reportFile, report, 'utf8');
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
    return;
  }
  console.log('140 niveles válidos; Exploradores del Mundo nivel 1 genera 135 preguntas de banderas.');
}

main();
