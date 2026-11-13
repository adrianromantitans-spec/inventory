# Contrato de integración bancaria (pendiente de implementación)

El cliente actual solo usa datos demo. `src/banking.js` define una interfaz futura, no una integración activa. No activar datos reales en este frontend sin completar estos requisitos.

- Autenticación de usuario en servidor; sesiones HttpOnly, Secure, SameSite, protección CSRF, límites de solicitudes y expiración. WebAuthn opcional con desafíos y verificación en servidor.
- Proveedor Open Banking autorizado que confirme cobertura de Banca Transilvania y permisos de solo lectura. No recoger credenciales bancarias ni PAN/CVV.
- `GET /api/banking/status`: sesión obligatoria, devolver estado de consentimiento (no configurado, activo, caducado, revocado) y fecha de última sincronización.
- `POST /api/banking/connect`: sesión + CSRF, crear consentimiento y redirigir al proveedor con state de un solo uso y PKCE cuando corresponda.
- Retorno OAuth: validar state, emisor y redirección; intercambiar código exclusivamente en servidor.
- `POST /api/banking/sync`: sesión + CSRF, comprobar consentimiento y límites del proveedor, importar páginas de movimientos con cursor, actualizar saldos y guardar timestamp solo al completar la sincronización. Clave única proveedor/cuenta/ID de movimiento; manejar transacciones pendientes y contabilizadas según contrato del proveedor.
- `DELETE /api/banking/connection`: revocar consentimiento y eliminar tokens.
- Tokens, cuentas y movimientos cifrados con claves gestionadas fuera de la base de datos, rotación, control de acceso y retención. Nunca incluirlos en logs.
- Datos reales nunca en localStorage ni en caché de service worker; respuestas Cache-Control: no-store. Separar completamente tablas y rutas demo/real.
- Al abrir una sesión autenticada, comprobar estado y sincronizar solo con consentimiento vigente. Si caduca, pedir reconexión sin reintentos automáticos ilimitados.
- Credenciales y secretos exclusivamente en entorno seguro del servidor. Elegir proveedor, infraestructura y almacenamiento antes de implementar.

No se incluye backend operativo, cifrado de datos reales ni autenticación real en esta entrega demo.
