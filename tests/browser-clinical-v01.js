async page => {
  const equal = (actual, expected, name) => {
    if (actual !== expected) throw new Error(`${name}: esperado ${expected}, obtenido ${actual}`);
  };
  const contains = (actual, expected, name) => {
    if (!actual.includes(expected)) throw new Error(`${name}: falta ${expected}`);
  };
  const errors=[];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({width:390,height:844});
  await page.reload();
  for(let i=0;i<6;i++) await page.locator('#mobile-next').click();
  equal(await page.locator('#current-value').innerText(),'0,51','Último control de la primera etapa');
  await page.locator('[data-view="valoracion"]').click();
  contains(await page.locator('#recurrence-copy').innerText(),'09/06/2017','Fecha de la señal histórica');
  equal(await page.locator('#options-list li').count(),0,'Sin opciones con contexto incompleto');

  await page.locator('[data-view="controles"]').click();
  await page.locator('#test-details summary').click();
  await page.locator('#new-date').fill('2018-03-01');
  await page.locator('#new-value').fill('1,2');
  await page.locator('#test-form button[type="submit"]').click();
  await page.locator('[data-view="valoracion"]').click();
  await page.locator('#clinical-context summary').click();
  await page.locator('#use-control-date').click();
  await page.locator('#clinical-order').selectOption('first');
  await page.locator('#clinical-life').selectOption('over5');
  await page.locator('#clinical-prior-rt').selectOption('no');
  await page.locator('#clinical-other-treatment').selectOption('no');
  await page.locator('#clinical-stage').selectOption('m0');
  await page.locator('#clinical-node').selectOption('n0');
  await page.locator('#clinical-imaging').selectOption('conventional');
  await page.locator('#clinical-hormone').selectOption('sensitive');
  await page.locator('#clinical-salvage').selectOption('no');
  await page.locator('#clinical-pelvic').selectOption('no');
  await page.locator('#clinical-psadt').fill('8');
  contains(await page.locator('#options-list').innerText(),'EMBARK','Primera recidiva no candidata a rescate');
  contains(await page.locator('#options-detail').innerText(),'confirma elegibilidad','Límite de la opción');
  await page.locator('#clinical-isup').selectOption('3');
  await page.locator('#clinical-psadt').fill('12,0001');
  contains(await page.locator('#risk-title').innerText(),'Riesgo bajo','Clasificación por encima de doce meses');
  contains(await page.locator('#doubling-copy').innerText(),'12,0001 meses','El valor visible coincide con la clasificación');
  await page.locator('#clinical-psadt').fill('12');
  contains(await page.locator('#risk-title').innerText(),'Riesgo alto','Doce meses pertenece al grupo alto');
  await page.locator('#clinical-isup').selectOption('4');
  await page.locator('#clinical-psadt').fill('8');

  await page.locator('#clinical-order').selectOption('second');
  equal(await page.locator('#options-title').innerText(),'Falta confirmar la segunda recidiva','Segunda recidiva sin fecha');
  await page.locator('#clinical-second-date').fill('2018-02-20');
  equal(await page.locator('#recurrence-title').innerText(),'Segunda recidiva comunicada','Dato de segunda recidiva');
  contains(await page.locator('#risk-copy').innerText(),'revisión especializada','Límite de la clasificación');
  await page.locator('#clinical-stage').selectOption('uncertain');
  equal(await page.locator('#options-title').innerText(),'Estadificación pendiente','Imagen incierta');
  equal(await page.locator('#options-list li').count(),0,'Sin vía M1 inferida');
  await page.locator('#clinical-stage').selectOption('m1');
  await page.locator('#clinical-extent').selectOption('poly');
  await page.locator('#clinical-timing').selectOption('metachronous');
  contains(await page.locator('#options-list').innerText(),'deprivación androgénica','Vía M1 hormonosensible');
  await page.locator('#clinical-hormone').selectOption('resistant');
  equal(await page.locator('#options-title').innerText(),'Requiere una vía específica','Resistencia comunicada');
  equal(await page.locator('#options-list li').count(),0,'Sin vía resistente inventada');

  await page.locator('[data-view="seguimiento"]').click();
  await page.locator('#mobile-previous').click();
  equal(await page.locator('#current-value').innerText(),'0,51','Retroceso a la primera etapa');
  equal(await page.locator('#options-list li').count(),0,'No se anticipa el contexto futuro');
  equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true,'Sin desbordamiento horizontal');
  equal(errors.length,0,'Errores de JavaScript');
  return 'Recorrido clínico v0.2 superado: contexto, escenarios, segunda recidiva y corte temporal.';
}
