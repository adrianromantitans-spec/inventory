import {useSyncExternalStore} from 'react';
const listeners=new Set();let language='es';try{const saved=localStorage.getItem('aura-language');if(['es','ro','en'].includes(saved))language=saved}catch{}
export const locale=()=>({es:'es-ES',ro:'ro-RO',en:'en-GB'})[language];
export function setLanguage(value){if(!['es','ro','en'].includes(value))return;language=value;try{localStorage.setItem('aura-language',value)}catch{}document.documentElement.lang=value;listeners.forEach(fn=>fn())}
export function useLanguage(){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn)},()=>language)}
const entries=`
Inicio|Home|Acasă
Tarjetas|Cards|Carduri
Movimientos|Transactions|Tranzacții
Estadísticas|Analytics|Statistici
Ahorros|Savings|Economii
Ajustes|Settings|Setări
Idioma|Language|Limbă
Español|Spanish|Spaniolă
Inglés|English|Engleză
Rumano|Romanian|Română
TU ESPACIO PERSONAL|YOUR PERSONAL SPACE|SPAȚIUL TĂU PERSONAL
Mi espacio|My space|Spațiul meu
Espacio personal|Personal space|Spațiu personal
TU DINERO, EN EQUILIBRIO|YOUR MONEY, IN BALANCE|BANII TĂI, ÎN ECHILIBRU
Un buen día para avanzar.|A good day to move forward.|O zi bună pentru a merge înainte.
Todo lo que necesitas para cuidar de tu futuro.|Everything you need to care for your future.|Tot ce ai nevoie pentru viitorul tău.
Tu día a día, en una sola cartera.|Your everyday life, in one wallet.|Viața de zi cu zi, într-un singur portofel.
Cada movimiento cuenta.|Every transaction counts.|Fiecare tranzacție contează.
Entiende tus hábitos. Decide con claridad.|Understand your habits. Decide with clarity.|Înțelege-ți obiceiurile. Decide cu claritate.
Haz espacio para lo que de verdad importa.|Make room for what really matters.|Fă loc pentru ceea ce contează cu adevărat.
Tu espacio, a tu manera.|Your space, your way.|Spațiul tău, în felul tău.
Tu tranquilidad, primero|Your peace of mind comes first|Liniștea ta, pe primul loc
Modo demo · sin datos bancarios|Demo mode · no bank data|Mod demo · fără date bancare
DEMOSTRACIÓN|DEMO|DEMONSTRAȚIE
Balance total|Total balance|Sold total
Ocultar saldo|Hide balance|Ascunde soldul
flujo neto del mes|net cash flow this month|flux net lunar
Ingresos|Income|Venituri
Gastos|Expenses|Cheltuieli
Datos ficticios|Fictional data|Date fictive
Actualizando demo…|Refreshing demo…|Se actualizează demonstrația…
Actualizado|Updated|Actualizat
Tu cartera|Your wallet|Portofelul tău
Ver tarjetas|View cards|Vezi cardurile
Desliza para explorar|Swipe to explore|Glisează pentru a explora
PASO A PASO|STEP BY STEP|PAS CU PAS
Tu futuro empieza|Your future starts|Viitorul tău începe
con un pequeño hábito.|with a small habit.|cu un mic obicei.
Este mes, reserva un poco|This month, set a little aside|Luna aceasta, pune puțin deoparte
para lo que viene.|for what comes next.|pentru ce urmează.
/ mes|/ month|/ lună
Mi plan de ahorro|My savings plan|Planul meu de economii
Así va tu mes|Your month so far|Luna ta până acum
Un vistazo a tus gastos acumulados|A look at your cumulative spending|O privire asupra cheltuielilor cumulate
vs. mes anterior|vs. previous month|față de luna precedentă
¿A dónde va tu dinero?|Where does your money go?|Unde se duc banii tăi?
Gasto total|Total spending|Total cheltuieli
Ver estadísticas|View analytics|Vezi statisticile
Últimos movimientos|Recent transactions|Tranzacții recente
Ver todos|View all|Vezi toate
Pequeños pasos, grandes metas|Small steps, big goals|Pași mici, obiective mari
Crear objetivo|Create goal|Creează un obiectiv
Cuenta principal|Main account|Cont principal
Cuenta viajes|Travel account|Cont de călătorii
Cuenta del día a día|Everyday account|Cont de zi cu zi
Tu próxima aventura|Your next adventure|Următoarea ta aventură
Cartera de demostración. Estas tarjetas no están conectadas a una cuenta bancaria.|Demo wallet. These cards are not connected to a bank account.|Portofel demonstrativ. Aceste carduri nu sunt conectate la un cont bancar.
Saldo de la cuenta|Account balance|Soldul contului
Conecta con tu tranquilidad|Connect with peace of mind|Conectează-te în siguranță
La conexión de solo lectura con Banca Transilvania requiere un proveedor Open Banking autorizado.|Read-only Banca Transilvania access requires an authorised Open Banking provider.|Accesul doar pentru citire la Banca Transilvania necesită un furnizor Open Banking autorizat.
Ver estado de conexión|View connection status|Vezi starea conexiunii
Buscar comercio|Search merchant|Caută comerciant
Buscar un movimiento…|Search transactions…|Caută o tranzacție…
Categoría|Category|Categorie
Tipo|Type|Tip
Cuenta|Account|Cont
Todas|All|Toate
Todos|All|Toate
Desde|From|De la
Hasta|To|Până la
Importe mínimo|Minimum amount|Sumă minimă
Importe máximo|Maximum amount|Sumă maximă
Mínimo €|Minimum €|Minim €
Máximo €|Maximum €|Maxim €
Principal|Main|Principal
Supermercado|Groceries|Alimente
Restaurantes|Restaurants|Restaurante
Compras|Shopping|Cumpărături
Transporte|Transport|Transport
Facturas|Bills|Facturi
Entretenimiento|Entertainment|Divertisment
Suscripciones|Subscriptions|Abonamente
Salud|Health|Sănătate
Viajes|Travel|Călătorii
Transferencias|Transfers|Transferuri
Otros|Other|Altele
Pago con tarjeta|Card payment|Plată cu cardul
Extracto local|Local statement|Extras local
No hay movimientos que coincidan con los filtros.|No transactions match your filters.|Nicio tranzacție nu corespunde filtrelor.
movimientos · Resultado neto:|transactions · Net result:|tranzacții · Rezultat net:
Flujo neto|Net cash flow|Flux net
Media diaria|Daily average|Media zilnică
Evolución de gastos|Spending trend|Evoluția cheltuielilor
Gasto acumulado|Cumulative spending|Cheltuieli cumulate
Gasto acumulado por día del mes seleccionado.|Cumulative spending by day of the selected month.|Cheltuieli cumulate pe zile în luna selectată.
Comparación mensual|Monthly comparison|Comparație lunară
Anterior|Previous|Precedent
Seleccionado|Selected|Selectat
Gastos por categoría|Spending by category|Cheltuieli pe categorii
Lo que dicen tus números|What your numbers say|Ce spun cifrele tale
Sin comparación disponible|No comparison available|Comparație indisponibilă
No hay movimientos en el mes anterior.|No transactions in the previous month.|Nu există tranzacții în luna precedentă.
menos|less|mai puțin
más|more|mai mult
suscripciones,|subscriptions,|abonamente,
Suma de los cargos clasificados como suscripciones. Revisa los movimientos para confirmar su recurrencia.|Sum of charges categorised as subscriptions. Review transactions to confirm recurrence.|Suma plăților din categoria abonamente. Verifică tranzacțiile pentru a confirma recurența.
Mayores gastos|Largest expenses|Cele mai mari cheltuieli
Gasto por semana|Weekly spending|Cheltuieli săptămânale
Pagos recurrentes identificados|Identified recurring payments|Plăți recurente identificate
Cargos marcados como recurrentes en la muestra demo.|Charges marked as recurring in the demo sample.|Plăți marcate ca recurente în exemplul demo.
Gasto por comercio|Spending by merchant|Cheltuieli pe comercianți
DISEÑA TU FUTURO|DESIGN YOUR FUTURE|CONSTRUIEȘTE-ȚI VIITORUL
Un hábito que crece contigo.|A habit that grows with you.|Un obicei care crește cu tine.
Elige una aportación mensual. No se realiza ningún movimiento de dinero.|Choose a monthly contribution. No money is transferred.|Alege o contribuție lunară. Nu se transferă bani.
Ahorro mensual|Monthly savings|Economii lunare
Conservadora|Conservative|Conservatoare
Equilibrada|Balanced|Echilibrată
Ambiciosa|Ambitious|Ambițioasă
% de ingresos|% of income|% din venituri
Aportación personalizada|Custom contribution|Contribuție personalizată
Porcentajes ilustrativos, sin rentabilidad ni asesoramiento financiero.|Illustrative percentages, without returns or financial advice.|Procente ilustrative, fără randamente sau consultanță financiară.
Imagina lo que puedes conseguir|Imagine what you can achieve|Imaginează-ți ce poți realiza
Si reduces tus gastos cada mes…|If you reduce spending each month…|Dacă reduci cheltuielile în fiecare lună…
Reducción mensual adicional|Additional monthly reduction|Reducere lunară suplimentară
Reducción mensual|Monthly reduction|Reducere lunară
En|In|În
meses|months|luni
de|of|din
Cálculo: (|Calculation: (|Calcul: (
) × meses. Proyección hipotética sin intereses.|) × months. Hypothetical projection without interest.|) × luni. Proiecție ipotetică fără dobândă.
Tus próximas grandes cosas|Your next big things|Următoarele tale planuri mari
Nuevo objetivo|New goal|Obiectiv nou
Presupuesto mensual|Monthly budget|Buget lunar
disponibles|available|disponibili
Límite total (€)|Total limit (€)|Limită totală (€)
del presupuesto|of budget|din buget
Sin límite|No limit|Fără limită
gastados|spent|cheltuiți
Estimación de cierre|Closing estimate|Estimare la închidere
Conexiones bancarias|Bank connections|Conexiuni bancare
Sin conexión · Solo demostración|Disconnected · Demo only|Neconectat · Doar demonstrație
La integración real está deshabilitada. Es necesario configurar un proveedor autorizado en el servidor, autenticación y consentimiento de solo lectura.|Live integration is disabled. An authorised server-side provider, authentication and read-only consent are required.|Integrarea reală este dezactivată. Sunt necesare un furnizor autorizat pe server, autentificare și consimțământ doar pentru citire.
Cómo conectar mi banco|How to connect my bank|Cum îmi conectez banca
No solicitamos contraseñas bancarias, números completos de tarjeta ni CVV.|We never request bank passwords, full card numbers or CVVs.|Nu solicităm parole bancare, numere complete de card sau CVV.
Privacidad y seguridad|Privacy and security|Confidențialitate și securitate
Datos utilizados|Data used|Date utilizate
Ficticios|Fictional|Fictive
Almacenamiento|Storage|Stocare
Local · solo demo|Local · demo only|Local · doar demo
El modo demo no incluye autenticación real ni almacena datos bancarios. Para producción se requiere una sesión segura y cifrado en el servidor. La biometría requiere WebAuthn, HTTPS y verificación del servidor.|Demo mode has no real authentication or stored bank data. Production requires secure sessions and server-side encryption. Biometrics require WebAuthn, HTTPS and server verification.|Modul demo nu include autentificare reală sau date bancare stocate. Producția necesită sesiuni sigure și criptare pe server. Biometria necesită WebAuthn, HTTPS și verificare pe server.
Bloquear vista demo|Lock demo view|Blochează vizualizarea demo
Tus datos de demostración|Your demo data|Datele tale demonstrative
Exporta los movimientos ficticios o restaura la experiencia inicial.|Export fictional transactions or restore the initial experience.|Exportă tranzacțiile fictive sau restabilește experiența inițială.
Exportar demo|Export demo|Exportă demonstrația
Restablecer datos demo|Reset demo data|Resetează datele demo
Siempre a mano|Always at hand|Mereu la îndemână
Instala Aura desde el menú del navegador. En iPhone: Compartir → Añadir a pantalla de inicio. En Android: menú → Instalar aplicación.|Install Aura from your browser menu. On iPhone: Share → Add to Home Screen. On Android: menu → Install app.|Instalează Aura din meniul browserului. Pe iPhone: Partajare → Adaugă pe ecranul principal. Pe Android: meniu → Instalează aplicația.
EUR · ESPAÑOL · MODO OSCURO|EUR · ENGLISH · DARK MODE|EUR · ROMÂNĂ · MOD ÎNTUNECAT
Un poco más cerca de lo que importa.|A little closer to what matters.|Puțin mai aproape de ceea ce contează.
Espacio de demostración|Demo space|Spațiu demonstrativ
Volver a mi cartera|Back to my wallet|Înapoi la portofel
Saldo de cuenta · demostración|Account balance · demo|Soldul contului · demo
Cerrar|Close|Închide
Tu objetivo|Your goal|Obiectivul tău
Algo que te ilusiona|Something to look forward to|Ceva care te inspiră
Nombre|Name|Nume
Mi próximo viaje|My next trip|Următoarea mea călătorie
Importe objetivo (€)|Target amount (€)|Sumă țintă (€)
Ahorro actual (€)|Current savings (€)|Economii actuale (€)
Fecha objetivo|Target date|Data țintă
Guardar objetivo|Save goal|Salvează obiectivul
Eliminar objetivo|Delete goal|Șterge obiectivul
DETALLE DEL MOVIMIENTO DEMO|DEMO TRANSACTION DETAILS|DETALIILE TRANZACȚIEI DEMO
Corregir categoría|Correct category|Corectează categoria
La clasificación se guarda solo en este navegador y actualiza las estadísticas.|Categories are saved only in this browser and update analytics.|Categoriile se salvează doar în acest browser și actualizează statisticile.
Elige tu mes|Choose your month|Alege luna
Periodo|Period|Perioadă
Aplicar periodo|Apply period|Aplică perioada
Una conexión segura, a su tiempo.|A secure connection, in due time.|O conexiune sigură, la momentul potrivit.
No hay proveedor Open Banking configurado. No se puede iniciar una autorización ni sincronizar cuentas reales.|No Open Banking provider is configured. Authorisation and real account sync are unavailable.|Nu este configurat niciun furnizor Open Banking. Autorizarea și sincronizarea conturilor reale nu sunt disponibile.
El backend deberá verificar tu sesión, crear el consentimiento con el proveedor, validar el retorno y custodiar los tokens cifrados. Podrás revocar el acceso en cualquier momento.|The backend must verify your session, create provider consent, validate the callback and protect encrypted tokens. You will be able to revoke access at any time.|Serverul trebuie să verifice sesiunea, să creeze consimțământul, să valideze răspunsul și să protejeze tokenurile criptate. Vei putea revoca accesul oricând.
Entendido|Understood|Am înțeles
Notificaciones|Notifications|Notificări
Todo en calma.|All quiet.|Totul este în regulă.
No tienes notificaciones nuevas. Estás explorando una demostración con datos ficticios.|No new notifications. You are exploring a demo with fictional data.|Nu ai notificări noi. Explorezi o demonstrație cu date fictive.
¿Volver a empezar?|Start again?|O iei de la capăt?
Se eliminarán tus objetivos, clasificaciones y ajustes de esta demostración local.|Your goals, categories and local demo settings will be deleted.|Obiectivele, categoriile și setările demonstrației locale vor fi șterse.
Sí, restablecer demo|Yes, reset demo|Da, resetează demonstrația
Conservar mis datos|Keep my data|Păstrează datele mele
Un momento para ti.|A moment for yourself.|Un moment pentru tine.
Vista demo bloqueada. Esta pantalla es una cortina de privacidad, no una autenticación.|Demo view locked. This screen is a privacy curtain, not authentication.|Vizualizarea demo este blocată. Acesta este un paravan vizual, nu autentificare.
Continuar en demostración|Continue demo|Continuă demonstrația
Objetivo guardado|Goal saved|Obiectiv salvat
Exportación de datos demo completada|Demo data exported|Datele demo au fost exportate
Datos de demostración actualizados. No se ha contactado con tu banco.|Demo data refreshed. Your bank has not been contacted.|Datele demo au fost actualizate. Banca ta nu a fost contactată.
Actualizar demostración|Refresh demo|Actualizează demonstrația
Un viaje inolvidable|An unforgettable trip|O călătorie de neuitat
Fondo de tranquilidad|Peace-of-mind fund|Fond de siguranță
Importar extracto|Import statement|Importă extras
Importación local|Local import|Import local
Solo en memoria|In memory only|Doar în memorie
Volver a demo|Back to demo|Înapoi la demo
Importados|Imported|Importate
Vaciar importaciones|Clear imports|Șterge importurile
Vista previa editable|Editable preview|Previzualizare editabilă
Fecha|Date|Dată
Descripción|Description|Descriere
Importe|Amount|Sumă
Eliminar fila|Delete row|Șterge rândul
Revisar|Review|De verificat
Confirmar importación|Confirm import|Confirmă importul
Cancelar|Cancel|Anulează
Moneda|Currency|Monedă
Identificador de cuenta|Account identifier|Identificator de cont
Usa el mismo identificador y moneda al importar PDF y CSV de la misma cuenta.|Use the same account identifier and currency when importing PDF and CSV from the same account.|Folosește același identificator și aceeași monedă la importul PDF și CSV din același cont.
El archivo se procesa solo en tu navegador. No se envía a ningún servidor. Los movimientos importados no se guardan en localStorage y se borran al recargar.|The file is processed only in your browser. It is never sent to a server. Imported transactions are not saved in localStorage and are cleared on reload.|Fișierul este procesat doar în browser. Nu este trimis la niciun server. Tranzacțiile importate nu sunt salvate în localStorage și se șterg la reîncărcare.
Seleccionar archivo PDF, CSV o MT940|Choose a PDF, CSV or MT940 file|Alege un fișier PDF, CSV sau MT940
Leyendo archivo…|Reading file…|Se citește fișierul…
Saldo inicial|Opening balance|Sold inițial
Saldo final|Closing balance|Sold final
Suma de movimientos|Sum of transactions|Suma tranzacțiilor
Los saldos cuadran.|Balances reconcile.|Soldurile corespund.
Los saldos no cuadran. Revisa los movimientos antes de confirmar.|Balances do not reconcile. Review the transactions before confirming.|Soldurile nu corespund. Verifică tranzacțiile înainte de confirmare.
No hay saldos inicial y final verificables. No se puede comprobar la integridad del extracto.|No verifiable opening and closing balances. Statement completeness cannot be checked.|Nu există solduri inițiale și finale verificabile. Integritatea extrasului nu poate fi verificată.
He revisado la diferencia y quiero continuar.|I have reviewed the difference and want to continue.|Am verificat diferența și doresc să continui.
Corrige las filas marcadas antes de confirmar.|Correct the marked rows before confirming.|Corectează rândurile marcate înainte de confirmare.
Confirma que has revisado todas las filas del extracto.|Confirm that you have reviewed every statement row.|Confirmă că ai verificat toate rândurile extrasului.
Datos locales importados, separados de la demostración. Se borran al recargar.|Local imported data, separate from the demo. Cleared on reload.|Date locale importate, separate de demonstrație. Se șterg la reîncărcare.
Los saldos de las tarjetas pertenecen a la demo, no al extracto.|Card balances belong to the demo, not to the statement.|Soldurile cardurilor aparțin demonstrației, nu extrasului.
No hay sincronización bancaria en el modo local.|Bank synchronisation is unavailable in local mode.|Sincronizarea bancară nu este disponibilă în modul local.
No se ha detectado una tabla compatible|No compatible table was detected|Nu a fost detectat un tabel compatibil
Fecha no válida|Invalid date|Dată nevalidă
Importe no válido|Invalid amount|Sumă nevalidă
Completa fecha, importe y descripción|Complete date, amount and description|Completează data, suma și descrierea
El archivo supera el límite de 20 MB|The file exceeds the 20 MB limit|Fișierul depășește limita de 20 MB
El PDF supera el límite de 100 páginas|The PDF exceeds the 100-page limit|PDF-ul depășește limita de 100 de pagini
El PDF es demasiado complejo|The PDF is too complex|PDF-ul este prea complex
El PDF no contiene texto seleccionable. Parece un documento escaneado. No se ha importado ningún dato. No hay OCR local habilitado.|The PDF has no selectable text and appears to be scanned. No data was imported. Local OCR is not enabled.|PDF-ul nu conține text selectabil și pare scanat. Nu s-au importat date. OCR local nu este activat.
No se ha detectado una tabla compatible. Exporta CSV/MT940 o revisa el formato del extracto.|No compatible table was detected. Export CSV/MT940 or check the statement format.|Nu a fost detectat un tabel compatibil. Exportă CSV/MT940 sau verifică formatul extrasului.
El PDF está protegido con contraseña. Desbloquéalo localmente antes de importarlo.|The PDF is password-protected. Unlock it locally before importing.|PDF-ul este protejat prin parolă. Deblochează-l local înainte de import.
No se puede leer este PDF. Comprueba que el archivo sea válido.|This PDF cannot be read. Check that the file is valid.|Acest PDF nu poate fi citit. Verifică dacă fișierul este valid.
Hay filas incompletas: revisa fecha, importe y descripción.|Some rows are incomplete: review date, amount and description.|Unele rânduri sunt incomplete: verifică data, suma și descrierea.
Formato no compatible|Unsupported format|Format neacceptat
No hay movimientos para importar|No transactions to import|Nu există tranzacții de importat
CSV con comillas sin cerrar|CSV has unclosed quotes|CSV-ul conține ghilimele neînchise
Revisa los importes y vuelve a intentarlo.|Check the amounts and try again.|Verifică sumele și încearcă din nou.
Importación confirmada|Import confirmed|Import confirmat
Añadidos|Added|Adăugate
Duplicados omitidos|Duplicates skipped|Duplicate omise
Diferencia|Difference|Diferență
Archivo|File|Fișier
Página|Page|Pagină
`.trim().split('\n').map(line=>line.split('|'));
const dictionary=new Map(entries.map(([es,en,ro])=>[es,{en,ro}]));
const fragments=[
 ['Disponible tras gastos y ahorro: ','Available after expenses and savings: ','Disponibil după cheltuieli și economii: '],
 ['El objetivo supera tu excedente mensual de ','The goal exceeds your monthly surplus of ','Obiectivul depășește excedentul lunar de '],
 ['Has superado el presupuesto en ','You have exceeded your budget by ','Ai depășit bugetul cu '],
 ['Presupuesto ','Budget ','Buget '],['Actualizado ','Updated ','Actualizat '],['Semana ','Week ','Săptămâna '],['/mes para el','/month by','/lună până la'],
 ['Compara meses completos de datos demo.','Compares complete months of demo data.','Compară luni complete de date demo.'],
 ['de gasto','spending','cheltuieli'],
 ['· Saldo demo actual + ingresos − gastos del mes seleccionado. Escenario ilustrativo: no representa un saldo futuro confirmado ni contempla cargos desconocidos.','· Current demo balance + income − selected month expenses. Illustrative scenario, not a confirmed future balance; unknown charges are excluded.','· Soldul demo actual + venituri − cheltuielile lunii selectate. Scenariu ilustrativ, nu un sold viitor confirmat; plățile necunoscute sunt excluse.'],
 ];
export function t(value){if(typeof value!=='string'||language==='es')return value;const trimmed=value.trim();const hit=dictionary.get(trimmed);if(hit)return value.replace(trimmed,hit[language]);let result=value;for(const [es,en,ro]of fragments)result=result.split(es).join(language==='en'?en:ro);return result;}
export const text=t;
for(const [es,en,ro] of [
 ['Objetivos de demostración','Demo goals','Obiective demonstrative'],
 ['Detalle del movimiento local','Local transaction details','Detaliile tranzacției locale'],
 ['La clasificación importada se mantiene solo en memoria.','Imported categories are kept in memory only.','Categoriile importate sunt păstrate doar în memorie.'],
 [' de ',' of ',' din '],
])dictionary.set(es.trim(),{en:en.trim(),ro:ro.trim()});
