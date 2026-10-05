async function coletarDadosProduto() {
    const nome = document.getElementById("nome-produto").value;
    const descricao = document.getElementById("descricao-produto").value;
    const preco = parseFloat(document.getElementById("preco-produto").value);
    const categoria = document.getElementById("categoria-produto").value;
    const inputImagem = document.getElementById("imagem-produto");

    const arquivoImagem = inputImagem.files[0];
    
    const imagemBase64 = await converterImagemParaBase64(arquivoImagem);

    const produto = new Produto(nome, descricao, preco, categoria, imagemBase64);

    return produto;
}

function converterImagemParaBase64(arquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsDataURL(arquivo);
    });
}

async function adicionarProdutoAoCardapio() {
    const produto = await coletarDadosProduto();
    bdProdutos.adicionarProduto(produto);
}

function limparInputs() {
    document.getElementById("nome-produto").value = '';
    document.getElementById("descricao-produto").value = '';
    document.getElementById("preco-produto").value = '';
    document.getElementById("categoria-produto").value = '';
    document.getElementById("imagem-produto").value = '';
}

function criarEventListenerBotaoAdicionar() {
    const botaoAdicionar = document.getElementById("btnAdicionar");
    botaoAdicionar.addEventListener("click", async () => {
        adicionarProdutoAoCardapio();
        limparInputs();
    });
}

document.addEventListener("DOMContentLoaded", criarEventListenerBotaoAdicionar());