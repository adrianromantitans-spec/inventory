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
