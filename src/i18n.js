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
Balance total|Total balance|Sold total
Ocultar saldo|Hide balance|Ascunde soldul
flujo neto del mes|net cash flow this month|flux net lunar
Ingresos|Income|Venituri
Gastos|Expenses|Cheltuieli
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
La integración real está deshabilitada. Es necesario configurar un proveedor autorizado en el servidor, autenticación y consentimiento de solo lectura.|Live integration is disabled. An authorised server-side provider, authentication and read-only consent are required.|Integrarea reală este dezactivată. Sunt necesare un furnizor autorizat pe server, autentificare și consimțământ doar pentru citire.
Cómo conectar mi banco|How to connect my bank|Cum îmi conectez banca
No solicitamos contraseñas bancarias, números completos de tarjeta ni CVV.|We never request bank passwords, full card numbers or CVVs.|Nu solicităm parole bancare, numere complete de card sau CVV.
Privacidad y seguridad|Privacy and security|Confidențialitate și securitate
Datos utilizados|Data used|Date utilizate
Almacenamiento|Storage|Stocare
Siempre a mano|Always at hand|Mereu la îndemână
Instala A desde el menú del navegador. En iPhone: Compartir → Añadir a pantalla de inicio. En Android: menú → Instalar aplicación.|Install A from your browser menu. On iPhone: Share → Add to Home Screen. On Android: menu → Install app.|Instalează A din meniul browserului. Pe iPhone: Partajare → Adaugă pe ecranul principal. Pe Android: meniu → Instalează aplicația.
EUR · ESPAÑOL · MODO OSCURO|EUR · ENGLISH · DARK MODE|EUR · ROMÂNĂ · MOD ÎNTUNECAT
Un poco más cerca de lo que importa.|A little closer to what matters.|Puțin mai aproape de ceea ce contează.
Volver a mi cartera|Back to my wallet|Înapoi la portofel
Cerrar|Close|Închide
Tu objetivo|Your goal|Obiectivul tău
Algo que te ilusiona|Something to look forward to|Ceva care te inspiră
Nombre|Name|Nume
Importe objetivo (€)|Target amount (€)|Sumă țintă (€)
Ahorro actual (€)|Current savings (€)|Economii actuale (€)
Fecha objetivo|Target date|Data țintă
Guardar objetivo|Save goal|Salvează obiectivul
Eliminar objetivo|Delete goal|Șterge obiectivul
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
¿Volver a empezar?|Start again?|O iei de la capăt?
Conservar mis datos|Keep my data|Păstrează datele mele
Un momento para ti.|A moment for yourself.|Un moment pentru tine.
Objetivo guardado|Goal saved|Obiectiv salvat
Importar extracto|Import statement|Importă extras
Importación local|Local import|Import local
Solo en memoria|In memory only|Doar în memorie
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
 ['de gasto','spending','cheltuieli'],
 ];
export function t(value){if(typeof value!=='string'||language==='es')return value;const trimmed=value.trim();const hit=dictionary.get(trimmed);if(hit)return value.replace(trimmed,hit[language]);let result=value;for(const [es,en,ro]of fragments)result=result.split(es).join(language==='en'?en:ro);return result;}

for(const [es,en,ro] of [
 ['Detalle del movimiento local','Local transaction details','Detaliile tranzacției locale'],
 ['La clasificación importada se mantiene solo en memoria.','Imported categories are kept in memory only.','Categoriile importate sunt păstrate doar în memorie.'],
 [' de ',' of ',' din '],
])dictionary.set(es.trim(),{en:en.trim(),ro:ro.trim()});
for(const line of `
DATOS LOCALES|LOCAL DATA|DATE LOCALE
Tu dinero, con claridad.|Your money, clearly.|Banii tăi, cu claritate.
Solo tus datos. Tus decisiones.|Only your data. Your decisions.|Doar datele tale. Deciziile tale.
Tus cuentas y conexiones bancarias.|Your accounts and bank connections.|Conturile și conexiunile tale bancare.
Solo en este navegador. Los datos de la sesión se borran al recargar.|Only in this browser. Session data is cleared on reload.|Doar în acest browser. Datele sesiunii se șterg la reîncărcare.
Empieza con tus propios datos|Start with your own data|Începe cu propriile date
Importa un extracto PDF, CSV o MT940. Nada se envía a un servidor.|Import a PDF, CSV or MT940 statement. Nothing is sent to a server.|Importă un extras PDF, CSV sau MT940. Nimic nu este trimis la un server.
Todavía no hay movimientos|No transactions yet|Nu există încă tranzacții
Importa tu primer extracto para empezar.|Import your first statement to get started.|Importă primul extras pentru a începe.
Todos los periodos|All periods|Toate perioadele
Saldo al cierre del extracto|Statement closing balance|Soldul final al extrasului
No es un saldo bancario en tiempo real.|This is not a real-time bank balance.|Acesta nu este un sold bancar în timp real.
Todavía no hay objetivos|No goals yet|Nu există încă obiective
Crea una meta con el importe y la fecha que tú elijas.|Create a goal with your chosen amount and date.|Creează un obiectiv cu suma și data alese de tine.
No hay tarjetas conectadas|No connected cards|Nu există carduri conectate
Importar un extracto no conecta una tarjeta ni recupera sus datos.|Importing a statement does not connect a card or retrieve its details.|Importarea unui extras nu conectează un card și nu îi preia datele.
Cuentas importadas|Imported accounts|Conturi importate
Importa un extracto para ver tus cuentas.|Import a statement to see your accounts.|Importă un extras pentru a vedea conturile tale.
Movimientos importados|Imported transactions|Tranzacții importate
Limpiar filtros|Clear filters|Șterge filtrele
No hay datos en el periodo seleccionado.|No data in the selected period.|Nu există date în perioada selectată.
No hay gastos en el periodo seleccionado.|No expenses in the selected period.|Nu există cheltuieli în perioada selectată.
Los cálculos usan únicamente los movimientos importados del periodo seleccionado.|Calculations use only imported transactions in the selected period.|Calculele folosesc doar tranzacțiile importate din perioada selectată.
Puedes corregir la categoría desde el detalle de cada movimiento.|You can correct categories in transaction details.|Poți corecta categoriile în detaliile fiecărei tranzacții.
La comparación no verifica si los extractos de ambos meses están completos.|The comparison does not verify whether both months' statements are complete.|Comparația nu verifică dacă extrasele ambelor luni sunt complete.
Importa también el mes anterior para comparar.|Import the previous month as well to compare.|Importă și luna precedentă pentru a compara.
Solo se muestran los movimientos que marques como recurrentes.|Only transactions you mark as recurring are shown.|Sunt afișate doar tranzacțiile pe care le marchezi ca recurente.
Importa datos para comparar el ahorro con tus ingresos y gastos.|Import data to compare savings with your income and expenses.|Importă date pentru a compara economiile cu veniturile și cheltuielile tale.
Límite total|Total limit|Limită totală
Sin conexión bancaria|No bank connection|Fără conexiune bancară
Solo tus importaciones|Only your imports|Doar importurile tale
No hay autenticación ni conexión bancaria activa. No se guardan extractos en el servidor ni en localStorage.|There is no authentication or active bank connection. Statements are not saved on the server or in localStorage.|Nu există autentificare sau conexiune bancară activă. Extrasele nu sunt salvate pe server sau în localStorage.
Datos de la sesión|Session data|Datele sesiunii
La exportación descarga una copia local de tus datos. Guárdala en un lugar seguro.|Export downloads a local copy of your data. Keep it somewhere safe.|Exportul descarcă o copie locală a datelor tale. Păstreaz-o într-un loc sigur.
Exportar datos|Export data|Exportă datele
Eliminar datos de sesión|Delete session data|Șterge datele sesiunii
Datos de sesión eliminados|Session data deleted|Datele sesiunii au fost șterse
Se eliminarán los movimientos importados, objetivos y presupuestos de esta sesión. Esta acción no se puede deshacer.|Imported transactions, goals and budgets from this session will be deleted. This cannot be undone.|Tranzacțiile importate, obiectivele și bugetele acestei sesiuni vor fi șterse. Acțiunea nu poate fi anulată.
Solo tus datos|Only your data|Doar datele tale
Importe objetivo|Target amount|Sumă țintă
Ahorro actual|Current savings|Economii actuale
Marcar como recurrente|Mark as recurring|Marchează ca recurent
`.trim().split('\n')){const[es,en,ro]=line.split('|');dictionary.set(es,{en,ro})}
for(const line of `
Cuenta anterior|Previous account|Contul anterior
Cuenta siguiente|Next account|Contul următor
Ver movimientos|View transactions|Vezi tranzacțiile
Saldos de cierre de tus extractos, no tarjetas bancarias conectadas.|Statement closing balances, not connected bank cards.|Solduri finale din extrase, nu carduri bancare conectate.
Extracto listo|Statement ready|Extras pregătit
Crear mi plan|Create my plan|Creează planul meu
Cerrar confirmación|Dismiss confirmation|Închide confirmarea
ASISTENTE LOCAL|LOCAL ASSISTANT|ASISTENT LOCAL
Un plan que parte de ti.|A plan that starts with you.|Un plan care începe cu tine.
Tus datos. Tu objetivo. Tu ritmo.|Your data. Your goal. Your pace.|Datele tale. Obiectivul tău. Ritmul tău.
Tu plan de ahorro|Your savings plan|Planul tău de economii
Editar plan|Edit plan|Editează planul
Ajustar plan|Adjust plan|Ajustează planul
Eliminar plan|Delete plan|Șterge planul
Plan guardado|Plan saved|Plan salvat
Plan eliminado|Plan deleted|Plan șters
Tus datos han cambiado. Revisa y recalcula el plan.|Your data has changed. Review and recalculate the plan.|Datele tale s-au schimbat. Verifică și recalculează planul.
Objetivo alcanzado según el ahorro que has indicado.|Goal reached based on the savings you entered.|Obiectiv atins conform economiilor pe care le-ai introdus.
Proyección sin intereses. Depende de mantener la aportación y el presupuesto.|Projection without interest. It depends on maintaining contributions and your budget.|Proiecție fără dobândă. Depinde de menținerea contribuțiilor și a bugetului.
Proyección|Projection|Proiecție
Ahorro proyectado|Projected savings|Economii estimate
Mes|Month|Lună
Asistente de ahorro local|Local savings assistant|Asistent local de economii
Primero, tus datos|First, your data|Mai întâi, datele tale
¿Qué quieres conseguir?|What do you want to achieve?|Ce vrei să realizezi?
Tu camino, a tu ritmo|Your path, your pace|Drumul tău, ritmul tău
Paso|Step|Pas
Se calcula aquí. Ningún dato sale de tu navegador.|Calculated here. No data leaves your browser.|Calculat aici. Nicio dată nu părăsește browserul.
Necesito tu extracto para empezar.|I need your statement to get started.|Am nevoie de extrasul tău pentru a începe.
No crearé cifras ni recomendaciones sin tus datos.|I will not create figures or recommendations without your data.|Nu voi crea cifre sau recomandări fără datele tale.
Primer mes|First month|Prima lună
Último mes|Last month|Ultima lună
Revisión de movimientos|Transaction review|Verificarea tranzacțiilor
pendientes|pending|în așteptare
Revisado|Reviewed|Verificat
¿Qué tipo de movimiento es?|What kind of transaction is this?|Ce tip de tranzacție este?
Clasificación para el plan|Classification for planning|Clasificare pentru plan
Elige una clasificación|Choose a classification|Alege o clasificare
Aprendido de tus revisiones|Learned from your reviews|Învățat din verificările tale
Confirmar|Confirm|Confirmă
No asumo que un abono sea una nómina ni que un cargo sea fijo. Tú lo confirmas.|I do not assume a credit is salary or a debit is fixed. You confirm it.|Nu presupun că o încasare este salariu sau că o plată este fixă. Tu confirmi.
Revisar otro|Review another|Verifică alta
Mi extracto está incompleto; indicaré mi presupuesto mensual.|My statement is incomplete; I will enter my monthly budget.|Extrasul meu este incomplet; voi introduce bugetul lunar.
Ingresos habituales|Regular income|Venituri regulate
Ingreso habitual|Regular income|Venit regulat
Ingreso puntual|One-off income|Venit ocazional
Gasto fijo|Fixed expense|Cheltuială fixă
Gasto variable|Variable expense|Cheltuială variabilă
Suscripción|Subscription|Abonament
Transferencia interna|Internal transfer|Transfer intern
Gastos fijos|Fixed expenses|Cheltuieli fixe
Gastos variables|Variable expenses|Cheltuieli variabile
He confirmado estos cuatro importes mensuales; no son totales del extracto.|I confirmed these four monthly amounts; they are not statement totals.|Am confirmat aceste patru sume lunare; nu sunt totalurile extrasului.
He importado todos los movimientos de estos meses completos, de todas mis cuentas.|I imported every transaction for these full months, across all my accounts.|Am importat toate tranzacțiile pentru aceste luni complete, din toate conturile mele.
Cómo funciona la inteligencia local|How local intelligence works|Cum funcționează inteligența locală
El clasificador aprende por similitud de tus ejemplos confirmados y se abstiene si hay dudas. No usa un modelo generativo ni un servicio externo. El plan usa cálculos explicables y no adivina datos ausentes.|The classifier learns from similarity to your confirmed examples and abstains when uncertain. No generative model or external service is used. Planning uses explainable calculations and does not guess missing data.|Clasificatorul învață din similitudinea exemplelor tale confirmate și se abține când există îndoieli. Nu utilizează un model generativ sau un serviciu extern. Planul folosește calcule explicabile, fără a ghici datele lipsă.
Continuar con mi objetivo|Continue to my goal|Continuă cu obiectivul meu
Elegir objetivo existente|Choose an existing goal|Alege un obiectiv existent
¿Para qué quieres ahorrar?|What are you saving for?|Pentru ce vrei să economisești?
¿Para cuándo?|By when?|Până când?
Colchón mensual que no quieres comprometer|Monthly buffer you want to protect|Rezerva lunară pe care vrei să o protejezi
¿Cuánto quieres aportar al mes?|How much do you want to save monthly?|Cât vrei să economisești lunar?
Calcular según mi objetivo|Calculate from my goal|Calculează după obiectiv
La primera aportación se proyecta el día 1 del próximo mes. No se mueve dinero.|The first contribution is projected for the first day of next month. No money is moved.|Prima contribuție este proiectată pentru prima zi a lunii următoare. Nu se transferă bani.
Revisar datos|Review data|Verifică datele
Calculando…|Calculating…|Se calculează…
Generar mi plan|Generate my plan|Generează planul meu
Capacidad tras el colchón|Capacity after buffer|Capacitate după rezervă
Alternativas de ahorro|Savings alternatives|Alternative de economisire
Más flexible|More flexible|Mai flexibil
Más rápida|Faster|Mai rapid
Equilibrada|Balanced|Echilibrat
de margen|left over|rămași
La proyección encaja en tu plazo.|The projection fits your deadline.|Proiecția se încadrează în termen.
Esta alternativa necesita más tiempo.|This alternative needs more time.|Această alternativă necesită mai mult timp.
La flexible propone el 75 % de tu aportación deseada, con un límite del 50 % de tu capacidad. La equilibrada limita tu aportación al 80 % de la capacidad. La rápida busca acelerar con hasta el 125 % de tu aportación deseada, sin superar la capacidad disponible.|Flexible uses 75% of your desired contribution, capped at 50% of capacity. Balanced caps it at 80% of capacity. Faster uses up to 125% of your desired contribution, without exceeding capacity.|Varianta flexibilă folosește 75% din contribuția dorită, până la 50% din capacitate. Varianta echilibrată o limitează la 80% din capacitate. Varianta rapidă folosește până la 125% din contribuția dorită, fără a depăși capacitatea.
Para tu plazo harían falta|Your deadline would require|Pentru termenul tău ar fi necesari
No se presupone reducir tus gastos ni obtener intereses.|No spending reductions or interest are assumed.|Nu se presupun reduceri de cheltuieli sau dobânzi.
Ver cálculo y limitaciones|See calculation and limitations|Vezi calculul și limitările
Importes clasificados ÷ meses completos confirmados. Se excluyen transferencias e ingresos puntuales. Capacidad = ingresos habituales − fijos − variables − suscripciones − colchón.|Classified totals ÷ confirmed full months. Transfers and one-off income are excluded. Capacity = regular income − fixed − variable − subscriptions − buffer.|Totaluri clasificate ÷ luni complete confirmate. Transferurile și veniturile ocazionale sunt excluse. Capacitate = venit regulat − fixe − variabile − abonamente − rezervă.
Ajustar objetivo y aportación|Adjust goal and contribution|Ajustează obiectivul și contribuția
Guardar mi plan|Save my plan|Salvează planul meu
Son escenarios orientativos, no garantías ni asesoramiento financiero profesional.|These are illustrative scenarios, not guarantees or professional financial advice.|Acestea sunt scenarii orientative, nu garanții sau consultanță financiară profesională.
Pendiente de clasificar|Awaiting classification|În așteptarea clasificării
Pendiente de revisar|Awaiting review|În așteptarea verificării
Detalle|Details|Detalii
Guardar cambios|Save changes|Salvează modificările
Movimiento actualizado|Transaction updated|Tranzacție actualizată
Movimiento eliminado|Transaction deleted|Tranzacție ștearsă
Eliminar movimiento|Delete transaction|Șterge tranzacția
Se eliminará este movimiento de la sesión. Se recalcularán las estadísticas y el plan quedará pendiente de revisión.|This transaction will be deleted from the session. Statistics will update and the plan will need review.|Această tranzacție va fi ștearsă din sesiune. Statisticile se vor actualiza și planul va necesita verificare.
Se elimina solo el plan. Conservas tu objetivo y tus movimientos.|Only the plan is deleted. Your goal and transactions are kept.|Se șterge doar planul. Obiectivul și tranzacțiile rămân.
Ya existe un movimiento con esos datos.|A transaction with those details already exists.|Există deja o tranzacție cu aceste date.
Selecciona el periodo que has importado.|Choose the period you imported.|Alege perioada importată.
Periodo no válido.|Invalid period.|Perioadă nevalidă.
Selecciona entre 1 y 120 meses.|Choose between 1 and 120 months.|Alege între 1 și 120 de luni.
Importa un extracto antes de crear un plan.|Import a statement before creating a plan.|Importă un extras înainte de a crea un plan.
No hay movimientos en ese periodo.|No transactions in that period.|Nu există tranzacții în această perioadă.
Revisa la clasificación de los movimientos pendientes.|Review the classification of pending transactions.|Verifică clasificarea tranzacțiilor în așteptare.
Completa los cuatro importes mensuales.|Complete all four monthly amounts.|Completează toate cele patru sume lunare.
Confirma los importes mensuales que has indicado.|Confirm the monthly amounts you entered.|Confirmă sumele lunare introduse.
Los importes mensuales los has definido tú; no son una estimación del extracto.|You defined the monthly amounts; they are not estimated from the statement.|Tu ai definit sumele lunare; nu sunt estimate din extras.
Confirma que el periodo incluye todas tus cuentas e ingresos y gastos.|Confirm the period includes all accounts, income and expenses.|Confirmă că perioada include toate conturile, veniturile și cheltuielile.
Faltan meses del periodo. Importa los extractos o indica tus importes mensuales.|Some months are missing. Import them or enter your monthly amounts.|Lipsesc luni din perioadă. Importă-le sau introdu sumele lunare.
Menos de tres meses: la estimación puede variar mucho.|Less than three months: estimates may vary considerably.|Mai puțin de trei luni: estimarea poate varia mult.
No hay ingresos habituales confirmados. Revisa los ingresos o indica tu presupuesto mensual.|No confirmed regular income. Review income or enter your monthly budget.|Nu există venituri regulate confirmate. Verifică veniturile sau introdu bugetul lunar.
Completa el objetivo, el importe y el ahorro actual.|Complete your goal, target amount and current savings.|Completează obiectivul, suma țintă și economiile actuale.
El objetivo y los extractos deben usar la misma moneda.|The goal and statements must use the same currency.|Obiectivul și extrasele trebuie să utilizeze aceeași monedă.
Elige una fecha a partir de la próxima aportación mensual.|Choose a date on or after the next monthly contribution.|Alege o dată începând cu următoarea contribuție lunară.
Indica un colchón mensual válido.|Enter a valid monthly buffer.|Introdu o rezervă lunară validă.
No queda capacidad de ahorro. Ajusta el presupuesto o el colchón antes de generar un plan.|No savings capacity remains. Adjust the budget or buffer first.|Nu rămâne capacitate de economisire. Ajustează mai întâi bugetul sau rezerva.
Indica una aportación mensual positiva.|Enter a positive monthly contribution.|Introdu o contribuție lunară pozitivă.
La aportación no permite un plazo razonable. Ajusta el objetivo o el presupuesto.|The contribution does not allow a reasonable timeframe. Adjust the goal or budget.|Contribuția nu permite un termen rezonabil. Ajustează obiectivul sau bugetul.
`.trim().split('\n')){const[es,en,ro]=line.split('|');dictionary.set(es,{en,ro})}
dictionary.set('Saldo no disponible',{en:'Balance unavailable',ro:'Sold indisponibil'});
