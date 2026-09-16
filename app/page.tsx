"use client";

import { useState } from "react";
import { Check, Clock3, MapPin, Mic, Percent, ShieldCheck, ShoppingBag, Sparkles, Star, X } from "lucide-react";

type FoodOption = { id: number; label: string; restaurant: string; rating: number; reviews: number; item: string; eta: string; total: number; savings: number; why: string };

const options: FoodOption[] = [
  { id: 1, label: "Best Match", restaurant: "Bawarchi", rating: 4.6, reviews: 12840, item: "Chicken Biryani ×2", eta: "27 min", total: 438, savings: 62, why: "Strong rating, fast ETA, and the closest match to your spicy preference." },
  { id: 2, label: "Best Value", restaurant: "Shah Ghouse", rating: 4.5, reviews: 9420, item: "Chicken Biryani ×2", eta: "31 min", total: 401, savings: 99, why: "Lowest comparable total while staying close to your requested delivery window." },
  { id: 3, label: "Highest Rated", restaurant: "Nayaab", rating: 4.7, reviews: 15600, item: "Chicken Biryani ×2", eta: "34 min", total: 465, savings: 35, why: "Highest verified rating in this shortlist, with a modest ETA tradeoff." },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<FoodOption | null>(null);
  const [optimized, setOptimized] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [location, setLocation] = useState("Hyderabad");
  const [toast, setToast] = useState("");

  const runSearch = (text = query) => {
    setQuery(text);
    setSubmitted(true);
    setSelected(null);
    setOptimized(false);
    setToast("Comparing restaurants, totals, offers, ETA and reviews…");
    window.setTimeout(() => setToast(""), 1800);
  };

  const choose = (item: FoodOption) => {
    setSelected(item);
    setCartOpen(true);
    setOptimized(false);
  };

  return (
    <div className="shell">
      <header className="nav">
        <div className="brand">IF<span>D</span></div>
        <div className="location"><MapPin size={15} /> {location}<button onClick={() => setLocation(location === "Hyderabad" ? "Nellore" : "Hyderabad")}>Switch</button></div>
      </header>

      {!submitted ? (
        <main>
          <section className="hero">
            <div className="eyebrow"><Sparkles size={14} /> India Food Intelligence</div>
            <h1>Tell IFD what you want. We’ll figure out the rest.</h1>
            <p>Search food by what you actually care about — budget, taste, timing, quantity and value — then compare the best available way to order it.</p>
            <div className="searchbox">
              <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()} placeholder="Try: chicken biryani for 2, under ₹1,000, within 30 minutes" />
              <div className="search-actions"><button className="ghost" aria-label="Voice search"><Mic size={18} /></button><button className="primary" onClick={() => runSearch()}>Find my food</button></div>
            </div>
            <div className="chips">
              {[
                "Chicken biryani for 2",
                "Something spicy",
                "Best value under ₹500",
                "Surprise me",
              ].map((chip) => <button className="chip" key={chip} onClick={() => runSearch(chip)}>{chip}</button>)}
            </div>
            <div className="trust"><span><Check size={16} /> Verified prices</span><span><Percent size={16} /> Deal optimization</span><span><Clock3 size={16} /> ETA-aware</span><span><ShieldCheck size={16} /> Verified reviews</span></div>
          </section>
          <section className="section">
            <div className="section-head"><div><h2>One food request. Smarter decisions.</h2><div className="sub">IFD is designed to answer the question behind the search: “What should I actually order right now?”</div></div></div>
            <div className="features">
              <Feature icon={<Sparkles size={19} />} title="AI Food Agent" text="Type or speak naturally. IFD turns your request into structured food intent." />
              <Feature icon={<Percent size={19} />} title="Real Total" text="Compare the delivered total instead of getting fooled by the menu price." />
              <Feature icon={<ShoppingBag size={19} />} title="IFD MAX" text="Optimize the cart for savings, value, portions and constraints." />
              <Feature icon={<ShieldCheck size={19} />} title="Food Intelligence" text="Use ratings, verified reviews, ETA and personal preferences together." />
            </div>
          </section>
        </main>
      ) : (
        <Results query={query} options={options} onChoose={choose} optimized={optimized} setOptimized={setOptimized} />
      )}

      {cartOpen && selected && <Cart selected={selected} optimized={optimized} onClose={() => setCartOpen(false)} onToast={setToast} />}
      {toast && <div className="toast">{toast}</div>}
      <footer className="footer">IFD · India Food Delivery · Prototype. Live platform data, coupons and cart handoff require legitimate data sources and authorized integrations.</footer>
    </div>
  );
}

function Results({ query, options, onChoose, optimized, setOptimized }: { query: string; options: FoodOption[]; onChoose: (item: FoodOption) => void; optimized: boolean; setOptimized: (value: boolean) => void }) {
  return <main>
    <section className="hero" style={{ paddingTop: 40 }}>
      <div className="eyebrow"><Sparkles size={14} /> IFD found your shortlist</div>
      <h1 style={{ fontSize: "clamp(42px,6vw,68px)" }}>Here are the 3 choices that matter.</h1>
      <p>Request: <strong>{query || "Chicken biryani for 2, under ₹1,000, within 30 minutes"}</strong></p>
    </section>
    <section className="section" style={{ paddingTop: 8 }}>
      <div className="grid">
        {options.map((item) => <article className={`card ${item.id === 1 ? "featured" : ""}`} key={item.id}>
          <span className={`tag ${item.id === 1 ? "orange" : ""}`}>{item.label}</span>
          <div className="restaurant">{item.restaurant}</div>
          <div className="meta"><Star size={14} fill="currentColor" style={{ verticalAlign: "-2px" }} /> {item.rating} · {item.reviews.toLocaleString()} verified signals</div>
          <div className="item">{item.item}</div>
          <div className="numbers"><div className="metric"><small>Real total</small><strong>₹{optimized && item.id === 1 ? 378 : item.total}</strong></div><div className="metric"><small>ETA</small><strong>{item.eta}</strong></div></div>
          <div className="save">Save ₹{optimized && item.id === 1 ? 122 : item.savings}<span>vs. baseline</span></div>
          <div className="why"><strong>Why this?</strong><br />{item.why}</div>
          <button className="primary" onClick={() => onChoose(item)}>Choose this</button>
        </article>)}
      </div>
      <section className="max">
        <div><div className="eyebrow" style={{ background: "#2a211d", color: "#ff9f72" }}>IFD MAX™</div><h3>Make my order better.</h3><p>Don’t stop at finding a good option. Let IFD test cart changes, offers and constraints to find a better outcome.</p><button className="primary" onClick={() => setOptimized(true)}>{optimized ? "Optimized ✓" : "Optimize this order"}</button></div>
        <div className="deal"><div><span>Current best total</span><strong>₹438</strong></div><div><span>Add Coke ₹40</span><strong>+₹40</strong></div><div><span>Unlock promotion</span><strong>-₹100</strong></div><div className="total"><span>Optimized total</span><strong>₹378</strong></div></div>
      </section>
    </section>
  </main>;
}

function Cart({ selected, optimized, onClose, onToast }: { selected: FoodOption; optimized: boolean; onClose: () => void; onToast: (value: string) => void }) {
  const total = optimized && selected.id === 1 ? 378 : selected.total;
  return <aside className="drawer">
    <div className="drawer-head"><h3>IFD Cart</h3><button className="close" onClick={onClose}><X size={18} /></button></div>
    <div className="meta" style={{ marginTop: 6 }}>{selected.restaurant} · {selected.eta}</div>
    <div className="cart-line"><div>{selected.item}</div><strong>₹{selected.total}</strong></div>
    {optimized && selected.id === 1 && <div className="save">IFD MAX saved ₹60 <span>optimized</span></div>}
    <div className="summary"><div className="row"><span>Items</span><span>₹{selected.total}</span></div><div className="row"><span>Delivery + fees</span><span>₹40</span></div><div className="row"><span>Offers</span><span>-₹40</span></div><div className="row total"><span>Total</span><span>₹{total}</span></div></div>
    <div style={{ display: "grid", gap: 8, marginTop: 16 }}><button className="primary" onClick={() => onToast("Demo: authorized Zomato cart handoff would start here.")}>Add to Zomato cart</button><button className="ghost" onClick={() => onToast("Demo: authorized Swiggy cart handoff would start here.")}>Add to Swiggy cart</button><button className="ghost" onClick={() => onToast("Demo: opening the exact item link would start here.")}>Open exact item instead</button></div>
    <div className="footnote">Live cart transfer is only possible through supported, authorized platform integrations. This prototype uses demo handoff actions.</div>
  </aside>;
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="card feature"><div className="tag" style={{ marginBottom: 16 }}>{icon}</div><h4>{title}</h4><p>{text}</p></div>;
}
