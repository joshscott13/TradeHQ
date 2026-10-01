"use client";

/** Presentation only: domain messages and financial meanings remain authoritative. */
export function plainPlannerText(text: string): string {
  const messages: Record<string, string> = {
    "Enter a complete decimal amount with at most 8 decimal places.": "Enter a full number with up to 8 digits after the decimal point.",
    "Trader share must be from 0 to 100%.": "Your share must be between 0% and 100%.",
    "A positive cash goal or costs are infeasible with 0% trader share.": "A payout goal or account costs above $0 need a share above 0%.",
    "Daily profit is below $150, so no days qualify for a payout request.": "Each trading day needs at least $150 profit to count toward a payout. This daily profit is too low.",
    "At least five qualifying active days are required for the first payout request.": "You need at least 5 trading days with $150 or more profit before the first payout request.",
    "Retained profit has not reached the $500 minimum gross request.": "There is not enough profit left in the account for the $500 minimum payout request before the firm's share.",
    "The funded phase stops at payout five. Live-stage income is not modeled.": "This estimate stops after payout 5. Income from live trading is not included.",
    "The model pauses for discretionary Elite Live review; this is not an automatic transition or an official funded payout cap.": "This estimate stops where Tradeify may consider live trading. A move to live trading is not automatic, and this is not an official payout limit.",
    "No request reaches the $250 minimum after preserving the $2,100 retained-profit buffer within the modeled days.": "These days do not leave enough profit for a $250 payout request while keeping $2,100 in the account.",
    "Fewer than five active days cannot support a payout request.": "Choose at least 5 trading days for a possible payout request.",
    "Fewer than five active days cannot support a payout request within this modeled horizon.": "Choose at least 5 trading days for a possible payout request within this period.",
  };
  if (messages[text]) return messages[text];
  return text
    .replace(/funded payout cycle/g, "payout round")
    .replace(/gross each/g, "per request before the firm's share")
    .replace(/trader share/g, "your share")
    .replace(/portfolio costs/g, "total account costs")
    .replace(/The funded phase ends after five payouts\./g, "This estimate stops after payout 5; live trading income is excluded.")
    .replace(/The goal exceeds request cash available within the selected (\d+)-day horizon and the model's (\d+)-cycle discretionary review pause\./g, "This goal is above the estimated payouts for these $1 days and $2 payout rounds before the estimate stops for possible live review.")
    .replace(/The goal exceeds request cash available within the selected horizon and the model's (\d+)-cycle discretionary review pause\./g, "This goal is above the estimated payouts for these days and $1 payout rounds before the estimate stops for possible live review.")
    .replace(/This does not establish firm-wide income impossibility or an official funded payout cap\./g, "This is a limit of this estimate, not a limit on everything the firm could pay.");
}

export function plainPlannerErrors<T extends object>(errors: T): T {
  return Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, typeof value === "string" ? plainPlannerText(value) : value])) as T;
}
