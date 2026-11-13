import React,{useEffect,useState} from 'react';
import {animate,useMotionValue,useMotionValueEvent,useReducedMotion} from 'motion/react';
import {money} from '../finance';
import {t} from '../i18n';
export default function AnimatedMoney({value,currency,className=''}){const reduced=useReducedMotion(),count=useMotionValue(value??0),[display,setDisplay]=useState(value??0);useMotionValueEvent(count,'change',latest=>setDisplay(latest));useEffect(()=>{if(value===null)return;if(reduced){count.set(value);return}const animation=animate(count,value,{duration:.32,ease:'easeOut'});return()=>animation.stop()},[value,reduced,count]);return <span className={`animated-money ${className}`} aria-label={value===null?t('Saldo no disponible'):money(value,currency)}><span aria-hidden="true">{value===null?'—':money(display,currency)}</span></span>}
