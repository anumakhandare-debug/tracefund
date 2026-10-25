import { supabase } from "@/lib/supabase";

export async function GET(req) {
  const id = new URL(req.url).searchParams.get("campaign_id");
  let q = supabase.from("ledger_entries").select("type, amount, proof_url");
  let f = supabase.from("flags").select("id", { count: "exact", head: true });
  if (id) { q = q.eq("campaign_id", id); f = f.eq("campaign_id", id); }
  const [{ data, error }, { count }] = await Promise.all([q, f]);
  if (error) return Response.json({ error: error.message }, { status: 400 });

  const rows = data || [];
  const sum = (a) => a.reduce((s, x) => s + Number(x.amount), 0);
  const donated = sum(rows.filter((r) => r.type === "donation"));
  const allocated = sum(rows.filter((r) => r.type === "allocation"));
  const exp = rows.filter((r) => r.type === "expense");
  const spent = sum(exp);
  const proven = sum(exp.filter((r) => r.proof_url));
  return Response.json({
    donated, allocated, spent,
    delivered_with_proof: proven,
    black_hole: Math.max(0, donated - proven),
    transactions: rows.length,
    flags: count || 0,
  });
}