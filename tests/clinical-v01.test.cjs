'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const match=html.match(/<script id="psa-core">\s*([\s\S]*?)<\/script>/);
assert.ok(match,'No se encontró la lógica del caso');
const sandbox={};
vm.createContext(sandbox);
vm.runInContext(match[1],sandbox,{timeout:1000,contextCodeGeneration:{strings:false,wasm:false}});
const core=sandbox.PSA_DEMO;
const rows=Array.from(core.ORIGINAL,r=>({...r}));
const base={scenario:'case',baseline:'case',isup:'4',assessmentDate:'',order:'unknown',life:'unknown',priorRT:'unknown',otherTreatment:'unknown',phase:'case',stage:'unknown',node:'unknown',imaging:'unknown',pet:'unknown',extent:'unknown',timing:'unknown',hormone:'unknown',salvage:'unknown',pelvic:'unknown',manualDT:''};
const evaluate=(date,extra={},series=rows)=>core.evaluateClinical(series,date,{...base,...extra});

// El dato de PSA indetectable del caso no se anticipa a enero de 2016.
assert.equal(evaluate('2016-01-19').signal.title,'Falta el dato basal');
assert.equal(evaluate('2016-01-19').signal.possible,false);
assert.equal(evaluate('2016-07-21').signal.possible,false);
assert.equal(evaluate('2016-11-09').signal.possible,false,'Una sola subida no confirma la señal');
assert.equal(evaluate('2017-06-09').signal.possible,true,'Dos aumentos consecutivos activan una señal para revisión');
assert.equal(evaluate('2017-06-09').signal.reason,'rises');
assert.equal(evaluate('2018-01-26').signal.triggerDate,'2017-06-09','Se conserva la fecha de la primera señal histórica');
assert.ok(evaluate('2018-01-26').signal.copy.includes('En el historial'));
assert.equal(evaluate('2017-06-09').risk.state,'high','ISUP 4 cumple uno de los criterios altos');
assert.equal(evaluate('2017-06-09').options.items.length,0,'No hay opciones sin contexto clínico');

const atBoundary=[{date:'2016-03-30',value:0.01},{date:'2016-07-30',value:0.1}];
const aboveBoundary=[{date:'2016-03-30',value:0.01},{date:'2016-07-30',value:0.1001}];
assert.equal(evaluate('2016-07-30',{},atBoundary).signal.possible,false,'0,1 exacto no supera el umbral');
assert.equal(evaluate('2016-07-30',{},aboveBoundary).signal.reason,'threshold','Más de 0,1 tras el basal activa una señal');
assert.equal(evaluate('2018-01-26',{baseline:'unknown'}).signal.possible,false);
assert.equal(evaluate('2016-11-09',{baseline:'confirmed',baselineDate:'2017-01-01'}).signal.possible,false,'No se usa un basal futuro');
assert.equal(evaluate('2018-01-26',{baseline:'confirmed',baselineDate:'2015-01-01'}).errors.length>0,true);
const badBaseline=[{date:'2016-03-30',value:0.3},{date:'2016-08-30',value:0.4}];
assert.equal(evaluate('2016-08-30',{},badBaseline).signal.title,'Revise el dato basal');
assert.equal(evaluate('2018-01-26',{baseline:'persistent'}).signal.possible,false);
assert.ok(evaluate('2018-01-26',{baseline:'persistent'}).errors.length>0);
assert.equal(evaluate('2018-01-26',{baseline:'persistent',assessmentDate:'2018-01-26'}).signal.title,'Persistencia comunicada');

// El cálculo requiere valores positivos, al menos tres en 12 meses y separación suficiente.
const growing=[{date:'2024-01-01',value:1},{date:'2024-04-01',value:2},{date:'2024-07-01',value:4}];
const dt=core.estimateDoubling(growing,'2024-07-01','2024-01-01');
assert.equal(dt.state,'estimated');
assert.ok(dt.value>2.9 && dt.value<3.1,'Duplicación aproximada cada tres meses');
assert.equal(core.estimateDoubling(growing.slice(0,2),'2024-07-01','2024-01-01').state,'insufficient');
assert.equal(core.estimateDoubling(growing,'2024-04-01','2024-01-01').state,'insufficient','Se excluyen valores futuros');
assert.equal(core.estimateDoubling([{date:'2024-01-01',value:1},{date:'2024-01-20',value:2},{date:'2024-07-01',value:4}],'2024-07-01','2024-01-01').state,'interval');
assert.equal(core.estimateDoubling([{date:'2024-01-01',value:4},{date:'2024-04-01',value:2},{date:'2024-07-01',value:1}],'2024-07-01','2024-01-01').state,'nonrising');
assert.equal(core.estimateDoubling([{date:'2024-01-01',value:0},{date:'2024-04-01',value:2},{date:'2024-07-01',value:4}],'2024-07-01','2024-01-01').state,'insufficient');
const withZero=[{date:'2024-01-01',value:0},{date:'2024-02-01',value:1},{date:'2024-04-01',value:2},{date:'2024-07-01',value:4}];
assert.equal(core.estimateDoubling(withZero,'2024-07-01','2024-01-01').excludedZeros,1,'La estimación declara la exclusión de ceros');
const old=[{date:'2022-01-01',value:1},{date:'2023-04-01',value:2},{date:'2024-07-01',value:4}];
assert.equal(core.estimateDoubling(old,'2024-07-01','2022-01-01').state,'insufficient','No se usan valores de más de 12 meses');

// EAU tras cirugía: alto si cualquiera de los criterios es alto; bajo exige ambos bajos.
const positive={possible:true};
const unknown={value:null}, slow={value:12.0001}, limit={value:12}, fast={value:8};
assert.equal(core.eauRisk(positive,'4',unknown,false).state,'high');
assert.equal(core.eauRisk(positive,'unknown',fast,false).state,'high');
assert.equal(core.eauRisk(positive,'3',limit,false).state,'high','Doce meses pertenece al grupo alto');
assert.equal(core.eauRisk(positive,'3',slow,false).state,'low');
assert.equal(core.eauRisk(positive,'unknown',slow,false).state,'pending');
assert.equal(core.eauRisk(positive,'3',unknown,false).state,'pending');
assert.equal(core.eauRisk({possible:false},'4',fast,false).state,'pending','El riesgo no se aplica antes de la señal');
assert.equal(core.formatDoubling(12.0001),'12,0001','La presentación conserva el límite EAU');
assert.equal(core.formatDoubling(9.0001),'9,0001','La presentación conserva el límite EMBARK');
assert.equal(core.formatDoubling(12.04),'12,04','Se muestran decimales cuando un redondeo ocultaría el límite EAU');
assert.equal(core.formatDoubling(9.04),'9,04','Se muestran decimales cuando un redondeo ocultaría el límite EMBARK');
assert.equal(core.formatDoubling(3.23),'3,2','Se evita una precisión innecesaria lejos de los límites');
assert.equal(core.formatDoubling(12.000001),'>12,0','El redondeo no oculta que supera 12 meses');
assert.equal(core.formatDoubling(9.000001),'>9,0','El redondeo no oculta que supera 9 meses');
assert.equal(core.formatDoubling(0.000001),'<0,0001','El redondeo no muestra cero para un valor positivo');

const first={assessmentDate:'2018-01-26',order:'first',life:'over5',priorRT:'no',otherTreatment:'no',stage:'m0',node:'n0',imaging:'conventional',hormone:'sensitive',salvage:'yes'};
let assessment=evaluate('2018-01-26',first);
assert.equal(assessment.contextAvailable,true);
assert.ok(Array.from(assessment.options.items).some(s=>s.includes('radioterapia como opción preferida')));
assessment=evaluate('2018-01-26',{...first,assessmentDate:'2018-01-27'});
assert.equal(assessment.contextAvailable,false);
assert.equal(assessment.options.items.length,0,'No se usan decisiones futuras');
assessment=evaluate('2018-01-26',{...first,assessmentDate:'2017-10-09',manualDT:'8'});
assert.equal(assessment.doubling.state,'stale');
assert.equal(assessment.options.title,'Actualice la valoración');
assert.equal(assessment.options.items.length,0,'Una valoración anterior no se presenta como actual');
assert.ok(evaluate('2018-01-26',{...first,assessmentDate:'2016-01-20'}).errors.length>0,'El contexto no puede ser anterior al basal');
assessment=evaluate('2018-01-26',{...first,stage:'uncertain'});
assert.equal(assessment.options.title,'Estadificación pendiente');
assert.equal(assessment.options.items.length,0,'Una lesión dudosa no se convierte en M1');
assessment=evaluate('2018-01-26',{...first,stage:'m1',hormone:'unknown'});
assert.equal(assessment.options.items.length,0,'M1 sin estado hormonal no selecciona tratamiento');
assessment=evaluate('2018-01-26',{...first,stage:'m1',hormone:'resistant'});
assert.equal(assessment.options.title,'Requiere una vía específica');
assert.equal(assessment.options.items.length,0,'La vía resistente no se inventa');

const second={assessmentDate:'2018-03-01',order:'second',secondDate:'2018-02-20',priorRT:'yes',otherTreatment:'no',stage:'m0',node:'n0',imaging:'conventional',hormone:'sensitive',salvage:'no',pelvic:'no',manualDT:'8'};
const extended=[...rows,{date:'2018-03-01',value:1.2}];
assert.equal(evaluate('2018-03-01',{...second,secondDate:''},extended).options.title,'Falta confirmar la segunda recidiva');
assert.ok(evaluate('2018-03-01',{...second,secondDate:'2016-01-20'},extended).errors.length>0);
assert.ok(evaluate('2018-03-01',{...second,secondDate:'2018-03-02'},extended).errors.length>0);
assessment=evaluate('2018-03-01',second,extended);
assert.equal(assessment.secondConfirmed,true);
assert.equal(assessment.doubling.state,'reported');
assert.ok(Array.from(assessment.options.items).some(s=>s.includes('EMBARK')));
assert.ok(assessment.risk.copy.includes('segunda recidiva'));
assert.ok(Array.from(evaluate('2018-03-01',{...second,manualDT:'9'},extended).options.items).some(s=>s.includes('EMBARK')));
assert.ok(!Array.from(evaluate('2018-03-01',{...second,manualDT:'9,0001'},extended).options.items).some(s=>s.includes('EMBARK')));
assert.ok(!Array.from(evaluate('2018-03-01',{...second,salvage:'yes'},extended).options.items).some(s=>s.includes('EMBARK')));
const exactPSA=[...rows,{date:'2018-03-01',value:1}];
const belowPSA=[...rows,{date:'2018-03-01',value:0.9999}];
assert.ok(Array.from(evaluate('2018-03-01',second,exactPSA).options.items).some(s=>s.includes('EMBARK')));
assert.ok(!Array.from(evaluate('2018-03-01',second,belowPSA).options.items).some(s=>s.includes('EMBARK')));
const firstNotEligibleForRT={...second,order:'first',secondDate:'',life:'over5',priorRT:'no'};
assert.ok(Array.from(evaluate('2018-03-01',firstNotEligibleForRT,extended).options.items).some(s=>s.includes('EMBARK')),'La primera recidiva sin radioterapia previa también puede reunir criterios del ensayo');
assert.equal(evaluate('2018-03-01',{...second,manualDT:''},extended).doubling.state,'phase','No se mezclan automáticamente fases con radioterapia previa');
assessment=evaluate('2018-03-01',{...second,manualDT:'<8'},extended);
assert.ok(assessment.errors.length>0);
assert.equal(assessment.options.items.length,0,'Un dato inválido bloquea las opciones');
assessment=evaluate('2018-03-01',{...second,stage:'m1',extent:'poly',timing:'metachronous',hormone:'sensitive'},extended);
assert.ok(Array.from(assessment.options.items).some(s=>s.includes('deprivación androgénica')));
assert.equal(evaluate('2017-06-09',second,extended).options.items.length,0,'La valoración y las opciones futuras no se anticipan');

// La v0.2 no usa M0 para inferir N0 y mantiene separadas las modalidades de imagen.
assert.equal(evaluate('2018-01-26',{...first,node:'unknown'}).options.items.length,0,'M0 sin N no selecciona una vía');
assert.ok(evaluate('2018-01-26',{...first,node:'unknown'}).options.copy.includes('ganglionar'));
assert.equal(evaluate('2018-01-26',{...first,life:'unknown'}).options.items.length,0,'La vía inicial exige esperanza de vida comunicada');
assert.equal(evaluate('2018-01-26',{...first,life:'upto5'}).options.title,'NCCN PROS-9 · observación');
assert.equal(evaluate('2018-01-26',{...first,life:'upto5',hormone:'resistant'}).options.title,'Requiere una vía específica');
assert.equal(evaluate('2018-01-26',{...first,imaging:'psma',pet:'negative'}).options.title,'Imagen convencional pendiente');
assert.equal(evaluate('2018-01-26',{...first,imaging:'both',pet:'suspected'}).options.title,'Estadificación pendiente');
assert.equal(evaluate('2018-01-26',{...first,imaging:'both',pet:'regional',node:'n0'}).options.title,'Revise las imágenes');
assert.equal(evaluate('2018-01-26',{...first,imaging:'both',pet:'distant',stage:'m0'}).options.title,'Revise las imágenes');
assert.ok(evaluate('2018-01-26',{...first,node:'n1',extent:'oligo',timing:'metachronous'}).options.title.includes('PROS-13'));
assert.equal(evaluate('2018-01-26',{...first,node:'n1',extent:'poly',timing:'metachronous'}).options.title,'Revise la extensión ganglionar');
assert.ok(evaluate('2018-01-26',{...first,stage:'m1',extent:'oligo',timing:'metachronous'}).options.title.includes('PROS-13'));
assert.ok(evaluate('2018-01-26',{...first,stage:'m1',extent:'oligo',timing:'synchronous'}).options.title.includes('PROS-14'));
assert.ok(evaluate('2018-01-26',{...first,stage:'m1',extent:'poly',timing:'metachronous'}).options.title.includes('PROS-14'));
assert.equal(evaluate('2018-01-26',{...first,stage:'m1',extent:'oligo',timing:'unknown'}).options.items.length,0);
assert.equal(evaluate('2018-01-26',{...first,stage:'m1',extent:'unknown'}).options.items.length,0);

// La persistencia comunicada no se deduce del PSA y tiene una vía inicial distinta del riesgo EAU.
assessment=evaluate('2018-01-26',{...first,baseline:'persistent',persistence:'unknown'});
assert.equal(assessment.options.title,'Falta confirmar la persistencia');
assessment=evaluate('2018-01-26',{...first,baseline:'persistent',persistence:'yes'});
assert.equal(assessment.signal.kind,'persistence');
assert.equal(assessment.risk.state,'pending');
assert.ok(assessment.options.title.includes('PROS-9'));

// No se confunden la radioterapia de rescate, el tratamiento pélvico y la indicación AEMPS.
assessment=evaluate('2018-03-01',{...second,pelvic:'unknown'},extended);
assert.ok(!Array.from(assessment.options.items).some(s=>s.includes('categoría 1')));
assert.ok(assessment.options.detail.includes('pelvis'));
assessment=evaluate('2018-03-01',second,extended);
assert.ok(Array.from(assessment.options.items).some(s=>s.includes('categoría 1')));
assessment=evaluate('2018-03-01',firstNotEligibleForRT,extended);
assert.ok(Array.from(assessment.options.items).some(s=>s.includes('no es una vía específica')));
assert.ok(evaluate('2018-01-26').signal.copy.includes('09/10/2017'),'Se distingue la fecha comunicada de la señal anterior');
assert.ok(!evaluate('2017-06-09').signal.copy.includes('09/10/2017'),'No se anticipa la fecha clínica futura');

// Una serie con tratamientos solo se calcula cuando se declara y confirma su fase.
const mixed=[...rows,{date:'2030-01-01',value:1.2},{date:'2030-03-01',value:0.1},{date:'2030-05-01',value:0.2},{date:'2030-07-01',value:0.4},{date:'2030-09-01',value:1.2}];
const mixedContext={...second,scenario:'hypothetical',assessmentDate:'2030-09-01',secondDate:'2030-05-01',priorRT:'no',otherTreatment:'yes',manualDT:''};
assert.equal(evaluate('2030-09-01',mixedContext,mixed).doubling.state,'phase','No se mezclan fases tras otros tratamientos');
const selected={...mixedContext,phase:'selected',phaseDate:'2030-03-01',phaseConfirm:'yes',treatmentType:'hormonal',treatmentDate:'2030-02-01'};
assessment=evaluate('2030-09-01',selected,mixed);
assert.equal(assessment.doubling.state,'estimated');
assert.ok(assessment.doubling.value>1.6 && assessment.doubling.value<1.9,'Solo se calcula la fase desde marzo');
assert.equal(evaluate('2030-09-01',{...selected,phaseConfirm:'unknown'},mixed).doubling.state,'phase');
assert.equal(evaluate('2030-09-01',{...selected,treatmentDate:'2030-04-01'},mixed).doubling.state,'phase');
assert.equal(evaluate('2030-09-01',{...selected,treatmentDate:'2030-03-01'},mixed).doubling.state,'phase','El mismo día no aclara si la muestra fue anterior al cambio');
assert.equal(evaluate('2030-09-01',{...selected,phaseDate:'2030-10-01'},mixed).doubling.state,'phase');
assert.equal(evaluate('2030-09-01',{...selected,otherTreatment:'unknown'},mixed).doubling.state,'phase');
assert.equal(evaluate('2030-09-01',{...mixedContext,manualDT:'8'},mixed).doubling.state,'reported','Se puede aportar un valor validado');
assert.equal(evaluate('2018-03-01',{...second,priorRT:'no',manualDT:''},extended).doubling.state,'phase','Los controles añadidos necesitan fase confirmada');
assert.ok(evaluate('2024-11-02',{...first,assessmentDate:'2024-11-02',priorRT:'no'}).errors.some(s=>s.includes('radioterapia')),'No se contradice la radioterapia del caso original');
assert.ok(evaluate('2024-11-02',{...first,assessmentDate:'2024-11-02',otherTreatment:'no'}).errors.some(s=>s.includes('hormonal')),'No se omite el tratamiento hormonal del caso original');
assert.equal(evaluate('2024-11-02',{...first,scenario:'hypothetical',assessmentDate:'2024-11-02'}).errors.length,0,'Un escenario alternativo se identifica expresamente');

console.log('Pruebas clínicas v0.2 superadas: cronología, fase, estadificación, persistencia y vías condicionadas.');
