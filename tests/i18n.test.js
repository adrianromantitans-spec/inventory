import {test} from 'node:test';import assert from 'node:assert/strict';
import {t,setLanguage,locale} from '../src/i18n.js';
const documentMock={documentElement:{lang:'es'}};
test('navigation and importer translate in three languages while category keys stay canonical',()=>{globalThis.document=documentMock;setLanguage('en');assert.equal(t('Movimientos'),'Transactions');assert.equal(t('Confirmar importación'),'Confirm import');assert.equal(locale(),'en-GB');setLanguage('ro');assert.equal(t('Movimientos'),'Tranzacții');assert.equal(t('Confirmar importación'),'Confirmă importul');assert.equal(locale(),'ro-RO');setLanguage('es');assert.equal(t('Movimientos'),'Movimientos');assert.equal(t(123),123);delete globalThis.document});
