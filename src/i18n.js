import {useSyncExternalStore} from 'react';
const listeners=new Set();let language='es';try{const saved=localStorage.getItem('aura-language');if(['es','ro','en'].includes(saved))language=saved}catch{}
export const locale=()=>({es:'es-ES',ro:'ro-RO',en:'en-GB'})[language];
export function setLanguage(value){if(!['es','ro','en'].includes(value))return;language=value;try{localStorage.setItem('aura-language',value)}catch{}document.documentElement.lang=value;listeners.forEach(fn=>fn())}
export function useLanguage(){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn)},()=>language)}
const dictionary=new Map();
for(const line of `
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
Ver todos|View all|Vezi toate
Tus próximas grandes cosas|Your next big things|Următoarele tale lucruri importante
Crear objetivo|Create goal|Creează obiectiv
Todavía no hay objetivos|No goals yet|Încă nu există obiective
Crea una meta con el importe y la fecha que tú elijas.|Create a goal with the amount and date you choose.|Creează un obiectiv cu suma și data pe care le alegi.
Todavía no hay movimientos|No transactions yet|Încă nu există tranzacții
Importa tu primer extracto para empezar.|Import your first statement to get started.|Importă primul extras pentru a începe.
Importar extracto|Import statement|Importă extras
Empieza con tus propios datos|Start with your own data|Începe cu propriile date
Importa un extracto PDF, CSV o MT940. Nada se envía a un servidor.|Import a PDF, CSV or MT940 statement. Nothing is sent to a server.|Importă un extras PDF, CSV sau MT940. Nimic nu este trimis la un server.
Solo tus datos. Tus decisiones.|Only your data. Your decisions.|Doar datele tale. Deciziile tale.
Tus cuentas y conexiones bancarias.|Your accounts and bank connections.|Conturile și conexiunile tale bancare.
Todos los periodos|All periods|Toate perioadele
Elige tu mes|Choose your month|Alege luna
Periodo|Period|Perioadă
Aplicar periodo|Apply period|Aplică perioada
DATOS LOCALES|LOCAL DATA|DATE LOCALE
Solo en memoria|In memory only|Doar în memorie
Importación local|Local import|Import local
Tu dinero, con claridad.|Your money, with clarity.|Banii tăi, cu claritate.
Saldo al cierre del extracto|Statement closing balance|Soldul final al extrasului
No es un saldo bancario en tiempo real.|This is not a real-time bank balance.|Nu este un sold bancar în timp real.
Flujo neto|Net flow|Flux net
Media diaria|Daily average|Medie zilnică
Mayores gastos|Largest expenses|Cele mai mari cheltuieli
Pagos recurrentes identificados|Identified recurring payments|Plăți recurente identificate
Gasto por comercio|Spending by merchant|Cheltuieli pe comerciant
No hay datos en el periodo seleccionado.|No data in the selected period.|Nu există date în perioada selectată.
No hay gastos en el periodo seleccionado.|No expenses in the selected period.|Nu există cheltuieli în perioada selectată.
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
Saldo al cierre|Closing balance|Sold final
Vista anterior|Previous view|Vizualizare anterioară
Vista siguiente|Next view|Vizualizare următoare
Navegación entre vistas|View navigation|Navigare între vizualizări
`.trim().split('\n')){const[es,en,ro]=line.split('|');dictionary.set(es,{en,ro})}
export function t(key){if(typeof key!=='string')return key;const entry=dictionary.get(key);if(!entry)return key;return language==='en'?entry.en:language==='ro'?entry.ro:key}
