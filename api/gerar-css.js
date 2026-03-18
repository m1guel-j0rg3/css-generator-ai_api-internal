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

       const data = await response.json();

    const conteudo = data.choices?.[0]?.message?.content;

    if (!conteudo) {
        console.log("Resposta inválida:", data);
        return res.status(500).json({
            error: "Resposta inválida da API externa",
            raw: data
        });
    }

    return res.status(200).json({
        css: conteudo
    });

    } catch (erro) {
        console.error("Erro real:", erro);
        return res.status(500).json({
            error: erro.message,
            stack: erro.stack
        });
    }
}
