// Google retired `embedding-001` and `text-embedding-004`; `gemini-embedding-001`
// is the replacement. It defaults to 3072 dimensions, so we ask for 768 to keep
// matching the `vector(768)` column on `documents`.
export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;

// RETRIEVAL_DOCUMENT for stored chunks, RETRIEVAL_QUERY for the user's question.
export type EmbeddingTaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

export async function getEmbedding(
  text: string,
  apiKey: string,
  taskType: EmbeddingTaskType
): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        taskType,
        outputDimensionality: EMBEDDING_DIMENSIONS,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Gemini embedding request failed (${response.status}): ${await response.text()}`
    );
  }

  const { embedding } = await response.json();
  const values: number[] = embedding?.values ?? [];
  if (values.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Expected ${EMBEDDING_DIMENSIONS} dimensions, got ${values.length}`
    );
  }

  // Only the full 3072-dim output is pre-normalized; truncated outputs are not.
  const magnitude = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
  return magnitude === 0 ? values : values.map((v) => v / magnitude);
}
