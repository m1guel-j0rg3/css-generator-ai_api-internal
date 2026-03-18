export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    // 🔥 Logs de debug
    console.log("Prompt recebido:", req.body.prompt);
    console.log("Chave GROQ_API_KEY:", process.env.GROQ_API_KEY ? "OK" : "NÃO ENCONTRADA");
    console.log("URL da API sendo chamada:", "https://api.groq.com/openai/v1/chat/completions");

    try {
        // Chamada para a API do Groq
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-70b-versatile",
                messages: [{ role: "user", content: req.body.prompt }]
            })
        });

        // 🔥 Log da resposta bruta
        const rawData = await response.text();
        console.log("Resposta bruta da API:", rawData);

        // Verifica se o HTTP está OK
        if (!response.ok) {
            console.log("Erro HTTP da API:", response.status, response.statusText);
            return res.status(500).json({ error: "Erro na API externa" });
        }

        // Converte para JSON
        const data = JSON.parse(rawData);

        // Valida o conteúdo da resposta
        if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
            console.log("Resposta inválida da API:", data);
            return res.status(500).json({ error: "Resposta inválida da API" });
        }

        // Envia CSS para o frontend
        const css = data.choices[0].message.content;
        res.status(200).json({ css });

    } catch (erro) {
        console.error("Erro no handler:", erro);
        res.status(500).json({ error: erro.message });
    }
}
