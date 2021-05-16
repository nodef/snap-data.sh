const fs = require('fs');
const os = require('os');
const csv = require('csv');

const INPUT  = 'data.csv';
const OUTPUT = 'data.json';




function stringifyJson(x) {
  return JSON.stringify(x, null, 2);
}

function writeFile(pth, d) {
  d = d.replace(/\r?\n/g, os.EOL);
  fs.writeFileSync(pth, d);
}


function processRow(r) {
  var {id, name, type, path} = r;
  var a = {id, name, type, path, files: []};
  for (var k in r) {
    if (!k.startsWith('file')) continue;
    else if (r[k]) a.files.push(r[k]);
  }
  return a;
}


function main() {
  var rows = [];
  var s = fs.createReadStream(INPUT).pipe(csv.parse({columns: true, comment: '#'}));
  s.on('data', r => rows.push(processRow(r)));
  s.on('end', () => writeFile(OUTPUT, stringifyJson(rows)));
}
main();
