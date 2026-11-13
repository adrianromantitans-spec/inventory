import React,{useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import {motion,useReducedMotion,useDragControls} from 'motion/react';
import {X} from 'lucide-react';
import {t} from '../i18n';
export default function Sheet({children,onClose,titleId,className='',dismissOnBackdrop=true}){
  const ref=useRef(null),close=useRef(onClose),controls=useDragControls(),reduced=useReducedMotion();close.current=onClose;
  useEffect(()=>{
    const previous=document.activeElement,scroll=window.scrollY;
    const saved={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width};
    document.body.style.position='fixed';document.body.style.top=`-${scroll}px`;document.body.style.width='100%';
    const update=()=>{const viewport=window.visualViewport,height=viewport?.height||window.innerHeight;ref.current?.style.setProperty('--available-height',`${height}px`);if(ref.current?.parentElement){ref.current.parentElement.style.height=`${height}px`;ref.current.parentElement.style.top=`${viewport?.offsetTop||0}px`;ref.current.parentElement.style.bottom='auto'}};
    update();window.visualViewport?.addEventListener('resize',update);window.visualViewport?.addEventListener('scroll',update);
    const focusable=()=>[...ref.current.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex="0"]')].filter(el=>el.getClientRects().length);
    ref.current.querySelector('.close')?.focus({preventScroll:true});
    const keydown=event=>{if(event.key==='Escape'){event.preventDefault();close.current()}if(event.key==='Tab'){const list=focusable();if(!list.length){event.preventDefault();return}if(!ref.current.contains(document.activeElement)){event.preventDefault();(event.shiftKey?list.at(-1):list[0]).focus()}else if(event.shiftKey&&document.activeElement===list[0]){event.preventDefault();list.at(-1).focus()}else if(!event.shiftKey&&document.activeElement===list.at(-1)){event.preventDefault();list[0].focus()}}};
    document.addEventListener('keydown',keydown);
    return()=>{document.removeEventListener('keydown',keydown);window.visualViewport?.removeEventListener('resize',update);window.visualViewport?.removeEventListener('scroll',update);Object.assign(document.body.style,saved);window.scrollTo(0,scroll);if(previous?.isConnected)previous.focus({preventScroll:true})};
  },[]);
  return createPortal(<motion.div className="overlay native-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.16}} onClick={event=>{if(dismissOnBackdrop&&event.target===event.currentTarget)onClose()}}><motion.section ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`sheet native-sheet ${className}`} initial={reduced?{opacity:0}:{y:70,opacity:0}} animate={{y:0,opacity:1}} exit={reduced?{opacity:0}:{y:70,opacity:0}} transition={reduced?{duration:.1}:{type:'spring',damping:32,stiffness:420,mass:.65,restDelta:.5,restSpeed:10}} drag={reduced?false:'y'} dragListener={false} dragControls={controls} dragConstraints={{top:0,bottom:0}} dragElastic={{top:0,bottom:.35}} onDragEnd={(_,info)=>{if(info.offset.y>90||info.velocity.y>650)onClose()}}><div className="sheet-grip" aria-hidden="true" onPointerDown={event=>controls.start(event)}><span/></div><button className="close icon-button" aria-label={t('Cerrar')} onClick={onClose}><X size={20}/></button><div className="sheet-content">{children}</div></motion.section></motion.div>,document.body)
}
