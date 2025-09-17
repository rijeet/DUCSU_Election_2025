export function toEnglishDigits(input: string | number | null | undefined): number | null {
  if (input == null) return null;
  const s = String(input);
  const map: Record<string, string> = { 
    "০":"0","১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9" 
  };
  const normalized = s.replace(/[০-৯]/g, d => map[d]);
  const n = parseInt(normalized, 10);
  return Number.isFinite(n) ? n : null;
}

export function isMemberPosition(positionKey: string) {
  return positionKey === "member";
}
