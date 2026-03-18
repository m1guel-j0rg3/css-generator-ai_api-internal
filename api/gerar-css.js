export default async function handler(req, res) {
    console.log("Funcao chamada");

    if (req.method !== "POST") {
        console.log("Metodo invalido:", req.method);
        return res.status(405).json({ error: "Metodo nao permitido" });
    }

    try {
        console.log("Body recebido:", req.body);

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "user", content: req.body.prompt }
                ]
            })
        });

        console.log("Status da API:", response.status);

        const text = await response.text();
        console.log("Resposta bruta:", text);

        return res.status(response.status).json({
            status: response.status,
            resposta: text
        });

    } catch (erro) {
        console.error("Erro real:", erro);
        return res.status(500).json({
            error: erro.message,
            stack: erro.stack
        });
    }
}
