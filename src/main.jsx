import React from 'react';
import {createRoot} from 'react-dom/client';
createRoot(document.getElementById('root')).render(
  React.createElement('div', {style:{padding:40,background:'#0c0d14',color:'#eee',minHeight:'100vh',fontFamily:'system-ui'}},
    React.createElement('h1', null, 'Aura'),
    React.createElement('p', null, 'Actualizando la interfaz. Vuelve a cargar en unos minutos.'),
    React.createElement('p', {style:{color:'#9393a6',fontSize:14}}, 'Modernización de tarjetas y transiciones en curso.')
  )
);
