import { supabase } from "@/lib/supabase";

export async function GET(req) {
  new URL(req.url);
  const { data: camps } = await supabase.from("campaigns")
    .select("id, name, organizations(name)");
  const { data: fl } = await supabase.from("flags").select("campaign_id, severity");
  const out = (camps || []).map((c) => {
    const mine = (fl || []).filter((f) => f.campaign_id === c.id);
    const high = mine.filter((f) => f.severity === "high").length;
    const med = mine.length - high;
    return {
      campaign_id: c.id, campaign: c.name,
      ngo: c.organizations?.name || c.name,
      flags: mine.length,
      score: Math.max(0, 100 - high * 10 - med * 4),
    };
  });
  return Response.json(out);
}