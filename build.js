const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const csv = require('csv');
const htmlEntities = require('html-entities');
const markdownToText = require('markdown-to-text').default;

const DATA_INPUT  = 'data.csv';
const DATA_OUTPUT = 'data.json';
const HELP_URL = 'https://github.com/nodef/snap-data.sh/wiki/${name}';
const HELP_NAME_SIZE = 16;
const HELP_DESC_SIZE = 74;




// HELPERS
// -------

function stringifyJson(x) {
  return JSON.stringify(x, null, 2);
}


function stringLimit(x, n) {
  return x.length <= n? x : x.substring(0, n-4)+' ...';
}

function stringAlign(x, n, s) {
  var a = '';
  for (var i=0; i<x.length; i+=n) {
    if (a) a += '\n'+' '.repeat(s);
    a += x.substring(i, i+n);
  }
  return a;
}


function readFile(f) {
  var d = fs.readFileSync(f, 'utf8');
  return d.replace(/\r?\n/g, '\n');
}

function writeFile(f, d) {
  d = d.replace(/\r?\n/g, os.EOL);
  fs.writeFileSync(f, d);
}


function readJson(pth) {
  var pth = pth||'package.json';
  var d = readFile(pth)||'{}';
  return JSON.parse(d);
}

function writeJson(pth, v) {
  var pth = pth||'package.json';
  var d = JSON.stringify(v, null, 2)+'\n';
  writeFile(pth, d);
}




// BUILD-MAN
// ---------

function readDescWiki() {
  var a = new Map();
  for (var f of fs.readdirSync('wiki')) {
    if (path.extname(f) !== '.md') continue;
    if (f==='Home.md') continue;
    var d = readFile(`wiki/${f}`);
    var name = f.replace(/\..*/, '');
    var desc = d.match(/^(.*)$/m)[1];
    a.set(name, desc);
  }
  return a;
}

function readHelp() {
  var a = '', ns = HELP_NAME_SIZE, ds = HELP_DESC_SIZE;
  for (var [name, desc] of readDescWiki())
    a += ` ${name.padEnd(ns)} ${stringAlign(desc, ds, 2+ns)}\n`;
  var d = readFile('man/help.txt');
  return d.replace('${commands}', a);
}

function readIndex(descs) {
  var a = '';
  var names = [...descs.keys()].sort();
  for (var name of names) {
    var desc = descs.get(name);
    a += `| [${name}] | ${stringLimit(desc, HELP_DESC_SIZE)} |\n`;
  }
  a += `\n\n`;
  for (var name of descs.keys())
    a += `[${name}]: ${HELP_URL.replace('${name}', name)}\n`;
  return a;
}


function copyMan(dir) {
  fs.mkdirSync('man', {recursive: true});
  if (!fs.existsSync(dir)) return;
  for (var f of fs.readdirSync(dir)) {
    if (path.extname(f) !== '.md') continue;
    if (f === 'Home.md') continue;
    var g = f.replace(/\.md$/g, '');
    if (fs.existsSync(`man/${g}.txt`)) continue;
    var d = readFile(`${dir}/${f}`);
    d = markdownToText(d);
    d = htmlEntities.decode(d);
    writeFile(`man/${g}.txt`, d);
  }
}


function buildMan(f=true) {
  var descs = readDescWiki();
  if (f) copyMan('wiki');
  if (f) writeFile('man/help.txt', readHelp());
  writeFile('index.log', readIndex(descs));
  var p = readJson('package.json');
  p.keywords = [...new Set([...p.keywords, ...descs.keys()])];
  if (f) writeJson('package.json', p);
}




// BUILD-DATA
// ----------


function processRow(r) {
  var {id, name, type, path} = r;
  var a = {id, name, type, path, files: []};
  for (var k in r) {
    if (!k.startsWith('file')) continue;
    else if (r[k]) a.files.push(r[k]);
  }
  return a;
}


function buildData() {
  var rows = [];
  var s = fs.createReadStream(DATA_INPUT).pipe(csv.parse({columns: true, comment: '#'}));
  s.on('data', r => rows.push(processRow(r)));
  s.on('end', () => writeFile(DATA_OUTPUT, stringifyJson(rows)));
}




// MAIN
// ----

function makeExec() {
  cp.execSync(`chmod +x index.js`);
}

function main(f=true) {
  buildData();
  buildMan(f);
  if (f) makeExec();
}
main(process.argv[2] !== 'local');
