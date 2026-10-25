import type { ReactNode } from "react";

export const metadata = { title: "TraceFund · The Black Hole Ledger" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
