import { supabase } from "@/lib/supabase";

export async function GET(req) {
  const id = new URL(req.url).searchParams.get("campaign_id");
  let q = supabase.from("flags").select("*").order("created_at");
  if (id) q = q.eq("campaign_id", id);
  const { data, error } = await q;
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(data);
}