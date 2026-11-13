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
Ver todos|View all|Vezi toate
Importar extracto|Import statement|Importă extras
Saldo al cierre|Closing balance|Sold final
Vista anterior|Previous view|Vizualizare anterioară
Vista siguiente|Next view|Vizualizare următoare
Navegación entre vistas|View navigation|Navigare între vizualizări
`.trim().split('\n').map(line=>line.split('|'));
const dictionary=new Map(entries.map(([es,en,ro])=>[es,{en,ro}]));
export function t(value){if(typeof value!=='string'||language==='es')return value;const trimmed=value.trim();const hit=dictionary.get(trimmed);if(hit)return value.replace(trimmed,hit[language]);return value;}
