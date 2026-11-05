async page => {
  await page.setViewportSize({width:390,height:844});
  await page.reload();
  const info=await page.evaluate(async()=>{
    const manifest=await fetch('manifest.webmanifest').then(r=>r.json());
    await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error('service worker no preparado')),20000))]);
    return {display:manifest.display,icons:manifest.icons.map(icon=>icon.sizes)};
  });
  if(info.display!=='standalone' || !info.icons.includes('192x192') || !info.icons.includes('512x512')) throw new Error('Manifiesto incompleto');
  await page.reload();
  if (!await page.evaluate(()=>Boolean(navigator.serviceWorker.controller))) throw new Error('La aplicación aún no está controlada para el uso sin conexión');
  try {
    await page.context().setOffline(true);
    await page.reload();
    if (!/v0\.2/.test(await page.title())) throw new Error('No se abrió la versión esperada sin conexión');
    await page.locator('#mobile-next').click();
    if (await page.locator('#current-value').innerText()!=='0,01') throw new Error('La navegación sin conexión falló');
    await page.locator('[data-view="valoracion"]').click();
    if (!(await page.locator('#clinical-cutoff').innerText()).includes('30 de marzo de 2016')) throw new Error('La valoración sin conexión perdió la fecha');
  } finally { await page.context().setOffline(false); }
  return 'Manifiesto, instalación técnica y recarga con navegación sin conexión verificados.';
}
