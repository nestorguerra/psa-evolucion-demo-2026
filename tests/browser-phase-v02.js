async page => {
  const equal=(actual,expected,name)=>{if(actual!==expected) throw new Error(`${name}: ${actual}`);};
  const contains=(actual,expected,name)=>{if(!actual.includes(expected)) throw new Error(`${name}: ${actual}`);};
  await page.setViewportSize({width:390,height:844});
  await page.reload();
  for(let i=0;i<6;i++) await page.locator('#mobile-next').click();
  for(const [date,value] of [['2030-01-01','1,2'],['2030-03-01','0,1'],['2030-05-01','0,2'],['2030-07-01','0,4'],['2030-09-01','1,2']]) {
    await page.locator('[data-view="controles"]').click();
    if (!await page.locator('#test-details').evaluate(element=>element.open)) await page.locator('#test-details summary').click();
    await page.locator('#new-date').fill(date);
    await page.locator('#new-value').fill(value);
    await page.locator('#test-form button[type="submit"]').click();
  }
  await page.locator('[data-view="valoracion"]').click();
  await page.locator('#clinical-context summary').click();
  await page.locator('#clinical-scenario').selectOption('hypothetical');
  await page.locator('#use-control-date').click();
  await page.locator('#clinical-order').selectOption('second');
  await page.locator('#clinical-second-date').fill('2030-05-01');
  await page.locator('#clinical-prior-rt').selectOption('no');
  await page.locator('#clinical-other-treatment').selectOption('yes');
  contains(await page.locator('#doubling-copy').innerText(),'pendiente','No se calcula una mezcla de fases');
  await page.locator('#clinical-phase').selectOption('selected');
  await page.locator('#clinical-phase-date').fill('2030-03-01');
  await page.locator('#clinical-phase-confirm').selectOption('yes');
  await page.locator('#clinical-treatment-type').selectOption('hormonal');
  await page.locator('#clinical-treatment-date').fill('2030-02-01');
  contains(await page.locator('#doubling-copy').innerText(),'1,7 meses','Cálculo solo de la fase confirmada');
  await page.locator('#clinical-treatment-date').fill('2030-04-01');
  contains(await page.locator('#doubling-copy').innerText(),'pendiente','Un cambio posterior al inicio invalida la fase');
  await page.locator('#clinical-treatment-date').fill('2030-02-01');
  await page.locator('[data-view="seguimiento"]').click();
  await page.locator('#mobile-previous').click();
  equal(await page.locator('#current-date').innerText(),'1 de julio de 2030','Retroceso temporal');
  await page.locator('[data-view="valoracion"]').click();
  contains(await page.locator('#doubling-copy').innerText(),'pendiente','No se utiliza la fase indicada en una fecha futura');
  equal(await page.locator('#options-list li').count(),0,'No se anticipan opciones');
  return 'Fases y retroceso temporal verificados en la interfaz móvil.';
}
