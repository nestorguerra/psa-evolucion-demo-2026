async page => {
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width:320,height:568});
  await page.reload();
  for (const [view,visible] of [['seguimiento',2],['valoracion',1],['controles',1],['fuentes',1]]) {
    await page.locator(`.app-tab[data-view="${view}"]`).click();
    if (await page.locator(`.app-tab[data-view="${view}"]`).getAttribute('aria-current')!=='page') throw new Error(`Pestaña no marcada: ${view}`);
    const count=await page.locator(`[data-app-view="${view}"]:visible`).count();
    if (count!==visible) throw new Error(`Pantallas visibles incorrectas en ${view}: ${count}`);
  }
  await page.locator('#install-button').click();
  if (!await page.locator('#install-dialog').isVisible()) throw new Error('No se abrió la ayuda de instalación');
  if (!(await page.locator('#install-dialog').innerText()).includes('Añadir a pantalla de inicio')) throw new Error('Falta la instrucción de instalación');
  await page.locator('#close-install').click();
  if (await page.locator('#install-dialog').isVisible()) throw new Error('No se cerró la ayuda de instalación');
  await page.locator('[data-view="seguimiento"]').click();
  await page.locator('[data-view="controles"]').click();
  if (await page.locator('#later-stage-details').evaluate(element=>element.open)) throw new Error('La etapa posterior se mostró sin solicitarla');
  await page.locator('#later-stage-details summary').click();
  if (!(await page.locator('#later-stage-details').innerText()).includes('<0,01 ng/mL')) throw new Error('Falta la expresión no cuantificada del caso');
  await page.locator('#test-details summary').click();
  await page.locator('#new-date').fill('2016-02-01');
  await page.locator('#new-value').fill('0,07');
  await page.locator('#test-form button[type="submit"]').click();
  if ((await page.locator('#current-value').innerText())!=='0,07') throw new Error('El control añadido no aparece');
  await page.reload();
  if ((await page.locator('#current-value').innerText())!=='0,05') throw new Error('Los valores de prueba no se descartaron al recargar');
  if (await page.locator('#history-body tr').count()!==1) throw new Error('El historial inicial no se restauró');
  if (errors.length) throw new Error(`Errores JavaScript: ${errors.join('; ')}`);
  return 'Pantallas, instalación guiada, datos de sesión y recarga verificados.';
}
