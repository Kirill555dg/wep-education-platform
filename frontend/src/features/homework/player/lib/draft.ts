const KEY_PREFIX = "wep.homework.draft.v1";

export type HomeworkDraft = {
  homeworkId: number;
  answers: Record<number, string>;
  updatedAt: number;
};

function key(homeworkId: number) {
  return `${KEY_PREFIX}:${homeworkId}`;
}

export function loadHomeworkDraft(homeworkId: number): HomeworkDraft | null {
  try {
    const raw = localStorage.getItem(key(homeworkId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HomeworkDraft;
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.homeworkId !== homeworkId) return null;
    if (!parsed.answers || typeof parsed.answers !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveHomeworkDraft(homeworkId: number, answers: Record<number, string>) {
  try {
    const payload: HomeworkDraft = { homeworkId, answers, updatedAt: Date.now() };
    localStorage.setItem(key(homeworkId), JSON.stringify(payload));
  } catch {
    // ignore storage failures
  }
}

export function clearHomeworkDraft(homeworkId: number) {
  try {
    localStorage.removeItem(key(homeworkId));
  } catch {
    // ignore
  }
}


