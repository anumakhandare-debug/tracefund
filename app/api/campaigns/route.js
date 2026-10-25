import { supabase } from "@/lib/supabase";

export async function GET(req) {
  new URL(req.url); // route ko dynamic rakhta hai
  const { data, error } = await supabase.from("campaigns")
    .select("id, name, organizations(name)");
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(data);
}