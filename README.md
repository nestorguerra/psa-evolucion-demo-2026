# Seguimiento del PSA · caso ficticio · v0.2

Demostración docente para recorrer el caso de Juan N. control a control. La aplicación muestra la evolución del PSA tras prostatectomía, una posible señal de recidiva, los criterios de riesgo EAU y opciones de manejo que pueden discutirse a partir del contexto aportado.

**Es una simulación con datos ficticios. No es una herramienta clínica validada ni establece diagnósticos o tratamientos.** La interpretación corresponde a profesionales sanitarios. Las vías implementadas son una selección para este caso; no sustituyen las guías completas.

[Abrir la aplicación](https://nestorguerra.github.io/psa-evolucion-demo-2026/) · [Código QR](assets/QR_PSA_v0.2.png)

## Usar en el móvil

Abra el enlace o escanee el QR. En iPhone, en Safari, pulse **Compartir → Añadir a pantalla de inicio**, active «Abrir como app web» si aparece y pulse «Añadir». En Android, use **Instalar aplicación** o **Añadir a pantalla de inicio** en el menú del navegador. La instalación depende del navegador y del dispositivo.

Tras añadirla, ábrala una vez desde el icono con conexión. Si el navegador ha preparado los archivos, la aplicación puede volver a abrirse sin conexión; compruebe el estado en «Fuentes». La ficha externa de AEMPS requiere conexión. Los controles y el contexto introducidos no se conservan al recargar.

## Funcionamiento

- Los catorce controles cuantificados reproducen las gráficas del caso hasta noviembre de 2024. Los resultados descritos como indetectables sin una cifra exacta no se convierten en números. La línea de 0,20 ng/mL es una referencia visual, no una conclusión clínica automática.
- Al avanzar o retroceder, los cálculos, la gráfica y la tabla usan solo los valores disponibles en la fecha del control seleccionado. La primera señal se conserva como antecedente histórico, no como prueba de actividad actual.
- El ISUP patológico y el dato de PSA indetectable proceden del caso. El texto original llama «indetectable» al PSA del 30 de marzo de 2016, mientras que la gráfica lo rotula como 0,01 ng/mL: se conservan ambas indicaciones.
- La gráfica separa los controles anteriores y posteriores al tratamiento de 2018. El primer cambio entre esas fases no se presenta como variación comparable.
- En «Controles → Etapa posterior · revelar» se pueden mostrar expresamente los resultados &lt;0,01 ng/mL comunicados en 2025. No se representan como cifras exactas ni se incluyen en el cálculo.
- La estimación de PSA-DT usa regresión logarítmica sobre al menos tres valores positivos de los últimos 12 meses, separados por cuatro semanas o más. La serie original se puede explorar sin tratamientos añadidos. Para controles de prueba o antecedentes terapéuticos se exige una fase delimitada y confirmada por el especialista, o un PSA-DT informado para el control actual. No se mezclan fases automáticamente.
- Para noviembre de 2024 se muestra que la presentación original comunica un PSA-DT de 8 meses; este dato no se aplica automáticamente al cálculo.
- Las opciones requieren los datos aplicables al escenario. M0 no implica N0; la imagen incierta permanece pendiente y la resistencia hormonal no se deduce del PSA. La persistencia comunicada se distingue de la recidiva.
- Se pueden introducir valores y contexto ficticios adicionales durante la sesión. No se admiten expresiones como «<0,02» como cifras exactas. Los datos introducidos desaparecen al recargar o cerrar la página.
- Las cifras introducidas están limitadas a 1.000.000 por motivos técnicos de la demostración; no es un límite clínico.
- El funcionamiento principal está en un archivo HTML sin dependencias de terceros, servidor de datos ni cuentas. El manifiesto, los iconos y el servicio de caché permiten la instalación y el acceso sin conexión cuando el navegador lo admite.

## Ejemplos ficticios para probarla

1. En «Seguimiento», avanzar hasta junio de 2017. En «Valoración» aparece una señal histórica y se explora el riesgo EAU; las opciones permanecen pendientes mientras falte contexto.
2. Para un escenario **hipotético**, seleccionar el control del 26 de enero de 2018. En «Valoración», completar: primera recidiva, esperanza de vida superior a cinco años, sin radioterapia ni otros tratamientos, M0, N0, imagen convencional, hormonosensible y candidato a rescate. Se muestra una vía para discutir, condicionada a confirmación.
3. Para otra prueba **inventada**, añadir un control del 1 de marzo de 2018 con PSA 1,2 ng/mL y seleccionar «Escenario alternativo ficticio». Completar N0M0 convencional, primera recidiva, más de cinco años, sin radioterapia ni otros tratamientos, hormonosensible, no candidato a rescate y PSA-DT comunicado de 8 meses. Se muestra una coincidencia parcial con datos de EMBARK, no una elegibilidad. Este control y el contexto son supuestos de prueba, no parte de la cronología original.

## Fuentes y límites

Se han utilizado EAU 2026 y NCCN Prostate Cancer 1.2027, junto con la ficha técnica española de enzalutamida. No se ha confirmado si la guía NCCN 1.2027 es la versión completa más reciente. La trazabilidad y las simplificaciones están en [FUENTES_Y_CRITERIOS.md](FUENTES_Y_CRITERIOS.md).

## Pruebas

Con Node.js instalado, ejecutar:

```sh
node tests/psa-core.test.cjs
node tests/clinical-v01.test.cjs
```

Las pruebas cubren la cronología, la señal, las fases, el cálculo, los umbrales, la estadificación y las vías condicionales. Los recorridos de navegador se encuentran en `tests/browser-*.js`. Ninguna de estas pruebas constituye validación clínica.
