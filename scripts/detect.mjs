import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const ZERO = "00000000-0000-0000-0000-000000000000";
await supabase.from("flags").delete().neq("id", ZERO);

const { data: camps } = await supabase.from("campaigns").select("id, name");
const flags = [];
const add = (c, e, rule, severity, explanation) =>
  flags.push({ campaign_id: c.id, entry_id: e.id, rule, severity, explanation });
const inr = (n) => "Rs " + Number(n).toLocaleString("en-IN");

for (const c of camps) {
  const { data: es } = await supabase.from("ledger_entries")
    .select("*").eq("campaign_id", c.id).order("seq");
  const entries = es || [];
  const expenses = entries.filter((e) => e.type === "expense");

  for (const e of expenses)
    if (!e.proof_url)
      add(c, e, "missing_proof", "high", `Expense of ${inr(e.amount)} to ${e.to_party} has no receipt attached.`);

  const seen = {};
  for (const e of expenses) {
    if (!e.proof_url) continue;
    if (seen[e.proof_url])
      add(c, e, "duplicate_invoice", "high", `Invoice ${e.proof_url} was already used by an earlier entry. Possible double-counting.`);
    else seen[e.proof_url] = e;
  }

  for (const e of expenses)
    if (e.amount >= 20000 && e.amount % 10000 === 0)
      add(c, e, "round_bill", "medium", `Suspiciously round bill of ${inr(e.amount)} to ${e.to_party}.`);

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const byVendor = {};
  for (const e of expenses) byVendor[e.to_party] = (byVendor[e.to_party] || 0) + Number(e.amount);
  for (const [v, amt] of Object.entries(byVendor)) {
    const share = total ? amt / total : 0;
    const list = expenses.filter((e) => e.to_party === v);
    if (share > 0.5 && list.length >= 3)
      for (const e of list)
        add(c, e, "vendor_concentration", "medium", `${v} receives ${(share * 100).toFixed(0)}% of this campaign's spending.`);
  }

  const donated = entries.filter((e) => e.type === "donation").reduce((s, e) => s + Number(e.amount), 0);
  const ovList = entries.filter((e) => e.type === "allocation" && e.to_party === "Admin / Overhead");
  const ov = ovList.reduce((s, e) => s + Number(e.amount), 0);
  const ovShare = donated ? ov / donated : 0;
  console.log(`${c.name}: donated ${donated}, overhead ${ov} = ${(ovShare * 100).toFixed(1)}%`);
  if (ovShare > 0.25 && ovList.length) {
    const big = ovList.reduce((a, b) => (Number(b.amount) > Number(a.amount) ? b : a));
    add(c, big, "high_overhead", "medium", `Admin / Overhead takes ${(ovShare * 100).toFixed(0)}% of donations (healthy limit is ~25%).`);
  }
}

if (flags.length) {
  const { error } = await supabase.from("flags").insert(flags);
  if (error) { console.error(error.message); process.exit(1); }
}
const count = {};
for (const f of flags) count[f.rule] = (count[f.rule] || 0) + 1;
console.log("Flags created:", flags.length, count);