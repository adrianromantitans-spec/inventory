# Aura · Finanzas personales

Aplicación React + Vite, JavaScript, Tailwind CSS, Motion, Lucide y Recharts. Interfaz en español con datos explícitamente ficticios. No conecta con bancos ni mueve dinero.

## Desarrollo

Requiere Node 22.12+ (verificado con Node 24). Desde `/workspace/inventory`:

```sh
npm ci --cache /tmp/aura-npm-cache
npm run dev
npm test
npm run build
```

Inicio, tarjetas con transición compartida y arrastre, movimientos con búsqueda y filtros, corrección de categorías, estadísticas calculadas, objetivos editables, presupuestos y simulador. Los ajustes demo se conservan en localStorage y pueden exportarse o restablecerse. Los importes son EUR. El selector de mes permite explorar los dos meses de ejemplo, generados al primer uso.

Los saldos de tarjeta son ejemplos independientes y no un libro contable. Las proyecciones son aritmética ilustrativa sin rentabilidad. El bloqueo demo es una cortina visual, no autenticación. Los gastos demo incluyen todo el mes seleccionado y no representan movimientos bancarios en tiempo real.

## PWA

Manifest, icono SVG y service worker de caché del shell en compilación de producción. Requiere HTTPS fuera de localhost. La primera visita debe tener conexión; probar tras `npm run build` y `npm run preview`. La instalación depende del navegador; iOS usa Añadir a pantalla de inicio. No se almacena ninguna ruta `/api` en caché.

## Integración real

Consultar `server/README.md` y `src/banking.js`. La integración, autenticación, biometría y cifrado de datos reales están pendientes de proveedor e infraestructura. La aplicación solo está habilitada para demostración. No introducir información financiera privada.

## Publicación con Pages desde main

La raíz contiene `index.html`, `assets/`, manifest, icono y service worker compilados para que Pages pueda servir `main / (root)` directamente. `.nojekyll` conserva los archivos sin procesamiento. El HTML editable es `application.html`; Vite lo sirve durante desarrollo y genera `dist/index.html` durante compilación.

Tras cambios de código, ejecutar `npm run publish:static`, revisar y subir los archivos generados junto al código fuente. No editar manualmente los bundles. También se conserva el workflow de GitHub Actions para quien configure Pages con esa modalidad.

## Extractos locales: PDF, CSV y MT940

En **Movimientos → Importar extracto** o en **Ajustes** se pueden abrir archivos locales (máximo 20 MB; PDF hasta 100 páginas). PDF.js y su worker se sirven desde la propia aplicación, sin CDN ni servicios de extracción. No hay subidas, OCR remoto ni sincronización bancaria. Los documentos escaneados sin texto seleccionable se rechazan con un aviso; OCR local no está habilitado.

El parser PDF usa coordenadas de texto para identificar cabeceras en rumano o inglés, columnas de fecha/descripción/débito/crédito/importe/saldo, cabeceras repetidas y descripciones que ocupan varias líneas. Descarta pies y totales conocidos. No todos los diseños de extracto son compatibles: las filas incompletas requieren corrección y nunca debe asumirse que una detección es perfecta.

**Todos los formatos pasan por una vista previa editable.** Permite corregir fecha, descripción e importe, borrar filas y revisar saldos inicial/final. Se exige confirmar la revisión. Si los saldos no cuadran, se muestra la diferencia y se necesita una confirmación adicional explícita; si faltan saldos, se informa de que no puede comprobarse la integridad. Fechas ambiguas se interpretan día/mes/año, nunca mes/día/año. Se aceptan importes europeos e ingleses.

Los tres formatos comparten SHA-256 de cuenta, moneda, fecha ISO, importe en céntimos y descripción normalizada a mayúsculas, espacios únicos y sin acentos. Usa el mismo identificador de cuenta y moneda para PDF y CSV del mismo extracto. Los duplicados se omiten en la sesión actual, incluso entre formatos. Dos cargos realmente distintos pero idénticos en esos campos también se consideran duplicados; revisa el recuento. No hay deduplicación entre sesiones porque no se conserva ningún dato importado.

Los movimientos importados se mantienen **solo en memoria**, separados de `aura-demo-*`. Recargar cierra la sesión local y los elimina. El selector de moneda se bloquea mientras hay movimientos importados para evitar sumar monedas distintas. Vaciar importaciones permite comenzar con otra moneda. Las tarjetas y los objetivos predefinidos siguen siendo ejemplos de demostración, no saldos recuperados del extracto. No se implementa autenticación de producción ni almacenamiento de extractos en esta aplicación estática.

**Idiomas:** selector ES / RO / EN en la cabecera, conservado localmente sin datos financieros. Los identificadores de categorías y filtros se mantienen estables al cambiar idioma. Los nombres de comercios y descripciones del archivo no se traducen.

### Pruebas sin datos bancarios reales

`npm test` incluye extracción de un PDF ficticio multipágina, descripción multilínea, débitos/créditos, cabeceras repetidas, formatos de importes, saldos, rechazo de documentos sin texto, deduplicación PDF/CSV y traducciones. Regenerar la muestra: `node tests/generate-pdf.mjs`. El PDF de `tests/fixtures/fictional-bt.pdf` contiene únicamente datos inventados y se identifica como tal. Los demás PDF están excluidos por `.gitignore`.
