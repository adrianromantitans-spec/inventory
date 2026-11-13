# Aura · Finanzas personales

Aplicación React + Vite, JavaScript, Tailwind CSS, Motion, Lucide y Recharts. Idiomas español, rumano e inglés. Arranca vacía: no incluye transacciones, tarjetas, saldos ni objetivos precargados.

## Desarrollo

Node 24 (PDF.js requiere Node 22.13 o posterior). Desde `/workspace/inventory`:

```sh
npm ci --cache /tmp/aura-npm-cache
npm run dev
npm test
npm run build
```

El HTML editable es `application.html`. Vite lo sirve durante desarrollo y genera `dist/index.html`. Para Pages con `main / (root)`, ejecutar `npm run publish:static` y subir los archivos generados junto al código. No editar bundles manualmente. El workflow de GitHub Actions también está disponible.

## Extractos locales: PDF, CSV y MT940

Abre **Importar extracto** en la cabecera o Ajustes. Archivos de hasta 20 MB y PDF hasta 100 páginas. PDF.js y su worker se sirven desde la aplicación, sin CDN ni servicios de extracción. No hay subidas ni OCR remoto. Los documentos escaneados sin texto seleccionable se rechazan claramente; OCR local no está habilitado.

PDF.js usa coordenadas para detectar cabeceras en rumano/inglés, columnas de fecha, descripción, débito/crédito o importe, y saldo. Une descripciones multilínea y descarta cabeceras repetidas, pies y totales conocidos. No todos los diseños son compatibles: revisa siempre los resultados.

Todos los formatos pasan por vista previa editable y confirmación de revisión. Permite corregir fecha, importe y descripción o borrar filas. Compara saldo inicial + movimientos con saldo final cuando ambos están disponibles; requiere aceptación explícita de las diferencias. Si faltan saldos, no se puede verificar la integridad. Fechas numéricas día/mes/año e ISO; importes europeos e ingleses.

La deduplicación usa el mismo SHA-256 para los tres formatos: cuenta, moneda, fecha ISO, céntimos y descripción con mayúsculas, espacios únicos y sin acentos. Usa idéntico identificador de cuenta y moneda para PDF y CSV. Dos movimientos distintos pero idénticos en esos campos también se consideran duplicados: revisa el recuento. No hay deduplicación entre sesiones.

## Datos y cálculos

Todos los movimientos, cuentas, saldos de extracto, objetivos y presupuestos de la sesión se mantienen solo en memoria y se borran al recargar. Solo se conserva la preferencia de idioma. Al arrancar se limpia el antiguo espacio de muestras, sin migrarlo a los extractos importados.

El saldo mostrado corresponde al cierre de los extractos importados que cuadran; no es saldo bancario actual. Si falta un saldo verificable, se muestra un guion. Los gastos, ingresos y estadísticas provienen exclusivamente de los movimientos importados. Las categorías se corrigen manualmente y los pagos recurrentes se marcan desde su detalle. Las comparaciones no garantizan que los meses importados estén completos.

No hay tarjetas conectadas ni números de tarjeta precargados. La pantalla Tarjetas muestra el estado de conexión y las cuentas identificadas por el usuario al importar. Los objetivos y presupuestos empiezan vacíos. Las proyecciones multiplican aportaciones definidas por el usuario, sin rentabilidad supuesta ni transferencias.

Exportar datos descarga una copia local; Eliminar datos de sesión borra las importaciones, objetivos y presupuestos actuales. Cambiar ES / RO / EN no traduce comercios ni descripciones importadas.

## Seguridad, PWA e integración bancaria

No hay autenticación de producción, biometría ni conexión bancaria activa. No introducir contraseñas bancarias, PAN completos, CVV o tokens. Los archivos no se envían a ningún servidor. Consultar `server/README.md` para los requisitos de una integración autorizada.

Manifest y service worker de caché del shell, solo en compilación de producción. Requiere HTTPS fuera de localhost. Los movimientos importados no se guardan en caché ni localStorage. Instalar depende del navegador; iPhone usa Añadir a pantalla de inicio.

## Pruebas

`npm test` valida cálculos, idiomas, importes, fechas, deduplicación entre formatos, saldos, documentos sin texto y PDF multipágina con descripciones multilínea y cabeceras repetidas. `tests/fixtures/fictional-bt.pdf` es un archivo de prueba inventado, nunca mostrado en la interfaz. Regenerar: `node tests/generate-pdf.mjs`. Los demás PDF están excluidos de Git.
