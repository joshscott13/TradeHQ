import Decimal from "decimal.js";

const Money = Decimal.clone({ precision: 100 });
export const MAX_CSV_BYTES = 250 * 1024;
export const MAX_RECORDS = 2000;
export const CSV_HEADERS = ["record_id", "account_id", "platform", "firm", "program", "instrument", "closed_at", "currency", "gross_pnl", "commissions", "fees"] as const;
export type Platform = "Tradovate" | "Rithmic";
export type MoneyTotals = { grossPnl: string; commissions: string; fees: string; netPnl: string };
export type PreviewError = { row: number; message: string };
export type PreviewRow = MoneyTotals & {
  recordId: string; accountId: string; platform: Platform; firm: string; program: string;
  instrument: string; closedAt: string; currency: "USD";
  source: { row: number; recordNumber: number; fields: string[] };
};
export type AccountSummary = MoneyTotals & {
  accountId: string; platform: Platform; firm: string; program: string; currency: "USD"; rowCount: number;
};
export type PreviewResult = { ok: false; errors: PreviewError[] } | {
  ok: true; rows: PreviewRow[]; accounts: AccountSummary[]; totals: MoneyTotals;
  duplicateCount: number; uniqueRowCount: number;
};

type CsvRecord = { fields: string[]; row: number };
// A bounded state machine: quotes are only valid at the beginning of a field.
function readCsv(input: string): CsvRecord[] {
  const text = input.replace(/^\uFEFF/, "");
  const records: CsvRecord[] = [];
  let fields: string[] = [], field = "", quoted = false, closed = false, line = 1, start = 1;
  function finishField() { fields.push(field); field = ""; closed = false; }
  function finishRecord() {
    finishField(); records.push({ fields, row: start }); fields = [];
    if (records.length > MAX_RECORDS + 1) throw { row: start, message: `Limit is ${MAX_RECORDS} data records.` };
  }
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; closed = true; }
      } else {
        field += char;
        if (char === "\n" || (char === "\r" && text[i + 1] !== "\n")) line++;
      }
      continue;
    }
    if (char === ",") { finishField(); continue; }
    if (char === "\n" || char === "\r") {
      finishRecord(); if (char === "\r" && text[i + 1] === "\n") i++;
      line++; start = line; continue;
    }
    if (closed) throw { row: start, message: "Unexpected text after closing quote." };
    if (char === '"') {
      if (field.length) throw { row: start, message: "Unexpected quote in unquoted field." };
      quoted = true;
    } else field += char;
  }
  if (quoted) throw { row: start, message: "Unclosed quoted field." };
  if (field.length || fields.length || closed) finishRecord();
  return records;
}

function validTimestamp(value: string): boolean {
  const parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!parts) return false;
  const [, year, month, day, hour, minute, second, zone] = parts;
  const y = Number(year), m = Number(month), d = Number(day);
  const days = [31, y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (y < 1 || m < 1 || m > 12 || d < 1 || d > days[m - 1] || Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) return false;
  if (zone !== "Z") {
    const hours = Number(zone.slice(1, 3)), minutes = Number(zone.slice(4, 6));
    if (hours > 14 || minutes > 59 || (hours === 14 && minutes !== 0)) return false;
  }
  return Number.isFinite(Date.parse(value));
}
function zero(): MoneyTotals { return { grossPnl: "0", commissions: "0", fees: "0", netPnl: "0" }; }
function add(total: MoneyTotals, row: MoneyTotals) {
  for (const key of ["grossPnl", "commissions", "fees", "netPnl"] as const) total[key] = new Money(total[key]).plus(row[key]).toFixed();
}

/** Local preview only: these are TradeHQ example records, not vendor-native adapters. */
export function previewCsv(text: string): PreviewResult {
  if (text.length > MAX_CSV_BYTES || new TextEncoder().encode(text).byteLength > MAX_CSV_BYTES)
    return { ok: false, errors: [{ row: 1, message: "CSV exceeds the 250 KiB limit." }] };
  let records: CsvRecord[];
  try { records = readCsv(text); }
  catch (error) { return { ok: false, errors: [error as PreviewError] }; }
  if (!records.length || records[0].fields.length !== CSV_HEADERS.length || records[0].fields.some((field, i) => field !== CSV_HEADERS[i]))
    return { ok: false, errors: [{ row: 1, message: `Use the exact ordered TradeHQ example headers: ${CSV_HEADERS.join(",")}` }] };
  if (records.length === 1) return { ok: false, errors: [{ row: 2, message: "Include at least one data record." }] };
  const errors: PreviewError[] = [], rows: PreviewRow[] = [];
  const identities = new Map<string, string>(), accounts = new Map<string, AccountSummary>();
  const totals = zero(); let duplicateCount = 0;
  records.slice(1).forEach((record, index) => {
    const fail = (message: string) => errors.push({ row: record.row, message });
    if (record.fields.length !== CSV_HEADERS.length) { fail(`Expected ${CSV_HEADERS.length} fields; found ${record.fields.length}.`); return; }
    const values = record.fields.map(value => value.trim());
    let invalid = false;
    for (let i = 0; i < 8; i++) {
      if (!values[i] || values[i].length > 100 || /^[=+\-@]/.test(values[i]) || /[\u0000-\u001F\u007F]/.test(record.fields[i])) {
        fail(`${CSV_HEADERS[i]} must be nonempty text of at most 100 characters without controls or a formula-leading character.`); invalid = true;
      }
    }
    if (values[2] !== "Tradovate" && values[2] !== "Rithmic") { fail("platform must be Tradovate or Rithmic."); invalid = true; }
    if (values[7] !== "USD") { fail("currency must be USD; currencies are never combined."); invalid = true; }
    if (!validTimestamp(values[6])) { fail("closed_at must be a valid ISO timestamp with explicit Z or numeric offset."); invalid = true; }
    const money: string[] = [];
    for (let i = 8; i < 11; i++) {
      const value = values[i];
      if (value.length > 32 || !/^-?\d+(?:\.\d{1,8})?$/.test(value) || new Money(value).abs().gt("1000000000000") || (i > 8 && new Money(value).isNegative() && !new Money(value).isZero())) {
        fail(`${CSV_HEADERS[i]} must be a ${i === 8 ? "signed" : "nonnegative"} decimal amount with at most eight decimals and magnitude at most $1 trillion.`); invalid = true;
      } else money.push(new Money(value).toFixed());
    }
    if (invalid) return;
    const [recordId, accountId, platform, firm, program, instrument, closedAt] = values;
    const [grossPnl, commissions, fees] = money;
    const identity = JSON.stringify([platform, accountId, recordId]);
    const normalized = JSON.stringify([...values.slice(0, 8), ...money]);
    if (identities.has(identity)) {
      if (identities.get(identity) === normalized) duplicateCount++;
      else fail(`Conflicting repeated source identity: ${platform} / ${accountId} / ${recordId}.`);
      return;
    }
    identities.set(identity, normalized);
    const key = JSON.stringify([platform, accountId]);
    let account = accounts.get(key);
    if (account && (account.firm !== firm || account.program !== program)) { fail(`Conflicting firm/program metadata for ${platform} / ${accountId}.`); return; }
    const row: PreviewRow = {
      recordId, accountId, platform: platform as Platform, firm, program, instrument, closedAt, currency: "USD",
      grossPnl, commissions, fees, netPnl: new Money(grossPnl).minus(commissions).minus(fees).toFixed(),
      source: { row: record.row, recordNumber: index + 1, fields: [...record.fields] }
    };
    if (!account) {
      account = { ...zero(), accountId, platform: platform as Platform, firm, program, currency: "USD", rowCount: 0 };
      accounts.set(key, account);
    }
    account.rowCount++; add(account, row); add(totals, row); rows.push(row);
  });
  if (errors.length) return { ok: false, errors };
  return { ok: true, rows, accounts: [...accounts.values()], totals, duplicateCount, uniqueRowCount: rows.length };
}

export const EXAMPLE_DATASETS = [
  {
    id: "tradovate-lucid", label: "Tradovate · Lucid $50k", description: "Synthetic TradeHQ example CSV. No native export compatibility or actual account history is implied.",
    csv: CSV_HEADERS.join(",") + "\n" + [
      "FAKE-L001,FAKE-LUCID-50K,Tradovate,Lucid,LucidFlex 50k,MES,2026-09-28T14:30:00Z,USD,250.50,4.50,1.25",
      "FAKE-L002,FAKE-LUCID-50K,Tradovate,Lucid,LucidFlex 50k,MES,2026-09-28T15:00:00Z,USD,-75.25,4.50,1.25",
      "FAKE-L003,FAKE-LUCID-50K,Tradovate,Lucid,LucidFlex 50k,MNQ,2026-09-29T09:45:00-05:00,USD,180,3,1"
    ].join("\n"),
    expectedTotals: { grossPnl: "355.25", commissions: "12", fees: "3.5", netPnl: "339.75" }
  },
  {
    id: "rithmic-tradeify", label: "Rithmic · Tradeify $50k", description: "Synthetic TradeHQ example CSV. No native export compatibility or actual account history is implied.",
    csv: CSV_HEADERS.join(",") + "\n" + [
      "FAKE-T001,FAKE-TRADEIFY-50K-A,Rithmic,Tradeify,Select 50k,MNQ,2026-09-28T14:20:00Z,USD,320.10,6.20,0.80",
      "FAKE-T002,FAKE-TRADEIFY-50K-A,Rithmic,Tradeify,Select 50k,MNQ,2026-09-29T14:20:00Z,USD,-120.10,6.20,0.80",
      "FAKE-T003,FAKE-TRADEIFY-50K-B,Rithmic,Tradeify,Growth 50k,MES,2026-09-29T15:20:00Z,USD,95.25,2.50,0.50"
    ].join("\n"),
    expectedTotals: { grossPnl: "295.25", commissions: "14.9", fees: "2.1", netPnl: "278.25" }
  }
] satisfies { id: string; label: string; description: string; csv: string; expectedTotals: MoneyTotals }[];
