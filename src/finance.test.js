import {test} from 'node:test';import assert from 'node:assert/strict';import {totals,groupExpenses,projection,goalMonthly} from './finance.js';
test('ingresos y gastos no se compensan incorrectamente',()=>assert.deepEqual(totals([{amount:2500},{amount:-100},{amount:-50}]),{income:2500,expenses:150}));
test('categorías excluyen ingresos',()=>assert.deepEqual(groupExpenses([{category:'Comida',amount:-20},{category:'Comida',amount:-30},{category:'Nómina',amount:100}]),[{name:'Comida',value:50}]));
test('proyecciones sin rentabilidad inventada',()=>assert.equal(projection(500,100)[2].value,7200));
test('objetivo completado no necesita aportación',()=>assert.equal(goalMonthly({target:100,current:120,date:'2027-01-01'}),0));
