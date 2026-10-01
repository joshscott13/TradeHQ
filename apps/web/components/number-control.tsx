"use client";

export function NumberControl({ label, value, onChange, min = 0, max, step = 1, prefix, suffix, error, hint, id }: { label: string; value: string; onChange: (value: string) => void; min?: number; max: number; step?: number; prefix?: string; suffix?: string; error?: string; hint?: string; id: string }) {
  const n = Number(value);
  return <div className="field">
    <div className="field-top"><label htmlFor={id}>{label}</label><div className={`number-box ${error ? "invalid" : ""}`}><span>{prefix}</span><input id={id} type="number" inputMode="decimal" min={prefix === "$" && min < 0 ? -1000000000000 : min} max={prefix === "$" ? 1000000000000 : max} step={step} value={value} onChange={e => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} /><span>{suffix}</span></div></div>
    <input className="slider" type="range" aria-label={`${label} slider`} min={min} max={max} step={step} value={Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min} onChange={e => onChange(e.target.value)} />
    {error ? <p className="field-error" id={`${id}-error`}>{error}</p> : hint ? <p className="field-hint" id={`${id}-hint`}>{hint}</p> : null}
  </div>;
}
