import { Asset, Horizon, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { HORIZON_URL } from "./stellar";

const FAUCET_XLM = "100";

/**
 * Sends testnet XLM to an existing account. Friendbot only funds addresses that do not exist yet,
 * so this funds a throwaway account with Friendbot and pays from it.
 */
export async function fundFromFriendbot(destination: string): Promise<string> {
  const source = Keypair.random();
  const response = await fetch(`https://friendbot.stellar.org/?addr=${source.publicKey()}`);
  if (!response.ok) throw new Error(`Friendbot returned ${response.status}`);

  const server = new Horizon.Server(HORIZON_URL);
  const account = await server.loadAccount(source.publicKey());
  const tx = new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.payment({ destination, asset: Asset.native(), amount: FAUCET_XLM }))
    .setTimeout(60)
    .build();
  tx.sign(source);
  const result = await server.submitTransaction(tx);
  return result.hash;
}
