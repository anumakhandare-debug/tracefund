import { supabase } from "@/lib/supabase";

async function reset(req) {
  const id = new URL(req.url).searchParams.get("campaign_id");
  const { data } = await supabase.from("ledger_entries")
    .select("id, original_amount").eq("campaign_id", id)
    .not("original_amount", "is", null);
  for (const e of data || [])
    await supabase.from("ledger_entries")
      .update({ amount: e.original_amount, original_amount: null }).eq("id", e.id);
  return Response.json({ restored: (data || []).length });
}
export const GET = reset;
export const POST = reset;