"use client";

import { useCallback, useState } from "react";
import { useCavos } from "@cavos/kit/react";
import type { CavosStellar } from "@cavos/kit";
import { useAction } from "@/lib/useAction";
import { Balances } from "./Balances";
import { Payments } from "./Payments";
import { SendXlm } from "./SendXlm";
import { button, card } from "./styles";

export function Wallet() {
  const { wallet, isLoading, isAuthenticated, authError, openModal } = useCavos();

  if (!isAuthenticated) {
    if (isLoading) return <p className="text-sm">Loading...</p>;
    return (
      <div className={card}>
        {authError && <p className="text-sm text-red-600">Sign-in failed: {authError}</p>}
        <button className={button} onClick={openModal}>
          Sign in
        </button>
      </div>
    );
  }

  if (wallet?.chain !== "stellar") return <p className="text-sm">Connecting your wallet...</p>;

  return <Account wallet={wallet} />;
}

function Account({ wallet }: { wallet: CavosStellar }) {
  const { logout, authorizeDevice, walletStatus } = useCavos();
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  const create = useAction(() => wallet.create(), refresh);
  const approve = useAction(authorizeDevice, refresh);
  const status = wallet.status;

  return (
    <>
      <div className={card}>
        <p className="text-sm">
          Address: <code className="break-all">{wallet.address}</code>
        </p>
        <p className="text-sm">
          Status: <code>{status}</code>
        </p>
        {status === "undeployed" && (
          <>
            <p className="text-sm text-neutral-600">
              The account does not exist on the network yet. Creating it is sponsored: it costs you
              nothing and starts with 0 XLM.
            </p>
            <button className={button} onClick={create.run} disabled={create.pending}>
              {create.pending ? "Creating..." : "Create account"}
            </button>
            {create.error && <p className="text-sm text-red-600">{create.error}</p>}
          </>
        )}
        {status === "needs-device-approval" && (
          <>
            <p className="text-sm text-neutral-600">
              This wallet already exists but this device is not authorized to sign for it yet.
              Approve this device to continue.
            </p>
            <button className={button} onClick={approve.run} disabled={approve.pending}>
              {approve.pending ? "Approving..." : "Approve this device"}
            </button>
            {approve.error && <p className="text-sm text-red-600">{approve.error}</p>}
          </>
        )}
        {walletStatus.isDeploying && <p className="text-sm">Working...</p>}
        <button className="self-start text-sm underline" onClick={logout}>
          Sign out
        </button>
      </div>
      {status !== "needs-device-approval" && (
        <>
          <Balances wallet={wallet} version={version} onChange={refresh} />
          <SendXlm wallet={wallet} onSent={refresh} />
          <Payments address={wallet.address} version={version} />
        </>
      )}
    </>
  );
}
