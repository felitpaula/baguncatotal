let idEditando = null;

function exibirCardapio() {
    const cardapioContainer = document.getElementById("cardapio-container");
    cardapioContainer.replaceChildren();
    bdProdutos.produtos.forEach((produto) => {
        if (produto.id === idEditando) {
            criarCardEditarProduto(produto);
        } else {
            criarCardProduto(produto);
        }
    });
}

function criarCardProduto(produto) {
    const cardapioContainer = document.getElementById("cardapio-container");

    const cardProduto = document.createElement("div");

    const imagemProduto = document.createElement("img");
    imagemProduto.src = produto.imagem;
    imagemProduto.alt = produto.nome;

    const nomeProduto = document.createElement("h3");
    nomeProduto.textContent = produto.nome;

    const descricaoProduto = document.createElement("p");
    descricaoProduto.textContent = produto.descricao;

    const precoProduto = document.createElement("p");
    precoProduto.textContent = `R$ ${produto.preco.toFixed(2)}`;

    const categoriaProduto = document.createElement("p");
    categoriaProduto.textContent = `Categoria: ${produto.categoria}`;

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover Produto";
    botaoRemover.addEventListener("click", () => {
        bdProdutos.removerProduto(produto.id);
        exibirCardapio();
    });

    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar Produto";
    botaoEditar.addEventListener("click", () => {
        idEditando = produto.id;
        exibirCardapio();
    });

    const quantidadeProduto = document.createElement("input");
    quantidadeProduto.type = "number";
    quantidadeProduto.min = "1";
    quantidadeProduto.step = "1";
    quantidadeProduto.value = 1;
    quantidadeProduto.id = `quantidade-${produto.id}`;
    quantidadeProduto.addEventListener("input", () => {
        const quantidade = Number(quantidadeProduto.value);

        if (!quantidade || quantidade < 1) {
            quantidadeProduto.value = 1;
        }
    });


    const botaoAdicionar = document.createElement("button");
    botaoAdicionar.textContent = "Adicionar ao Carrinho";
    botaoAdicionar.addEventListener("click", () => {
        const quantidade = document.getElementById(`quantidade-${produto.id}`).value;
        carrinho.adicionarItemAoCarrinho(produto, quantidade);
    });

    cardProduto.append(
        imagemProduto,
        nomeProduto,
        descricaoProduto,
        precoProduto,
        categoriaProduto,
        botaoRemover,
        botaoEditar,
        quantidadeProduto,
        botaoAdicionar
    );

    cardapioContainer.appendChild(cardProduto);
};

function criarCardEditarProduto(produto) {
    const cardapioContainer = document.getElementById("cardapio-container");

    const cardProduto = document.createElement("div");

    // Imagem atual
    const imagemProduto = document.createElement("img");
    imagemProduto.src = produto.imagem;
    imagemProduto.alt = produto.nome;

    // Nome
    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.value = produto.nome;

    // Descrição
    const inputDescricao = document.createElement("input");
    inputDescricao.type = "text";
    inputDescricao.value = produto.descricao;

    // Preço
    const inputPreco = document.createElement("input");
    inputPreco.type = "number";
    inputPreco.step = "0.01";
    inputPreco.min = "0";
    inputPreco.value = produto.preco;

    // Categoria
    const inputCategoria = document.createElement("select");

    const categorias = [
        "Alimentação",
        "Calçado",
        "Decoração",
        "Entretenimento",
        "Hobbies",
        "Mobília",
        "Papelaria",
        "Tecnologia",
        "Utensílio",
        "Vestuário"
    ];

    categorias.forEach((categoria) => {
        const option = document.createElement("option");

        option.value = categoria;
        option.textContent = categoria;

        if (categoria === produto.categoria) {
            option.selected = true;
        }

        inputCategoria.appendChild(option);
    });

    // Nova imagem (opcional)
    const inputImagem = document.createElement("input");
    inputImagem.type = "file";
    inputImagem.accept = "image/*";

    // Botão salvar
    const botaoSalvar = document.createElement("button");
    botaoSalvar.textContent = "Salvar Alterações";
    botaoSalvar.addEventListener("click", async () => {
        let imagem = produto.imagem;

        // Só altera a imagem se o usuário selecionar outra
        if (inputImagem.files.length > 0) {
            imagem = await converterImagemParaBase64(
                inputImagem.files[0]
            );
        }

        const produtoEditado = new Produto(
            inputNome.value,
            inputDescricao.value,
            Number(inputPreco.value),
            inputCategoria.value,
            imagem
        );

        bdProdutos.editarProduto(
            produto.id,
            produtoEditado
        );
        
        idEditando = null;
        exibirCardapio();
    });

    const botaoCancelarEdicao = document.createElement("button");
    botaoCancelarEdicao.textContent = "Cancelar Edição";
    botaoCancelarEdicao.addEventListener("click", async () => {
        idEditando = null;
        exibirCardapio();
    });

    cardProduto.append(
        imagemProduto,
        inputNome,
        inputDescricao,
        inputPreco,
        inputCategoria,
        inputImagem,
        botaoSalvar,
        botaoCancelarEdicao
    );

    cardapioContainer.appendChild(cardProduto);
}

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

document.addEventListener("DOMContentLoaded", exibirCardapio);

window.addEventListener("storage", (event) => {
    if (event.key === "produtos") {
        bdProdutos.carregarProdutos();
        exibirCardapio();
    }
});