export const HORIZON_URL = "https://horizon-testnet.stellar.org";

export const USDC = {
  code: "USDC",
  issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
};

const STROOPS_PER_XLM = 10_000_000n;

export function formatXlm(stroops: bigint): string {
  const whole = stroops / STROOPS_PER_XLM;
  const fraction = (stroops % STROOPS_PER_XLM).toString().padStart(7, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

/** Parses a decimal XLM amount such as "1.5" into stroops, or returns null if it is not a positive amount with at most 7 decimals. */
export function parseXlm(input: string): bigint | null {
  const match = /^(\d+)(?:\.(\d{1,7}))?$/.exec(input.trim());
  if (!match) return null;
  const stroops = BigInt(match[1]) * STROOPS_PER_XLM + BigInt((match[2] ?? "").padEnd(7, "0"));
  return stroops > 0n ? stroops : null;
}

export function isStellarAddress(value: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(value);
}

export function shorten(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export interface Payment {
  id: string;
  type: string;
  from: string;
  to: string;
  amount: string;
  asset: string;
}

interface HorizonRecord {
  id: string;
  type: string;
  from?: string;
  to?: string;
  funder?: string;
  account?: string;
  amount?: string;
  starting_balance?: string;
  asset_type?: string;
  asset_code?: string;
}

/** Fetches the ten most recent payments of an account from Horizon testnet. An account that does not exist yet has none. */
export async function fetchPayments(address: string): Promise<Payment[]> {
  const response = await fetch(
    `${HORIZON_URL}/accounts/${address}/payments?order=desc&limit=10`,
  );
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`Horizon returned ${response.status}`);
  const body: { _embedded: { records: HorizonRecord[] } } = await response.json();
  return body._embedded.records.map((record) => ({
    id: record.id,
    type: record.type,
    from: record.from ?? record.funder ?? "",
    to: record.to ?? record.account ?? "",
    amount: record.amount ?? record.starting_balance ?? "",
    asset: record.asset_type === "native" || record.type === "create_account"
      ? "XLM"
      : (record.asset_code ?? ""),
  }));
}
