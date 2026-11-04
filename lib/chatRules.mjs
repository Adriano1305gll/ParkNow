export const MAX_MESSAGE_LENGTH = 300;

export const STARTER_QUESTIONS = [
  "How do I find parking near me?",
  "Is there parking available right now?",
  "How much does ParkNow cost for drivers?",
];

export const AVAILABILITY_NOTE =
  "Simulated data: ParkNow does not have a verified live parking feed, so availability is never guaranteed.";

export const HUMAN_HELP_TEXT =
  "I can't answer that reliably. Please contact the ParkNow team directly. This assistant does not send your message to anyone.";

const RULES = [
  {
    id: "availability",
    keywords: ["available", "availability", "free spot", "free space", "spaces", "spots", "full", "right now", "live"],
    answer:
      "I can't confirm real-time availability. Any occupancy shown in ParkNow demos is simulated and is not verified live data. Please check on site or with the lot operator before relying on it.",
    simulated: true,
  },
  {
    id: "find",
    keywords: ["find", "near me", "nearby", "where", "search", "close to", "park near"],
    answer:
      "Open the Live Parking page, choose a lot, and compare its distance, price and simulated occupancy. Use the Plan a trip page to estimate your arrival and cost before you leave.",
    simulated: true,
  },
  {
    id: "driver-cost",
    keywords: ["cost", "price", "pricing", "free", "pay", "fee", "how much"],
    answer:
      "ParkNow is free for drivers. Individual lots set their own hourly rates, which are shown per lot. Paid plans are only for lot owners and administrators.",
  },
  {
    id: "owner",
    keywords: ["owner", "register", "my lot", "my parking lot", "administrator", "admin", "dashboard", "plan"],
    answer:
      "Lot owners can review plans on the Pricing page and manage lots from the Dashboard. Use the Pricing simulator to estimate revenue before choosing a plan.",
  },
  {
    id: "safety",
    keywords: ["safe", "security", "reserve", "reservation", "book"],
    answer:
      "ParkNow does not currently take reservations or guarantee a space. Always follow signage and the lot operator's rules.",
  },
];

export function validateMessage(input) {
  if (typeof input !== "string") return { ok: false, error: "Please type a question." };
  const text = input.trim();
  if (!text) return { ok: false, error: "Please type a question." };
  if (text.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `Please keep your question under ${MAX_MESSAGE_LENGTH} characters.` };
  }
  return { ok: true, text };
}

export function getChatReply(input) {
  const check = validateMessage(input);
  if (!check.ok) return { ok: false, error: check.error };

  const text = check.text.toLowerCase();
  const rule = RULES.find((r) => r.keywords.some((k) => text.includes(k)));

  if (!rule) {
    return { ok: true, intent: "unsupported", answer: HUMAN_HELP_TEXT, simulated: false, humanHelp: true };
  }
  return {
    ok: true,
    intent: rule.id,
    answer: rule.answer,
    simulated: Boolean(rule.simulated),
    humanHelp: false,
  };
}
