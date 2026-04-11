import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import {
  FiHome, FiShoppingBag, FiHeart, FiUser,
  FiSettings, FiLogOut, FiTrendingUp, FiBell,
  FiSearch, FiPackage, FiChevronRight, FiArrowUp, FiArrowDown,
} from 'react-icons/fi';

/* ─── Mock data ─────────────────────────────────────────── */
const STATS = [
  { label: 'Total Orders',   value: '128',    delta: '+12%', up: true,  icon: FiShoppingBag },
  { label: 'Wishlist Items', value: '34',     delta: '+5%',  up: true,  icon: FiHeart       },
  { label: 'Total Spent',    value: '₹42,800',delta: '-3%',  up: false, icon: FiTrendingUp  },
  { label: 'Active Returns', value: '2',      delta: '0%',   up: true,  icon: FiPackage     },
];

const ORDERS = [
  { id: '#SN-8821', item: 'Oversized Polo Tee',    status: 'Delivered', date: '10 Apr 2026', amount: '₹1,299' },
  { id: '#SN-8756', item: 'Cargo Jogger Pants',    status: 'Shipped',   date: '08 Apr 2026', amount: '₹2,149' },
  { id: '#SN-8702', item: 'Relaxed Fit Hoodie',    status: 'Processing',date: '06 Apr 2026', amount: '₹1,899' },
  { id: '#SN-8641', item: 'Classic White Sneakers',status: 'Delivered', date: '02 Apr 2026', amount: '₹3,499' },
  { id: '#SN-8590', item: 'Drop-Shoulder Shirt',   status: 'Cancelled', date: '29 Mar 2026', amount: '₹999'   },
];

const PRODUCTS = [
  { name: 'Oversized Polo Tee',     sales: 340, revenue: '₹4.4L', img: '👕' },
  { name: 'Cargo Jogger Pants',     sales: 280, revenue: '₹6.0L', img: '👖' },
  { name: 'Relaxed Fit Hoodie',     sales: 210, revenue: '₹3.9L', img: '🧥' },
  { name: 'Classic White Sneakers', sales: 190, revenue: '₹6.6L', img: '👟' },
];

const STATUS_STYLES = {
  Delivered:  { bg: 'rgba(34,197,94,0.1)',  color: '#4ade80', label: 'Delivered'  },
  Shipped:    { bg: 'rgba(232,201,126,0.1)',color: '#e8c97e', label: 'Shipped'    },
  Processing: { bg: 'rgba(99,102,241,0.1)', color: '#818cf8', label: 'Processing' },
  Cancelled:  { bg: 'rgba(239,68,68,0.1)',  color: '#f87171', label: 'Cancelled'  },
};

const NAV = [
  { icon: FiHome,        label: 'Dashboard', to: '/',          active: true  },
  { icon: FiShoppingBag, label: 'Orders',    to: '/orders',    active: false },
  { icon: FiHeart,       label: 'Wishlist',  to: '/wishlist',  active: false },
  { icon: FiPackage,     label: 'Products',  to: '/products',  active: false },
  { icon: FiUser,        label: 'Profile',   to: '/profile',   active: false },
  { icon: FiSettings,    label: 'Settings',  to: '/settings',  active: false },
];

/* ─── Sub-components ────────────────────────────────────── */
const StatCard = ({ label, value, delta, up, icon: Icon }) => (
  <div className="card-dark p-5 flex flex-col gap-3 animate-fade-up" style={{ borderRadius: 0 }}>
    <div className="flex items-center justify-between">
      <span className="text-xs font-sans tracking-widest uppercase text-on-surface-variant">{label}</span>
      <span
        className="flex items-center gap-1 text-xs font-sans font-medium"
        style={{ color: up ? '#4ade80' : '#f87171' }}
      >
        {up ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
        {delta}
      </span>
    </div>
    <div className="flex items-end justify-between">
      <span className="font-serif text-3xl text-on-surface">{value}</span>
      <div
        className="w-10 h-10 flex items-center justify-center"
        style={{ background: 'rgba(232,201,126,0.08)', border: '1px solid rgba(232,201,126,0.15)' }}
      >
        <Icon size={18} color="#e8c97e" />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Processing;
  return (
    <span
      className="text-xs font-sans font-medium px-2.5 py-1"
      style={{ background: s.bg, color: s.color, borderRadius: 2 }}
    >
      {s.label}
    </span>
  );
};

/* ─── Main Dashboard ────────────────────────────────────── */
export const Dashboard = () => {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = user?.fullName || user?.username || 'Member';
  const role        = user?.role || 'Buyer';
  const initial     = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Sidebar ───────────────────────────────────── */}
      <aside
        className="flex-shrink-0 flex flex-col"
        style={{
          width: 220,
          background: '#0f0f0f',
          borderRight: '1px solid #1e1e1e',
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        {/* Brand */}
        <div className="px-6 py-7 border-b" style={{ borderColor: '#1e1e1e' }}>
          <Link to="/" className="font-serif text-xl font-semibold tracking-[0.3em] text-on-surface">
            SNITCH
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          {NAV.map(({ icon: Icon, label, to, active }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-sans transition-all duration-200"
              style={{
                color: active ? '#e8c97e' : '#888580',
                background: active ? 'rgba(232,201,126,0.07)' : 'transparent',
                borderLeft: active ? '2px solid #e8c97e' : '2px solid transparent',
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User card */}
        <div className="px-4 py-5 border-t" style={{ borderColor: '#1e1e1e' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0 font-serif text-sm font-semibold"
              style={{ background: 'rgba(232,201,126,0.12)', color: '#e8c97e' }}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans font-medium text-on-surface truncate">{displayName}</p>
              <p className="text-xs font-sans text-on-surface-variant">{role}</p>
            </div>
            <button
              id="dashboard-logout"
              onClick={() => navigate('/login')}
              className="text-on-surface-variant hover:text-primary transition-colors"
              title="Logout"
            >
              <FiLogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header
          className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
          style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a' }}
        >
          <div>
            <h1 className="font-serif text-xl text-on-surface">Dashboard</h1>
            <p className="text-xs font-sans text-on-surface-variant mt-0.5">
              Welcome back, <span style={{ color: '#e8c97e' }}>{displayName}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ background: '#141414', border: '1px solid #2e2e2e', width: 200 }}
            >
              <FiSearch size={13} className="text-on-surface-variant" />
              <input
                id="dashboard-search"
                type="text"
                placeholder="Search orders…"
                className="bg-transparent text-xs font-sans text-on-surface placeholder:text-on-surface-variant outline-none w-full"
              />
            </div>

            {/* Bell */}
            <button id="dashboard-notifications" className="relative text-on-surface-variant hover:text-primary transition-colors">
              <FiBell size={18} />
              <span
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{ background: '#e8c97e' }}
              />
            </button>

            {/* Avatar */}
            <div
              className="w-8 h-8 flex items-center justify-center font-serif text-sm font-semibold cursor-pointer"
              style={{ background: 'rgba(232,201,126,0.12)', color: '#e8c97e', border: '1px solid rgba(232,201,126,0.2)' }}
            >
              {initial}
            </div>
          </div>
        </header>

        {/* Page body */}
        <div className="flex-1 px-8 py-7 space-y-8">

          {/* Gold accent bar */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,#e8c97e33 0%,transparent 60%)' }} />

          {/* Stat cards */}
          <section>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {STATS.map((s) => <StatCard key={s.label} {...s} />)}
            </div>
          </section>

          {/* Recent Orders */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg text-on-surface">Recent Orders</h2>
              <button
                id="dashboard-view-all-orders"
                className="flex items-center gap-1 text-xs font-sans text-on-surface-variant hover:text-primary transition-colors"
              >
                View all <FiChevronRight size={13} />
              </button>
            </div>

            <div className="card-dark overflow-hidden" style={{ borderRadius: 0 }}>
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                    {['Order ID', 'Item', 'Date', 'Amount', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs tracking-widest uppercase"
                        style={{ color: '#888580', fontWeight: 500 }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.map((o, i) => (
                    <tr
                      key={o.id}
                      style={{
                        borderBottom: i < ORDERS.length - 1 ? '1px solid #141414' : 'none',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#161616'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-5 py-4" style={{ color: '#e8c97e', fontFamily: 'monospace', fontSize: 12 }}>{o.id}</td>
                      <td className="px-5 py-4 text-on-surface">{o.item}</td>
                      <td className="px-5 py-4 text-on-surface-variant text-xs">{o.date}</td>
                      <td className="px-5 py-4 text-on-surface font-medium">{o.amount}</td>
                      <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Top Products */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg text-on-surface">Top Products</h2>
              <button
                id="dashboard-view-all-products"
                className="flex items-center gap-1 text-xs font-sans text-on-surface-variant hover:text-primary transition-colors"
              >
                View all <FiChevronRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {PRODUCTS.map((p, i) => (
                <div
                  key={p.name}
                  className="card-dark p-5 flex flex-col gap-4 animate-fade-up-delay cursor-pointer"
                  style={{ borderRadius: 0, animationDelay: `${i * 0.07}s` }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(232,201,126,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e1e1e'}
                >
                  <div
                    className="text-3xl w-12 h-12 flex items-center justify-center"
                    style={{ background: '#141414', border: '1px solid #2e2e2e' }}
                  >
                    {p.img}
                  </div>
                  <div>
                    <p className="text-sm font-sans font-medium text-on-surface leading-snug">{p.name}</p>
                    <p className="text-xs font-sans text-on-surface-variant mt-1">{p.sales} sales</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-serif text-base" style={{ color: '#e8c97e' }}>{p.revenue}</span>
                    <FiTrendingUp size={13} color="#4ade80" />
                  </div>
                  {/* Mini bar */}
                  <div style={{ height: 2, background: '#1e1e1e', borderRadius: 999 }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(p.sales / 340) * 100}%`,
                        background: 'linear-gradient(90deg,#e8c97e,#d4b46a)',
                        borderRadius: 999,
                        transition: 'width 1s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};
