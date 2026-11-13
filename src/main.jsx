import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  ChartNoAxesCombined,
  PiggyBank,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Search,
  ShieldCheck,
  ChevronDown,
  ShoppingBag,
  Coffee,
  Car,
  House,
  Music,
  ArrowRight,
  TrendingUp,
  Check,
  Download,
  Upload,
  FileText,
  Trash2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { t, locale, useLanguage, setLanguage } from "./i18n";
import { categories } from "./data";
import {
  money,
  setCurrency,
  totals,
  groupExpenses,
  projection,
  goalMonthly,
} from "./finance";
import StatementImporter from "./StatementImporter";
import "./style.css";
const nav = [
  ["Inicio", LayoutDashboard],
  ["Tarjetas", Wallet],
  ["Movimientos", ArrowLeftRight],
  ["Estadísticas", ChartNoAxesCombined],
  ["Ahorros", PiggyBank],
  ["Ajustes", Settings],
];
const icons = {
  Supermercado: ShoppingBag,
  Restaurantes: Coffee,
  Transporte: Car,
  Facturas: House,
  Suscripciones: Music,
  Compras: ShoppingBag,
};
const colors = [
  "#a992ff",
  "#6a94ff",
  "#f9bd79",
  "#70d6c1",
  "#ef8fb2",
  "#999aaa",
  "#6fd0ed",
  "#c6db86",
];
const monthName = (period) =>
  period
    ? new Date(period + "-15T12:00:00").toLocaleDateString(locale(), {
        month: "long",
        year: "numeric",
      })
    : t("Todos los periodos");
function EmptyState({
  icon: Icon = FileText,
  title = "Todavía no hay movimientos",
  description = "Importa tu primer extracto para empezar.",
  action,
  onAction,
}) {
  const hasText = title && title !== "—" && description;
  return (
    <div className={`empty-state ${hasText ? "" : "empty-state-minimal"}`}>
      <span className="empty-symbol" aria-hidden="true">
        <Icon size={hasText ? 29 : 32} />
      </span>
      {title && title !== "—" && <h2>{t(title)}</h2>}
      {description ? <p>{t(description)}</p> : null}
      {action && (
        <button className="primary" onClick={onAction} aria-label={t(action)}>
          <Upload size={16} />
          {hasText ? t(action) : null}
        </button>
      )}
    </div>
  );
}
function App() {
  const language = useLanguage();
  const [page, setPage] = useState("Inicio"),
    [rows, setRows] = useState([]),
    [currency, setUnit] = useState("EUR"),
    [snapshots, setSnapshots] = useState({}),
    [period, setPeriod] = useState(""),
    [importOpen, setImportOpen] = useState(false),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(""),
    [goals, setGoals] = useState([]),
    [saving, setSaving] = useState(0),
    [extra, setExtra] = useState(0),
    [budget, setBudget] = useState(0),
    [limits, setLimits] = useState({});
  const [category, setCategory] = useState("Todas"),
    [search, setSearch] = useState(""),
    [kind, setKind] = useState("Todos"),
    [account, setAccount] = useState("Todas"),
    [min, setMin] = useState(""),
    [max, setMax] = useState(""),
    [from, setFrom] = useState(""),
    [until, setUntil] = useState("");
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(null);
  const navNames = nav.map(([name]) => name);
  setCurrency(currency);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    // Remove the retired sample workspace; never migrate sample records into imports.
    Object.keys(localStorage)
      .filter((key) => key.startsWith("aura-demo-"))
      .forEach((key) => localStorage.removeItem(key));
    if ("serviceWorker" in navigator && import.meta.env.PROD)
      navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js");
  }, []);
  const selected = rows.filter((row) => !period || row.date.startsWith(period));
  const { income, expenses } = totals(selected),
    surplus = income - expenses,
    groups = groupExpenses(selected),
    accounts = [...new Set(rows.map((r) => r.account))];
  const priorPeriod = period
    ? new Date(Number(period.slice(0, 4)), Number(period.slice(5)) - 2, 15)
        .toISOString()
        .slice(0, 7)
    : "";
  const previousRows = priorPeriod
      ? rows.filter((r) => r.date.startsWith(priorPeriod))
      : [],
    previous = totals(previousRows);
  const delta =
    previousRows.length && previous.expenses
      ? (expenses / previous.expenses - 1) * 100
      : null;
  const filtered = selected.filter(
    (row) =>
      (category === "Todas" || row.category === category) &&
      row.merchant.toLowerCase().includes(search.toLowerCase()) &&
      (kind === "Todos" ||
        (kind === "Ingresos" ? row.amount > 0 : row.amount < 0)) &&
      (account === "Todas" || row.account === account) &&
      (!min || Math.abs(row.amount) >= Number(min)) &&
      (!max || Math.abs(row.amount) <= Number(max)) &&
      (!from || row.date >= from) &&
      (!until || row.date <= until),
  );
  const trend = period
    ? Array.from(
        {
          length: new Date(
            Number(period.slice(0, 4)),
            Number(period.slice(5)),
            0,
          ).getDate(),
        },
        (_, i) => ({
          day: String(i + 1),
          gasto: -selected
            .filter(
              (row) => row.amount < 0 && Number(row.date.slice(-2)) <= i + 1,
            )
            .reduce((s, row) => s + row.amount, 0),
        }),
      )
    : [...new Set(selected.map((r) => r.date))]
        .sort()
        .map((date) => ({
          day: date,
          gasto: -selected
            .filter((r) => r.amount < 0 && r.date <= date)
            .reduce((s, r) => s + r.amount, 0),
        }));
  const allBalancesKnown =
    accounts.length > 0 &&
    accounts.every(
      (id) => snapshots[id]?.reconciled && snapshots[id].closing !== null,
    );
  const closingBalance = allBalancesKnown
    ? accounts.reduce((s, id) => s + snapshots[id].closing, 0)
    : null;
  const days = period
    ? new Date(Number(period.slice(0, 4)), Number(period.slice(5)), 0).getDate()
    : selected.length
      ? Math.max(
          1,
          (new Date(
            [...selected]
              .map((r) => r.date)
              .sort()
              .at(-1),
          ) -
            new Date([...selected].map((r) => r.date).sort()[0])) /
            86400000 +
            1,
        )
      : 0;
  function notify(message) {
    setToast(message);
    setTimeout(() => setToast(""), 4500);
  }
  function go(next) {
    const fromIdx = navNames.indexOf(page);
    const toIdx = navNames.indexOf(next);
    if (toIdx !== -1 && fromIdx !== -1) {
      setDirection(toIdx > fromIdx ? 1 : -1);
    } else {
      setDirection(0);
    }
    setPage(next);
    setCategory("Todas");
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigator.vibrate?.(8);
  }
  function goAdjacent(delta) {
    const idx = navNames.indexOf(page);
    if (idx < 0) return;
    const next = navNames[idx + delta];
    if (next) go(next);
  }
  const onKeyNav = useCallback(
    (e) => {
      if (modal || importOpen) return;
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goAdjacent(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goAdjacent(-1);
      }
    },
    [page, modal, importOpen],
  );
  useEffect(() => {
    window.addEventListener("keydown", onKeyNav);
    return () => window.removeEventListener("keydown", onKeyNav);
  }, [onKeyNav]);
  function onTouchStart(e) {
    touchStartX.current = e.changedTouches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX.current == null || modal || importOpen) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 60) return;
    goAdjacent(dx < 0 ? 1 : -1);
  }
  function clearFilters() {
    setCategory("Todas");
    setSearch("");
    setKind("Todos");
    setAccount("Todas");
    setFrom("");
    setUntil("");
    setMin("");
    setMax("");
  }
  function imported(result) {
    if (result.currency !== currency) {
      setSaving(0);
      setExtra(0);
      setBudget(0);
      setLimits({});
    }
    setRows(result.rows);
    setUnit(result.currency);
    if (result.statement)
      setSnapshots((current) => {
        const old = current[result.statement.account];
        return !old || result.statement.date >= old.date
          ? { ...current, [result.statement.account]: result.statement }
          : current;
      });
    if (result.rows.length)
      setPeriod(
        result.rows
          .map((r) => r.date.slice(0, 7))
          .sort()
          .at(-1),
      );
    clearFilters();
    setImportOpen(false);
    setPage("Movimientos");
    notify(
      `${t("Importación confirmada")} · ${t("Añadidos")}: ${result.added} · ${t("Duplicados omitidos")}: ${result.duplicates}`,
    );
  }
  function reset() {
    setRows([]);
    setSnapshots({});
    setUnit("EUR");
    setPeriod("");
    setGoals([]);
    setSaving(0);
    setExtra(0);
    setBudget(0);
    setLimits({});
    clearFilters();
    setModal(null);
    setPage("Inicio");
    notify(t("Datos de sesión eliminados"));
  }
  function exportData() {
    const blob = new Blob(
        [
          JSON.stringify(
            { currency, transactions: rows, goals, snapshots },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
      url = URL.createObjectURL(blob),
      anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aura-extractos-locales.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function TxList({ data, limit, byAmount = false }) {
    const sorted = [...data]
      .sort((a, b) =>
        byAmount ? a.amount - b.amount : b.date.localeCompare(a.date),
      )
      .slice(0, limit);
    return (
      <div className="tx-list">
        {sorted.map((row, i) => {
          const Icon = icons[row.category] || ArrowLeftRight;
          return (
            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.025, 0.2) }}
              className="tx-row"
              key={row.id}
              onClick={() => setModal({ type: "transaction", id: row.id })}
            >
              <span
                className={
                  "merchant-icon " + (row.amount > 0 ? "positive" : "")
                }
              >
                <Icon size={19} />
              </span>
              <span className="tx-name">
                {row.merchant}
                <small>
                  {t(row.category)} ·{" "}
                  {new Date(row.date + "T12:00:00").toLocaleDateString(
                    locale(),
                    { day: "numeric", month: "short" },
                  )}
                </small>
              </span>
              <span className={"tx-amount " + (row.amount > 0 ? "green" : "")}>
                {row.amount > 0 ? "+" : ""}
                {money(row.amount)}
                <small>{row.account}</small>
              </span>
              <ChevronRight size={14} />
            </motion.button>
          );
        })}
        {!sorted.length && (
          <p className="empty">
            {t("No hay movimientos que coincidan con los filtros.")}
          </p>
        )}
      </div>
    );
  }
  function Chart() {
    if (!selected.length)
      return (
        <EmptyState description="No hay datos en el periodo seleccionado." />
      );
    return (
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trend}
            margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a88cf9" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#a88cf9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#292934"
              strokeDasharray="3 5"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              stroke="#9090a1"
              fontSize={10}
              minTickGap={22}
            />
            <YAxis
              tickFormatter={(v) => v.toLocaleString(locale())}
              tickLine={false}
              axisLine={false}
              stroke="#9090a1"
              fontSize={10}
              width={45}
            />
            <Tooltip
              contentStyle={{
                background: "#232333",
                border: "1px solid #424052",
                borderRadius: 12,
              }}
              formatter={(v) => [money(v), t("Gasto acumulado")]}
            />
            <Area
              type="monotone"
              dataKey="gasto"
              stroke="#b49aff"
              strokeWidth={2.5}
              fill="url(#fill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  function Goal({ goal }) {
    const percent = Math.min(
      100,
      Math.round((goal.current / goal.target) * 100),
    );
    return (
      <button className="goal" onClick={() => setModal({ type: "goal", goal })}>
        <div className="goal-top">
          <span className="goal-emoji">✧</span>
          <span>{percent} %</span>
        </div>
        <h3>{goal.name}</h3>
        <p>
          <strong>{money(goal.current, goal.currency || currency)}</strong>{" "}
          <span>
            {t("de")} {money(goal.target, goal.currency || currency)}
          </span>
        </p>
        <div className="progress">
          <i style={{ width: percent + "%" }} />
        </div>
        <small>
          {money(goalMonthly(goal), goal.currency || currency)}{" "}
          {t("/mes para el")}{" "}
          {new Date(goal.date + "T12:00:00").toLocaleDateString(locale(), {
            month: "short",
            year: "numeric",
          })}
        </small>
      </button>
    );
  }
  const transaction =
    modal?.type === "transaction" ? rows.find((r) => r.id === modal.id) : null;
  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <aside className="sidebar">
          <button className="logo" onClick={() => go("Inicio")}>
            <span className="logo-mark">Λ</span>aura
            <span className="logo-dot">.</span>
          </button>
          <div className="workspace-label">{t("TU ESPACIO PERSONAL")}</div>
          <nav>
            {nav.map(([name, Icon]) => (
              <button
                key={name}
                className={page === name ? "active" : ""}
                onClick={() => go(name)}
              >
                <Icon size={19} />
                {t(name)}
                {page === name && <span className="nav-dot" />}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="privacy">
              <ShieldCheck size={20} />
              <div>
                {t("Tu tranquilidad, primero")}
                <small>{t("Solo en memoria")}</small>
              </div>
            </div>
            <button className="profile" onClick={() => go("Ajustes")}>
              <span className="avatar">A</span>
              <span>
                {t("Espacio personal")}
                <small>{t("Importación local")}</small>
              </span>
              <Settings size={16} />
            </button>
          </div>
        </aside>
        <main>
          <header>
            <div className="breadcrumb">
              {t("Mi espacio")}
              <ChevronRight size={13} />
              <span>{t(page)}</span>
            </div>
            <div className="header-actions">
              <select
                className="language-select"
                aria-label={t("Idioma")}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="es">ES</option>
                <option value="ro">RO</option>
                <option value="en">EN</option>
              </select>
              <span className="local-pill">
                <span />
                {t("DATOS LOCALES")}
              </span>
              <button
                className="icon-button"
                aria-label={t("Importar extracto")}
                onClick={() => setImportOpen(true)}
              >
                <Upload size={18} />
              </button>
            </div>
          </header>
          <div className="content">
            <div className="page-heading">
              <div>
                <div className="eyebrow">{t("TU DINERO, EN EQUILIBRIO")}</div>
                <h1>
                  {t(page === "Inicio" ? "Tu dinero, con claridad." : page)}
                </h1>
                <p>
                  {t(
                    {
                      Inicio: "Solo tus datos. Tus decisiones.",
                      Tarjetas: "Tus cuentas y conexiones bancarias.",
                      Movimientos: "Cada movimiento cuenta.",
                      Estadísticas:
                        "Entiende tus hábitos. Decide con claridad.",
                      Ahorros: "Haz espacio para lo que de verdad importa.",
                      Ajustes: "Tu espacio, a tu manera.",
                    }[page],
                  )}
                </p>
              </div>
              <div className="heading-actions">
                <button
                  className="period"
                  onClick={() => setModal({ type: "period" })}
                >
                  {monthName(period)}
                  <ChevronDown size={14} />
                </button>
                <button
                  className="secondary import-cta"
                  onClick={() => setImportOpen(true)}
                >
                  <Upload size={15} />
                  {t("Importar extracto")}
                </button>
              </div>
            </div>
            <div className="session-note">
              <ShieldCheck size={14} />
              {t(
                "Solo en este navegador. Los datos de la sesión se borran al recargar.",
              )}
            </div>
            <div
              className="view-swipe"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="view-nav-controls" role="navigation" aria-label={t("Navegación entre vistas")}>
                <button
                  type="button"
                  className="view-nav-btn"
                  onClick={() => goAdjacent(-1)}
                  disabled={navNames.indexOf(page) <= 0}
                  aria-label={t("Vista anterior")}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="view-nav-btn"
                  onClick={() => goAdjacent(1)}
                  disabled={navNames.indexOf(page) >= navNames.length - 1}
                  aria-label={t("Vista siguiente")}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                initial={(dir) => ({
                  opacity: 0,
                  x: dir > 0 ? 28 : dir < 0 ? -28 : 0,
                })}
                animate={{ opacity: 1, x: 0 }}
                exit={(dir) => ({
                  opacity: 0,
                  x: dir > 0 ? -24 : dir < 0 ? 24 : 0,
                })}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {page === "Inicio" && (
                  <>
                    {!rows.length ? (
                      <section className="panel welcome-panel">
                        <EmptyState
                          title="Empieza con tus propios datos"
                          description="Importa un extracto PDF, CSV o MT940. Nada se envía a un servidor."
                          action="Importar extracto"
                          onAction={() => setImportOpen(true)}
                        />
                      </section>
                    ) : (
                      <>
                        <div className="stats-grid">
                          <section className="panel stat-card" aria-label={t("Saldo al cierre del extracto")}>
                            <span className="stat-icon" aria-hidden="true"><Wallet size={18} /></span>
                            <h2 className="stat-number">
                              {closingBalance === null
                                ? "—"
                                : money(closingBalance)}
                            </h2>
                            <small>{t("Saldo al cierre")}</small>
                          </section>
                          {[
                            [t("Ingresos"), income, "income"],
                            [t("Gastos"), expenses, "expense"],
                            [t("Flujo neto"), surplus, "net"],
                          ].map(([name, value, tone]) => (
                            <section key={name} className={`panel stat-card tone-${tone}`} aria-label={name}>
                              <span className="stat-icon" aria-hidden="true">
                                {tone === "income" ? <ArrowUpRight size={18} /> : tone === "expense" ? <ArrowDownLeft size={18} /> : <TrendingUp size={18} />}
                              </span>
                              <h2 className="stat-number">{money(value)}</h2>
                              <small>{name}</small>
                            </section>
                          ))}
                        </div>
                        <div className="middle-grid">
                          <section className="panel card-visual" aria-label={t("Así va tu mes")}>
                            <div className="section-title compact">
                              <span className="card-glyph" aria-hidden="true"><TrendingUp size={16} /></span>
                              <div className="chart-summary">
                                <strong>{money(expenses)}</strong>
                                {delta !== null && (
                                  <small className={delta > 0 ? "delta-up" : "delta-down"}>
                                    {delta > 0 ? "+" : ""}{delta.toFixed(1)}%
                                  </small>
                                )}
                              </div>
                            </div>
                            <Chart />
                          </section>
                          <section className="panel card-visual" aria-label={t("¿A dónde va tu dinero?")}>
                            <div className="section-title compact">
                              <span className="card-glyph" aria-hidden="true"><ChartNoAxesCombined size={16} /></span>
                              <button
                                onClick={() => go("Estadísticas")}
                                aria-label={t("Ver estadísticas")}
                              >
                                <ArrowUpRight size={18} />
                              </button>
                            </div>
                            {expenses > 0 ? (
                              <>
                                <div className="donut-wrap">
                                  <ResponsiveContainer
                                    width="100%"
                                    height={180}
                                  >
                                    <PieChart>
                                      <Pie
                                        data={groups}
                                        dataKey="value"
                                        innerRadius={62}
                                        outerRadius={77}
                                        paddingAngle={4}
                                        stroke="none"
                                        onClick={(group) => {
                                          go("Movimientos");
                                          setCategory(group.name);
                                        }}
                                      >
                                        {groups.map((g, i) => (
                                          <Cell
                                            key={g.name}
                                            fill={colors[i % colors.length]}
                                          />
                                        ))}
                                      </Pie>
                                      <Tooltip
                                        formatter={(value, name) => [
                                          money(value),
                                          t(name),
                                        ]}
                                        contentStyle={{
                                          background: "#202131",
                                          border: 0,
                                          borderRadius: 10,
                                        }}
                                      />
                                    </PieChart>
                                  </ResponsiveContainer>
                                  <div className="donut-label">
                                    <small>{t("Gasto total")}</small>
                                    <strong>{money(expenses)}</strong>
                                  </div>
                                </div>
                                <div className="category-legend">
                                  {groups.slice(0, 4).map((group, i) => (
                                    <button
                                      key={group.name}
                                      onClick={() => {
                                        go("Movimientos");
                                        setCategory(group.name);
                                      }}
                                    >
                                      <i style={{ background: colors[i] }} />
                                      {t(group.name)}
                                      <strong>{money(group.value)}</strong>
                                    </button>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <EmptyState description="No hay gastos en el periodo seleccionado." />
                            )}
                          </section>
                        </div>
                        <div className="bottom-grid">
                          <section className="panel card-visual" aria-label={t("Últimos movimientos")}>
                            <div className="section-title compact">
                              <span className="card-glyph" aria-hidden="true"><ArrowLeftRight size={16} /></span>
                              <button onClick={() => go("Movimientos")} aria-label={t("Ver todos")}>
                                <ArrowRight size={15} />
                              </button>
                            </div>
                            <TxList data={selected} limit={5} />
                          </section>
                          <section className="panel card-visual" aria-label={t("Tus próximas grandes cosas")}>
                            <div className="section-title compact">
                              <span className="card-glyph" aria-hidden="true"><PiggyBank size={16} /></span>
                              <button
                                aria-label={t("Crear objetivo")}
                                onClick={() => setModal({ type: "goal" })}
                              >
                                <Plus size={19} />
                              </button>
                            </div>
                            {goals.length ? (
                              goals
                                .slice(0, 2)
                                .map((goal) => (
                                  <Goal key={goal.id} goal={goal} />
                                ))
                            ) : (
                              <EmptyState
                                icon={PiggyBank}
                                title="—"
                                description=""
                              />
                            )}
                          </section>
                        </div>
                      </>
                    )}
                  </>
                )}
                {page === "Tarjetas" && (
                  <>
                    <section className="panel card-visual" aria-label={t("Tarjetas")}>
                      <EmptyState
                        icon={Wallet}
                        title="—"
                        description=""
                      />
                      <button
                        className="secondary"
                        onClick={() => setModal({ type: "bank" })}
                        aria-label={t("Ver estado de conexión")}
                      >
                        <ShieldCheck size={16} />
                      </button>
                    </section>
                    <section className="panel card-visual" aria-label={t("Cuentas importadas")}>
                      <div className="section-title compact">
                        <span className="card-glyph" aria-hidden="true"><Wallet size={16} /></span>
                        <span className="count-pill">{accounts.length}</span>
                      </div>
                      {accounts.length ? (
                        accounts.map((id) => (
                          <div className="account-row" key={id}>
                            <div className="merchant-icon">
                              <Wallet size={20} />
                            </div>
                            <div>
                              <h3>{id}</h3>
                              <small className="tx-count">
                                {rows.filter((r) => r.account === id).length}
                              </small>
                            </div>
                            <div className="account-balance">
                              <strong>
                                {snapshots[id]?.reconciled &&
                                snapshots[id]?.closing !== null
                                  ? money(snapshots[id].closing)
                                  : "—"}
                              </strong>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-inline" aria-label={t("Importa un extracto para ver tus cuentas.")}>—</div>
                      )}
                    </section>
                  </>
                )}
                {page === "Movimientos" && (
                  <section className="panel">
                    <div className="section-title">
                      <h2>{t("Movimientos importados")}</h2>
                      <span className="pill">{currency}</span>
                    </div>
                    {!rows.length ? (
                      <EmptyState
                        action="Importar extracto"
                        onAction={() => setImportOpen(true)}
                      />
                    ) : (
                      <>
                        <div className="filter-bar">
                          <label className="search">
                            <Search size={17} />
                            <input
                              aria-label={t("Buscar comercio")}
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder={t("Buscar un movimiento…")}
                            />
                          </label>
                          <select
                            aria-label={t("Categoría")}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            <option value="Todas">{t("Todas")}</option>
                            {categories.map((name) => (
                              <option value={name} key={name}>
                                {t(name)}
                              </option>
                            ))}
                          </select>
                          <select
                            aria-label={t("Tipo")}
                            value={kind}
                            onChange={(e) => setKind(e.target.value)}
                          >
                            {["Todos", "Ingresos", "Gastos"].map((name) => (
                              <option value={name} key={name}>
                                {t(name)}
                              </option>
                            ))}
                          </select>
                          <select
                            aria-label={t("Cuenta")}
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                          >
                            <option value="Todas">{t("Todas")}</option>
                            {accounts.map((id) => (
                              <option key={id}>{id}</option>
                            ))}
                          </select>
                        </div>
                        <div className="filter-bar">
                          <label>
                            {t("Desde")}
                            <input
                              type="date"
                              aria-label={t("Desde")}
                              value={from}
                              onChange={(e) => setFrom(e.target.value)}
                            />
                          </label>
                          <label>
                            {t("Hasta")}
                            <input
                              type="date"
                              aria-label={t("Hasta")}
                              value={until}
                              onChange={(e) => setUntil(e.target.value)}
                            />
                          </label>
                          <input
                            type="number"
                            min="0"
                            aria-label={t("Importe mínimo")}
                            placeholder={t("Importe mínimo")}
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                          />
                          <input
                            type="number"
                            min="0"
                            aria-label={t("Importe máximo")}
                            placeholder={t("Importe máximo")}
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                          />
                          <button className="secondary" onClick={clearFilters}>
                            {t("Limpiar filtros")}
                          </button>
                        </div>
                        <p>
                          {filtered.length} {t("movimientos · Resultado neto:")}{" "}
                          {money(
                            filtered.reduce((sum, row) => sum + row.amount, 0),
                          )}
                        </p>
                        <TxList data={filtered} />
                      </>
                    )}
                  </section>
                )}
                {page === "Estadísticas" && (
                  <>
                    {!selected.length ? (
                      <section className="panel">
                        <EmptyState
                          description="No hay datos en el periodo seleccionado."
                          action="Importar extracto"
                          onAction={() => setImportOpen(true)}
                        />
                      </section>
                    ) : (
                      <>
                        <div className="stats-grid">
                          {[
                            ["Ingresos", income],
                            ["Gastos", expenses],
                            ["Flujo neto", surplus],
                            ["Media diaria", days ? expenses / days : 0],
                          ].map(([name, value]) => (
                            <section className="panel" key={name}>
                              <small>{t(name)}</small>
                              <h2 className="stat-number">{money(value)}</h2>
                            </section>
                          ))}
                        </div>
                        <div className="middle-grid">
                          <section className="panel">
                            <h2>{t("Evolución de gastos")}</h2>
                            <Chart />
                            <p>
                              {t(
                                "Los cálculos usan únicamente los movimientos importados del periodo seleccionado.",
                              )}
                            </p>
                          </section>
                          <section className="panel">
                            <h2>{t("Gastos por categoría")}</h2>
                            {groups.length ? (
                              groups.map((group, i) => (
                                <button
                                  className="category-row"
                                  key={group.name}
                                  onClick={() => {
                                    go("Movimientos");
                                    setCategory(group.name);
                                  }}
                                >
                                  <div>
                                    <span>{t(group.name)}</span>
                                    <strong>{money(group.value)}</strong>
                                  </div>
                                  <div className="progress">
                                    <i
                                      style={{
                                        width:
                                          (group.value / expenses) * 100 + "%",
                                        background: colors[i % colors.length],
                                      }}
                                    />
                                  </div>
                                </button>
                              ))
                            ) : (
                              <p>
                                {t("No hay gastos en el periodo seleccionado.")}
                              </p>
                            )}
                            <p>
                              {t(
                                "Puedes corregir la categoría desde el detalle de cada movimiento.",
                              )}
                            </p>
                          </section>
                        </div>
                        <div className="middle-grid">
                          <section className="panel">
                            <h2>{t("Comparación mensual")}</h2>
                            {previousRows.length && period ? (
                              <>
                                <div className="chart">
                                  <ResponsiveContainer>
                                    <BarChart
                                      data={[
                                        {
                                          name: monthName(priorPeriod),
                                          gastos: previous.expenses,
                                          ingresos: previous.income,
                                        },
                                        {
                                          name: monthName(period),
                                          gastos: expenses,
                                          ingresos: income,
                                        },
                                      ]}
                                    >
                                      <XAxis
                                        dataKey="name"
                                        stroke="#999"
                                        fontSize={10}
                                      />
                                      <Tooltip
                                        formatter={(value, name) => [
                                          money(value),
                                          t(name),
                                        ]}
                                        contentStyle={{
                                          background: "#242332",
                                          border: 0,
                                        }}
                                      />
                                      <Bar
                                        dataKey="gastos"
                                        name={t("Gastos")}
                                        fill="#aa91ff"
                                        radius={[6, 6, 0, 0]}
                                      />
                                      <Bar
                                        dataKey="ingresos"
                                        name={t("Ingresos")}
                                        fill="#74d4b5"
                                        radius={[6, 6, 0, 0]}
                                      />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                                <p>
                                  {delta !== null
                                    ? `${delta.toFixed(1)} % · (${money(expenses)} ÷ ${money(previous.expenses)} − 1) × 100`
                                    : t("Sin comparación disponible")}
                                </p>
                                <p>
                                  {t(
                                    "La comparación no verifica si los extractos de ambos meses están completos.",
                                  )}
                                </p>
                              </>
                            ) : (
                              <p>
                                {t(
                                  "Importa también el mes anterior para comparar.",
                                )}
                              </p>
                            )}
                          </section>
                          <section className="panel">
                            <h2>{t("Mayores gastos")}</h2>
                            <TxList
                              byAmount
                              data={selected.filter((row) => row.amount < 0)}
                              limit={5}
                            />
                          </section>
                        </div>
                        <section className="panel">
                          <h2>{t("Pagos recurrentes identificados")}</h2>
                          <p>
                            {t(
                              "Solo se muestran los movimientos que marques como recurrentes.",
                            )}
                          </p>
                          <TxList
                            data={selected.filter((row) => row.recurring)}
                          />
                        </section>
                        <section className="panel">
                          <h2>{t("Gasto por comercio")}</h2>
                          {Object.entries(
                            selected
                              .filter((row) => row.amount < 0)
                              .reduce(
                                (acc, row) => (
                                  (acc[row.merchant] =
                                    (acc[row.merchant] || 0) - row.amount),
                                  acc
                                ),
                                {},
                              ),
                          )
                            .sort((a, b) => b[1] - a[1])
                            .map(([name, value]) => (
                              <div className="setting-row" key={name}>
                                <span>{name}</span>
                                <strong>{money(value)}</strong>
                              </div>
                            ))}
                        </section>
                      </>
                    )}
                  </>
                )}
                {page === "Ahorros" && (
                  <>
                    <div className="middle-grid">
                      <section className="panel savings-plan">
                        <span className="eyebrow">{t("DISEÑA TU FUTURO")}</span>
                        <h2>{t("Un hábito que crece contigo.")}</h2>
                        <p>
                          {t(
                            "Elige una aportación mensual. No se realiza ningún movimiento de dinero.",
                          )}
                        </p>
                        <div className="saving-big">
                          {money(saving)}
                          <small>{t("/ mes")}</small>
                        </div>
                        <input
                          aria-label={t("Ahorro mensual")}
                          type="range"
                          min="0"
                          max={Math.max(1000, income, saving)}
                          step="10"
                          value={saving}
                          onChange={(e) => setSaving(+e.target.value)}
                        />
                        <div className="strategies">
                          {[
                            ["Conservadora", 0.1],
                            ["Equilibrada", 0.2],
                            ["Ambiciosa", 0.3],
                          ].map(([name, fraction]) => (
                            <button
                              key={name}
                              disabled={!income}
                              onClick={() =>
                                setSaving(Math.round(income * fraction))
                              }
                            >
                              {t(name)}
                              <small>
                                {fraction * 100} {t("% de ingresos")}
                              </small>
                            </button>
                          ))}
                        </div>
                        <label>
                          {t("Aportación personalizada")} ({currency})
                          <input
                            type="number"
                            min="0"
                            max="1000000"
                            value={saving}
                            onChange={(e) =>
                              setSaving(
                                Math.max(0, Math.min(1000000, +e.target.value)),
                              )
                            }
                          />
                        </label>
                        <p className={saving > surplus ? "warning" : "green"}>
                          {selected.length
                            ? (saving > surplus
                                ? t(
                                    "El objetivo supera tu excedente mensual de ",
                                  )
                                : t("Disponible tras gastos y ahorro: ")) +
                              money(
                                saving > surplus ? surplus : surplus - saving,
                              )
                            : t(
                                "Importa datos para comparar el ahorro con tus ingresos y gastos.",
                              )}
                        </p>
                        <small>
                          {t(
                            "Porcentajes ilustrativos, sin rentabilidad ni asesoramiento financiero.",
                          )}
                        </small>
                      </section>
                      <section className="panel">
                        <h2>{t("Imagina lo que puedes conseguir")}</h2>
                        <p>{t("Si reduces tus gastos cada mes…")}</p>
                        <label>
                          {t("Reducción mensual adicional")}{" "}
                          <strong>{money(extra)}</strong>
                          <input
                            aria-label={t("Reducción mensual")}
                            type="range"
                            min="0"
                            max="500"
                            step="10"
                            value={extra}
                            onChange={(e) => setExtra(+e.target.value)}
                          />
                        </label>
                        <div className="projection-grid">
                          {projection(saving, extra).map((item) => (
                            <div key={item.months}>
                              <small>
                                {t("En")} {item.months} {t("meses")}
                              </small>
                              <strong>{money(item.value)}</strong>
                            </div>
                          ))}
                        </div>
                        <p>
                          {t("Cálculo: (")}
                          {money(saving)} + {money(extra)}
                          {t(") × meses. Proyección hipotética sin intereses.")}
                        </p>
                      </section>
                    </div>
                    <div className="section-title">
                      <h2>{t("Tus próximas grandes cosas")}</h2>
                      <button
                        className="secondary"
                        onClick={() => setModal({ type: "goal" })}
                      >
                        <Plus size={16} />
                        {t("Nuevo objetivo")}
                      </button>
                    </div>
                    {goals.length ? (
                      <div className="goal-grid">
                        {goals.map((goal) => (
                          <Goal key={goal.id} goal={goal} />
                        ))}
                      </div>
                    ) : (
                      <section className="panel">
                        <EmptyState
                          icon={PiggyBank}
                          title="Todavía no hay objetivos"
                          description="Crea una meta con el importe y la fecha que tú elijas."
                        />
                      </section>
                    )}
                    <section className="panel budget">
                      <div className="section-title">
                        <h2>{t("Presupuesto mensual")}</h2>
                        <span>
                          {budget > 0
                            ? money(Math.max(0, budget - expenses)) +
                              " " +
                              t("disponibles")
                            : t("Sin límite")}
                        </span>
                      </div>
                      <label>
                        {t("Límite total")} ({currency})
                        <input
                          type="number"
                          min="0"
                          max="1000000000"
                          value={budget}
                          onChange={(e) =>
                            setBudget(
                              Math.max(0, Math.min(1e9, +e.target.value)),
                            )
                          }
                        />
                      </label>
                      {budget > 0 && (
                        <>
                          <div
                            className="budget-ring"
                            style={{
                              background: `conic-gradient(#b39bff ${Math.min(100, (expenses / budget) * 100)}%,#2b2b3e 0)`,
                            }}
                          >
                            <span>
                              {Math.round((expenses / budget) * 100)} %
                              <small>{t("del presupuesto")}</small>
                            </span>
                          </div>
                          {expenses > budget && (
                            <p className="warning">
                              {t("Has superado el presupuesto en ")}
                              {money(expenses - budget)}
                            </p>
                          )}
                        </>
                      )}
                      {groups.map((group) => (
                        <div className="budget-category" key={group.name}>
                          <label>
                            {t(group.name)}
                            <input
                              aria-label={t("Presupuesto ") + t(group.name)}
                              type="number"
                              min="0"
                              placeholder={t("Sin límite")}
                              value={limits[group.name] ?? ""}
                              onChange={(e) =>
                                setLimits({
                                  ...limits,
                                  [group.name]: e.target.value,
                                })
                              }
                            />
                          </label>
                          <small
                            className={
                              limits[group.name] &&
                              group.value > +limits[group.name] * 0.9
                                ? "warning"
                                : ""
                            }
                          >
                            {money(group.value)} {t("gastados")}
                            {limits[group.name]
                              ? " / " + money(+limits[group.name])
                              : ""}
                          </small>
                        </div>
                      ))}
                    </section>
                  </>
                )}
                {page === "Ajustes" && (
                  <div className="settings-grid">
                    <section className="panel">
                      <h2>{t("Importación local")}</h2>
                      <p>
                        {t(
                          "El archivo se procesa solo en tu navegador. No se envía a ningún servidor. Los movimientos importados no se guardan en localStorage y se borran al recargar.",
                        )}
                      </p>
                      <button
                        className="secondary"
                        onClick={() => setImportOpen(true)}
                      >
                        <Upload size={16} />
                        {t("Importar extracto")}
                      </button>
                    </section>
                    <section className="panel">
                      <h2>{t("Conexiones bancarias")}</h2>
                      <div className="connection">
                        <ShieldCheck size={28} />
                        <div>
                          <h3>Banca Transilvania</h3>
                          <p>{t("Sin conexión bancaria")}</p>
                        </div>
                      </div>
                      <p>
                        {t(
                          "La conexión de solo lectura con Banca Transilvania requiere un proveedor Open Banking autorizado.",
                        )}
                      </p>
                      <button
                        className="secondary"
                        onClick={() => setModal({ type: "bank" })}
                      >
                        {t("Ver estado de conexión")}
                        <ArrowUpRight size={16} />
                      </button>
                    </section>
                    <section className="panel">
                      <h2>{t("Privacidad y seguridad")}</h2>
                      <div className="setting-row">
                        <span>{t("Datos utilizados")}</span>
                        <span>{t("Solo tus importaciones")}</span>
                      </div>
                      <div className="setting-row">
                        <span>{t("Almacenamiento")}</span>
                        <span className="green">{t("Solo en memoria")}</span>
                      </div>
                      <p>
                        {t(
                          "No hay autenticación ni conexión bancaria activa. No se guardan extractos en el servidor ni en localStorage.",
                        )}
                      </p>
                      <p>
                        {t(
                          "No solicitamos contraseñas bancarias, números completos de tarjeta ni CVV.",
                        )}
                      </p>
                    </section>
                    <section className="panel">
                      <h2>{t("Datos de la sesión")}</h2>
                      <p>
                        {rows.length} {t("Movimientos").toLowerCase()} ·{" "}
                        {currency}
                      </p>
                      <p>
                        {t(
                          "La exportación descarga una copia local de tus datos. Guárdala en un lugar seguro.",
                        )}
                      </p>
                      <button
                        className="secondary"
                        disabled={!rows.length && !goals.length}
                        onClick={exportData}
                      >
                        <Download size={16} />
                        {t("Exportar datos")}
                      </button>
                      <button
                        className="danger"
                        disabled={!rows.length && !goals.length}
                        onClick={() => setModal({ type: "clear" })}
                      >
                        <Trash2 size={15} />
                        {t("Eliminar datos de sesión")}
                      </button>
                    </section>
                    <section className="panel">
                      <h2>{t("Idioma")}</h2>
                      <label>
                        {t("Idioma")}
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          <option value="es">Español</option>
                          <option value="ro">Română</option>
                          <option value="en">English</option>
                        </select>
                      </label>
                    </section>
                    <section className="panel">
                      <h2>{t("Siempre a mano")}</h2>
                      <p>
                        {t(
                          "Instala Aura desde el menú del navegador. En iPhone: Compartir → Añadir a pantalla de inicio. En Android: menú → Instalar aplicación.",
                        )}
                      </p>
                    </section>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            </div>
            <footer>
              <span className="footer-brand">Λ aura</span>
              <span>{t("Un poco más cerca de lo que importa.")}</span>
              <span>
                <ShieldCheck size={13} />
                {t("Solo tus datos")}
              </span>
            </footer>
          </div>
        </main>
        <nav className="mobile-nav">
          {nav.map(([name, Icon]) => (
            <button
              key={name}
              className={page === name ? "active" : ""}
              onClick={() => go(name)}
            >
              <Icon size={20} />
              <span>{t(name)}</span>
            </button>
          ))}
        </nav>
        {importOpen && (
          <StatementImporter
            existing={rows}
            currency={currency}
            onClose={() => setImportOpen(false)}
            onConfirm={imported}
          />
        )}
        {modal && (
          <div className="overlay" onClick={() => setModal(null)}>
            <motion.section
              role="dialog"
              aria-modal="true"
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close icon-button"
                aria-label={t("Cerrar")}
                onClick={() => setModal(null)}
              >
                <X size={20} />
              </button>
              {modal.type === "goal" && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget),
                      goal = {
                        id: modal.goal?.id || crypto.randomUUID(),
                        name: data.get("name").trim(),
                        target: +data.get("target"),
                        current: +data.get("current"),
                        date: data.get("date"),
                        currency: modal.goal?.currency || currency,
                      };
                    if (!goal.name) return;
                    setGoals((current) => [
                      ...current.filter((item) => item.id !== goal.id),
                      goal,
                    ]);
                    setModal(null);
                    notify(t("Objetivo guardado"));
                  }}
                >
                  <h2>
                    {t(modal.goal ? "Tu objetivo" : "Algo que te ilusiona")}
                  </h2>
                  <label>
                    {t("Nombre")}
                    <input
                      name="name"
                      required
                      maxLength={60}
                      defaultValue={modal.goal?.name}
                    />
                  </label>
                  <label>
                    {t("Importe objetivo")} ({modal.goal?.currency || currency})
                    <input
                      name="target"
                      type="number"
                      min="1"
                      max="10000000"
                      step=".01"
                      required
                      defaultValue={modal.goal?.target}
                    />
                  </label>
                  <label>
                    {t("Ahorro actual")} ({modal.goal?.currency || currency})
                    <input
                      name="current"
                      type="number"
                      min="0"
                      max="10000000"
                      step=".01"
                      required
                      defaultValue={modal.goal?.current ?? 0}
                    />
                  </label>
                  <label>
                    {t("Fecha objetivo")}
                    <input
                      name="date"
                      type="date"
                      required
                      defaultValue={modal.goal?.date}
                    />
                  </label>
                  <button className="primary">
                    {t("Guardar objetivo")}
                    <Check size={16} />
                  </button>
                  {modal.goal && (
                    <button
                      type="button"
                      className="danger"
                      onClick={() => {
                        setGoals(
                          goals.filter((goal) => goal.id !== modal.goal.id),
                        );
                        setModal(null);
                      }}
                    >
                      {t("Eliminar objetivo")}
                    </button>
                  )}
                  <p>
                    {t(
                      "Solo en este navegador. Los datos de la sesión se borran al recargar.",
                    )}
                  </p>
                </form>
              )}
              {transaction && (
                <>
                  <div className="eyebrow">
                    {t("Detalle del movimiento local")}
                  </div>
                  <h2>{transaction.merchant}</h2>
                  <div className="saving-big">{money(transaction.amount)}</div>
                  <p>
                    {transaction.date} · {transaction.account}
                  </p>
                  <label>
                    {t("Corregir categoría")}
                    <select
                      value={transaction.category}
                      onChange={(e) =>
                        setRows(
                          rows.map((row) =>
                            row.id === transaction.id
                              ? { ...row, category: e.target.value }
                              : row,
                          ),
                        )
                      }
                    >
                      {categories.map((name) => (
                        <option value={name} key={name}>
                          {t(name)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!transaction.recurring}
                      onChange={(e) =>
                        setRows(
                          rows.map((row) =>
                            row.id === transaction.id
                              ? { ...row, recurring: e.target.checked }
                              : row,
                          ),
                        )
                      }
                    />
                    {t("Marcar como recurrente")}
                  </label>
                  <p>
                    {t(
                      "La clasificación importada se mantiene solo en memoria.",
                    )}
                  </p>
                </>
              )}
              {modal.type === "period" && (
                <>
                  <h2>{t("Elige tu mes")}</h2>
                  <label>
                    {t("Periodo")}
                    <input
                      type="month"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    />
                  </label>
                  <button
                    className="secondary"
                    onClick={() => {
                      setPeriod("");
                      setModal(null);
                    }}
                  >
                    {t("Todos los periodos")}
                  </button>
                  <button className="primary" onClick={() => setModal(null)}>
                    {t("Aplicar periodo")}
                  </button>
                </>
              )}
              {modal.type === "bank" && (
                <>
                  <ShieldCheck size={35} />
                  <h2>{t("Sin conexión bancaria")}</h2>
                  <p>
                    {t(
                      "No hay proveedor Open Banking configurado. No se puede iniciar una autorización ni sincronizar cuentas reales.",
                    )}
                  </p>
                  <p>
                    {t(
                      "El backend deberá verificar tu sesión, crear el consentimiento con el proveedor, validar el retorno y custodiar los tokens cifrados. Podrás revocar el acceso en cualquier momento.",
                    )}
                  </p>
                  <button className="primary" onClick={() => setModal(null)}>
                    {t("Entendido")}
                  </button>
                </>
              )}
              {modal.type === "clear" && (
                <>
                  <h2>{t("Eliminar datos de sesión")}</h2>
                  <p>
                    {t(
                      "Se eliminarán los movimientos importados, objetivos y presupuestos de esta sesión. Esta acción no se puede deshacer.",
                    )}
                  </p>
                  <button className="danger" onClick={reset}>
                    {t("Eliminar datos de sesión")}
                  </button>
                  <button className="secondary" onClick={() => setModal(null)}>
                    {t("Cancelar")}
                  </button>
                </>
              )}
            </motion.section>
          </div>
        )}
        {toast && (
          <div role="status" className="toast">
            <Check size={17} />
            {toast}
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")).render(<App />);
