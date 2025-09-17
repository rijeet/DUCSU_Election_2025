export const POSITION_LABELS: Record<string, string> = {
  vice_president: "Vice-President",
  general_secretary: "General Secretary",
  assistant_general_secretary: "Assistant General Secretary",
  liberation_war: "Liberation War and Democratic M",
  science_tech: "Science and Technology",
  common_room: "Common Room, Reading Room and C",
  international_affairs: "International Affairs",
  research_publication: "Research and Publication",
  literature_cultural: "Literature and Cultural Affairs",
  sports: "Sports",
  "Students Transport": "Students' Transport",
  social_service: "Social Service",
  career_development: "Career Development",
  health_environment: "Health and Environment",
  human_rights_legal: "Human Rights and Legal Affairs",
  member: "Member",
};

export const PYRAMID_LAYERS: string[][] = [
  ["vice_president"],
  ["general_secretary", "assistant_general_secretary"],
  ["liberation_war", "science_tech", "common_room"],
  ["international_affairs", "research_publication", "literature_cultural", "sports"],
  ["Students Transport", "social_service", "career_development", "health_environment", "human_rights_legal"],
  ["member", "member", "member", "member", "member", "member"],
];

export function toPositionKey(label: string): string {
  const entries = Object.entries(POSITION_LABELS);
  const found = entries.find(([, v]) => v.toLowerCase() === label.toLowerCase());
  if (found) return found[0];
  // heuristic for partial/truncated labels from import
  const key = entries.find(([, v]) => label && v.toLowerCase().startsWith(label.toLowerCase()))?.[0];
  return key ?? "member";
}
