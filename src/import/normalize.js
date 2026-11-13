// All formats share these rules. Never hash the source format or filename.
export function normalizeDescription(value='') {
  return String(value).normalize('NFD').replace(/\p{Diacritic}/gu,'').toUpperCase().replace(/\s+/g,' ').trim();
}
export function normalizeDate(value) {
  const str=String(value??'').trim();let year,month,day;
  let m=str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:\s.*)?$/);
  if(m)[,year,month,day]=m;else{m=str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?:\s.*)?$/);if(!m)throw new Error('Fecha no válida');[,day,month,year]=m;}
  const date=new Date(Date.UTC(+year,+month-1,+day));
  if(date.getUTCFullYear()!==+year||date.getUTCMonth()!==+month-1||date.getUTCDate()!==+day)throw new Error('Fecha no válida');
  return date.toISOString().slice(0,10);
}
export function parseAmount(value) {
  if(typeof value==='number'){if(!Number.isFinite(value))throw new Error('Importe no válido');return Math.round(value*100)/100;}
  let s=String(value??'').trim();if(!s||/^[-—–]$/.test(s))return null;
  s=s.replace(/\b(?:EUR|RON|LEI|USD|GBP)\b/gi,'').replace(/[€$£\s\u00a0']/g,'');
  let negative=false;if(/^\(.*\)$/.test(s)){negative=true;s=s.slice(1,-1)}
  if(s.startsWith('-')){negative=true;s=s.slice(1)}else if(s.startsWith('+'))s=s.slice(1);
  if(!/^\d+(?:[.,]\d+)*$/.test(s))throw new Error('Importe no válido');
  const comma=s.lastIndexOf(','),dot=s.lastIndexOf('.');
  if(comma>=0&&dot>=0){const decimal=comma>dot?',':'.';const thousands=decimal===','?'.':',';const parts=s.split(decimal);if(parts.length!==2||!/^\d{1,2}$/.test(parts[1])||!new RegExp('^\\d{1,3}(?:\\'+thousands+'\\d{3})+$').test(parts[0]))throw new Error('Importe no válido');s=parts[0].split(thousands).join('')+'.'+parts[1];}
  else if(comma>=0||dot>=0){const sep=comma>=0?',':'.';const parts=s.split(sep);if(parts.length===2&&parts[1].length<=2)s=parts.join('.');else if(parts.slice(1).every(p=>p.length===3)&&parts[0].length<=3)s=parts.join('');else throw new Error('Importe no válido');}
  const amount=Number(s)*(negative?-1:1);if(!Number.isFinite(amount)||Math.abs(amount)>1e12)throw new Error('Importe no válido');return Math.round(amount*100)/100;
}
export function normalizeMovement(row,account='principal',currency='EUR') {
  const date=normalizeDate(row.date),amount=parseAmount(row.amount),description=String(row.description??row.merchant??'').replace(/\s+/g,' ').trim();
  if(amount===null||!description)throw new Error('Completa fecha, importe y descripción');
  return {...row,date,amount,description,account,currency,category:row.category||'Otros'};
}
export async function movementHash(row) {
  const canonical=JSON.stringify([normalizeDescription(row.account),row.currency.toUpperCase(),normalizeDate(row.date),Math.round(parseAmount(row.amount)*100),normalizeDescription(row.description??row.merchant)]);
  const digest=await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical));
  return [...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
export async function mergeMovements(existing,incoming,account,currency) {
  const hashes=new Set();for(const row of existing)hashes.add(await movementHash(row));
  const added=[];let duplicates=0;
  for(const source of incoming){const row=normalizeMovement(source,account,currency);const hash=await movementHash(row);if(hashes.has(hash)){duplicates++;continue;}hashes.add(hash);added.push({...row,id:hash,merchant:row.description,type:'Extracto local',hash});}
  return {rows:[...existing,...added],added:added.length,duplicates};
}
export function reconcile(opening,closing,rows) {
  if(opening===null||opening===undefined||closing===null||closing===undefined)return {available:false};
  try{const sum=rows.reduce((s,r)=>{const a=parseAmount(r.amount);if(a===null)throw new Error();return s+Math.round(a*100)},0);const difference=Math.round(closing*100)-Math.round(opening*100)-sum;return {available:true,valid:true,matches:difference===0,difference:difference/100};}catch{return {available:true,valid:false,matches:false};}
}
