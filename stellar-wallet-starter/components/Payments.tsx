"use client";

import { useEffect, useState } from "react";
import { fetchPayments, shorten, type Payment } from "@/lib/stellar";
import { card } from "./styles";

export function Payments({ address, version }: { address: string; version: number }) {
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stale = false;
    fetchPayments(address)
      .then((next) => {
        if (stale) return;
        setPayments(next);
        setError(null);
      })
      .catch((e) => {
        if (!stale) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      stale = true;
    };
  }, [address, version]);

  return (
    <div className={card}>
      <h2 className="font-medium">Recent payments</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {payments?.length === 0 && <p className="text-sm text-neutral-600">No payments yet.</p>}
      <ul className="flex flex-col gap-1">
        {payments?.map((p) => (
          <li key={p.id} className="text-sm">
            {p.type === "payment" || p.type === "create_account" ? (
              <>
                {p.amount} {p.asset}: {shorten(p.from)} to {shorten(p.to)}
              </>
            ) : (
              p.type
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
