"use client";

import { useState } from "react";
import type { CavosStellar } from "@cavos/kit";
import { fundFromFriendbot } from "@/lib/faucet";
import { isStellarAddress, parseXlm } from "@/lib/stellar";
import { useAction } from "@/lib/useAction";
import { button, card } from "./styles";

export function SendXlm({ wallet, onSent }: { wallet: CavosStellar; onSent: () => void }) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fund = useAction(() => fundFromFriendbot(wallet.address), onSent);

  const stroops = parseXlm(amount);
  const valid = isStellarAddress(destination) && stroops !== null;

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (stroops === null) return;
    setPending(true);
    setError(null);
    setHash(null);
    try {
      setHash(await wallet.execute(stroops, destination));
      onSent();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={card} onSubmit={send}>
      <h2 className="font-medium">Send XLM</h2>
      <p className="text-sm text-neutral-600">
        The account must hold the XLM you send. A new sponsored account holds 0 XLM, so a first
        payment fails with <code>op_underfunded</code>. Get testnet XLM first.
      </p>
      <button
        type="button"
        className={button}
        onClick={fund.run}
        disabled={fund.pending || wallet.status !== "ready"}
      >
        {fund.pending ? "Funding..." : "Get 100 testnet XLM"}
      </button>
      {fund.error && <p className="text-sm text-red-600">{fund.error}</p>}
      <input
        className="rounded border border-neutral-300 px-2 py-1 text-sm"
        placeholder="Destination (G...)"
        value={destination}
        onChange={(e) => setDestination(e.target.value.trim())}
      />
      <input
        className="rounded border border-neutral-300 px-2 py-1 text-sm"
        placeholder="Amount in XLM"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className={button} type="submit" disabled={!valid || pending}>
        {pending ? "Sending..." : "Send"}
      </button>
      {hash && <p className="break-all text-sm">Sent. Transaction hash: {hash}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
