export default async function handler(req, res) { 
    if (req.method !== "POST") {
        return res.status(405).end();
    }
    
    console.log("Prompt recebido:", req.body.prompt);
    console.log("Chave GROQ_API_KEY:", process.env.GROQ_API_KEY ? "OK" : "NÃO ENCONTRADA");
    console.log("URL da API sendo chamada:", "https://api.groq.com/openai/v1/chat/completions");

    try {
        const response = await fetch("https://api/groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    { role: "user", content: req.body.prompt }
                ]
            })
        });

        if (!response.ok) {
            console.log("Erro na API externa:", response.status, response.statusText);
            return res.status(500).json({ error: "Erro na API externa" });
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
            console.log("Resposta inválida da API:", data);
            return res.status(500).json({ error: "Resposta inválida da API" });
        }

        const css = data.choices[0].message.content;
        res.status(200).json({ css });

    } catch (erro) {
        console.error("Erro no handler:", erro);
        res.status(500).json({ error: erro.message });
    }
}
