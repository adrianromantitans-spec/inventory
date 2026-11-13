import {parsePositionedPages} from './pdf-layout.js';
export async function extractPdf(file){
  if(file.size>20*1024*1024)throw new Error('El archivo supera el límite de 20 MB');
  // PDF.js and its worker are bundled locally. No CDN, upload, OCR or external API.
  const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs');
  const {default:worker}=await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc=worker;
  const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,useSystemFonts:true,disableFontFace:true});
  let doc;
  try{doc=await task.promise;if(doc.numPages>100)throw new Error('El PDF supera el límite de 100 páginas');
    const pages=[];for(let n=1;n<=doc.numPages;n++){const page=await doc.getPage(n),viewport=page.getViewport({scale:1}),content=await page.getTextContent();if(content.items.length>50000)throw new Error('El PDF es demasiado complejo');pages.push(content.items.filter(i=>i.str!==undefined).map(i=>{const [,y]=viewport.convertToViewportPoint(i.transform[4],i.transform[5]);return {text:i.str,x:i.transform[4],y,width:i.width,height:i.height}}));page.cleanup();}
    return parsePositionedPages(pages);
  }catch(error){if(error.name==='PasswordException')throw new Error('El PDF está protegido con contraseña. Desbloquéalo localmente antes de importarlo.');if(error.name==='InvalidPDFException')throw new Error('No se puede leer este PDF. Comprueba que el archivo sea válido.');throw error;}finally{await task.destroy();}
}
