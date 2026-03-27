export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    const { prompt } = req.body ?? {};
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return res.status(400).json({ error: "Campo 'prompt' é obrigatório." });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            signal: controller.signal,
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: "Voce e um gerador de codigo HTML e CSS. Responda SOMENTE com codigo puro. Nunca use markdown, explicacoes ou texto fora do codigo. Formato: primeiro <style> com CSS, depois HTML. Gere exatamente o que o usuario pedir, sem adicionar elementos extras."
                    },
                    { role: "user", content: prompt }
                ]
            })
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: "Erro na API Groq", detail: errorData });
        }

        const data = await response.json();
        const output = data.choices?.[0]?.message?.content;

        if (!output) {
            return res.status(500).json({ error: "Resposta inválida da API", raw: data });
        }

        return res.status(200).json({ output });
    } catch (erro) {
        clearTimeout(timeout);
        if (erro.name === "AbortError") {
            return res.status(504).json({ error: "Tempo limite da requisição atingido." });
        }
        console.error("Erro:", erro);
        return res.status(500).json({ error: erro.message });
    }
}
