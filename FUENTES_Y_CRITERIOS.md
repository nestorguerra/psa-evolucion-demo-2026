# Fuentes y criterios · PSA v0.1

Documento de trazabilidad de una demostración educativa con datos ficticios. Los resúmenes son una interpretación acotada; no sustituyen los documentos originales ni una revisión clínica.

## Documentos consultados

1. **EAU-EANM-ESTRO-ESUR-ISUP-SIOG Guidelines on Prostate Cancer 2026**, sección 6.4 y tabla 6.4.1, páginas 101–102. Archivo revisado: `EAU-EANM-ESTRO-ESUR-ISUP-SIOG-Guidelines-on-Prostate-Cancer-2026.pdf`. SHA-256: `157632be572dea05d25aff9901c449cf69ac8f896ddd71742533cb41f1207603`.
2. **NCCN Guidelines Prostate Cancer, versión 4.2026**, PROS-9 y PROS-9A, para persistencia y primera recidiva tras cirugía; PROS-11 y PROS-12, para vías posteriores. Archivo revisado: `NCCN Guidelines Prostate Cancer Version 4.2026.pdf`. SHA-256: `51b868a78f50a7b1ebd807d1c843b3baabb7e61165d26290fa7f98d5cbc89d3f`. Existe un artículo NCCN Insights de la versión 5.2026; la versión completa vigente de la guía no se ha confirmado.
3. **AEMPS, ficha técnica de Xtandi (enzalutamida)**, consulta de la indicación europea y del ensayo EMBARK: [ficha técnica en CIMA](https://cima.aemps.es/cima/dochtml/ft/113846002/FT_113846002.html), consultada el 5 de noviembre de 2026.

Los PDF originales no se incluyen en el repositorio de la aplicación.

## Traducción al demostrador

- **Señal tras cirugía:** partiendo de un PSA indetectable comunicado, se señala para revisión un ascenso por encima de 0,1 ng/mL o dos aumentos consecutivos. Se conserva la fecha de la primera señal en el historial. Una señal anterior no determina por sí sola la situación presente. La persistencia se presenta por separado. Esto no confirma un diagnóstico.
- **Riesgo EAU tras prostatectomía:** solo se explora ante una señal que puede requerir valoración o una segunda recidiva comunicada. El grupo alto se muestra de forma condicional si el ISUP patológico es 4–5 o el PSA-DT es ≤12 meses. El bajo exige ISUP <4 y PSA-DT >12 meses. Faltando datos, puede quedar indeterminado. En una segunda recidiva se señala la necesidad de revisión especializada.
- **PSA-DT:** regresión lineal del logaritmo natural de PSA frente al tiempo; PSA-DT = ln(2)/pendiente. La aplicación exige al menos tres valores positivos dentro de los 12 meses previos y un intervalo mínimo de 28 días. EAU considera preferible el intervalo de cuatro semanas, no un requisito absoluto: aquí se adopta de forma conservadora. Los métodos pueden producir resultados distintos. Los cálculos usan el valor sin redondear; cerca de 9 y 12 meses se muestran decimales adicionales para no ocultar el lado del umbral. No se mezclan automáticamente mediciones de fases con radioterapia previa; puede aportarse un PSA-DT validado para el control en curso.
- **Opciones:** son un subconjunto docente inspirado en NCCN para el escenario posterior a cirugía. Se requieren datos expresos de momento, imagen y sensibilidad hormonal, entre otros. Una segunda recidiva precisa fecha aportada; la imagen incierta se deja pendiente y la vía resistente requiere otro análisis.
- **EMBARK y autorización europea:** la aplicación identifica solamente algunos datos de dicho estudio para el escenario posterior a prostatectomía: PSA ≥1 ng/mL, PSA-DT ≤9 meses, M0 con imagen convencional y no candidato a radioterapia de rescate. Coincidir con ellos no confirma la elegibilidad ni sustituye la ficha técnica. Son criterios del ensayo y no se presentan como requisitos exhaustivos de la autorización europea. La ficha contempla enzalutamida con o sin deprivación androgénica en la indicación aplicable y prioriza la combinación salvo el supuesto que especifica.

Las guías NCCN corresponden al contexto estadounidense; las opciones mencionadas en ellas no demuestran por sí solas una indicación autorizada en Europa. La aplicación no incorpora dosis ni calcula todas las vías, tratamientos previos, contraindicaciones o criterios de elegibilidad.
