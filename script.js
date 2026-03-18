document.addEventListener("DOMContentLoaded", () => {
    let botao = document.querySelector(".botao-gerar");

    async function gerarCodigo() {
        let textoUsuario = document.querySelector(".caixa-texto").value;
        let blococodigo = document.querySelector(".bloco-codigo");
        let blocoresultado = document.querySelector(".bloco-resultado");

        botao.disabled = true;
        botao.textContent = "Gerando...";

        try {
            let resposta = await fetch("/api/gerar-css", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: textoUsuario })
});

let dados = await resposta.json();

    if (!resposta.ok) {
        console.error("Erro completo:", dados);
        throw new Error(JSON.stringify(dados));
    }

    if (!dados.css) {
        throw new Error("Resposta inválida da API");
    }

    let resultado = dados.css;

// Remove blocos de markdown, se houver
    let htmlLimpo = resultado.replace(/```html|```/g, "").trim();

        blococodigo.textContent = resultado;
        blocoresultado.srcdoc = htmlLimpo;

        } catch (erro) {
            console.error(erro);
            blococodigo.textContent = `Erro: ${erro.message}`;
        } finally {
            botao.disabled = false;
            botao.textContent = "Gerar";
        }
    }

    if (botao) {
        botao.addEventListener("click", gerarCodigo);
    }
});
