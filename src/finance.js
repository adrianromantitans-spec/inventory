export const money=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
export const totals=rows=>({income:rows.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0),expenses:-rows.filter(t=>t.amount<0).reduce((s,t)=>s+t.amount,0)});
export const groupExpenses=rows=>Object.entries(rows.filter(t=>t.amount<0).reduce((a,t)=>(a[t.category]=(a[t.category]||0)-t.amount,a),{})).map(([name,value])=>({name,value:Math.round(value*100)/100})).sort((a,b)=>b.value-a.value);
export const projection=(monthly,extra=0)=>[3,6,12,24].map(months=>({months,value:(monthly+extra)*months}));
export const goalMonthly=(goal,today=new Date())=>{const end=new Date(goal.date);const months=Math.max(1,(end.getFullYear()-today.getFullYear())*12+end.getMonth()-today.getMonth());return Math.max(0,goal.target-goal.current)/months};
