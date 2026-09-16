"use client";

import { useState } from "react";
import { Check, Clock3, MapPin, Mic, Percent, ShieldCheck, ShoppingBag, Sparkles, Star, X } from "lucide-react";

type PlatformQuote = { platform: "Zomato" | "Swiggy"; total: number; eta: string; food: number; fees: number; discount: number };
type FoodOption = { id: number; label: string; restaurant: string; rating: number; reviews: number; item: string; why: string; quotes: PlatformQuote[] };

const options: FoodOption[] = [
  { id: 1, label: "Best Overall", restaurant: "Bawarchi", rating: 4.6, reviews: 12840, item: "Chicken Biryani ×2", why: "Best balance of final price, ETA and verified food signals for your spicy preference.", quotes: [
    { platform: "Zomato", total: 438, eta: "27 min", food: 420, fees: 35, discount: 17 },
    { platform: "Swiggy", total: 472, eta: "24 min", food: 420, fees: 52, discount: 0 },
  ] },
  { id: 2, label: "Cheapest", restaurant: "Shah Ghouse", rating: 4.5, reviews: 9420, item: "Chicken Biryani ×2", why: "Lowest comparable final total across the two platforms, while staying near your delivery window.", quotes: [
    { platform: "Zomato", total: 465, eta: "34 min", food: 420, fees: 45, discount: 0 },
    { platform: "Swiggy", total: 401, eta: "31 min", food: 420, fees: 18, discount: 37 },
  ] },
  { id: 3, label: "Highest Rated", restaurant: "Nayaab", rating: 4.7, reviews: 15600, item: "Chicken Biryani ×2", why: "Highest verified rating in this shortlist, with a modest ETA and price tradeoff.", quotes: [
    { platform: "Zomato", total: 465, eta: "34 min", food: 420, fees: 45, discount: 0 },
    { platform: "Swiggy", total: 500, eta: "29 min", food: 420, fees: 80, discount: 0 },
  ] },
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
    setToast("Comparing Zomato, Swiggy, totals, offers, ETA and reviews…");
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
            <h1>Tell IFD what you want. We’ll compare the rest.</h1>
            <p>Tell us your food, budget, taste and timing. IFD compares Zomato and Swiggy and shows the actual choice worth making.</p>
            <div className="searchbox">
              <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()} placeholder="Try: chicken biryani for 2, under ₹1,000, within 30 minutes" />
              <div className="search-actions"><button className="ghost" aria-label="Voice search"><Mic size={18} /></button><button className="primary" onClick={() => runSearch()}>Compare my food</button></div>
            </div>
            <div className="chips">{["Chicken biryani for 2", "Something spicy", "Best value under ₹500", "Surprise me"].map((chip) => <button className="chip" key={chip} onClick={() => runSearch(chip)}>{chip}</button>)}</div>
            <div className="trust"><span><Check size={16} /> Zomato + Swiggy</span><span><Percent size={16} /> Deal optimization</span><span><Clock3 size={16} /> ETA-aware</span><span><ShieldCheck size={16} /> Verified reviews</span></div>
          </section>
          <section className="section">
            <div className="section-head"><div><h2>One request. Two platforms. One answer.</h2><div className="sub">IFD turns the food-ordering decision into a transparent comparison of final totals, delivery time and food signals.</div></div></div>
            <div className="features">
              <Feature icon={<Sparkles size={19} />} title="AI Food Agent" text="Type or speak naturally. IFD turns your request into structured food intent." />
              <Feature icon={<Percent size={19} />} title="Real Total" text="Compare what you actually pay on Zomato versus Swiggy, not just the menu price." />
              <Feature icon={<ShoppingBag size={19} />} title="IFD MAX" text="Optimize the selected cart for savings, offers, portions and constraints." />
              <Feature icon={<ShieldCheck size={19} />} title="Food Intelligence" text="Use ratings, verified reviews, ETA and platform economics together." />
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
      <h1 style={{ fontSize: "clamp(42px,6vw,68px)" }}>Compare before you order.</h1>
      <p>Request: <strong>{query || "Chicken biryani for 2, under ₹1,000, within 30 minutes"}</strong></p>
    </section>
    <section className="section" style={{ paddingTop: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <span className="tag orange">Zomato</span><span className="tag">Swiggy</span><span className="tag">Final total comparison</span>
      </div>
      <div className="grid">
        {options.map((item) => {
          const cheapest = [...item.quotes].sort((a, b) => a.total - b.total)[0];
          const other = item.quotes.find((q) => q.platform !== cheapest.platform)!;
          const saving = other.total - cheapest.total;
          return <article className={`card ${item.id === 1 ? "featured" : ""}`} key={item.id}>
            <span className={`tag ${item.id === 1 ? "orange" : ""}`}>{item.label}</span>
            <div className="restaurant">{item.restaurant}</div>
            <div className="meta"><Star size={14} fill="currentColor" style={{ verticalAlign: "-2px" }} /> {item.rating} · {item.reviews.toLocaleString()} verified signals</div>
            <div className="item">{item.item}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
              {item.quotes.map((quote) => {
                const isBest = quote.platform === cheapest.platform;
                return <div key={quote.platform} style={{ border: isBest ? "2px solid #171717" : "1px solid #e9e4dc", borderRadius: 16, padding: 14, background: isBest ? "#faf7f2" : "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <strong>{quote.platform}</strong>{isBest && <span style={{ fontSize: 11, fontWeight: 800 }}>✓ BEST</span>}
                  </div>
                  <div style={{ fontSize: 25, fontWeight: 800, marginTop: 8 }}>₹{quote.total}</div>
                  <div className="meta" style={{ marginTop: 3 }}>{quote.eta}</div>
                  <div style={{ fontSize: 12, color: "#766f67", marginTop: 10 }}>Food ₹{quote.food} · Fees ₹{quote.fees} · Offer -₹{quote.discount}</div>
                </div>;
              })}
            </div>

            <div className="save" style={{ marginTop: 14 }}>₹{saving} cheaper on {cheapest.platform}<span>vs. {other.platform}</span></div>
            <div className="why"><strong>Why this?</strong><br />{item.why}</div>
            <button className="primary" onClick={() => onChoose(item)}>Choose {cheapest.platform}</button>
            <div className="meta" style={{ marginTop: 10, fontSize: 12 }}>Same restaurant · same requested items · final totals shown for comparison</div>
          </article>;
        })}
      </div>

      <section className="max">
        <div><div className="eyebrow" style={{ background: "#2a211d", color: "#ff9f72" }}>IFD MAX™</div><h3>Make my order better.</h3><p>Don’t stop at finding a good platform. Let IFD test cart changes and offers to find a better outcome.</p><button className="primary" onClick={() => setOptimized(true)}>{optimized ? "Optimized ✓" : "Optimize this order"}</button></div>
        <div className="deal"><div><span>Current best total</span><strong>₹438</strong></div><div><span>Add Coke ₹40</span><strong>+₹40</strong></div><div><span>Unlock promotion</span><strong>-₹100</strong></div><div className="total"><span>Optimized total</span><strong>₹378</strong></div></div>
      </section>
    </section>
  </main>;
}

function Cart({ selected, optimized, onClose, onToast }: { selected: FoodOption; optimized: boolean; onClose: () => void; onToast: (value: string) => void }) {
  const cheapest = [...selected.quotes].sort((a, b) => a.total - b.total)[0];
  const total = optimized && selected.id === 1 ? 378 : cheapest.total;
  return <aside className="drawer">
    <div className="drawer-head"><h3>IFD Cart</h3><button className="close" onClick={onClose}><X size={18} /></button></div>
    <div className="meta" style={{ marginTop: 6 }}>{selected.restaurant} · {cheapest.platform} · {cheapest.eta}</div>
    <div className="cart-line"><div>{selected.item}</div><strong>₹{cheapest.food}</strong></div>
    <div className="summary"><div className="row"><span>Food</span><span>₹{cheapest.food}</span></div><div className="row"><span>Delivery + fees</span><span>₹{cheapest.fees}</span></div><div className="row"><span>Offers</span><span>-₹{cheapest.discount}</span></div>{optimized && selected.id === 1 && <div className="row"><span>IFD MAX adjustment</span><span>-₹60</span></div>}<div className="row total"><span>Total</span><span>₹{total}</span></div></div>
    <div style={{ display: "grid", gap: 8, marginTop: 16 }}><button className="primary" onClick={() => onToast(`Demo: authorized ${cheapest.platform} cart handoff would start here.`)}>Order on {cheapest.platform}</button><button className="ghost" onClick={() => onToast("Demo: opening the exact restaurant/item link would start here.")}>Open exact item instead</button></div>
    <div className="footnote">Live cart transfer is only possible through supported, authorized platform integrations. This prototype uses demo handoff actions.</div>
  </aside>;
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="card feature"><div className="tag" style={{ marginBottom: 16 }}>{icon}</div><h4>{title}</h4><p>{text}</p></div>;
}
