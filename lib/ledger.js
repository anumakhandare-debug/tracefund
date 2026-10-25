import crypto from "crypto";

export const GENESIS = "0".repeat(64);

export function canonical(e) {
  return JSON.stringify([
    e.campaign_id, e.type, e.from_party ?? null, e.to_party ?? null,
    Number(e.amount), e.proof_url || null,
  ]);
}

export function makeHash(prevHash, entry) {
  return crypto.createHash("sha256")
    .update(prevHash + canonical(entry)).digest("hex");
}

export function verifyChain(entries) {
  let prev = GENESIS;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.prev_hash !== prev)
      return { valid: false, brokenAt: i, entry_id: e.id, reason: "Chain link toota" };
    if (makeHash(e.prev_hash, e) !== e.entry_hash)
      return { valid: false, brokenAt: i, entry_id: e.id, reason: "Record ka data badla gaya" };
    prev = e.entry_hash;
  }
  return { valid: true, length: entries.length };
}