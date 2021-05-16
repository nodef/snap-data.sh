#!/usr/bin/env node
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const data = require('./data.json');




// HELPERS
// -------

function setDifference(x, y) {
  var a = [];
  for (var v of x)
    if (!y.includes(v)) a.push(v);
  return a;
}


function matchWord(x, f) {
  return !f || x===f;
}

function matchWords(x, f) {
  if (!f) return true;
  for (var w of f.split(/\W+/g))
    if (!x.includes(w)) return false;
  return true;
}


function filename(x) {
  var a = path.basename(x, path.extname(x));
  if (path.extname(x)!=='tar') return a;
  return path.basename(a, path.extname(a));
}

function cpExec(cmd, o) {
  var stdio = [0, 1, 2];
  cp.execSync(cmd, Object.assign({stdio}, o));
}


function extractFile(pth) {
  if (pth.endsWith('.zip')) cpExec(`unzip "${pth}" && rm -f "${pth}"`);
  else if (pth.endsWith('.tar.gz')) cpExec(`tar -xzf "${pth} && rm -f "${pth}""`);
  else if (pth.endsWith('.gz')) cpExec(`gunzip "${pth}"`);
}




// RUN HELPERS
// -----------

function readArgs(args, fn) {
  var o = {error: null};
  for (var i=1, I=args.length; i<I; i++) {
    var e = args[i].indexOf('=');
    var k = e<0? args[i] : args[i].slice(0, i);
    var fv  = () => e<0? args[++i] : args[i].slice(i+1);
    o.error = fn(o, k, fv);
    if (o.error) break;
  }
  return o;
}




// RUN-HELP
// --------

function runHelp(args) {
  var A = args.length;
  var cmd = A<=1? 'help' : args[1];
  var man = path.join(__dirname, 'man', cmd+'.txt');
  if (fs.existsSync(man)) cpExec(`less "${man}"`);
  else console.error(`error: unknown command "${cmd}"`);
}




// RUN-CLONE
// ---------

function clone(r, dir) {
  var cwd = dir;
  if (r.path==='/') {
    cpExec(`mkdir -p "${id}"`, {cwd});
    cwd = path.join(dir, id);
    if (fs.existsSync(cwd)) return [[], r.files];
  }
  var fetched = [], skipped = [];
  for (var f of r.files) {
    var dow = path.join(cwd, f.replace(/.*\//, ''));
    var nam = filename(dow);
    if (fs.existsSync(nam)) { skipped.push(f); continue; }
    cpExec(`wget ${f}`);
    extractFile(dow);
    fetched.push(nam);
  }
  return [fetched, skipped];
}


function readCloneArg(o, k, fv) {
  if (!k.startsWith('-')) o.out = k;
  else if (k==='-i' || k==='--id')   o.id   = fv();
  else if (k==='-n' || k==='--name') o.name = fv();
  else if (k==='-t' || k==='--type') o.type = fv();
  else return `unknown option "${k}"`;
  return null;
}

function runClone(args) {
  var o = readArgs(args, readCloneArg);
  if (o.error) return console.error('error: '+o.error);
  var rows = data.filter(r => {
    if (!matchWord(r.id, o.id)) return false;
    if (!matchWords(r.name, o.name)) return false;
    if (!matchWords(r.type, o.type)) return false;
    return true;
  });
  console.log('Matched datasets: '+rows.map(r => r.id).join(', ')+'\n');
  if (o.out) process.chdir(o.out);
  var fetched = [], skipped = [];
  for (var r of rows) {
    var files = clone(r, process.cwd());
    fetched.push(...files[0]);
    skipped.push(...files[1]);
  }
  console.log('\n');
  console.log('Fetched the following files:\n'+fetched.join('\n'));
  console.log('Skipped the following files:\n'+skipped.join('\n'));
}




// MAIN
// ----

function processArgs(args) {
  var A = args.length;
  if (A<=2 || args[2]==='--help') return ['help'];
  if (A>=4 && args[3]==='--help') return ['help', args[2]];
  return args.slice(2);
}

function main(args) {
  var cmd = args[0];
  switch (cmd) {
    case 'help':  return runHelp(args);
    case 'clone': return runClone(args);
    default: console.error(`error: unknown command "${cmd}"`); break;
  }
  console.log();
}
main(processArgs(process.argv));
