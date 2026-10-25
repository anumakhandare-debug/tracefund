import { supabase } from "@/lib/supabase";
import { verifyChain } from "@/lib/ledger";

export async function GET(req) {
  const id = new URL(req.url).searchParams.get("campaign_id");
  const { data, error } = await supabase.from("ledger_entries")
    .select("*").eq("campaign_id", id).order("seq");
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(verifyChain(data || []));
}