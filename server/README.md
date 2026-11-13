# Integración bancaria pendiente

La aplicación estática funciona exclusivamente con extractos abiertos localmente. No incluye servidor de autenticación, cifrado persistente ni proveedor Open Banking operativo. `src/banking.js` define una interfaz futura, no una conexión activa.

Antes de conectar Banca Transilvania:

- Elegir proveedor autorizado con cobertura y consentimiento de solo lectura.
- Implementar sesiones HttpOnly, Secure y SameSite, expiración, límites y CSRF. WebAuthn requiere desafíos verificados en servidor.
- `GET /api/banking/status`: sesión obligatoria, devolver estado de consentimiento y última sincronización.
- `POST /api/banking/connect`: crear consentimiento y redirigir con state de un solo uso y PKCE según proveedor.
- Callback: validar state, emisor y retorno; intercambiar código solo en servidor.
- `POST /api/banking/sync`: comprobar consentimiento, paginar movimientos con cursor, deduplicar por proveedor/cuenta/ID y guardar timestamp únicamente tras completar la sincronización.
- `DELETE /api/banking/connection`: revocar consentimiento y eliminar tokens.
- Cifrar tokens y datos persistentes con claves externas a la base de datos, rotación, retención y acceso restringido. Nunca registrar tokens, documentos ni movimientos en logs.
- No almacenar datos bancarios en localStorage ni service worker; respuestas `Cache-Control: no-store`.
- Al caducar el consentimiento, pedir reconexión sin reintentos ilimitados. No recoger contraseñas bancarias, PAN completos ni CVV.

Los extractos abiertos en el navegador no constituyen una sincronización bancaria ni acreditan el saldo actual de la cuenta.
