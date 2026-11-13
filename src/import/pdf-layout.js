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
// Text extraction may split a number into several glyph runs. Join only
// adjacent numeric fragments; complete adjacent amounts remain separate.
function joinNumericFragments(items){const result=[];for(const item of items){const previous=result.at(-1),numeric=text=>/^[+−()\d.,\s-]+$/.test(text.trim());const gap=previous?item.x-previous.x-(previous.width||0):Infinity;if(previous&&!datePattern.test(previous.text.trim())&&!datePattern.test(item.text.trim())&&gap>=-1&&gap<=4&&numeric(previous.text)&&numeric(item.text)&&!(moneyPattern.test(previous.text.trim())&&moneyPattern.test(item.text.trim()))){previous.text+=item.text;previous.width=item.x+(item.width||0)-previous.x;}else result.push({...item});}return result;}
function readCells(items,columns,start){const cells={};for(const item of items){if(item.x<start)continue;const clean=item.text.replace(/−/g,'-').trim();if(!moneyPattern.test(clean)&&!/^[-—–]$/.test(clean))continue;const center=item.x+(item.width||0)/2,col=columns.reduce((a,b)=>Math.abs(b.center-center)<Math.abs(a.center-center)?b:a);if(cells[col.type]&&cells[col.type]!==clean)cells[col.type]='?';else cells[col.type]=clean;}return cells;}
function pdfHeaderType(value){const text=fold(value).replace(/[:()]/g,' ').replace(/\b(?:ron|eur|usd|gbp)\b/g,'').replace(/\s+/g,' ').trim();if(text.length>48)return null;const labels=/^(?:data(?: (?:tranzactiei|tranzactie|operatiunii|operarii|valuta|valutei))?|date|booking date|transaction date|value date|fecha|descriere(?: (?:tranzactie|tranzactiei|operatiune|operatiunii))?|detalii(?: tranzactie)?|explicatii|description|transaction description|transaction details|details|narrative|merchant|beneficiar|descripcion|debit|debitor|rulaj debit|rulaj debitor|sume debitoare|withdrawals|plati|credit|creditor|rulaj credit|rulaj creditor|sume creditoare|deposits|incasari|amount|suma|sume|valoare|importe|sold|sold contabil|balance|saldo)$/;return labels.test(text)?headerType(text):null;}
function detectHeader(lines,index){
  const line=lines[index];
  if(line.items.some(item=>datePattern.test(item.text.trim())))return null;
  // A balance summary above the table must not become its balance column.
  if(!line.items.some(item=>[item.text,...item.text.split(/\s+/)].some(text=>{const type=pdfHeaderType(text);return type&&type!=='balance'})))return null;
  const candidates=[line];
  // Banks wrap headings over several baselines. Stop before any dated row.
  for(let n=1;n<4&&index+n<lines.length;n++){
    const next=lines[index+n];
    if(next.y-line.y>44||next.items.some(i=>datePattern.test(i.text.trim()))||/\b(?:sold (?:anterior|initial|final)|rulaj|opening balance|closing balance)\b/i.test(fold(next.text)))break;
    candidates.push(next);
  }
  const columns=[];
  for(const candidate of candidates){
    const pieces=[];
    for(const item of candidate.items){
      const direct=pdfHeaderType(item.text);
      if(direct)pieces.push({...item,type:direct});
      else if(item.text.length<=64&&item.text.split(/\s+/).every(word=>pdfHeaderType(word))){let offset=0;for(const word of item.text.split(/(\s+)/)){if(!word)continue;const width=(item.width||0)*word.length/item.text.length;if(word.trim())pieces.push({text:word,x:item.x+offset,width});offset+=width;}}
    }
    for(let i=0;i<pieces.length;i++){
      const item=pieces[i];let type=item.type||pdfHeaderType(item.text),width=item.width||0;
      if(!type)for(let count=2;count<=3&&i+count<=pieces.length;count++){const group=pieces.slice(i,i+count);if(group.some((p,j)=>j&&p.x-(group[j-1].x+group[j-1].width)>18))break;type=pdfHeaderType(group.map(p=>p.text).join(' '));if(type){width=group.at(-1).x+group.at(-1).width-item.x;break;}}
      if(type&&!columns.some(c=>c.type===type))columns.push({type,x:item.x,width,center:item.x+width/2});
    }
  }
  if(!columns.some(c=>c.type==='date')||!columns.some(c=>c.type==='description')||!columns.some(c=>['amount','debit','credit'].includes(c.type)))return null;
  return {columns:columns.sort((a,b)=>a.x-b.x),skip:Math.max(0,...candidates.map((candidate,i)=>candidate.items.some(item=>pdfHeaderType(item.text)||item.text.split(/\s+/).some(word=>pdfHeaderType(word)))?i:0))};
}
function extractBalance(line,kind){const s=fold(line.text);const pattern=kind==='opening'?/\b(?:sold initial|sold anterior|sold precedent|opening balance|initial balance|balance brought forward|saldo inicial)\b/:/\b(?:sold final|sold nou|closing balance|final balance|saldo final)\b/;if(!pattern.test(s))return undefined;const matches=line.text.match(/[+-]?(?:\d{1,3}(?:[.,\s]\d{3})+|\d+)[.,]\d{2}/g);if(!matches)return undefined;try{return parseAmount(matches.at(-1))}catch{return undefined}}
const footer=s=>/^(?:pagina\b|page\b|pag\.?\s*\d|total\b|rulaj total\b|total rulaj\b|banca transilvania\b|extras de cont\b|account statement\b|continuare\b|report generat\b|generated\b|www\.|cui\b|iban\b|titular\b|sold (?:initial|final|precedent|nou)\b|opening balance\b|closing balance\b|sold disponibil\b|available balance\b)/.test(fold(s));
export function parsePositionedPages(pages){
  let columns=null,active=false,foundTable=false,opening=null,closing=null,textCharacters=0,lastDate='';
  const rows=[],warnings=[];let pending=null;
  const flush=()=>{if(!pending)return;pending.description=pending.description.replace(/\s+/g,' ').trim();pending.review=Boolean(pending.review||!pending.description||pending.amount===null||!pending.date);delete pending.cells;delete pending.descriptionX;delete pending.lastY;rows.push(pending);pending=null};
  const startRow=(date,items,cells,y,page,left)=>{let amount=null,review=false;try{amount=signedAmount(cells)}catch{review=true}pending={date,description:items.map(item=>item.text).join(' '),amount,cells,review,page,lastY:y,descriptionX:items[0]?.x??left}};
  for(let pageIndex=0;pageIndex<pages.length;pageIndex++){
    const lines=positionedLines(pages[pageIndex]);textCharacters+=lines.reduce((sum,line)=>sum+line.text.length,0);
    for(let index=0;index<lines.length;index++){
      const line=lines[index],label=fold(line.text);
      const initial=extractBalance(line,'opening'),final=extractBalance(line,'closing');
      if(initial!==undefined){flush();lastDate='';if(opening===null)opening=initial;continue;}
      if(final!==undefined){flush();closing=final;lastDate='';if(!/sold final zi/.test(label))active=false;continue;}
      // Daily/account turnover is a summary, never another debit/credit movement.
      if(/\b(?:rulaj (?:zi|total)|total rulaj|daily total|daily turnover|account turnover)\b/.test(label)){flush();lastDate='';if(/rulaj total|account turnover/.test(label))active=false;continue;}
      const header=detectHeader(lines,index);
      if(header){columns=header.columns;active=true;foundTable=true;index+=header.skip;continue;}
      if(!active||!columns||footer(line.text))continue;
      const items=joinNumericFragments(line.items),dateCol=columns.find(col=>col.type==='date'),descriptionCol=columns.find(col=>col.type==='description');
      const amountColumns=columns.filter(col=>['debit','credit','amount','balance'].includes(col.type)),numericStart=Math.min(...amountColumns.map(col=>col.x))-32;
      const dateItem=items.find(item=>datePattern.test(item.text.trim())&&item.x>=dateCol.x-8&&item.x<descriptionCol.x);
      const left=dateItem?Math.min(descriptionCol.x-12,dateItem.x+(dateItem.width||0)+1):(pending?.descriptionX??descriptionCol.x-12);
      const descriptionItems=items.filter(item=>item!==dateItem&&!datePattern.test(item.text.trim())&&item.x>=left&&item.x<numericStart);
      const extra=readCells(items,amountColumns,numericStart),hasMovement=['debit','credit','amount'].some(key=>extra[key]&&extra[key]!=='-'&&extra[key]!=='—');
      if(dateItem){flush();try{lastDate=normalizeDate(dateItem.text)}catch{lastDate=dateItem.text.trim()}startRow(lastDate,descriptionItems,{...Object.fromEntries(amountColumns.map(col=>[col.type,''])),...extra},line.y,pageIndex+1,left);}
      else if(hasMovement&&(!pending||pending.amount!==null)){
        // BT prints a date once for a group. Each subsequent amount starts a new
        // transaction using that explicit group date, not the PDF filename/date.
        flush();startRow(lastDate,descriptionItems,{...Object.fromEntries(amountColumns.map(col=>[col.type,''])),...extra},line.y,pageIndex+1,left);
      }else if(pending&&(pending.page!==pageIndex+1||line.y-pending.lastY<28)){
        if(descriptionItems.length)pending.description+=' '+descriptionItems.map(item=>item.text).join(' ');
        for(const[key,value]of Object.entries(extra)){if(pending.cells[key]&&pending.cells[key]!==value)pending.cells[key]='?';else pending.cells[key]=value}
        try{pending.amount=signedAmount(pending.cells)}catch{pending.amount=null;pending.review=true}pending.lastY=line.y;
      }
    }
  }
  flush();
  if(textCharacters<20)throw new Error('El PDF no contiene texto seleccionable. Parece un documento escaneado. No se ha importado ningún dato. No hay OCR local habilitado.');
  if(!foundTable||!rows.length)throw new Error('No se ha detectado una tabla compatible. Exporta CSV/MT940 o revisa el formato del extracto.');
  if(rows.some(row=>row.review))warnings.push('Hay filas incompletas: revisa fecha, importe y descripción.');
  const currencies=[...new Set(pages.flat().map(item=>item.text.trim()).filter(text=>/^(EUR|RON|USD|GBP)$/.test(text)))];
  return {rows,opening,closing,format:'PDF',warnings,...(currencies.length===1?{currency:currencies[0]}:{})};
}
