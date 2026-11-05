'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/<script id="psa-core">\s*([\s\S]*?)<\/script>/);
assert.ok(match, 'No se encontró la lógica del caso');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(match[1], sandbox, {timeout:1000, contextCodeGeneration:{strings:false,wasm:false}});
const core = sandbox.PSA_DEMO;
const rows = Array.from(core.ORIGINAL, x => ({...x}));

assert.deepEqual(rows.map(x=>[x.date,x.value]), [
  ['2016-01-19',0.05],['2016-03-30',0.01],['2016-07-21',0.01],
  ['2016-11-09',0.02],['2017-06-09',0.10],['2017-10-09',0.25],['2018-01-26',0.51],
  ['2022-11-30',0.04],['2023-05-31',0.09],['2023-11-30',0.23],['2024-02-29',0.46],
  ['2024-05-31',0.73],['2024-08-31',0.94],['2024-11-02',1.13]
], 'Los datos deben coincidir con el gráfico original');

const beginning = core.analyze(rows,'2016-01-19');
assert.equal(beginning.visible.length,1);
assert.equal(beginning.trend,'start');
assert.equal(beginning.delta,null);
assert.equal(beginning.last.value,0.05);

const early = core.analyze(rows,'2016-11-09');
assert.equal(early.visible.length,4);
assert.equal(early.last.date,'2016-11-09');
assert.equal(early.previous.value,0.01);
assert.equal(early.last.value,0.02);
assert.equal(early.delta,0.01);
assert.equal(early.trend,'rise');
assert.equal(early.atReference,false);
assert.ok(Array.from(early.visible).every(r=>r.date<='2016-11-09'),'No debe incluir valores futuros');

const beforeRise = core.analyze(rows,'2016-07-21');
assert.equal(beforeRise.trend,'stable');
assert.equal(beforeRise.delta,0);
assert.equal(beforeRise.visible.length,3);
const afterThreshold = core.analyze(rows,'2017-10-09');
assert.equal(afterThreshold.atReference,true);
assert.equal(afterThreshold.last.value,0.25);
assert.equal(afterThreshold.visible.length,6);
assert.ok(!Array.from(afterThreshold.visible).some(r=>r.date==='2018-01-26'));
const all = core.analyze(rows,'2018-01-26');
assert.equal(all.last.value,0.51);
assert.equal(all.visible.length,7);
const later=core.analyze(rows,'2024-11-02');
assert.equal(later.last.value,1.13,'Último valor cuantificado de la gráfica posterior');
assert.equal(later.visible.length,14);

const unsorted = [rows[6],rows[0],rows[3],rows[1]];
const originalOrder = unsorted.map(r=>r.date).join('|');
const clipped = core.analyze(unsorted,'2016-11-09');
assert.equal(clipped.last.date,'2016-11-09');
assert.equal(clipped.visible.length,3);
assert.equal(unsorted.map(r=>r.date).join('|'),originalOrder,'El análisis no debe modificar los datos');
assert.equal(core.parseValue('0,12'),0.12);
assert.equal(core.parseValue('0.0123'),0.0123);
assert.equal(core.parseValue('0'),0);
assert.equal(core.parseValue('1000000'),1000000,'Límite técnico admitido');
assert.equal(core.parseValue('1000001'),null,'Se rechaza un valor fuera del límite técnico');
assert.equal(core.parseValue('9'.repeat(309)),null,'Se rechazan valores que desbordan la gráfica');
for(const bad of ['','-1','<0,1','0,1,2','1e2','Infinity','abc']) assert.equal(core.parseValue(bad),null,`Debe rechazar ${bad}`);
assert.equal(core.validDate('2016-02-29'),true);
assert.equal(core.validDate('2016-02-30'),false);
assert.equal(core.validDate('2016-13-01'),false);
assert.throws(()=>core.analyze(rows,'2016-02-30'));
console.log('Pruebas superadas: datos originales, cortes temporales, alarmas numéricas y entradas.');
