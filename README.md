# A · Finanzas personales

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

Todos los movimientos, cuentas, saldos de extracto, objetivos, planes y presupuestos de la sesión se mantienen solo en memoria y se borran al recargar. Solo se conserva la preferencia de idioma. Al arrancar se limpia el antiguo espacio de muestras, sin migrarlo a los extractos importados.

El saldo mostrado corresponde al cierre de los extractos importados que cuadran; no es saldo bancario actual. Si falta un saldo verificable, se muestra un guion. Los gastos, ingresos y estadísticas provienen exclusivamente de los movimientos importados. Las categorías se corrigen manualmente y los pagos recurrentes se marcan desde su detalle. Las comparaciones no garantizan que los meses importados estén completos.

No hay tarjetas conectadas ni números de tarjeta precargados. La pantalla Tarjetas muestra el estado de conexión y las cuentas identificadas por el usuario al importar. Los objetivos y presupuestos empiezan vacíos. Las proyecciones multiplican aportaciones definidas por el usuario, sin rentabilidad supuesta ni transferencias.

Exportar datos descarga una copia local; Eliminar datos de sesión borra las importaciones, objetivos, planes y presupuestos actuales. Cambiar ES / RO / EN no traduce comercios ni descripciones importadas.

## Seguridad, PWA e integración bancaria

No hay autenticación de producción, biometría ni conexión bancaria activa. No introducir contraseñas bancarias, PAN completos, CVV o tokens. Los archivos no se envían a ningún servidor. Consultar `server/README.md` para los requisitos de una integración autorizada.

Manifest y service worker de caché del shell, solo en compilación de producción. Requiere HTTPS fuera de localhost. Los movimientos importados no se guardan en caché ni localStorage. Instalar depende del navegador; iPhone usa Añadir a pantalla de inicio.

## Pruebas

`npm test` valida cálculos, idiomas, importes, fechas, deduplicación entre formatos, saldos, documentos sin texto y PDF multipágina con descripciones multilínea y cabeceras repetidas. `tests/fixtures/fictional-bt.pdf` es un archivo de prueba inventado, nunca mostrado en la interfaz. Regenerar: `node tests/generate-pdf.mjs`. Los demás PDF están excluidos de Git.

## iPhone, navegación y marca A

La aplicación conserva las seis secciones, filtros, importador, exportación, objetivos, simulador y presupuestos. La marca visible y los iconos son A. Se añaden áreas seguras del notch/indicador inferior, `viewport-fit=cover`, icono PNG de Apple y controles de al menos 44 × 44 px. Las hojas inferiores bloquean el fondo, atrapan y restauran el foco, se cierran con Escape y ajustan su altura al viewport visual cuando aparece el teclado. Sus encabezados permiten arrastrar para cerrar sin capturar el desplazamiento del contenido.

Las tarjetas representan exclusivamente las cuentas importadas y sus saldos de cierre verificados. No inventan tarjetas bancarias ni números. Admiten gesto horizontal, controles accesibles y transición compartida al detalle. `touch-action: pan-y` preserva el desplazamiento vertical. Gráficos y cifras tienen transiciones breves y se respeta la preferencia de reducir movimiento.

## Planificador inteligente local

Tras importar, **Crear mi plan** abre un recorrido de datos → objetivo → alternativas. El clasificador local aprende de los movimientos que la persona revisa en la sesión: coincidencias normalizadas de comercio y un clasificador por vecinos similares con umbral de abstención. Nunca aplica una sugerencia automáticamente. No contiene entrenamiento ficticio, un modelo generativo, descargas de pesos ni servicios externos.

Se debe confirmar cada clasificación (ingreso habitual, ingreso puntual, gasto fijo, variable, suscripción o transferencia). Se pide el periodo completo y todas las cuentas. Si el extracto es parcial, se solicitan cuatro importes mensuales explícitos y su confirmación. No se extrapolan silenciosamente unos pocos días. Las transferencias internas y los ingresos puntuales no financian la capacidad mensual habitual. Con menos de tres meses se advierte que la estimación es limitada.

El plan divide los importes clasificados por los meses completos confirmados o utiliza el presupuesto mensual indicado. Resta gastos fijos, variables, suscripciones y el colchón elegido. A partir del objetivo, ahorro existente, plazo y aportación deseada, crea hasta tres alternativas distintas sin exceder esa capacidad. La flexible usa 75 % de la aportación deseada, limitada a 50 % de capacidad; la equilibrada la limita a 80 % de capacidad; la rápida intenta 125 % de la aportación deseada o la necesaria para el plazo, sin superar la capacidad. Cada opción muestra aportación, margen, meses, fecha estimada y si necesita ampliar el plazo. Son escenarios sin intereses, no garantías ni asesoramiento profesional. La primera aportación se sitúa el día 1 del siguiente mes; las alternativas de más de 50 años se rechazan y los gráficos muestran hasta los primeros 60 meses.

Se pueden editar objetivo y plan, borrar el plan conservando el objetivo, y corregir o borrar movimientos posteriores a la importación. Cualquier cambio de datos marca el plan guardado como pendiente de revisión. Editar importe o fecha, o borrar un movimiento, invalida la comprobación del saldo de su extracto. Se conservan los demás datos de la sesión. No hay transferencias ni solicitudes de credenciales.

### Pruebas de navegador

Después de `npm run build`, iniciar `npm run preview` y ejecutar en otra terminal:

```sh
npx playwright install chromium
npm run test:browser
```

Si ya existe Chromium, usar `A_BROWSER_PATH=/usr/bin/chromium npm run test:browser`. `A_TEST_URL` permite apuntar al servidor estático local. El recorrido usa exclusivamente el PDF ficticio y datos sintéticos de prueba; verifica estado vacío, importación, errores, clasificación pendiente, planes y sus ediciones, conservación/eliminación selectiva de datos, gestos horizontal/vertical, foco, movimiento reducido, ausencia de envíos y objetivos táctiles en 320/390/430 px. Capturas en `test-results/` (ignorado por Git). `npm test` incluye pruebas unitarias del motor, abstención del clasificador, transferencias, datos insuficientes, presupuestos y fechas imposibles.

Se intentó instalar WebKit para comprobar Safari, pero la política de red bloquea los dominios de descarga de Playwright. La emulación de iPhone usa Chromium; no equivale a una prueba en un iPhone físico o en Safari.

Los presupuestos y ajustes del simulador se conservan por moneda dentro de la sesión; cambiar la moneda de una nueva importación no reinterpreta ni borra los anteriores. Corregir fecha, importe o descripción de un movimiento lo vuelve a marcar para revisar su clasificación. Ninguna actualización de la app recarga automáticamente una sesión con datos en memoria.
