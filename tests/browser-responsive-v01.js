async page => {
  const errors=[];
  const external=[];
  const origin=new URL(page.url()).origin;
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    const url=request.url();
    if (/^https?:/.test(url) && new URL(url).origin!==origin) external.push(url);
  });
  for (const width of [320,360,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    await page.reload();
    if (await page.evaluate(() => document.documentElement.scrollWidth>innerWidth)) throw new Error(`Desbordamiento a ${width}px`);
    if (!await page.getByText('Caso ficticio · v0.1').isVisible()) throw new Error(`Falta distintivo ficticio a ${width}px`);
    const next=await page.locator('#mobile-next').isVisible() ? page.locator('#mobile-next') : page.locator('#next');
    await next.focus();
    await page.keyboard.press('Enter');
    if (await page.locator('#current-value').innerText()!=='0,01') throw new Error(`Navegación con teclado a ${width}px`);
    await page.locator('#test-details summary').click();
    await page.locator('#new-date').fill('2016-04-01');
    await page.locator('#new-value').fill('1000001');
    await page.locator('#test-form button[type="submit"]').click();
    if (!await page.locator('#form-error').isVisible()) throw new Error(`No se rechazó la cifra extrema a ${width}px`);
    await page.locator('#new-value').fill('1000000');
    await page.locator('#test-form button[type="submit"]').click();
    if (await page.locator('#form-error').isVisible()) throw new Error(`Se rechazó el límite técnico a ${width}px`);
    const graph=await page.locator('#chart').innerHTML();
    if (/NaN|Infinity|undefined/.test(graph)) throw new Error(`Coordenadas inválidas en la gráfica a ${width}px`);
    if (await page.evaluate(() => document.documentElement.scrollWidth>innerWidth)) throw new Error(`Desbordamiento con datos a ${width}px`);
  }
  if (errors.length) throw new Error(`Errores JavaScript: ${errors.join('; ')}`);
  if (external.length) throw new Error(`La aplicación solicitó recursos externos: ${external.join('; ')}`);
  return 'Seis tamaños de pantalla, teclado, límites de entrada, gráfica y recursos locales: correctos.';
}
