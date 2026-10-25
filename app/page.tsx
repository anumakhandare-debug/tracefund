const css = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
html,body{margin:0;background:#0b1220}
.tf{min-height:100vh;box-sizing:border-box;padding:24px 32px 55px;background:#0b1220;color:#cbd5e1;font-family:Inter,"Segoe UI",system-ui,-apple-system,sans-serif;font-size:15px}
.tf *{box-sizing:border-box}
.tf :where(h1,h2,h3,p){margin:0}
.tf-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;flex-wrap:wrap;gap:12px}
.tf-brand{font-size:22px;font-weight:400;color:#94a3b8}
.tf-brand b{color:#fff;font-weight:700}
.tf-nav{display:flex;gap:22px}
.tf-nav a{color:#5eead4;text-decoration:underline;font-size:15px}
.tf-card{background:#121a2e;border:1px solid #1d2842;border-radius:16px}
.tf-sec{margin-top:32px}
.tf-hero{height:353px;padding:0 40px 0 38px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.tf-eye{font-size:13px;letter-spacing:.04em;color:#2dd4bf;margin-bottom:18px}
.tf-hero>div:first-child{flex:1;min-width:0}
.tf-hero h2{font-size:48px;line-height:1.12;font-weight:800;color:#eef2fb;letter-spacing:-.01em}
.tf-hero .sub{font-size:18px;line-height:1.5;color:#94a3b8;max-width:510px;margin-top:18px}
.tf-btns{display:flex;gap:12px;margin-top:26px;flex-wrap:wrap}
.tf-b1{background:#2dd4bf;color:#0b1220;font-weight:600;font-size:16px;padding:15px 24px;border-radius:10px;text-decoration:none}
.tf-b2{border:1px solid #14766c;color:#99f6e4;font-size:16px;padding:14px 23px;border-radius:10px;text-decoration:none}
.tf-rings{flex:none;width:274px;height:274px;border-radius:50%;border:1px solid #5b1f2b;display:grid;place-items:center}
.tf-r2{width:214px;height:214px;border-radius:50%;border:2px solid #d9504f;display:grid;place-items:center}
.tf-r3{width:156px;height:156px;border-radius:50%;border:3px solid #f0817c;display:grid;place-items:center}
.tf-r4{width:100px;height:100px;border-radius:50%;background:#000;border:2px solid #f0817c;display:flex;flex-direction:column;align-items:center;justify-content:center}
.tf-r4 b{font-size:17px;color:#f87171;font-weight:700}
.tf-r4 span{font-size:12px;color:#fca5a5;margin-top:2px}
.tf-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.tf-stat{height:100px;padding:21px 20px;background:#121a2e;border:1px solid #1d2842;border-radius:16px}
.tf-stat p{font-size:14px;color:#94a3b8}
.tf-stat strong{display:block;margin-top:6px;font-size:32px;font-weight:700;color:#fff}
.tf-stat.teal strong{color:#2dd4bf}
.tf-stat.red{background:#2a1214;border-color:#4a1d20}
.tf-stat.red strong{color:#f87171}
.tf-pad{padding:24px}
.tf-pad h3{font-size:22px;font-weight:700;color:#fff}
.tf-note{font-size:14.5px;color:#94a3b8;margin-top:14px}
.tf-row{margin-top:16px}
.tf-lab{display:flex;justify-content:space-between;font-size:14.5px;color:#cbd5e1;margin-bottom:6px}
.tf-lab.bad{color:#f87171}
.tf-bar{height:15px;border-radius:999px;background:#2dd4bf}
.tf-bar.bad{background:#f87171}
.tf-two{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.tf-trk{height:9px;border-radius:999px;background:#1d2842}
.tf-trk i{display:block;height:9px;border-radius:999px}
.tf-why{font-size:15.5px;line-height:1.6;color:#94a3b8;margin-top:20px}
.tf-hash{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;color:#5eead4;margin-top:20px}
.tf-scroll{overflow-x:auto;margin-top:20px}
.tf table{width:100%;min-width:620px;border-collapse:collapse;table-layout:fixed;text-align:left}
.tf th{font-size:15px;font-weight:700;color:#dbe3f0;padding:0 0 12px}
.tf td{font-size:15px;color:#cbd5e1;height:44px;border-top:1px solid #1d2842}
.tf td.m{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px}
.tf td.ok{color:#2dd4bf}
.tf td.no{color:#f87171}
@media(max-width:860px){
 .tf{padding:20px 16px 40px}
 .tf-hero{height:auto;flex-direction:column;align-items:flex-start;padding:28px 20px}
 .tf-hero h2{font-size:34px}
 .tf-rings{align-self:center}
 .tf-stats{grid-template-columns:1fr 1fr}
 .tf-two{grid-template-columns:1fr}
}
`;

const stats = [
  { label: "Donated", value: "₹50.0L", cls: "" },
  { label: "Verified transactions", value: "1,248", cls: "teal" },
  { label: "Reached beneficiaries", value: "₹24.0L", cls: "" },
  { label: "Black hole: no spend record", value: "₹16.7L", cls: "red" },
];

// width = % of donated amount
const journey = [
  { label: "1. Donors", amount: "₹50.0L", w: 100, bad: false },
  { label: "2. NGO received", amount: "₹48.2L", w: 96, bad: false },
  { label: "3. Paid to vendors", amount: "₹31.5L", w: 63, bad: false },
  { label: "4. Delivered to beneficiaries", amount: "₹24.0L", w: 48, bad: false },
  { label: "!. Unaccounted gap", amount: "₹16.7L", w: 33, bad: true },
];

const trust = [
  { name: "Green Roots Foundation", score: 91, color: "#2dd4bf" },
  { name: "Bright Future Society", score: 74, color: "#fbbf24" },
  { name: "Asha Relief Trust", score: 38, color: "#f87171" },
];

const ledger = [
  { id: "#0141", route: "Donor → NGO", amount: "₹2.0L", hash: "a3f9…c21e", ok: true },
  { id: "#0142", route: "NGO → Vendor", amount: "₹0.8L", hash: "7b2d…09aa", ok: true },
  { id: "#0143", route: "NGO → ?", amount: "₹4.5L", hash: "missing", ok: false },
];

export default function Home() {
  return (
    <div className="tf">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <header className="tf-head">
        <h1 className="tf-brand">
          <b>TraceFund</b> · The Black Hole Ledger
        </h1>
        <nav className="tf-nav">
          <a href="#journey">Fund journey</a>
          <a href="#trust">NGO trust</a>
          <a href="#ledger">Ledger</a>
        </nav>
      </header>

      <section className="tf-card tf-hero">
        <div>
          <p className="tf-eye">VERIFIABLE NGO FUND FLOWS</p>
          <h2>Where did your donation really go?</h2>
          <p className="sub">
            TraceFund hashes every transaction and follows it from donor to beneficiary, so
            missing money cannot hide.
          </p>
          <div className="tf-btns">
            <a className="tf-b1" href="#ledger">Trace a donation</a>
            <a className="tf-b2" href="#ledger">View public ledger</a>
          </div>
        </div>
        <div className="tf-rings">
          <div className="tf-r2">
            <div className="tf-r3">
              <div className="tf-r4">
                <b>₹16.7L</b>
                <span>vanished</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tf-sec tf-stats">
        {stats.map((s) => (
          <div key={s.label} className={`tf-stat ${s.cls}`}>
            <p>{s.label}</p>
            <strong>{s.value}</strong>
          </div>
        ))}
      </section>

      <section id="journey" className="tf-sec tf-card tf-pad">
        <h3>The fund journey</h3>
        <p className="tf-note">Sample NGO: Asha Relief Trust. Each stage is a verified, hash-linked record.</p>
        <div style={{ marginTop: 6 }}>
          {journey.map((j) => (
            <div key={j.label} className="tf-row">
              <div className={`tf-lab ${j.bad ? "bad" : ""}`}>
                <span>{j.label}</span>
                <span>{j.amount}</span>
              </div>
              <div className={`tf-bar ${j.bad ? "bad" : ""}`} style={{ width: `${j.w}%` }} />
            </div>
          ))}
        </div>
      </section>

      <section className="tf-sec tf-two">
        <div id="trust" className="tf-card tf-pad">
          <h3>NGO trust score</h3>
          <div style={{ marginTop: 6 }}>
            {trust.map((t) => (
              <div key={t.name} className="tf-row">
                <div className="tf-lab" style={{ fontSize: 15 }}>
                  <span>{t.name}</span>
                  <span style={{ color: t.color }}>{t.score}/100</span>
                </div>
                <div className="tf-trk">
                  <i style={{ width: `${t.score}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="tf-card tf-pad">
          <h3>Why it cannot be faked</h3>
          <p className="tf-why">
            Every record stores the hash of the one before it. Edit a single amount and every
            later hash breaks, so tampering shows up instantly.
          </p>
          <p className="tf-hash">#0141 a3f9…c21e → #0142 7b2d…09aa → #0143 ???</p>
        </div>
      </section>

      <section id="ledger" className="tf-sec tf-card tf-pad">
        <h3>Public ledger</h3>
        <div className="tf-scroll">
          <table>
            <colgroup>
              <col style={{ width: "12%" }} />
              <col style={{ width: "31%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "23%" }} />
              <col style={{ width: "16%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>From → To</th>
                <th>Amount</th>
                <th>Hash</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.route}</td>
                  <td>{r.amount}</td>
                  <td className="m">{r.hash}</td>
                  <td className={r.ok ? "ok" : "no"}>{r.ok ? "Verified" : "Flagged"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
