# Seguimiento del PSA · caso ficticio

Demostración docente para recorrer el caso de Juan N. control a control. La aplicación muestra la evolución del PSA posterior a la prostatectomía y señala una subida numérica con respecto al control previo.

El paciente y las cifras son ficticios. La alerta sirve para revisar un cambio numérico; no establece un diagnóstico ni propone un tratamiento. Su interpretación y los criterios clínicos requieren revisión especializada.

## Funcionamiento

- La serie de siete controles reproduce la gráfica de la primera etapa del caso.
- Al avanzar o retroceder, el cálculo, la gráfica y la tabla usan únicamente los valores con fecha igual o anterior al control seleccionado.
- La línea de 0,20 ng/mL reproduce una referencia visual del caso; no es una conclusión clínica automática.
- Es posible introducir valores ficticios adicionales durante la sesión. No se admiten expresiones como «<0,02» como cifras exactas.
- La aplicación es un único archivo HTML, sin dependencias externas, servidor de datos ni cuentas. Los valores de prueba desaparecen al recargar o cerrar la página.

## Pruebas

Con Node.js instalado, ejecutar:

```sh
node tests/psa-core.test.cjs
```

Las pruebas comprueban los datos, los cortes temporales, las variaciones y la validación de entradas. No constituyen validación clínica.
