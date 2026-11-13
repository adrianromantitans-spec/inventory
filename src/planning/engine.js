import {normalizeDescription,normalizeDate} from '../import/normalize.js';
export const kinds={income:'Ingreso habitual',oneoff:'Ingreso puntual',fixed:'Gasto fijo',variable:'Gasto variable',subscription:'Suscripción',transfer:'Transferencia interna'};
const cents=value=>Math.round(Number(value)*100),round=value=>Math.round(value*100)/100;
export function validKind(row,kind=row.planningClass){return Object.hasOwn(kinds,kind)&&(kind==='transfer'||(row.amount>0?['income','oneoff'].includes(kind):['fixed','variable','subscription'].includes(kind)))}
const tokens=description=>new Set(normalizeDescription(description).split(/[^A-Z]+/).filter(word=>word.length>2));
function similarity(a,b){if(!a.size||!b.size)return 0;let dot=0;for(const word of a)if(b.has(word))dot++;return dot/Math.sqrt(a.size*b.size)}
// An on-device, example-based classifier. Training data consists only of this
// session's human-reviewed movements. Abstention is deliberate, not a guessed label.
export function suggestClass(row,rows){
  const samples=rows.filter(sample=>sample.id!==row.id&&sample.planningReviewed&&validKind(sample)&&Math.sign(sample.amount)===Math.sign(row.amount));
  const description=row.description||row.merchant;
  const exact=samples.filter(sample=>normalizeDescription(sample.description||sample.merchant)===normalizeDescription(description));
  if(exact.length){const labels=new Set(exact.map(sample=>sample.planningClass));if(labels.size===1)return {kind:exact[0].planningClass,method:'same-merchant',support:exact.length};return null;}
  if(samples.length<4||new Set(samples.map(s=>s.planningClass)).size<2)return null;
  const ranked=samples.map(sample=>({kind:sample.planningClass,score:similarity(tokens(description),tokens(sample.description||sample.merchant))})).sort((a,b)=>b.score-a.score);
  const best=ranked[0],support=ranked.filter(s=>s.kind===best.kind&&s.score>=.86),other=ranked.find(s=>s.kind!==best.kind)?.score||0;
  if(best.score<.92||support.length<2||best.score-other<.18)return null;
  return {kind:best.kind,method:'nearest-neighbours',support:support.length};
}
export function dataSignature(rows){return JSON.stringify([...rows].sort((a,b)=>a.id.localeCompare(b.id)).map(row=>[row.id,row.date,row.amount,row.description||row.merchant,row.account,row.currency,row.category,row.planningClass,!!row.planningReviewed]))}
function periodMonths(from,to){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(from)||!/^\d{4}-(0[1-9]|1[0-2])$/.test(to))throw new Error('Selecciona el periodo que has importado.');const begin=new Date(`${from}-01T12:00:00Z`),end=new Date(`${to}-01T12:00:00Z`);if(begin.toISOString().slice(0,7)!==from||end.toISOString().slice(0,7)!==to)throw new Error('Periodo no válido.');const months=(end.getUTCFullYear()-begin.getUTCFullYear())*12+end.getUTCMonth()-begin.getUTCMonth()+1;if(months<1||months>120)throw new Error('Selecciona entre 1 y 120 meses.');return months;}
export function analyze(rows,{from,to,coverageConfirmed=false,manual=null}={}){
  if(!rows.length)throw new Error('Importa un extracto antes de crear un plan.');
  const months=periodMonths(from,to),inPeriod=rows.filter(row=>row.date.slice(0,7)>=from&&row.date.slice(0,7)<=to);
  if(!inPeriod.length)throw new Error('No hay movimientos en ese periodo.');
  const pending=inPeriod.filter(row=>!row.planningReviewed||!validKind(row));
  const sum=key=>round(inPeriod.filter(row=>row.planningClass===key&&row.planningReviewed).reduce((s,row)=>s+Math.abs(row.amount),0)/months);
  let baseline={income:sum('income'),fixed:sum('fixed'),variable:sum('variable'),subscriptions:sum('subscription')};
  const warnings=[];
  if(pending.length)throw new Error('Revisa la clasificación de los movimientos pendientes.');
  if(manual){for(const key of ['income','fixed','variable','subscriptions']){if(manual[key]===''||manual[key]===undefined||!Number.isFinite(Number(manual[key]))||Number(manual[key])<0||Number(manual[key])>1e9)throw new Error('Completa los cuatro importes mensuales.');baseline[key]=round(Number(manual[key]));}if(!manual.confirmed)throw new Error('Confirma los importes mensuales que has indicado.');warnings.push('Los importes mensuales los has definido tú; no son una estimación del extracto.');}
  else {if(!coverageConfirmed)throw new Error('Confirma que el periodo incluye todas tus cuentas e ingresos y gastos.');const importedMonths=new Set(inPeriod.map(row=>row.date.slice(0,7)));if(importedMonths.size<months)throw new Error('Faltan meses del periodo. Importa los extractos o indica tus importes mensuales.');}
  if(months<3&&!manual)warnings.push('Menos de tres meses: la estimación puede variar mucho.');
  if(!baseline.income)throw new Error('No hay ingresos habituales confirmados. Revisa los ingresos o indica tu presupuesto mensual.');
  const capacity=round(baseline.income-baseline.fixed-baseline.variable-baseline.subscriptions);
  return {...baseline,capacity,months,from,to,manual:!!manual,warnings,transactions:inPeriod.length,oneoff:sum('oneoff'),fingerprint:dataSignature(rows)};
}
function monthISO(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
export function nextContribution(today=new Date()){return new Date(today.getFullYear(),today.getMonth()+1,1,12)}
export function buildPlan(analysis,goal,{buffer=0,desired=null,today=new Date(),currency='EUR'}={}){
  if(!goal?.name?.trim()||!Number.isFinite(Number(goal.target))||Number(goal.target)<=0||Number(goal.target)>1e9||!Number.isFinite(Number(goal.current))||Number(goal.current)<0)throw new Error('Completa el objetivo, el importe y el ahorro actual.');
  if(goal.currency&&goal.currency!==currency)throw new Error('El objetivo y los extractos deben usar la misma moneda.');
  const date=normalizeDate(goal.date),deadline=new Date(date+'T12:00:00'),first=nextContribution(today);
  if(deadline<first)throw new Error('Elige una fecha a partir de la próxima aportación mensual.');
  if(!Number.isFinite(Number(buffer))||Number(buffer)<0||Number(buffer)>1e9)throw new Error('Indica un colchón mensual válido.');
  const remaining=Math.max(0,cents(goal.target)-cents(goal.current));
  const months=(deadline.getFullYear()-first.getFullYear())*12+deadline.getMonth()-first.getMonth()+1;
  const required=Math.ceil(remaining/months)/100,capacity=Math.max(0,(cents(analysis.capacity)-cents(buffer))/100);
  if(remaining===0)return {goal:{...goal},analysis,buffer:Number(buffer),capacity,required:0,alternatives:[],complete:true,createdAt:today.toISOString(),fingerprint:analysis.fingerprint};
  if(capacity<=0)throw new Error('No queda capacidad de ahorro. Ajusta el presupuesto o el colchón antes de generar un plan.');
  const contribution=desired===null||desired===''?required:Number(desired);
  if(!Number.isFinite(contribution)||contribution<=0||contribution>1e9)throw new Error('Indica una aportación mensual positiva.');
  const amounts=[Math.min(contribution*.75,capacity*.5),Math.min(contribution,capacity*.8),Math.min(Math.max(contribution*1.25,required),capacity)].map(value=>Math.floor(value*100)/100);
  const alternatives=amounts.map((monthly,index)=>{
    if(monthly<=0)return null;
    const count=Math.ceil(remaining/cents(monthly)),finish=new Date(first.getFullYear(),first.getMonth()+count-1,1,12);
    if(count>600)return null;
    const points=Array.from({length:Math.min(count,60)+1},(_,i)=>({month:i,value:Math.min(cents(goal.target),cents(goal.current)+cents(monthly)*i)/100}));
    return {id:['flexible','balanced','fast'][index],name:['Más flexible','Equilibrada','Más rápida'][index],monthly,count,finish:monthISO(finish),onTime:finish<=deadline,margin:round(capacity-monthly),points};
  }).filter(Boolean).filter((option,index,all)=>all.findIndex(other=>other.monthly===option.monthly)===index);
  if(!alternatives.length)throw new Error('La aportación no permite un plazo razonable. Ajusta el objetivo o el presupuesto.');
  return {goal:{...goal},analysis,buffer:Number(buffer),capacity,required,desired:contribution,alternatives,complete:false,fingerprint:analysis.fingerprint,createdAt:today.toISOString(),firstDate:monthISO(first)};
}
