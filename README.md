# TraceFund

Tamper-evident ledger for NGO funds, with an AI auditor.
Every donation, allocation and expense is stored in a hash chain, so if anyone edits an old record, verification fails immediately.

## What it does
- Tracks funds from donor to beneficiary (Sankey chart)
- Hash-chained ledger with a Verify button (green = intact, red = tampered)
- AI auditor flags suspicious entries and explains them
- Demo mode: Tamper and Reset buttons

## Tech stack
Next.js, Supabase (Postgres), Vercel, Nebius Token Factory with NVIDIA Nemotron

## What existed before this hackathon
TraceFund was first built for the Black Hole Ledger hackathon. That version already had:
- the hash-chain ledger and verification
- the Supabase database and API endpoints
- the Sankey trace view and anomaly flags
- tamper/reset demo mode and the Vercel deployment

## What is new for the Nebius x NVIDIA hackathon
- (Fill this in only with what you really finished)
- AI auditor moved from Claude to NVIDIA Nemotron on Nebius Token Factory
- Ask the Ledger (if built)
- Audit report / root hash display (if built)

## Setup
1. Clone the repo and run `npm install`
2. Create `.env.local` with:
   SUPABASE_URL, SUPABASE_SERVICE_KEY,
   NEBIUS_API_KEY, NEBIUS_BASE_URL, NEBIUS_MODEL
3. Run `npm run dev`

## Feedback on Nebius / NVIDIA tools
(Write 4-5 honest lines after you try them)

## Limitations
An admin could rebuild the whole chain. Future work: anchor the root hash publicly.

## License
MIT
