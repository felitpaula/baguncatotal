function exibirCarrinho() {
    const carrinhoContainer = document.getElementById("carrinho-container");
    carrinhoContainer.replaceChildren();
    carrinho.itensCarrinho.forEach(criarCardItemCarrinho);
    const subtotal = document.getElementById('subtotal');
    subtotal.textContent = `R$ ${carrinho.calcularSubtotal().toFixed(2)}`;
    const tipoEntrega = document.getElementById("tipo-entrega").value;
    const total = document.getElementById("total");
    total.textContent = `R$ ${carrinho.calcularTotal(tipoEntrega).toFixed(2)}`;
}

function criarCardItemCarrinho(itemCarrinho) {
    const carrinhoContainer = document.getElementById("carrinho-container");

    const cardItemCarrinho = document.createElement("div");

    const imagemProduto = document.createElement("img");
    imagemProduto.src = itemCarrinho.produto.imagem;
    imagemProduto.alt = itemCarrinho.produto.nome;

    const nomeProduto = document.createElement("h3");
    nomeProduto.textContent = itemCarrinho.produto.nome;

    const precoProduto = document.createElement("p");
    precoProduto.textContent = `R$ ${itemCarrinho.produto.preco.toFixed(2)}`;

    const quantidadeItemCarrinho = document.createElement("input");
    quantidadeItemCarrinho.type = "number";
    quantidadeItemCarrinho.step = "1";
    quantidadeItemCarrinho.value = itemCarrinho.quantidade;
    quantidadeItemCarrinho.id = `quantidade-${itemCarrinho.produto.nome}`;

    quantidadeItemCarrinho.addEventListener("input", () => {
        const quantidade = Number(quantidadeItemCarrinho.value);

        if (!quantidade || quantidade < 1) {
            carrinho.removerItemDoCarrinho(itemCarrinho.produto.id);
        }

        itemCarrinho.quantidade = quantidade;
        carrinho.salvarCarrinho();
        exibirCarrinho();
    });

    const totalPorItem = document.createElement("p");
    totalPorItem.textContent = `Total: R$ ${itemCarrinho.calcularTotal().toFixed(2)}`;

    cardItemCarrinho.append(
        imagemProduto,
        nomeProduto,
        precoProduto,
        quantidadeItemCarrinho,
        totalPorItem
    );

    carrinhoContainer.appendChild(cardItemCarrinho);
};


function criarPedido() {
    const nomeCliente = document.getElementById("nome-cliente").value;
    const tipoEntrega = document.getElementById("tipo-entrega").value;
    
    const pedido = new Pedido(nomeCliente, carrinho, tipoEntrega);

    return pedido;
}

function fecharPedido() {
    bdProdutos.carregarProdutos();
    if (!carrinho.verificarProdutosDisponiveis(bdProdutos)) {
        alert("Um ou mais produtos não estão mais disponíveis.");
        return;
    }

    const pedido = criarPedido();

    bdPedidos.adicionarPedido(pedido);
    carrinho.limparCarrinho();
}

const botaoFecharPedido = document.getElementById("btnFecharPedido");

botaoFecharPedido.addEventListener("click", () => {
    fecharPedido();
    exibirCarrinho();
});

function criarEventListenerParaTipoEntrega() {
    const tipoEntregaSelect = document.getElementById("tipo-entrega");
    tipoEntregaSelect.addEventListener("change", () => {
        const tipoEntrega = tipoEntregaSelect.value;
        const total = document.getElementById("total");
        total.textContent = `R$ ${carrinho.calcularTotal(tipoEntrega).toFixed(2)}`;
    });
}

function inicializarApp() {
    exibirCarrinho();
    criarEventListenerParaTipoEntrega();
}

document.addEventListener("DOMContentLoaded", inicializarApp);

window.addEventListener("storage", (event) => {
    if (event.key === "carrinho") {
        carrinho.carregarCarrinho();
        exibirCarrinho();
    }
});

window.addEventListener("storage", (event) => {
    if (event.key === "produtos") {
        bdProdutos.carregarProdutos();
        carrinho.carregarCarrinho();
        exibirCarrinho();
    }
});