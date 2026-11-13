import {headerType,signedAmount} from './text.js';
import {normalizeDate,normalizeDescription,parseAmount} from './normalize.js';
const datePattern=/^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}$/;
const moneyPattern=/^[+−-]?(?:\d{1,3}(?:[.,\s]\d{3})+|\d+)[.,]\d{2}(?:\s*(?:RON|EUR|LEI))?$/i;
const fold=s=>normalizeDescription(s).toLowerCase();
function positionedLines(items){
  const lines=[];
  for(const item of [...items].filter(i=>i.text?.trim()).sort((a,b)=>a.y-b.y||a.x-b.x)){
    let line=lines.find(l=>Math.abs(l.y-item.y)<2.5);
    if(!line){line={y:item.y,items:[]};lines.push(line)}line.items.push(item);
  }
  return lines.map(l=>({...l,items:l.items.sort((a,b)=>a.x-b.x),text:l.items.map(i=>i.text).join(' ')}));
}
function detectHeader(lines,index){
  const line=lines[index];
  if(line.items.some(item=>datePattern.test(item.text.trim())))return null;
  // A balance summary above the table must not become its balance column.
  if(!line.items.some(item=>[item.text,...item.text.split(/\s+/)].some(text=>{const type=headerType(text);return type&&type!=='balance'})))return null;
  const candidates=[line];
  // Banks wrap headings over several baselines. Stop before any dated row.
  for(let n=1;n<4&&index+n<lines.length;n++){
    const next=lines[index+n];
    if(next.y-line.y>44||next.items.some(i=>datePattern.test(i.text.trim())))break;
    candidates.push(next);
  }
  const columns=[];
  for(const candidate of candidates){
    const pieces=[];
    for(const item of candidate.items){
      const direct=headerType(item.text);
      if(direct)pieces.push({...item,type:direct});
      else {let offset=0;for(const word of item.text.split(/(\s+)/)){if(!word)continue;const width=(item.width||0)*word.length/item.text.length;if(word.trim())pieces.push({text:word,x:item.x+offset,width});offset+=width;}}
    }
    for(let i=0;i<pieces.length;i++){
      const item=pieces[i];let type=item.type||headerType(item.text),width=item.width||0;
      if(!type)for(let count=2;count<=3&&i+count<=pieces.length;count++){const group=pieces.slice(i,i+count);if(group.some((p,j)=>j&&p.x-(group[j-1].x+group[j-1].width)>18))break;type=headerType(group.map(p=>p.text).join(' '));if(type){width=group.at(-1).x+group.at(-1).width-item.x;break;}}
      if(type&&!columns.some(c=>c.type===type))columns.push({type,x:item.x,width,center:item.x+width/2});
    }
  }
  if(!columns.some(c=>c.type==='date')||!columns.some(c=>c.type==='description')||!columns.some(c=>['amount','debit','credit'].includes(c.type)))return null;
  return {columns:columns.sort((a,b)=>a.x-b.x),skip:Math.max(0,...candidates.map((candidate,i)=>candidate.items.some(item=>headerType(item.text)||item.text.split(/\s+/).some(word=>headerType(word)))?i:0))};
}
function extractBalance(line,kind){const s=fold(line.text);const pattern=kind==='opening'?/\b(?:sold initial|sold precedent|opening balance|initial balance|balance brought forward|saldo inicial)\b/:/\b(?:sold final|sold nou|closing balance|final balance|saldo final)\b/;if(!pattern.test(s))return undefined;const matches=line.text.match(/[+-]?(?:\d{1,3}(?:[.,\s]\d{3})+|\d+)[.,]\d{2}/g);if(!matches)return undefined;try{return parseAmount(matches.at(-1))}catch{return undefined}}
const footer=s=>/^(?:pagina\b|page\b|pag\.?\s*\d|total\b|rulaj total\b|total rulaj\b|banca transilvania\b|extras de cont\b|account statement\b|continuare\b|report generat\b|generated\b|www\.|cui\b|iban\b|titular\b|sold (?:initial|final|precedent|nou)\b|opening balance\b|closing balance\b|sold disponibil\b|available balance\b)/.test(fold(s));
export function parsePositionedPages(pages){
  let columns=null,foundTable=false,opening=null,closing=null,textCharacters=0;const rows=[],warnings=[];let pending=null;
  const flush=()=>{if(!pending)return;pending.description=pending.description.replace(/\s+/g,' ').trim();pending.review=Boolean(pending.review||!pending.description||pending.amount===null);delete pending.lastY;rows.push(pending);pending=null};
  for(let pageIndex=0;pageIndex<pages.length;pageIndex++){
    const lines=positionedLines(pages[pageIndex]);textCharacters+=lines.reduce((s,l)=>s+l.text.length,0);
    // Every page must establish its own column positions; never inherit unrelated page text.
    let pageColumns=columns,stopped=false;
    for(let index=0;index<lines.length;index++){
      const line=lines[index];
      const initial=extractBalance(line,'opening'),final=extractBalance(line,'closing');
      if(initial!==undefined&&opening===null)opening=initial;
      if(final!==undefined){closing=final;flush();stopped=true;}
      const header=detectHeader(lines,index);
      if(header){pageColumns=header.columns;columns=header.columns;index+=header.skip;foundTable=true;stopped=false;continue;}
      if(!pageColumns||stopped)continue;
      if(footer(line.text))continue;
      const dateCol=columns.find(c=>c.type==='date'),descriptionCol=columns.find(c=>c.type==='description');
      const amountColumns=columns.filter(c=>['debit','credit','amount','balance'].includes(c.type));
      const firstMoney=Math.min(...amountColumns.map(c=>c.x));
      const dateItem=line.items.find(i=>datePattern.test(i.text.trim())&&i.x<descriptionCol.x);
      const descriptionItems=line.items.filter(i=>i.x>=descriptionCol.x-12&&i.x<firstMoney-20);
      if(dateItem){flush();let date=dateItem.text,review=false;try{date=normalizeDate(date)}catch{review=true}
        const cells={};for(const c of amountColumns)cells[c.type]='';
        for(const item of line.items){if(item.x<firstMoney-20)continue;const clean=item.text.replace(/−/g,'-').trim();if(!moneyPattern.test(clean)&&!/^[-—–]$/.test(clean))continue;const center=item.x+(item.width||0)/2;const col=amountColumns.reduce((a,b)=>Math.abs(b.center-center)<Math.abs(a.center-center)?b:a);cells[col.type]=clean;}
        let amount=null;try{amount=signedAmount(cells)}catch{review=true}
        pending={lastY:line.y,date,description:descriptionItems.map(i=>i.text).join(' '),amount,review,page:pageIndex+1};
      }else if(pending&&descriptionItems.length&&(pending.page!==pageIndex+1||line.y-(pending.lastY??line.y)<28)){
        // Only text aligned with the description column is joined; balances and page furniture are excluded.
        pending.description+=' '+descriptionItems.map(i=>i.text).join(' ');pending.lastY=line.y;
      }
    }
  }
  flush();
  if(textCharacters<20)throw new Error('El PDF no contiene texto seleccionable. Parece un documento escaneado. No se ha importado ningún dato. No hay OCR local habilitado.');
  if(!foundTable||!rows.length)throw new Error('No se ha detectado una tabla compatible. Exporta CSV/MT940 o revisa el formato del extracto.');
  if(rows.some(r=>r.review))warnings.push('Hay filas incompletas: revisa fecha, importe y descripción.');
  return {rows,opening,closing,format:'PDF',warnings};
}
