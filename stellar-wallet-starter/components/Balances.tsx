"use client";

import { useEffect, useState } from "react";
import type { CavosStellar } from "@cavos/kit";
import { USDC, formatXlm } from "@/lib/stellar";
import { useAction } from "@/lib/useAction";
import { button, card } from "./styles";

interface Props {
  wallet: CavosStellar;
  version: number;
  onChange: () => void;
}

export function Balances({ wallet, version, onChange }: Props) {
  const [xlm, setXlm] = useState<bigint | null>(null);
  const [usdc, setUsdc] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const trustline = useAction(() => wallet.addTrustline(USDC), onChange);
  const status = wallet.status;

  useEffect(() => {
    let stale = false;
    Promise.all([wallet.balance(), wallet.tokenBalance(USDC)])
      .then(([nextXlm, nextUsdc]) => {
        if (stale) return;
        setXlm(nextXlm);
        setUsdc(nextUsdc);
        setLoadError(null);
      })
      .catch((e) => {
        if (!stale) setLoadError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      stale = true;
    };
  }, [wallet, status, version]);

  return (
    <div className={card}>
      <h2 className="font-medium">Balances</h2>
      {loadError && <p className="text-sm text-red-600">{loadError}</p>}
      <p className="text-sm">XLM: {xlm === null ? "..." : formatXlm(xlm)}</p>
      <p className="text-sm">USDC (testnet): {usdc ?? "..."}</p>
      <button
        className={button}
        onClick={trustline.run}
        disabled={trustline.pending || status !== "ready"}
      >
        {trustline.pending ? "Adding..." : "Add USDC trustline"}
      </button>
      <p className="text-sm text-neutral-600">
        The trustline reserve and the fee are sponsored. Create the account first.
      </p>
      {trustline.error && <p className="text-sm text-red-600">{trustline.error}</p>}
    </div>
  );
}
