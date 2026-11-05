# Fuentes y criterios · PSA v0.2

Documento de trazabilidad de una demostración educativa con datos ficticios. Los resúmenes son una interpretación acotada; no sustituyen los documentos originales ni una revisión clínica.

## Documentos consultados

1. **EAU-EANM-ESTRO-ESUR-ISUP-SIOG Guidelines on Prostate Cancer 2026**, sección 6.4 y tabla 6.4.1, páginas 101–102. Archivo revisado: `EAU-EANM-ESTRO-ESUR-ISUP-SIOG-Guidelines-on-Prostate-Cancer-2026.pdf`. SHA-256: `157632be572dea05d25aff9901c449cf69ac8f896ddd71742533cb41f1207603`.
2. **NCCN Guidelines Prostate Cancer, versión 1.2027**, 12 de octubre de 2026, PROS-9, PROS-9A y PROS-11 a PROS-15A. SHA-256 del documento revisado: `d13045eca54090ced44ccacc4c95a004667d8094c7d912db0fde00b14d06989a`. No se ha confirmado si es la versión completa más reciente.
3. **AEMPS, ficha técnica de Xtandi (enzalutamida)**, consulta de la indicación europea y del ensayo EMBARK: [ficha técnica en CIMA](https://cima.aemps.es/cima/dochtml/ft/113846002/FT_113846002.html), consultada el 5 de noviembre de 2026.

Los PDF originales no se incluyen en el repositorio de la aplicación.

Los catorce valores cuantificados del caso ficticio proceden de las gráficas de la presentación de Miguel, diapositivas 10, 15 y 16. Los controles de 2025 expresados como &lt;0,01 ng/mL se comunican aparte, tras una acción explícita de revelar, y no se usan como valores exactos. Los resultados descritos como indetectables sin cifra exacta se señalan en el contexto y no se usan como valores numéricos. La gráfica se interrumpe entre la serie anterior y posterior al inicio del tratamiento de 2018.

## Traducción al demostrador

- **Señal tras cirugía:** partiendo de un PSA indetectable comunicado, se señala para revisión un ascenso por encima de 0,1 ng/mL o dos aumentos consecutivos. Se conserva la fecha de la primera señal en el historial. En el caso original, la presentación comunica la recidiva el 09/10/2017; esta fecha se muestra solo a partir de ese control. La persistencia se presenta por separado y debe estar comunicada en la ventana de 6 a 12 semanas. Esto no confirma un diagnóstico.
- **Riesgo EAU tras prostatectomía:** solo se explora ante una señal que puede requerir valoración o una segunda recidiva comunicada. El grupo alto se muestra de forma condicional si el ISUP patológico es 4–5 o el PSA-DT es ≤12 meses. El bajo exige ISUP <4 y PSA-DT >12 meses. Faltando datos, puede quedar indeterminado. En una segunda recidiva se señala la necesidad de revisión especializada.
- **PSA-DT:** regresión lineal del logaritmo natural de PSA frente al tiempo; PSA-DT = ln(2)/pendiente. Se necesitan al menos tres valores positivos de los últimos 12 meses y un intervalo mínimo de 28 días. EAU considera preferible el intervalo de cuatro semanas, no un requisito absoluto. Las decisiones usan el valor sin redondear. Ante valores añadidos o tratamientos, se exige que el especialista delimite y confirme la fase; el inicio debe ser posterior al último cambio comunicado. También puede aportarse un PSA-DT validado. Esto no garantiza la corrección clínica de la selección.
- **Estadificación y opciones:** la aplicación distingue M0/M1, N0/cN1, modalidad de imagen y resultados dudosos; no deduce un estadio de otro. Para M1 o cN1M0 requiere además la extensión y su momento. Las vías son un subconjunto docente y no cubren la enfermedad resistente. La primera recidiva o persistencia usa la esperanza de vida comunicada para explorar PROS-9; la segunda N0M0 sigue PROS-12; la oligometástasis metacrónica explora PROS-13.
- **NCCN, EMBARK y AEMPS:** el grupo de riesgo EAU no es equivalente a las condiciones NCCN ni a la indicación europea. La coincidencia parcial con datos de EMBARK no confirma elegibilidad. Para mostrar la opción de PROS-12 se comprueba por separado si el especialista considera posible un tratamiento dirigido a la pelvis; esto no se infiere de la radioterapia de rescate. La ficha española contempla enzalutamida con o sin deprivación androgénica para la indicación aplicable y prioriza la combinación salvo el supuesto que especifica. La mención del ensayo en primera recidiva no se presenta como una vía específica de enzalutamida en PROS-9.

Las guías NCCN corresponden al contexto estadounidense; las opciones mencionadas en ellas no demuestran por sí solas una indicación autorizada en Europa. La aplicación no incorpora dosis ni calcula todas las vías, tratamientos previos, contraindicaciones o criterios de elegibilidad.
