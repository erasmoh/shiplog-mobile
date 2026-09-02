export const PROJECT_STATUSES = ["active", "paused", "done"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Activo",
  paused: "En pausa",
  done: "Terminado",
};

export const ENTRY_KINDS = ["feature", "bugfix", "refactor", "other"] as const;
export type EntryKind = (typeof ENTRY_KINDS)[number];

export const KIND_LABEL: Record<EntryKind, string> = {
  feature: "Feature",
  bugfix: "Bugfix",
  refactor: "Refactor",
  other: "Otro",
};

export const KIND_COLOR: Record<EntryKind, { bg: string; fg: string }> = {
  feature: { bg: "#d1fae5", fg: "#065f46" },
  bugfix: { bg: "#ffe4e6", fg: "#9f1239" },
  refactor: { bg: "#e0f2fe", fg: "#075985" },
  other: { bg: "#e4e4e7", fg: "#27272a" },
};

export function isStatus(v: string): v is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(v);
}

export function isKind(v: string): v is EntryKind {
  return (ENTRY_KINDS as readonly string[]).includes(v);
}
