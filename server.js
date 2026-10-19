const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const AQ.Ab8RN6La0LBh3QMVuZFiyFtnrkrVTj-WmRer2tZ__aOfaxZkQg = process.env.AQ.Ab8RN6La0LBh3QMVuZFiyFtnrkrVTj-WmRer2tZ__aOfaxZkQg;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

app.use(express.json({ limit: "6mb" }));
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  if (!AQ.Ab8RN6La0LBh3QMVuZFiyFtnrkrVTj-WmRer2tZ__aOfaxZkQg) {
    return res.status(500).json({
      error: "Falta configurar AQ.Ab8RN6La0LBh3QMVuZFiyFtnrkrVTj-WmRer2tZ__aOfaxZkQg nas variáveis de ambiente do Render."
    });
  }

  try {
    const messages = req.body && req.body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Envia uma mensagem primeiro." });
    }

    const contents = [];
    for (const message of messages.slice(-12)) {
      if (!message || !["user", "model"].includes(message.role)) continue;

      const parts = [];
      const text = typeof message.text === "string" ? message.text.slice(0, 12000) : "";
      if (text) parts.push({ text });

      if (message.role === "user" && message.image && typeof message.image.data === "string") {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const mimeType = allowedTypes.includes(message.image.mimeType)
          ? message.image.mimeType
          : "image/jpeg";
        if (message.image.data.length > 5600000) {
          return res.status(413).json({ error: "Imagem muito grande. Usa uma imagem menor que 4 MB." });
        }
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: message.image.data
          }
        });
      }

      if (parts.length) contents.push({ role: message.role, parts });
    }

    if (!contents.length) {
      return res.status(400).json({ error: "A mensagem está vazia." });
    }

    const systemInstruction =
      "Tu és Arthur IA, uma assistente útil que fala português brasileiro informal e respeitoso. " +
      "Ajudas a criar e corrigir códigos e interfaces, especialmente HTML, CSS, JavaScript e Java/Android. " +
      "Quando pedirem código, entrega exemplos completos e explica em que arquivo ou local colocar. " +
      "Não afirmes que testaste algo se não testaste. Se receberes uma imagem, analisa o que conseguires observar " +
      "e ajuda a criar um design inspirado nela. Se faltarem detalhes, faz uma pergunta curta. " +
      "Sê honesta sobre os teus limites.";

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": AQ.Ab8RN6La0LBh3QMVuZFiyFtnrkrVTj-WmRer2tZ__aOfaxZkQg
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 5000 }
        })
      }
    );

    const result = await apiResponse.json();

    if (!apiResponse.ok) {
      const apiMessage = result && result.error && result.error.message
        ? result.error.message
        : "A API Gemini recusou o pedido.";
      const status = apiResponse.status === 429 ? 429 : 502;
      return res.status(status).json({
        error: apiResponse.status === 429
          ? "A quota da API foi atingida. Confere os limites do Gemini e tenta mais tarde."
          : `Erro da API Gemini: ${apiMessage.slice(0, 350)}`
      });
    }

    const reply = (result.candidates?.[0]?.content?.parts || [])
      .map(part => part.text || "")
      .join("\n")
      .trim();

    if (!reply) {
      return res.status(502).json({ error: "A IA não devolveu texto. Tenta novamente." });
    }

    return res.json({ reply });
  } catch (error) {
    console.error("Erro em /api/chat:", error.message);
    return res.status(500).json({ error: "Erro interno ao processar a mensagem. Tenta novamente." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Arthur IA disponível na porta ${PORT}`);
});
