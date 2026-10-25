/**
 * runRules(entries) -> flags[]
 * flag = { rule, severity, campaign, row_ids, details }
 *
 * Entry fields: campaign, type, from_party, to_party, amount, proof_url
 * (optional: id. Agar id nahi hai to row_ids mein 1-based row number aayega)
 */

const CONFIG = {
  types: { expense: 'expense', donation: 'donation', overhead: 'overhead' },
  bigAmount: 20000,
  roundMultiple: 10000,
  vendorShareLimit: 0.6,    // 60%
  overheadShareLimit: 0.3,  // 30%
};

function runRules(entries) {
  const T = CONFIG.types;
  const flags = [];

  const rows = (entries || []).map((e, i) => ({
    ...e,
    _id: e.id !== undefined && e.id !== null ? e.id : i + 1,
    _type: String(e.type || '').trim().toLowerCase(),
    _amount: Number(e.amount) || 0,
    _proof: String(e.proof_url || '').trim().toLowerCase(),
    _vendor: String(e.to_party || '').trim().toLowerCase(),
  }));

  const pct = (x) => (x * 100).toFixed(1) + '%';
  const sum = (arr) => arr.reduce((s, r) => s + r._amount, 0);
  const campaignOf = (arr) => [...new Set(arr.map((r) => r.campaign))].join(', ');

  // Rule 1: expense mein proof_url khali
  for (const r of rows) {
    if (r._type === T.expense && !r._proof) {
      flags.push({
        rule: 'MISSING_PROOF',
        severity: 'high',
        campaign: r.campaign,
        row_ids: [r._id],
        details: `Expense of ${r._amount} to "${r.to_party}" has no proof_url.`,
      });
    }
  }

  // Rule 2: same proof_url do ya zyada baar
  const byProof = new Map();
  for (const r of rows) {
    if (!r._proof) continue;
    if (!byProof.has(r._proof)) byProof.set(r._proof, []);
    byProof.get(r._proof).push(r);
  }
  for (const [url, group] of byProof) {
    if (group.length < 2) continue;
    flags.push({
      rule: 'DUPLICATE_PROOF',
      severity: 'high',
      campaign: campaignOf(group),
      row_ids: group.map((r) => r._id),
      details: `proof_url "${url}" used ${group.length} times (total amount ${sum(group)}).`,
    });
  }

  // Rule 3: amount > 20000 aur 10000 ka multiple (round-figure)
  for (const r of rows) {
    if (r._amount > CONFIG.bigAmount && r._amount % CONFIG.roundMultiple === 0) {
      flags.push({
        rule: 'ROUND_LARGE_AMOUNT',
        severity: 'medium',
        campaign: r.campaign,
        row_ids: [r._id],
        details: `Amount ${r._amount} is above ${CONFIG.bigAmount} and an exact multiple of ${CONFIG.roundMultiple}.`,
      });
    }
  }

  // Campaign-wise grouping (rules 4 & 5)
  const byCampaign = new Map();
  for (const r of rows) {
    if (!byCampaign.has(r.campaign)) byCampaign.set(r.campaign, []);
    byCampaign.get(r.campaign).push(r);
  }

  for (const [campaign, list] of byCampaign) {
    // Rule 4: ek vendor kul expense ka 60% se zyada
    const expenses = list.filter((r) => r._type === T.expense);
    const totalExpense = sum(expenses);
    if (totalExpense > 0) {
      const byVendor = new Map();
      for (const r of expenses) {
        if (!r._vendor) continue;
        if (!byVendor.has(r._vendor)) byVendor.set(r._vendor, []);
        byVendor.get(r._vendor).push(r);
      }
      for (const group of byVendor.values()) {
        const share = sum(group) / totalExpense;
        if (share > CONFIG.vendorShareLimit) {
          flags.push({
            rule: 'VENDOR_CONCENTRATION',
            severity: 'medium',
            campaign,
            row_ids: group.map((r) => r._id),
            details: `Vendor "${group[0].to_party}" got ${sum(group)} of ${totalExpense} total expense (${pct(share)}), limit ${pct(CONFIG.vendorShareLimit)}.`,
          });
        }
      }
    }

    // Rule 5: overhead kul donation ka 30% se zyada
    const donations = list.filter((r) => r._type === T.donation);
    const overheads = list.filter((r) => r._type === T.overhead);
    const totalDonation = sum(donations);
    const totalOverhead = sum(overheads);
    if (totalDonation > 0 && totalOverhead / totalDonation > CONFIG.overheadShareLimit) {
      flags.push({
        rule: 'HIGH_OVERHEAD',
        severity: 'high',
        campaign,
        row_ids: overheads.map((r) => r._id),
        details: `Overhead ${totalOverhead} is ${pct(totalOverhead / totalDonation)} of total donations ${totalDonation}, limit ${pct(CONFIG.overheadShareLimit)}.`,
      });
    }
  }

  return flags;
}

module.exports = { runRules, CONFIG };
