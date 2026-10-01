import test from "node:test";
import assert from "node:assert/strict";
import { CSV_HEADERS, EXAMPLE_DATASETS, MAX_CSV_BYTES, MAX_RECORDS, previewCsv } from "../src/index.ts";

const header = CSV_HEADERS.join(",");
const base = ["FAKE-001", "FAKE-ACCOUNT", "Tradovate", "Lucid", "LucidFlex 50k", "MES", "2026-09-30T14:30:00Z", "USD", "100.10", "0.20", "0.30"];
const csv = (...rows: string[][]) => header + "\n" + rows.map(row => row.join(",")).join("\n");
function invalid(text: string, pattern?: RegExp) {
  const result = previewCsv(text);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(result.errors.length > 0);
    assert.ok(!("totals" in result), "No partial total on invalid input");
    if (pattern) assert.match(result.errors.map(error => error.message).join(" "), pattern);
  }
}

test("synthetic totals reconcile to independently written expected amounts", () => {
  for (const example of EXAMPLE_DATASETS) {
    const result = previewCsv(example.csv);
    assert.ok(result.ok);
    if (result.ok) {
      assert.deepEqual(result.totals, example.expectedTotals);
      assert.equal(result.uniqueRowCount, 3);
      assert.equal(result.duplicateCount, 0);
      assert.ok(result.rows.every(row => row.recordId.startsWith("FAKE") && row.accountId.startsWith("FAKE")));
    }
  }
  const tradeify = previewCsv(EXAMPLE_DATASETS[1].csv);
  assert.ok(tradeify.ok);
  if (tradeify.ok) assert.deepEqual(tradeify.accounts.map(account => account.netPnl), ["186", "92.25"]);
});

test("money is exact before display, with no monetary float coercion", () => {
  const result = previewCsv(csv(base, [...base.slice(0, 8), "0.00000001", "0", "0"].map((value, i) => i === 0 ? "FAKE-002" : value)));
  assert.ok(result.ok);
  if (result.ok) assert.equal(result.totals.netPnl, "99.60000001");
  for (const amount of ["", "1e2", "NaN", "Infinity", "+1", "1.", "1.000000001", "1000000000000.00000001"]) invalid(csv(base.map((v, i) => i === 8 ? amount : v)), /gross_pnl/);
  for (const i of [9, 10]) invalid(csv(base.map((v, j) => j === i ? "-0.01" : v)), /nonnegative/);
  const large = previewCsv(csv(base.map((v, i) => i === 8 ? "1000000000000" : v)));
  assert.ok(large.ok);
});

test("BOM, LF/CRLF, commas, escaped quotes and original provenance", () => {
  const fields = base.map((v, i) => i === 3 ? '"Lucid, ""example"""' : v);
  const result = previewCsv("\uFEFF" + csv(fields).replaceAll("\n", "\r\n") + "\r\n");
  assert.ok(result.ok);
  if (result.ok) {
    assert.equal(result.rows[0].firm, 'Lucid, "example"');
    assert.equal(result.rows[0].source.row, 2);
    assert.equal(result.rows[0].source.recordNumber, 1);
    assert.equal(result.rows[0].source.fields[3], 'Lucid, "example"');
  }
  const multiline = previewCsv(csv(base.map((v, i) => i === 3 ? '"Lucid\nexample"' : v), base.map((v, i) => i === 0 ? "FAKE-002" : i === 7 ? "EUR" : v)));
  assert.equal(multiline.ok, false);
  if (!multiline.ok) {
    assert.ok(multiline.errors.some(error => error.row === 2 && /controls/.test(error.message)));
    assert.ok(multiline.errors.some(error => error.row === 4 && /currency/.test(error.message)));
  }
});

test("malformed quotes, unexpected headers and incorrect widths reject", () => {
  invalid(header + '\n"unclosed', /Unclosed/);
  invalid(csv(base.map((v, i) => i === 3 ? 'Lu"cid' : v)), /Unexpected quote/);
  invalid(csv(base.map((v, i) => i === 3 ? '"Lucid"bad' : v)), /after closing quote/);
  invalid(csv(base).replace("record_id", "recordId"), /headers/);
  invalid(header);
  invalid(csv(base.slice(0, -1)), /Expected 11/);
  invalid(csv([...base, "extra"]), /Expected 11/);
  invalid(csv(base) + "\n\n", /Expected 11/);
});

test("timestamps require exact possible calendar times with explicit offsets", () => {
  for (const timestamp of ["2026-02-29T14:30:00Z", "2026-04-31T14:30:00Z", "2026-13-01T14:30:00Z", "2026-09-30T24:00:00Z", "2026-09-30T14:60:00Z", "2026-09-30T14:30:60Z", "2026-09-30T14:30:00", "2026-09-30", "0000-01-01T00:00:00Z", "2026-09-30T14:30:00+14:01", "2026-09-30T14:30:00-15:00"]) invalid(csv(base.map((v, i) => i === 6 ? timestamp : v)), /closed_at/);
  for (const timestamp of ["2024-02-29T14:30:00Z", "2026-09-30T09:30:00-05:00", "2026-09-30T14:30:00.123456789+14:00"]) assert.ok(previewCsv(csv(base.map((v, i) => i === 6 ? timestamp : v))).ok);
});

test("dedupe only same source identity and normalized data, conflicting repeats fail", () => {
  const normalized = base.map((v, i) => i === 8 ? "100.100" : v);
  const result = previewCsv(csv(base, normalized, base.map((v, i) => i === 0 ? "FAKE-002" : v)));
  assert.ok(result.ok);
  if (result.ok) { assert.equal(result.duplicateCount, 1); assert.equal(result.uniqueRowCount, 2); assert.equal(result.totals.netPnl, "199.2"); }
  invalid(csv(base, base.map((v, i) => i === 8 ? "100.11" : v)), /Conflicting repeated/);
  invalid(csv(base, base.map((v, i) => i === 0 ? "FAKE-002" : i === 4 ? "Other" : v)), /Conflicting firm\/program/);
  const separate = previewCsv(csv(base, base.map((v, i) => i === 1 ? "FAKE-OTHER" : v), base.map((v, i) => i === 2 ? "Rithmic" : v)));
  assert.ok(separate.ok);
  if (separate.ok) assert.equal(separate.accounts.length, 3);
});

test("metadata rejects formulas and controls while preserving string IDs", () => {
  for (const value of ["=SUM(1)", "+123", "-123", "@value", " \tFAKE", "FAKE\u0000", "x".repeat(101), " "]) invalid(csv(base.map((v, i) => i === 0 ? value : v)), /record_id/);
  invalid(csv(base.map((v, i) => i === 2 ? "Unknown" : v)), /platform/);
  invalid(csv(base.map((v, i) => i === 7 ? "EUR" : v)), /currency/);
  const result = previewCsv(csv(base.map((v, i) => i === 0 ? "000001" : v)));
  assert.ok(result.ok);
  if (result.ok) assert.equal(result.rows[0].recordId, "000001");
});

test("byte and record bounds apply before successful allocation/preview", () => {
  invalid("x".repeat(MAX_CSV_BYTES + 1), /250 KiB/);
  invalid("é".repeat(MAX_CSV_BYTES / 2 + 1), /250 KiB/);
  const short = ["FAKE", "A", "Rithmic", "F", "P", "I", "2026-09-30T00:00:00Z", "USD", "0", "0", "0"];
  const max = previewCsv(csv(...Array.from({ length: MAX_RECORDS }, (_, i) => short.map((v, j) => j === 0 ? `FAKE${i}` : v))));
  assert.ok(max.ok);
  if (max.ok) assert.equal(max.uniqueRowCount, MAX_RECORDS);
  invalid(csv(...Array.from({ length: MAX_RECORDS + 1 }, () => short)), /data records/);
});
