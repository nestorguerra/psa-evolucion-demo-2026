# Seguimiento del PSA · caso ficticio · v0.1

Demostración docente para recorrer el caso de Juan N. control a control. La aplicación muestra la evolución del PSA tras prostatectomía, una posible señal de recidiva, los criterios de riesgo EAU y opciones de manejo que pueden discutirse a partir del contexto aportado.

**Es una simulación con datos ficticios. No es una herramienta clínica validada ni establece diagnósticos o tratamientos.** La interpretación corresponde a profesionales sanitarios. Las vías implementadas son una selección para este caso; no sustituyen las guías completas.

[Abrir la aplicación](https://nestorguerra.github.io/psa-evolucion-demo-2026/) · [Código QR](assets/QR_PSA_v0.1.png)

## Funcionamiento

- La serie de siete controles reproduce la gráfica de la primera etapa del caso. La línea de 0,20 ng/mL es una referencia visual, no una conclusión clínica automática.
- Al avanzar o retroceder, los cálculos, la gráfica y la tabla usan solo los valores disponibles en la fecha del control seleccionado. La primera señal se conserva como antecedente histórico, no como prueba de actividad actual.
- El ISUP patológico y el dato de PSA indetectable proceden del caso. El texto original llama «indetectable» al PSA del 30 de marzo de 2016, mientras que la gráfica lo rotula como 0,01 ng/mL: se conservan ambas indicaciones.
- La estimación de PSA-DT usa regresión logarítmica sobre valores positivos de los últimos 12 meses, con al menos tres determinaciones separadas por cuatro semanas o más. Es una simplificación docente y requiere revisión. Puede sustituirse por un valor informado por el especialista para el control actual.
- Las opciones aparecen solo con una señal o una segunda recidiva comunicada y los datos clínicos necesarios para el escenario. Una imagen incierta no se trata como M1 y la resistencia hormonal no se deduce del PSA.
- Se pueden introducir valores y contexto ficticios adicionales durante la sesión. No se admiten expresiones como «<0,02» como cifras exactas. Los datos introducidos desaparecen al recargar o cerrar la página.
- Las cifras introducidas están limitadas a 1.000.000 por motivos técnicos de la demostración; no es un límite clínico.
- La aplicación es un único archivo HTML, sin dependencias externas, servidor de datos ni cuentas. El enlace a AEMPS abre la ficha técnica externa solo si se pulsa.

## Ejemplos ficticios para probarla

1. Avanzar por el caso original hasta junio de 2017. La aplicación muestra una señal histórica y explora el riesgo EAU; las opciones de manejo permanecen pendientes mientras falte contexto.
2. En el control del 26 de enero de 2018, abrir «Ajustar datos clínicos ficticios», usar la fecha del control y seleccionar primera recidiva, sin radioterapia previa, M0 convencional, hormonosensible y candidato a rescate. Aparecen vías para discutir, sujetas a confirmación.
3. Para probar otra vía, añadir un control **inventado para la prueba** el 1 de marzo de 2018 con PSA 1,2 ng/mL. Usar la fecha de ese control; seleccionar primera recidiva, sin radioterapia previa, M0 convencional, hormonosensible, no candidato a rescate y PSA-DT informado de 8 meses. La aplicación muestra una coincidencia parcial con criterios de EMBARK, no una elegibilidad. Cambiar la imagen a «M0 / M1 incierto» deja la estadificación pendiente. Este ejemplo adicional no forma parte de la cronología original.

## Fuentes y límites

Se han utilizado EAU 2026 y NCCN Prostate Cancer 4.2026, junto con la ficha técnica española de enzalutamida. La guía completa NCCN vigente está pendiente de contraste: hay una publicación de NCCN Insights posterior, pero no acredita por sí sola la versión completa más reciente. La trazabilidad y las simplificaciones están en [FUENTES_Y_CRITERIOS.md](FUENTES_Y_CRITERIOS.md).

## Pruebas

Con Node.js instalado, ejecutar:

```sh
node tests/psa-core.test.cjs
node tests/clinical-v01.test.cjs
```

Las pruebas cubren la cronología, la señal, el cálculo, los umbrales, los datos ausentes y las vías condicionales. No constituyen validación clínica.
