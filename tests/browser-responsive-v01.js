async page => {
  const errors=[];
  const external=[];
  const origin=new URL(page.url()).origin;
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    const url=request.url();
    if (/^https?:/.test(url) && new URL(url).origin!==origin) external.push(url);
  });
  for (const [width,height] of [[320,568],[360,640],[390,844],[768,1024],[1024,768],[1440,900]]) {
    await page.setViewportSize({width,height});
    await page.reload();
    if (await page.evaluate(() => document.documentElement.scrollWidth>innerWidth)) throw new Error(`Desbordamiento a ${width}px`);
    if (!await page.getByText('Ficticio · v0.2').isVisible()) throw new Error(`Falta distintivo ficticio a ${width}px`);
    const next=await page.locator('#mobile-next').isVisible() ? page.locator('#mobile-next') : page.locator('#next');
    await next.focus();
    await page.keyboard.press('Enter');
    if (await page.locator('#current-value').innerText()!=='0,01') throw new Error(`Navegación con teclado a ${width}px`);
    await next.click({timeout:5000});
    if (!(await page.locator('#current-date').innerText()).includes('21 de julio')) throw new Error(`Botón táctil a ${width}px`);
    await page.locator('[data-view="controles"]').click();
    await page.locator('#test-details summary').click();
    await page.locator('#new-date').fill('2016-08-01');
    await page.locator('#new-value').fill('1000001');
    await page.locator('#test-form button[type="submit"]').click();
    if (!await page.locator('#form-error').isVisible()) throw new Error(`No se rechazó la cifra extrema a ${width}px`);
    await page.locator('#new-value').fill('1000000');
    await page.locator('#test-form button[type="submit"]').click();
    if (await page.locator('#form-error').isVisible()) throw new Error(`Se rechazó el límite técnico a ${width}px`);
    const graph=await page.locator('#chart').innerHTML();
    if (/NaN|Infinity|undefined/.test(graph)) throw new Error(`Coordenadas inválidas en la gráfica a ${width}px`);
    const fits=await page.locator('.value-line').evaluate(line=>line.querySelector('.unit').getBoundingClientRect().right<=line.getBoundingClientRect().right+1);
    if (!fits) throw new Error(`La cifra de prueba se recorta a ${width}px`);
    if (await page.evaluate(() => document.documentElement.scrollWidth>innerWidth)) throw new Error(`Desbordamiento con datos a ${width}px`);
  }
  if (errors.length) throw new Error(`Errores JavaScript: ${errors.join('; ')}`);
  if (external.length) throw new Error(`La aplicación solicitó recursos externos: ${external.join('; ')}`);
  return 'Seis tamaños de pantalla, teclado, límites de entrada, gráfica y recursos locales: correctos.';
}
