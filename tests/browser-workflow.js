async page => {
  const equal = (actual, expected, name) => {
    if (actual !== expected) throw new Error(`${name}: esperado ${expected}, obtenido ${actual}`);
  };
  await page.setViewportSize({width:390,height:844});
  await page.reload();
  const value = () => page.locator('#current-value').textContent();
  const date = () => page.locator('#current-date').innerText();
  const count = () => page.locator('#history-body tr').count();
  equal(await value(),'0,05','Primer control');
  equal(await count(),1,'Historial inicial');
  equal(await page.locator('#source-note').getAttribute('hidden'),'','Nota futura oculta');
  equal(await page.locator('#case-reported-dt').getAttribute('hidden'),'','PSA-DT comunicado futuro oculto');
  for (const [index,expected] of ['0,01','0,01','0,02'].entries()) {
    await page.locator('#mobile-next').click();
    equal(await value(),expected,'Avance cronológico');
    if(index===0) equal(await page.locator('#source-note').getAttribute('hidden'),null,'Nota disponible desde su fecha');
  }
  equal(await date(),'9 de noviembre de 2016','Fecha del primer ascenso');
  equal(await page.locator('#signal-title').innerText(),'Subida detectada','Alerta de ascenso');
  equal(await count(),4,'Sin registros futuros en el historial');
  if (/2017|2018/.test(await page.locator('#history-body').textContent())) throw new Error('El historial contiene fechas futuras');
  for (const expected of ['0,10','0,25','0,51']) {
    await page.locator('#mobile-next').click();
    equal(await value(),expected,'Control siguiente');
  }
  for (const [index,expected] of ['0,04','0,09','0,23','0,46','0,73','0,94','1,13'].entries()) {
    await page.locator('#mobile-next').click();
    equal(await value(),expected,'Evolución posterior del caso');
    if (index===0) {
      equal(await page.locator('#signal-title').innerText(),'Cambio de fase','No se comparan controles a través del tratamiento');
      equal(await page.locator('#delta-value').innerText(),'No comparable','Cambio entre fases');
      equal(await page.locator('#phase-note').isVisible(),true,'Tratamiento y valores no cuantificados visibles');
      const line=await page.locator('#chart path[stroke="#a4f1d4"]').getAttribute('d');
      equal((line.match(/M/g)||[]).length,2,'La gráfica no une fases distintas');
    }
  }
  equal(await page.locator('#mobile-next').isDisabled(),true,'Último control');
  equal(await page.locator('#case-reported-dt').getAttribute('hidden'),null,'PSA-DT comunicado disponible al final del caso');
  for(let i=0;i<10;i++) await page.locator('#mobile-previous').click();
  equal(await value(),'0,02','Retroceso al cuarto control');
  equal(await count(),4,'Retroceso sin datos futuros');
  if (/2017|2018/.test(await page.locator('#history-body').textContent())) throw new Error('El retroceso conserva fechas futuras');
  await page.locator('[data-view="controles"]').click();
  await page.locator('#test-details summary').click();
  await page.locator('#new-date').fill('2016-12-10');
  await page.locator('#new-value').fill('<0,02');
  await page.locator('#test-form button[type="submit"]').click();
  equal(await page.locator('#form-error').isVisible(),true,'Rechazo de límite no exacto');
  equal(await value(),'0,02','No registrar dato inválido');
  await page.locator('#new-value').fill('1000001');
  await page.locator('#test-form button[type="submit"]').click();
  equal(await page.locator('#form-error').isVisible(),true,'Rechazo de cifras fuera del límite técnico');
  equal(await value(),'0,02','No registrar una cifra fuera de rango');
  await page.locator('#new-value').fill('0,03');
  await page.locator('#test-form button[type="submit"]').click();
  equal(await value(),'0,03','Valor ficticio añadido');
  equal(await count(),5,'Historial con prueba y sin futuro');
  await page.locator('[data-view="controles"]').click();
  await page.locator('#reset-tests').click();
  equal(await value(),'0,02','Restauración sin saltar al futuro');
  equal(await count(),4,'Historial restaurado');
  return 'Recorrido móvil superado: avance, retroceso, corte temporal y valores de prueba.';
}
