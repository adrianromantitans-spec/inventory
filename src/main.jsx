import { t, text, locale, useLanguage, setLanguage } from './i18n';
import StatementImporter from './StatementImporter';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { LayoutDashboard, Wallet, ArrowLeftRight, ChartNoAxesCombined, PiggyBank, Settings, ArrowUpRight, ArrowDownLeft, ChevronRight, ChevronLeft, Plus, X, Search, Bell, RefreshCw, ShieldCheck, ChevronDown, Wifi, ShoppingBag, Coffee, Car, House, Music, Utensils, Ellipsis, ArrowRight, Target, TrendingUp, Check, Lock, Eye, EyeOff, Download, LogOut } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { transactions as initial, month, categories, cards } from './data';
import { money, setCurrency, totals, groupExpenses, projection, goalMonthly } from './finance';
import './style.css';
const icons = {
  Supermercado: ShoppingBag,
  Restaurantes: Coffee,
  Transporte: Car,
  Facturas: House,
  Suscripciones: Music,
  Compras: ShoppingBag
};
const colors = ['#a992ff', '#6a94ff', '#f9bd79', '#70d6c1', '#ef8fb2', '#999aaa', '#6fd0ed', '#c6db86'];
function usePersist(key, def) {
  const [v, set] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aura-demo-' + key)) ?? def;
    } catch {
      return def;
    }
  });
  useEffect(() => {
    localStorage.setItem('aura-demo-' + key, JSON.stringify(v));
  }, [v, key]);
  return [v, set];
}
const nav = [['Inicio', LayoutDashboard], ['Tarjetas', Wallet], ['Movimientos', ArrowLeftRight], ['Estadísticas', ChartNoAxesCombined], ['Ahorros', PiggyBank], ['Ajustes', Settings]];
function App() {
  const language = useLanguage();
  const [importOpen, setImportOpen] = useState(false),
    [localData, setLocalData] = useState({
      rows: [],
      currency: 'EUR'
    }),
    [sourceMode, setSourceMode] = useState('demo');
  const [page, setPage] = useState('Inicio'),
    [demoRows, setDemoRows] = usePersist('transactions', initial),
    [goals, setGoals] = usePersist('goals', [{
      id: 1,
      name: 'Un viaje inolvidable',
      target: 3000,
      current: 1850,
      date: '2027-08-01',
      emoji: '✈'
    }, {
      id: 2,
      name: 'Fondo de tranquilidad',
      target: 10000,
      current: 4200,
      date: '2028-01-01',
      emoji: '◈'
    }]),
    [saving, setSaving] = usePersist('saving', 500),
    [budget, setBudget] = usePersist('budget', 2200),
    [limits, setLimits] = usePersist('limits', {}),
    [hide, setHide] = useState(false),
    [selected, setSelected] = useState(null),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(''),
    [sync, setSync] = useState(false),
    [last, setLast] = useState(new Date()),
    [period, setPeriod] = useState(month),
    [category, setCategory] = useState('Todas'),
    [search, setSearch] = useState(''),
    [kind, setKind] = useState('Todos'),
    [account, setAccount] = useState('Todas'),
    [min, setMin] = useState(''),
    [max, setMax] = useState(''),
    [from, setFrom] = useState(''),
    [until, setUntil] = useState(''),
    [extra, setExtra] = useState(100),
    [locked, setLocked] = useState(false);
  setCurrency(sourceMode === 'local' ? localData.currency : 'EUR');
  const rows = sourceMode === 'local' ? localData.rows : demoRows;
  const setRows = sourceMode === 'local' ? fn => setLocalData(d => ({
    ...d,
    rows: typeof fn === 'function' ? fn(d.rows) : fn
  })) : setDemoRows;
  const current = rows.filter(t => t.date.startsWith(period)),
    {
      income,
      expenses
    } = totals(current),
    surplus = income - expenses,
    groups = groupExpenses(current),
    totalBalance = cards.reduce((s, c) => s + c.balance, 0),
    prevPeriod = new Date(Number(period.slice(0, 4)), Number(period.slice(5)) - 2, 15).toISOString().slice(0, 7),
    previous = totals(rows.filter(t => t.date.startsWith(prevPeriod))),
    delta = previous.expenses ? (expenses / previous.expenses - 1) * 100 : 0;
  const notify = t => {
    setToast(t);
    setTimeout(() => setToast(''), 3500);
  };
  const refresh = () => {
    if (sourceMode === 'local') {
      notify(t('No hay sincronización bancaria en el modo local.'));
      return;
    }
    setSync(true);
    setTimeout(() => {
      setLast(new Date());
      setSync(false);
      notify('Datos de demostración actualizados. No se ha contactado con tu banco.');
    }, 900);
  };
  const go = p => {
    setPage(p);
    setCategory('Todas');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    navigator.vibrate?.(8);
  };
  useEffect(()=>{document.documentElement.lang=language},[language]);
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js');
  }, []);
  const filtered = current.filter(t => (category === 'Todas' || t.category === category) && t.merchant.toLowerCase().includes(search.toLowerCase()) && (kind === 'Todos' || (kind === 'Ingresos' ? t.amount > 0 : t.amount < 0)) && (account === 'Todas' || t.account === account) && (!min || Math.abs(t.amount) >= Number(min)) && (!max || Math.abs(t.amount) <= Number(max)) && (!from || t.date >= from) && (!until || t.date <= until));
  const trend = Array.from({
    length: 28
  }, (_, i) => ({
    day: i + 1,
    gasto: current.filter(t => Number(t.date.slice(-2)) <= i + 1 && t.amount < 0).reduce((s, t) => s - t.amount, 0)
  }));
  function Card({
    card,
    compact = false
  }) {
    return <motion.button layoutId={'card-' + card.id} className={'bank-card ' + card.style + (compact ? ' compact' : '')} onClick={() => setSelected(card)} whileHover={{
      y: -5,
      rotateX: 3,
      rotateY: -3
    }} whileTap={{
      scale: .98
    }} drag="x" dragConstraints={{
      left: 0,
      right: 0
    }} onDragEnd={(_, i) => {
      if (Math.abs(i.offset.x) > 60) setSelected(cards[card.id === 'principal' ? 1 : 0]);
    }}><div className="card-top"><span className="bank-brand"><span className="bt">{text("BT")}</span> {text(card.bank)}</span><Wifi size={23} /></div><div className="chip" /><div className="card-number">{text("•••• •••• •••• ")}{text(card.last)}</div><div className="card-bottom"><span>{text(card.name)}<small>{text("ADRIÁN ROMÁN")}</small></span><strong className="visa">{text("VISA")}</strong></div><div className="card-orbit" /></motion.button>;
  }
  function TxList({
    data,
    short = false,
    byAmount = false
  }) {
    return <div className="tx-list">{text(data.slice().sort((a, b) => byAmount ? a.amount - b.amount : b.date.localeCompare(a.date)).slice(0, short ? 5 : undefined).map((t, i) => {
        const Icon = icons[t.category] || ArrowLeftRight;
        return <motion.button key={t.id} initial={{
          opacity: 0,
          y: 8
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: Math.min(i * .035, .3)
        }} className="tx-row" onClick={() => setModal({
          type: 'transaction',
          transaction: t
        })}><span className={'merchant-icon ' + (t.amount > 0 ? 'positive' : '')}><Icon size={19} /></span><span className="tx-name">{t.merchant}<small>{text(t.category)} <span className="dot">{text("·")}</span> {text(new Date(t.date + 'T12:00:00').toLocaleDateString(locale(), {
                day: 'numeric',
                month: 'short'
              }))}</small></span><span className={'tx-amount ' + (t.amount > 0 ? 'green' : '')}>{text(t.amount > 0 ? '+' : '')}{text(money(t.amount))}<small>{text(t.account === 'principal' ? 'Cuenta principal' : t.account === 'viajes'?'Cuenta viajes':t.account)}</small></span><ChevronRight size={15} className="muted" /></motion.button>;
      }))}{text(!data.length && <p className="empty">{text("No hay movimientos que coincidan con los filtros.")}</p>)}</div>;
  }
  function Chart() {
    return <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{
          top: 10,
          right: 8,
          left: -20,
          bottom: 0
        }}><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a88cf9" stopOpacity={.3} /><stop offset="100%" stopColor="#a88cf9" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#252631" strokeDasharray="3 5" /><XAxis dataKey="day" ticks={[1, 7, 14, 21, 28]} tickLine={false} axisLine={false} stroke="#79798b" fontSize={11} /><YAxis tickFormatter={v => v + ' €'} tickLine={false} axisLine={false} stroke="#79798b" fontSize={10} /><Tooltip contentStyle={{
            background: '#232333',
            border: '1px solid #424052',
            borderRadius: 12
          }} formatter={v => [money(v), t('Gasto acumulado')]} /><Area type="monotone" dataKey="gasto" stroke="#b49aff" strokeWidth={2.5} fill="url(#fill)" /></AreaChart></ResponsiveContainer></div>;
  }
  function Goal({
    goal
  }) {
    return <button className="goal" onClick={() => setModal({
      type: 'goal',
      goal
    })}><div className="goal-top"><span className="goal-emoji">{text(goal.emoji)}</span><span>{text(Math.round(goal.current / goal.target * 100))}{text(" %")}</span></div><h3>{text(goal.name)}</h3><p><strong>{text(money(goal.current))}</strong> <span>{text("de ")}{text(money(goal.target))}</span></p><div className="progress"><i style={{
          width: Math.min(100, goal.current / goal.target * 100) + '%'
        }} /></div><small>{text(money(goalMonthly(goal)))}{text("/mes para el ")}{text(new Date(goal.date + 'T12:00').toLocaleDateString(locale(), {
          month: 'short',
          year: 'numeric'
        }))}</small></button>;
  }
  return <MotionConfig reducedMotion="user"><div className="app"><aside className="sidebar"><a className="logo" onClick={() => go('Inicio')}><span className="logo-mark">{text("Λ")}</span>{text("aura")}<span className="logo-dot">{text(".")}</span></a><div className="workspace-label">{text("TU ESPACIO PERSONAL")}</div><nav>{text(nav.map(([n, I]) => <button key={n} className={page === n ? 'active' : ''} onClick={() => go(n)}><I size={19} />{text(n)}{text(page === n && <span className="nav-dot" />)}</button>))}</nav><div className="sidebar-bottom"><div className="privacy"><ShieldCheck size={20} /><div>{text("Tu tranquilidad, primero")}<small>{text(sourceMode==='local'?'Solo en memoria':'Modo demo · sin datos bancarios')}</small></div></div><button className="profile" onClick={() => go('Ajustes')}><span className="avatar">{text("AR")}</span><span>{text("Adrián Román")}<small>{text("Espacio personal")}</small></span><Settings size={16} /></button></div></aside><main onTouchStart={e => {
        window.auraTouch = e.touches[0].clientY;
      }} onTouchEnd={e => {
        if (window.scrollY === 0 && e.changedTouches[0].clientY - window.auraTouch > 120) refresh();
      }}><header><div className="breadcrumb">{text("Mi espacio ")}<ChevronRight size={13} /> <span>{text(page)}</span></div><div className="header-actions"><select className="language-select" aria-label={t(t(t("Idioma")))} value={language} onChange={e => setLanguage(e.target.value)}><option value="es">{text("ES")}</option><option value="ro">{text("RO")}</option><option value="en">{text("EN")}</option></select><span className="demo-pill"><span /> {text(sourceMode === 'local' ? 'Importación local' : 'DEMOSTRACIÓN')}</span><button className="icon-button" aria-label={t(t("Notificaciones"))} onClick={() => setModal({
              type: 'notifications'
            })}><Bell size={19} /><i /></button><button className="avatar small-avatar" onClick={() => go('Ajustes')}>{text("AR")}</button></div></header><div className="content"><div className="page-heading"><div><div className="eyebrow">{text("TU DINERO, EN EQUILIBRIO")}</div><h1>{text(page === 'Inicio' ? 'Un buen día para avanzar.' : page)}</h1><p>{text({
                  Inicio: 'Todo lo que necesitas para cuidar de tu futuro.',
                  Tarjetas: 'Tu día a día, en una sola cartera.',
                  Movimientos: 'Cada movimiento cuenta.',
                  Estadísticas: 'Entiende tus hábitos. Decide con claridad.',
                  Ahorros: 'Haz espacio para lo que de verdad importa.',
                  Ajustes: 'Tu espacio, a tu manera.'
                }[page])}</p></div><div className="heading-actions"><button className="period" onClick={() => setModal({
                type: 'period'
              })}>{text(new Date(period + '-15').toLocaleDateString(locale(), {
                  month: 'long',
                  year: 'numeric'
                }))}<ChevronDown size={14} /></button><button className="icon-button" onClick={refresh} aria-label={t(t("Actualizar demostración"))}><RefreshCw size={17} className={sync ? 'spin' : ''} /></button></div></div>{text(sourceMode === 'local' && <div className="notice local-mode"><div>{t('Datos locales importados, separados de la demostración. Se borran al recargar.')}<br />{t('Los saldos de las tarjetas pertenecen a la demo, no al extracto.')}</div><button className="secondary" onClick={() => setSourceMode('demo')}>{t('Volver a demo')}</button><button className="danger" onClick={() => {
              setLocalData({
                rows: [],
                currency: 'EUR'
              });
              setSourceMode('demo');
            }}>{t('Vaciar importaciones')}</button></div>)}
<AnimatePresence mode="wait"><motion.div key={page} initial={{
              opacity: 0,
              y: 12
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -8
            }} transition={{
              duration: .22
            }}>
{text(page === 'Inicio' && <>{text(sourceMode === 'demo' && <div className="overview-grid"><section className="panel balance-panel"><div className="panel-caption">{text("Balance total ")}<button aria-label={t("Ocultar saldo")} onClick={() => setHide(!hide)}>{text(hide ? <EyeOff size={16} /> : <Eye size={16} />)}</button><span className="currency">{text("EUR ")}<ChevronDown size={11} /></span></div><div className="balance">{text(sourceMode === 'local' ? '—' : hide ? '••••••' : money(totalBalance))}</div><div className="balance-note"><span className="green"><TrendingUp size={14} /> {text(money(surplus))}</span>{text(" flujo neto del mes")}</div><div className="balance-divider" /><div className="income-expense"><div><span className="circle-icon green"><ArrowDownLeft size={17} /></span><span><small>{text("Ingresos")}</small><strong>{text(money(income))}</strong></span></div><div><span className="circle-icon peach"><ArrowUpRight size={17} /></span><span><small>{text("Gastos")}</small><strong>{text(money(expenses))}</strong></span></div></div><div className="sync-note"><span className="status-dot" />{text("Datos ficticios ")}<span>{text("·")}</span> {text(sync ? 'Actualizando demo…' : 'Actualizado ' + last.toLocaleTimeString(locale(), {
                        hour: '2-digit',
                        minute: '2-digit'
                      }))}</div></section><section className="wallet-preview"><div className="section-title"><h2>{text("Tu cartera ")}<span>{text("2")}</span></h2><button onClick={() => go('Tarjetas')}>{text("Ver tarjetas ")}<ArrowUpRight size={15} /></button></div><Card card={cards[0]} compact /><div className="wallet-dots"><i className="active" /><i /> <span>{text("Desliza para explorar")}</span></div></section><section className="panel savings-teaser"><span className="teaser-icon"><PiggyBank size={23} /></span><span className="pill">{text("PASO A PASO")}</span><h2>{text("Tu futuro empieza")}<br />{text("con un pequeño hábito.")}</h2><p>{text("Este mes, reserva un poco")}<br />{text("para lo que viene.")}</p><div className="teaser-value">{text(money(saving))}<small>{text("/ mes")}</small></div><button className="primary" onClick={() => go('Ahorros')}>{text("Mi plan de ahorro ")}<ArrowUpRight size={17} /></button></section></div>)}<div className="middle-grid"><section className="panel"><div className="section-title"><div><h2>{text("Así va tu mes")}</h2><p>{text("Un vistazo a tus gastos acumulados")}</p></div><span className="legend"><i />{text(" Gastos")}</span></div><div className="chart-summary"><strong>{text(money(expenses))}</strong><span className="green">{text(delta.toFixed(1))}{text(" %")}</span><small>{text("vs. mes anterior")}</small></div><Chart /></section><section className="panel distribution"><div className="section-title"><h2>{text("¿A dónde va tu dinero?")}</h2><button aria-label={t("Ver estadísticas")} onClick={() => go('Estadísticas')}><ArrowUpRight size={18} /></button></div><div className="donut-wrap"><ResponsiveContainer width="100%" height={180}><PieChart><Pie data={groups} dataKey="value" innerRadius={62} outerRadius={77} paddingAngle={4} stroke="none" onClick={d => {
                            go('Movimientos');
                            setCategory(d.name);
                          }}>{text(groups.map((g, i) => <Cell key={g.name} fill={colors[i % colors.length]} />))}</Pie><Tooltip formatter={(v,name) => [money(v),t(name)]} contentStyle={{
                            background: '#202131',
                            border: 'none',
                            borderRadius: 10
                          }} /></PieChart></ResponsiveContainer><div className="donut-label"><small>{text("Gasto total")}</small><strong>{text(money(expenses))}</strong></div></div><div className="category-legend">{text(groups.slice(0, 4).map((g, i) => <button key={g.name} onClick={() => {
                        go('Movimientos');
                        setCategory(g.name);
                      }}><i style={{
                          background: colors[i]
                        }} />{text(g.name)}<strong>{text(money(g.value))}</strong></button>))}</div></section></div><div className="bottom-grid"><section className="panel"><div className="section-title"><h2>{text("Últimos movimientos")}</h2><button onClick={() => go('Movimientos')}>{text("Ver todos ")}<ArrowRight size={15} /></button></div><TxList data={current} short /></section><section className="panel goals-panel"><div className="section-title"><h2>{text("Pequeños pasos, grandes metas")}</h2><button aria-label={t("Crear objetivo")} onClick={() => setModal({
                        type: 'goal'
                      })}><Plus size={19} /></button></div>{text(goals.slice(0, 2).map(g => <Goal key={g.id} goal={g} />))}</section></div></>)}
{text(page === 'Tarjetas' && <><div className="notice"><ShieldCheck size={18} />{text(" Cartera de demostración. Estas tarjetas no están conectadas a una cuenta bancaria.")}</div><div className="cards-grid">{text(cards.map(c => <div key={c.id}><Card card={c} /><div className="card-balance"><span>{text("Saldo de la cuenta")}</span><strong>{text(money(c.balance,'EUR'))}</strong></div></div>))}</div><section className="panel"><div className="section-title"><h2>{text("Conecta con tu tranquilidad")}</h2><ShieldCheck /></div><p>{text("La conexión de solo lectura con Banca Transilvania requiere un proveedor Open Banking autorizado.")}</p><button className="secondary" onClick={() => go('Ajustes')}>{text("Ver estado de conexión ")}<ArrowRight size={16} /></button></section></>)}
{text(page === 'Movimientos' && <section className="panel"><div className="section-title"><h2>{text(sourceMode === 'local' ? 'Importados' : 'Movimientos')}</h2><button className="secondary" onClick={() => setImportOpen(true)}>{t('Importar extracto')}</button></div><div className="filter-bar"><label className="search"><Search size={17} /><input aria-label={t("Buscar comercio")} value={search} onChange={e => setSearch(e.target.value)} placeholder={t("Buscar un movimiento…")} /></label><select aria-label={t("Categoría")} value={category} onChange={e => setCategory(e.target.value)}><option value="Todas">{text("Todas")}</option>{text(categories.map(c => <option key={c} value={c}>{text(c)}</option>))}</select><select aria-label={t("Tipo")} value={kind} onChange={e => setKind(e.target.value)}>{text(['Todos', 'Ingresos', 'Gastos'].map(c => <option key={c} value={c}>{text(c)}</option>))}</select><select aria-label={t("Cuenta")} value={account} onChange={e => setAccount(e.target.value)}><option value="Todas">{text("Todas")}</option>{text([...new Set(rows.map(r=>r.account))].map(id=><option key={id} value={id}>{text(id==='principal'?'Principal':id==='viajes'?'Viajes':id)}</option>))}</select></div><div className="filter-bar"><label>{text("Desde")}<input aria-label={t("Desde")} type="date" value={from} onChange={e => setFrom(e.target.value)} /></label><label>{text("Hasta")}<input aria-label={t("Hasta")} type="date" value={until} onChange={e => setUntil(e.target.value)} /></label><input aria-label={t("Importe mínimo")} type="number" min="0" placeholder={t("Mínimo €")} value={min} onChange={e => setMin(e.target.value)} /><input aria-label={t("Importe máximo")} type="number" min="0" placeholder={t("Máximo €")} value={max} onChange={e => setMax(e.target.value)} /></div><p className="muted">{text(filtered.length)}{text(" movimientos · Resultado neto: ")}{text(money(filtered.reduce((s, t) => s + t.amount, 0)))}</p><TxList data={filtered} /></section>)}
{text(page === 'Estadísticas' && <><div className="stats-grid">{text([['Ingresos', income], ['Gastos', expenses], ['Flujo neto', surplus], ['Media diaria', expenses / new Date(Number(period.slice(0, 4)), Number(period.slice(5)), 0).getDate()]].map(([n, v]) => <section className="panel" key={n}><small>{text(n)}</small><h2 className="stat-number">{text(money(v))}</h2></section>))}</div><div className="middle-grid"><section className="panel"><h2>{text("Evolución de gastos")}</h2><Chart /><p>{text("Gasto acumulado por día del mes seleccionado.")}</p></section><section className="panel"><h2>{text("Comparación mensual")}</h2><div className="chart"><ResponsiveContainer><BarChart data={[{
                          name: t('Anterior'),
                          gastos: previous.expenses,
                          ingresos: previous.income
                        }, {
                          name: t('Seleccionado'),
                          gastos: expenses,
                          ingresos: income
                        }]}><XAxis dataKey="name" stroke="#999" /><Tooltip formatter={(v,name) => [money(v),t(name)]} contentStyle={{
                            background: '#242332',
                            border: 0
                          }} /><Bar dataKey="gastos" name={t("Gastos")} fill="#aa91ff" radius={[6, 6, 0, 0]} /><Bar dataKey="ingresos" name={t("Ingresos")} fill="#74d4b5" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section></div><div className="middle-grid"><section className="panel"><h2>{text("Gastos por categoría")}</h2>{text(groups.map((g, i) => <button className="category-row" key={g.name} onClick={() => {
                      go('Movimientos');
                      setCategory(g.name);
                    }}><div><span>{text(g.name)}</span><strong>{text(money(g.value))}</strong></div><div className="progress"><i style={{
                          width: g.value / expenses * 100 + '%',
                          background: colors[i % colors.length]
                        }} /></div></button>))}</section><section className="panel"><h2>{text("Lo que dicen tus números")}</h2><div className="insight"><TrendingUp /><h3>{text(previous.expenses ? `${Math.abs(delta).toFixed(1)} % ${t(delta <= 0 ? 'menos' : 'más')} ${t('de gasto')}` : 'Sin comparación disponible')}</h3><p>{text(previous.expenses ? `(${money(expenses)} ÷ ${money(previous.expenses)} − 1) × 100. Compara meses completos de datos demo.` : 'No hay movimientos en el mes anterior.')}</p></div><div className="insight"><Music /><h3>{text(current.filter(t => t.category === 'Suscripciones').length)}{text(" suscripciones, ")}{text(money(-current.filter(t => t.category === 'Suscripciones').reduce((s, t) => s + t.amount, 0)))}</h3><p>{text("Suma de los cargos clasificados como suscripciones. Revisa los movimientos para confirmar su recurrencia.")}</p></div><h3>{text("Mayores gastos")}</h3><TxList byAmount data={current.filter(t => t.amount < 0).sort((a, b) => a.amount - b.amount).slice(0, 3)} /></section></div><div className="middle-grid"><section className="panel"><h2>{text("Gasto por semana")}</h2><div className="chart"><ResponsiveContainer><BarChart data={[0, 1, 2, 3, 4].map(w => ({
                          name: t('Semana ') + (w+1),
                          gasto: -current.filter(t => t.amount < 0 && Math.floor((Number(t.date.slice(-2)) - 1) / 7) === w).reduce((s, t) => s + t.amount, 0)
                        }))}><XAxis dataKey="name" stroke="#999" fontSize={10} /><Tooltip formatter={(v,name) => [money(v),t(name)]} contentStyle={{
                            background: '#242332',
                            border: 0
                          }} /><Bar dataKey="gasto" name={t("Gastos")} fill="#a992ff" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section><section className="panel"><h2>{text("Pagos recurrentes identificados")}</h2><p>{text("Cargos marcados como recurrentes en la muestra demo.")}</p><TxList data={current.filter(t => t.recurring)} /></section></div><section className="panel"><h2>{text("Gasto por comercio")}</h2>{text(Object.entries(current.filter(t => t.amount < 0).reduce((a, t) => (a[t.merchant] = (a[t.merchant] || 0) - t.amount, a), {})).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => <div className="setting-row" key={name}><span>{text(name)}</span><strong>{text(money(value))}</strong></div>))}</section></>)}
{text(page === 'Ahorros' && <><div className="middle-grid"><section className="panel savings-plan"><span className="eyebrow">{text("DISEÑA TU FUTURO")}</span><h2>{text("Un hábito que crece contigo.")}</h2><p>{text("Elige una aportación mensual. No se realiza ningún movimiento de dinero.")}</p><div className="saving-big">{text(money(saving))}<small>{text("/ mes")}</small></div><input aria-label={t("Ahorro mensual")} type="range" min="0" max={Math.max(2000, income)} step="10" value={saving} onChange={e => setSaving(+e.target.value)} /><div className="range-label"><span>{text("0 €")}</span><span>{text(money(Math.max(2000, income)))}</span></div><div className="strategies">{text([['Conservadora', .1], ['Equilibrada', .2], ['Ambiciosa', .3]].map(([n, p]) => <button key={n} className={saving === income * p ? 'selected' : ''} onClick={() => setSaving(Math.round(income * p))}>{text(n)}<small>{text(p * 100)}{text(" % de ingresos")}</small></button>))}</div><label>{text("Aportación personalizada")}<input type="number" min="0" max="1000000" required value={saving} onChange={e => setSaving(Math.max(0, Math.min(1000000, +e.target.value)))} /></label><p className={saving > surplus ? 'warning' : 'green'}>{text(saving > surplus ? 'El objetivo supera tu excedente mensual de ' + money(surplus) : 'Disponible tras gastos y ahorro: ' + money(surplus - saving))}</p><small>{text("Porcentajes ilustrativos, sin rentabilidad ni asesoramiento financiero.")}</small></section><section className="panel"><h2>{text("Imagina lo que puedes conseguir")}</h2><p>{text("Si reduces tus gastos cada mes…")}</p><label>{text("Reducción mensual adicional ")}<strong>{text(money(extra))}</strong><input aria-label={t("Reducción mensual")} type="range" min="0" max="500" step="10" value={extra} onChange={e => setExtra(+e.target.value)} /></label><div className="projection-grid">{text(projection(saving, extra).map(p => <div key={p.months}><small>{text("En ")}{text(p.months)}{text(" meses")}</small><strong>{text(money(p.value))}</strong></div>))}</div><p className="muted">{text("Cálculo: (")}{text(money(saving))}{text(" + ")}{text(money(extra))}{text(") × meses. Proyección hipotética sin intereses.")}</p></section></div><div className="section-title"><h2>{text(sourceMode==='local'?'Objetivos de demostración':'Tus próximas grandes cosas')}</h2><button className="secondary" onClick={() => setModal({
                    type: 'goal'
                  })}><Plus size={16} />{text(" Nuevo objetivo")}</button></div><div className="goal-grid">{text(goals.map(g => <Goal key={g.id} goal={g} />))}</div><section className="panel budget"><div className="section-title"><h2>{text("Presupuesto mensual")}</h2><span>{text(money(Math.max(0, budget - expenses)))}{text(" disponibles")}</span></div><label>{text("Límite total (€)")}<input type="number" min="0" value={budget} onChange={e => setBudget(Math.max(0, +e.target.value))} /></label><div className="budget-ring" style={{
                    background: `conic-gradient(#b39bff ${Math.min(100, expenses / (budget || 1) * 100)}%,#2b2b3e 0)`
                  }}><span>{text(Math.round(expenses / (budget || 1) * 100))}{text(" %")}<small>{text("del presupuesto")}</small></span></div>{text(expenses > budget && <p className="warning">{text("Has superado el presupuesto en ")}{text(money(expenses - budget))}{text(".")}</p>)}{text(groups.map(g => <div className="budget-category" key={g.name}><label>{text(g.name)}<input aria-label={t('Presupuesto ' + g.name)} type="number" min="0" placeholder={t("Sin límite")} value={limits[g.name] ?? ''} onChange={e => setLimits({
                        ...limits,
                        [g.name]: e.target.value
                      })} /></label><small className={limits[g.name] && g.value > Number(limits[g.name]) * .9 ? 'warning' : ''}>{text(money(g.value))}{text(" gastados")}{text(limits[g.name] ? ' de ' + money(Number(limits[g.name])) : '')}</small></div>))}{text(sourceMode === 'demo' && <><h3>{text("Estimación de cierre")}</h3><p>{text(money(totalBalance + surplus))}{text(" · Saldo demo actual + ingresos − gastos del mes seleccionado. Escenario ilustrativo: no representa un saldo futuro confirmado ni contempla cargos desconocidos.")}</p></>)}</section></>)}
{text(page === 'Ajustes' && <div className="settings-grid"><section className="panel"><h2>{t('Importación local')}</h2><p>{t('El archivo se procesa solo en tu navegador. No se envía a ningún servidor. Los movimientos importados no se guardan en localStorage y se borran al recargar.')}</p><button className="secondary" onClick={() => setImportOpen(true)}>{t('Importar extracto')}</button></section><section className="panel"><div className="section-title"><h2>{text("Conexiones bancarias")}</h2><ShieldCheck /></div><div className="connection"><span className="bt">{text("BT")}</span><div><h3>{text("Banca Transilvania")}</h3><p>{text("Sin conexión · Solo demostración")}</p></div></div><div className="notice">{text("La integración real está deshabilitada. Es necesario configurar un proveedor autorizado en el servidor, autenticación y consentimiento de solo lectura.")}</div><button className="secondary" onClick={() => setModal({
                    type: 'bank'
                  })}>{text("Cómo conectar mi banco ")}<ArrowUpRight size={16} /></button><p>{text("No solicitamos contraseñas bancarias, números completos de tarjeta ni CVV.")}</p></section><section className="panel"><h2>{text("Privacidad y seguridad")}</h2><div className="setting-row"><span>{text("Datos utilizados")}</span><span className="green">{text(sourceMode==='local'?'Importados':'Ficticios')}</span></div><div className="setting-row"><span>{text("Almacenamiento")}</span><span>{text(sourceMode==='local'?'Solo en memoria':'Local · solo demo')}</span></div><p>{text("El modo demo no incluye autenticación real ni almacena datos bancarios. Para producción se requiere una sesión segura y cifrado en el servidor. La biometría requiere WebAuthn, HTTPS y verificación del servidor.")}</p><button className="secondary" onClick={() => setLocked(true)}><Lock size={16} />{text(" Bloquear vista demo")}</button></section><section className="panel"><h2>{text("Tus datos de demostración")}</h2><p>{text("Exporta los movimientos ficticios o restaura la experiencia inicial.")}</p><button className="secondary" onClick={() => {
                    const blob = new Blob([JSON.stringify({
                      mode: 'demo',
                      transactions: demoRows,
                      goals
                    }, null, 2)], {
                      type: 'application/json'
                    });
                    const u = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = u;
                    a.download = 'aura-demostracion.json';
                    a.click();
                    URL.revokeObjectURL(u);
                    notify('Exportación de datos demo completada');
                  }}><Download size={16} />{text(" Exportar demo")}</button><button className="danger" onClick={() => setModal({
                    type: 'reset'
                  })}>{text("Restablecer datos demo")}</button></section><section className="panel"><h2>{text("Siempre a mano")}</h2><p>{text("Instala Aura desde el menú del navegador. En iPhone: Compartir → Añadir a pantalla de inicio. En Android: menú → Instalar aplicación.")}</p><span className="pill">{text("EUR · ESPAÑOL · MODO OSCURO")}</span></section></div>)}
</motion.div></AnimatePresence><footer><span className="footer-brand">{text("Λ aura")}</span><span>{text("Un poco más cerca de lo que importa.")}</span><span><ShieldCheck size={13} />{text(" Espacio de demostración")}</span></footer></div></main><nav className="mobile-nav">{text(nav.map(([n, I]) => <button key={n} className={page === n ? 'active' : ''} onClick={() => go(n)}><I size={20} /><span>{text(n)}</span></button>))}</nav>
<AnimatePresence>{text(selected && <motion.div className="overlay" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} onClick={() => setSelected(null)}><motion.section className="sheet card-sheet" onClick={e => e.stopPropagation()} drag="y" dragConstraints={{
            top: 0,
            bottom: 0
          }} onDragEnd={(_, i) => {
            if (i.offset.y > 100) setSelected(null);
          }}><button className="back" onClick={() => setSelected(null)}><ChevronLeft size={18} />{text(" Volver a mi cartera")}</button><Card card={selected} /><h2>{text(selected.name)}</h2><small>{text("Saldo de cuenta · demostración")}</small><div className="saving-big">{text(money(selected.balance,'EUR'))}</div><TxList data={(sourceMode==='local'?demoRows:current).filter(t => t.account === selected.id)} short /><Chart /></motion.section></motion.div>)}</AnimatePresence>
{text(importOpen && <StatementImporter existing={localData.rows} currency={localData.currency} onClose={() => setImportOpen(false)} onConfirm={result => {
        setLocalData({
          rows: result.rows,
          currency: result.currency
        });
        setSourceMode('local');
        setPage('Movimientos');
        setCategory('Todas');
        setSearch('');
        setKind('Todos');
        setAccount('Todas');
        setFrom('');
        setUntil('');
        setMin('');
        setMax('');
        if (result.rows.length) setPeriod(result.rows.map(r => r.date.slice(0, 7)).sort().at(-1));
        setImportOpen(false);
        notify(`${t('Importación confirmada')} · ${t('Añadidos')}: ${result.added} · ${t('Duplicados omitidos')}: ${result.duplicates}`);
      }} />)}
{text(modal && <div className="overlay" onClick={() => setModal(null)}><motion.section initial={{
          y: 30,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} className="sheet" onClick={e => e.stopPropagation()}><button className="close icon-button" aria-label={t("Cerrar")} onClick={() => setModal(null)}><X size={20} /></button>{text(modal.type === 'goal' && <form onSubmit={e => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            const g = {
              id: modal.goal?.id || Date.now(),
              name: d.get('name'),
              target: +d.get('target'),
              current: +d.get('current'),
              date: d.get('date'),
              emoji: modal.goal?.emoji || '✧'
            };
            setGoals(gs => [...gs.filter(x => x.id !== g.id), g]);
            setModal(null);
            notify('Objetivo guardado');
          }}><h2>{text(modal.goal ? 'Tu objetivo' : 'Algo que te ilusiona')}</h2><label>{text("Nombre")}<input name="name" required maxLength="60" defaultValue={modal.goal?.name} placeholder={t("Mi próximo viaje")} /></label><label>{text("Importe objetivo (€)")}<input name="target" type="number" min="1" max="10000000" step=".01" required defaultValue={modal.goal?.target} /></label><label>{text("Ahorro actual (€)")}<input name="current" type="number" min="0" max="10000000" step=".01" required defaultValue={modal.goal?.current || 0} /></label><label>{text("Fecha objetivo")}<input name="date" type="date" required defaultValue={modal.goal?.date} /></label><button className="primary">{text("Guardar objetivo ")}<Check size={16} /></button>{text(modal.goal && <button type="button" className="danger" onClick={() => {
              setGoals(goals.filter(g => g.id !== modal.goal.id));
              setModal(null);
            }}>{text("Eliminar objetivo")}</button>)}</form>)}{text(modal.type === 'transaction' && <><div className="eyebrow">{text(sourceMode==='local'?'Detalle del movimiento local':'DETALLE DEL MOVIMIENTO DEMO')}</div><h2>{modal.transaction.merchant}</h2><div className="saving-big">{text(money(modal.transaction.amount))}</div><p>{text(modal.transaction.date)}{text(" · ")}{text(modal.transaction.type)}</p><p>{text("Cuenta ")}{text(modal.transaction.account)}{text(" · ID ")}{text(modal.transaction.id)}</p><label>{text("Corregir categoría")}<select value={rows.find(t => t.id === modal.transaction.id)?.category} onChange={e => setRows(rows.map(t => t.id === modal.transaction.id ? {
                ...t,
                category: e.target.value
              } : t))}>{text(categories.map(c => <option key={c} value={c}>{text(c)}</option>))}</select></label><p className="muted">{text(sourceMode==='local'?'La clasificación importada se mantiene solo en memoria.':'La clasificación se guarda solo en este navegador y actualiza las estadísticas.')}</p></>)}{text(modal.type === 'period' && <><h2>{text("Elige tu mes")}</h2><label>{text("Periodo")}<input type="month" value={period} onChange={e => {
                if (e.target.value) setPeriod(e.target.value);
              }} /></label><button className="primary" onClick={() => setModal(null)}>{text("Aplicar periodo")}</button></>)}{text(modal.type === 'bank' && <><ShieldCheck size={35} /><h2>{text("Una conexión segura, a su tiempo.")}</h2><p>{text("No hay proveedor Open Banking configurado. No se puede iniciar una autorización ni sincronizar cuentas reales.")}</p><p>{text("El backend deberá verificar tu sesión, crear el consentimiento con el proveedor, validar el retorno y custodiar los tokens cifrados. Podrás revocar el acceso en cualquier momento.")}</p><button className="primary" onClick={() => setModal(null)}>{text("Entendido")}</button></>)}{text(modal.type === 'notifications' && <><Bell size={30} /><h2>{text("Todo en calma.")}</h2><p>{text(sourceMode==='local'?'Datos locales importados, separados de la demostración. Se borran al recargar.':'No tienes notificaciones nuevas. Estás explorando una demostración con datos ficticios.')}</p></>)}{text(modal.type === 'reset' && <><h2>{text("¿Volver a empezar?")}</h2><p>{text("Se eliminarán tus objetivos, clasificaciones y ajustes de esta demostración local.")}</p><button className="danger" onClick={() => {
              Object.keys(localStorage).filter(k => k.startsWith('aura-demo-')).forEach(k => localStorage.removeItem(k));
              location.reload();
            }}>{text("Sí, restablecer demo")}</button><button className="secondary" onClick={() => setModal(null)}>{text("Conservar mis datos")}</button></>)}</motion.section></div>)}{text(locked && <div className="overlay lock-overlay"><section className="sheet"><Lock size={36} /><h2>{text("Un momento para ti.")}</h2><p>{text("Vista demo bloqueada. Esta pantalla es una cortina de privacidad, no una autenticación.")}</p><button className="primary" onClick={() => setLocked(false)}>{text("Continuar en demostración")}</button></section></div>)}{text(toast && <div role="status" className="toast"><Check size={17} />{text(toast)}</div>)}</div></MotionConfig>;
}
createRoot(document.getElementById('root')).render(<App />);
