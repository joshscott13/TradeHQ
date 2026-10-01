"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { formatUsd } from "@tradehq/domain";
import { previewCsv, EXAMPLE_DATASETS, CSV_HEADERS, MAX_CSV_BYTES, MAX_RECORDS } from "@tradehq/imports";

type Preview = ReturnType<typeof previewCsv>;

export default function ImportsPage() {
  const [csv, setCsv] = useState("");
  const [source, setSource] = useState("No source selected");
  const [result, setResult] = useState<Preview | null>(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const revision = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);

  function changeInput(text: string, label: string) {
    revision.current += 1;
    setCsv(text);
    setSource(label);
    setResult(null);
    setFileError("");
    setLoading(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function loadFile(file: File | undefined) {
    if (!file) return;
    const current = ++revision.current;
    setCsv("");
    setSource(`Local file · ${file.name}`);
    setResult(null);
    setFileError("");
    setLoading(false);
    if (file.size > MAX_CSV_BYTES) {
      setFileError("This file exceeds 250 KiB. Choose a smaller TradeHQ example CSV.");
      return;
    }
    setLoading(true);
    try {
      const bytes = await file.arrayBuffer();
      const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      if (current !== revision.current) return;
      setCsv(text);
    } catch {
      if (current !== revision.current) return;
      setFileError("This file could not be read as UTF-8 CSV. Choose a UTF-8 file or paste CSV text below.");
    } finally {
      if (current === revision.current) setLoading(false);
    }
  }

  const preview = result?.ok ? result : null;
  return <div className="app-shell">
    <aside className="sidebar" aria-label="Workspace">
      <Link className="brand" href="/"><span className="brand-mark">T<span>H</span></span>TradeHQ<span className="brand-dot">.</span></Link>
      <div className="workspace-label">TRADING WORKSPACE</div>
      <Link className="nav-link" href="/">Income planner <span aria-hidden="true">↗</span></Link>
      <div className="nav-current" aria-current="page"><span className="nav-glyph" aria-hidden="true">▤</span>Imports<span className="nav-current-dot" /></div>
      <div className="future-label">ON THE ROADMAP</div>
      <div className="future-nav"><span>Trade journal</span><span>Accounts</span><span>Cash ledger</span></div>
      <div className="sidebar-bottom"><span className="prototype-dot" />Local preview prototype<p>See the records.<br />Understand the result.</p><div className="sidebar-meta">USD · TRADE REVIEW</div></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><span>Workspace <span className="breadcrumb-separator">/</span> <strong>Imports</strong></span><span className="topbar-tag">LOCAL PREVIEW</span></header>
      <main id="main" className="import-main">
        <div className="page-heading"><div><p className="eyebrow">FROM RECORDS TO CLARITY</p><h1>Review before you import<span>.</span></h1><p className="intro">Explore account results with Tradovate and Rithmic examples.</p></div><button className="reset-button" onClick={() => changeInput("", "No source selected")}>Clear preview <span aria-hidden="true">↺</span></button></div>
        <div className="import-scope"><strong>TradeHQ example CSV</strong><p>These examples use one TradeHQ format with platform labels. Native Tradovate and Rithmic exports are not supported yet. Preview stays in this browser tab; nothing is uploaded or saved.</p></div>
        <div className="import-layout">
          <section className="import-input-panel" aria-labelledby="input-title">
            <div className="section-heading"><span className="section-number">01</span><h2 id="input-title">Choose your source</h2><span className="currency-tag">CSV</span></div>
            <p className="section-description">Start with a synthetic example, or review a file in the same format.</p>
            <div className="example-buttons">{EXAMPLE_DATASETS.map(example => <button key={example.id} onClick={() => changeInput(example.csv, `Synthetic example · ${example.label}`)}><span className="sample-badge">SYNTHETIC</span><strong>{example.label}</strong><span>{example.description}</span><span className="sample-action">Load example <span aria-hidden="true">→</span></span></button>)}</div>
            <div className="local-file-control"><label htmlFor="csv-file">Choose a local CSV file</label><input id="csv-file" ref={fileInput} type="file" accept=".csv,text/csv" onChange={event => void loadFile(event.target.files?.[0])} /><p>Maximum 250 KiB · {MAX_RECORDS.toLocaleString("en-US")} data records · USD only</p></div>
            <label className="csv-editor-label" htmlFor="csv-text">CSV text</label>
            <textarea id="csv-text" spellCheck={false} value={csv} onChange={event => changeInput(event.target.value, "Edited CSV · provenance unverified")} placeholder="Load an example above, choose a file, or paste TradeHQ-format CSV." aria-describedby="csv-format-help" />
            <div className="preview-actions"><button className="preview-button" disabled={loading || !csv.trim()} onClick={() => setResult(previewCsv(csv))}>{loading ? "Reading file…" : "Preview records"}<span aria-hidden="true">→</span></button><span>No final import or ledger yet</span></div>
            <details className="csv-schema" id="csv-format-help"><summary>View the accepted CSV format</summary><p>Headers must appear in this exact order:</p><code>{CSV_HEADERS.join(",")}</code><p>Each row is a closed-trade summary with supplied gross P&amp;L and nonnegative commissions and other trading fees. Dates require an explicit UTC or numeric offset. No fills or instrument multipliers are inferred.</p><p>Supported platform labels: Tradovate and Rithmic. Use plain decimal money and nonempty identifiers. Firm fees and payout cash belong outside these trade totals.</p></details>
          </section>
          <div className="import-result-column">
            <section className="import-source-panel" aria-labelledby="source-title"><p className="eyebrow" id="source-title">CURRENT DATA SOURCE</p><strong>{source}</strong><p>Results use supplied close timestamps. Trading sessions are not inferred.</p><div role="status" aria-live="polite">{loading ? "Reading local file…" : preview ? `${preview.uniqueRowCount} unique records reviewed. ${preview.duplicateCount} exact duplicates skipped.` : result && !result.ok ? "Preview needs corrections. No totals are available." : "Choose a source, then preview its records."}</div></section>
            {fileError && <section className="import-errors" role="alert"><h2>File unavailable</h2><p>{fileError}</p></section>}
            {result && !result.ok && <section className="import-errors" role="alert"><h2>Correct the CSV to continue</h2><p>All records must be valid before a complete total can be shown.</p><ul>{result.errors.map((error, index) => <li key={index}><strong>{error.row > 0 ? `Row ${error.row}: ` : "File: "}</strong>{error.message}</li>)}</ul></section>}
            {preview ? <>
              <section className="import-totals" aria-labelledby="total-title"><p className="eyebrow">REVIEWED RECORDS · USD</p><h2 id="total-title">Net trading P&amp;L</h2><strong className={`import-net ${preview.totals.netPnl.startsWith("-") ? "negative" : ""}`}>{formatUsd(preview.totals.netPnl)}</strong><dl><div><dt>Gross trading P&amp;L</dt><dd>{formatUsd(preview.totals.grossPnl)}</dd></div><div><dt>Commissions</dt><dd>{formatUsd(preview.totals.commissions)}</dd></div><div><dt>Other trading fees</dt><dd>{formatUsd(preview.totals.fees)}</dd></div></dl><p>Gross P&amp;L − commissions − other trading fees. This is trading performance, not cash received.</p></section>
              <section className="import-review-note"><h3>Every record accounted for</h3><div><strong>{preview.uniqueRowCount}</strong><span>unique records</span><strong>{preview.duplicateCount}</strong><span>exact repeats skipped</span></div><p>Duplicates are matched by platform, account and record ID within this preview. Different IDs remain separate trades. No history is saved.</p></section>
            </> : !fileError && !(result && !result.ok) && <section className="import-empty"><span aria-hidden="true">▤</span><h2>Your records, in view.</h2><p>Preview reveals gross and net trading P&amp;L, costs, account totals and exact repeated rows.</p><div>Nothing previewed yet</div></section>}
          </div>
        </div>
        {preview && <>
          <section className="import-table-panel" aria-labelledby="accounts-title"><div className="section-heading"><span className="section-number">02</span><h2 id="accounts-title">Results by account</h2><span className="currency-tag">USD</span></div><div className="import-table-scroll"><table><caption>Account identity combines platform and account ID. Firm/program metadata must be consistent.</caption><thead><tr><th scope="col">Account / source</th><th scope="col">Program</th><th scope="col">Records</th><th scope="col">Gross P&amp;L</th><th scope="col">Commissions</th><th scope="col">Other fees</th><th scope="col">Net P&amp;L</th></tr></thead><tbody>{preview.accounts.map(account => <tr key={JSON.stringify([account.platform, account.accountId])}><th scope="row">{account.accountId}<small>{account.platform} · {account.firm}</small></th><td>{account.program}</td><td>{account.rowCount}</td><td>{formatUsd(account.grossPnl)}</td><td>{formatUsd(account.commissions)}</td><td>{formatUsd(account.fees)}</td><td className="import-net-cell">{formatUsd(account.netPnl)}</td></tr>)}</tbody></table></div></section>
          <section className="import-table-panel" aria-labelledby="records-title"><div className="section-heading"><span className="section-number">03</span><h2 id="records-title">Underlying records</h2><span className="currency-tag">{preview.uniqueRowCount} ROWS</span></div><div className="import-table-scroll import-records-scroll"><table><caption>Unique closed-trade summaries in source order. Close time retains its supplied timezone offset.</caption><thead><tr><th scope="col">Record / account</th><th scope="col">Instrument</th><th scope="col">Close timestamp</th><th scope="col">CSV row</th><th scope="col">Gross P&amp;L</th><th scope="col">Commissions</th><th scope="col">Other fees</th><th scope="col">Net P&amp;L</th></tr></thead><tbody>{preview.rows.map(row => <tr key={JSON.stringify([row.platform, row.accountId, row.recordId])}><th scope="row">{row.recordId}<small>{row.accountId} · {row.platform}</small></th><td>{row.instrument}</td><td>{row.closedAt}</td><td>{row.source.row}</td><td>{formatUsd(row.grossPnl)}</td><td>{formatUsd(row.commissions)}</td><td>{formatUsd(row.fees)}</td><td className="import-net-cell">{formatUsd(row.netPnl)}</td></tr>)}</tbody></table></div><p className="import-table-note">Display rounds money to two decimals; totals use the original decimal precision. Original fields and row provenance are retained in this preview’s calculation.</p></section>
        </>}
        <footer className="calculation-footer"><div><strong>A review step, with clear boundaries.</strong><p>Synthetic examples demonstrate the TradeHQ CSV format. A native platform adapter and real statement reconciliation are still pending. Preview does not create a journal, establish payout eligibility or record cash received.</p></div><span className="footer-wordmark">TradeHQ<span>.</span></span></footer>
      </main>
    </div>
  </div>;
}
