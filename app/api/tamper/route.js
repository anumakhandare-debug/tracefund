import { supabase } from "@/lib/supabase";

async function tamper(req) {
  const id = new URL(req.url).searchParams.get("campaign_id");
  const { data } = await supabase.from("ledger_entries")
    .select("id, amount").eq("campaign_id", id).eq("type", "expense")
    .is("original_amount", null).order("seq").limit(1);
  if (!data?.length) return Response.json({ error: "koi expense nahi mila" }, { status: 404 });
  const e = data[0];
  const newAmount = Number(e.amount) > 1000 ? Number(e.amount) - 1000 : Number(e.amount) + 1000;
  // entry_hash ko NAHI chhedna, isi se chain tootegi
  await supabase.from("ledger_entries")
    .update({ original_amount: e.amount, amount: newAmount }).eq("id", e.id);
  return Response.json({ tampered: e.id, from: Number(e.amount), to: newAmount });
}
export const GET = tamper;
export const POST = tamper;