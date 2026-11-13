// Invented data only. This fixture is not a bank document.
import {PDFDocument,StandardFonts,rgb} from 'pdf-lib';
import {writeFile,mkdir} from 'node:fs/promises';
export async function createFictionalPdf({balance=true}={}){const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica);doc.setTitle('FICTIONAL TEST FIXTURE - NOT A REAL BANK STATEMENT');
const draw=(page,text,x,y,size=10)=>page.drawText(text,{x,y,size,font,color:rgb(.1,.1,.1)});
const header=(page,english=false)=>{draw(page,'FICTIONAL TEST DATA - NO REAL BANK INFORMATION',40,800,11);draw(page,english?'Date':'Data',40,730);draw(page,english?'Description':'Descriere',125,730);draw(page,'Debit',355,730);draw(page,'Credit',435,730);balance&&draw(page,english?'Balance':'Sold',515,730);};
const number=(page,s,right,y)=>draw(page,s,right-font.widthOfTextAtSize(s,10),y);
let p=doc.addPage([600,840]);header(p);draw(p,'Sold initial 1.000,00 EUR',40,760);draw(p,'02.01.2026',40,700);draw(p,'CAFENEA FICTIVA',125,700);number(p,'25,50',380,700);balance&&number(p,'974,50',550,700);draw(p,'Descriere pe mai multe linii',125,685);draw(p,'cu detalii suplimentare',125,670);draw(p,'03.01.2026',40,640);draw(p,'SALARIU FICTIV',125,640);number(p,'1.234,56',460,640);balance&&number(p,'2.209,06',550,640);draw(p,'Pagina 1 din 2',240,35);
p=doc.addPage([600,840]);header(p,true);draw(p,'05.01.2026',40,700);draw(p,'MAGAZIN INVENTAT',125,700);number(p,'100.00',380,700);balance&&number(p,'2,109.06',550,700);draw(p,'Sold final 2.109,06 EUR',40,650);draw(p,'Total debit 125,50',125,620);draw(p,'Page 2 of 2',240,35);return doc.save();}
if(process.argv[1]?.endsWith('generate-pdf.mjs')){await mkdir('tests/fixtures',{recursive:true});await writeFile('tests/fixtures/fictional-bt.pdf',await createFictionalPdf());}
