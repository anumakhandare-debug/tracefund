import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { GENESIS, makeHash } from "../lib/ledger.js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const ZERO = "00000000-0000-0000-0000-000000000000";

function parseLine(line) {
  const out = []; let cur = "", q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const lines = readFileSync("data/tracefund_dataset.csv", "utf8").split(/\r?\n/).filter((l) => l.trim());
const header = parseLine(lines[0]);
const rows = lines.slice(1).map((l) => {
  const c = parseLine(l);
  return Object.fromEntries(header.map((h, i) => [h, c[i] ?? ""]));
});
console.log("CSV rows:", rows.length);

// purana data saaf
for (const t of ["flags", "ledger_entries", "campaigns", "organizations"]) {
  const { error } = await supabase.from(t).delete().neq("id", ZERO);
  if (error) { console.error("delete", t, error.message); process.exit(1); }
}

// har campaign ka NGO donation rows se milta hai
const ngoOf = {};
for (const r of rows) if (r.type === "donation") ngoOf[r.campaign] = r.to_party;

const campId = {};
for (const name of Object.keys(ngoOf)) {
  const { data: org, error: e1 } = await supabase.from("organizations")
    .insert({ name: ngoOf[name] }).select().single();
  if (e1) { console.error(e1.message); process.exit(1); }
  const { data: camp, error: e2 } = await supabase.from("campaigns")
    .insert({ org_id: org.id, name }).select().single();
  if (e2) { console.error(e2.message); process.exit(1); }
  campId[name] = camp.id;
}

rows.sort((a, b) => a.date.localeCompare(b.date)); // stable sort

const prev = {};
let n = 0;
for (const r of rows) {
  const cid = campId[r.campaign];
  if (!cid) { console.log("skip (campaign nahi mila):", r.campaign); continue; }
  const row = {
    campaign_id: cid, type: r.type,
    from_party: r.from_party || null, to_party: r.to_party || null,
    amount: Number(r.amount), proof_url: r.proof_url || null,
  };
  const prev_hash = prev[cid] ?? GENESIS;
  const entry_hash = makeHash(prev_hash, row);
  const { error } = await supabase.from("ledger_entries")
    .insert({ ...row, prev_hash, entry_hash, created_at: r.date });
  if (error) { console.error("insert fail:", error.message, r); process.exit(1); }
  prev[cid] = entry_hash;
  if (++n % 25 === 0) console.log("inserted", n);
}
console.log("DONE. Total entries:", n);
console.log("Campaign IDs:", campId);