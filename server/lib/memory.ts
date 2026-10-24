import { one, q } from "../db.js";

export const MEMORY_KINDS = ["fact", "preference", "decision", "note", "todo"] as const;
export type MemoryKind = (typeof MEMORY_KINDS)[number];

export interface Memory {
  id: string;
  kind: MemoryKind;
  content: string;
  source: string;
  agent_id: string | null;
  conversation_id: string | null;
  tags: string[];
  pinned: boolean;
  created_at: string;
}

export async function saveMemory(input: {
  content: string;
  kind?: string;
  source?: string;
  agent_id?: string | null;
  conversation_id?: string | null;
  tags?: string[];
  pinned?: boolean;
}) {
  const kind = MEMORY_KINDS.includes(input.kind as MemoryKind) ? input.kind : "note";
  return one<Memory>(
    `INSERT INTO memories (kind, content, source, agent_id, conversation_id, tags, pinned)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, kind, content, source, agent_id, conversation_id, tags, pinned, created_at`,
    [
      kind,
      input.content.trim().slice(0, 4000),
      input.source ?? "ui",
      input.agent_id ?? null,
      input.conversation_id ?? null,
      (input.tags ?? []).slice(0, 12),
      input.pinned ?? false,
    ],
  );
}

/**
 * Full-text recall ranked by relevance, with a trigram fallback for short or misspelled
 * queries. Without a query: pinned first, then most recent.
 */
export async function searchMemories(query: string | undefined, limit = 8) {
  const cols = "id, kind, content, source, agent_id, conversation_id, tags, pinned, created_at";
  const text = query?.trim();
  if (!text) {
    return q<Memory>(`SELECT ${cols} FROM memories ORDER BY pinned DESC, created_at DESC LIMIT $1`, [limit]);
  }
  return q<Memory>(
    `SELECT ${cols} FROM memories
     WHERE search @@ websearch_to_tsquery('english', $1) OR $1 <% content OR content ILIKE '%' || $1 || '%'
     ORDER BY pinned DESC,
              ts_rank(search, websearch_to_tsquery('english', $1)) + word_similarity($1, content) DESC,
              created_at DESC
     LIMIT $2`,
    [text, limit],
  );
}
