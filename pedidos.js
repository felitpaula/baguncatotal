function exibirPedidos() {
    const pedidosContainer = document.getElementById("pedidos-container");
    
    pedidosContainer.replaceChildren();

    carregarPedidos();
}

function carregarPedidos() {
    bdPedidos.pedidos.forEach(criarCardPedidos);
}

function criarCardPedidos(pedido) {
    const pedidosContainer = document.getElementById("pedidos-container");

    const cardPedido = document.createElement("div");

    const nomeCliente = document.createElement("h3");
    nomeCliente.textContent = `Cliente: ${pedido.nomeCliente}`;

    pedido.carrinho.itensCarrinho.forEach((itemCarrinho) => {
        const itemProduto = document.createElement("p");
        itemProduto.textContent = `Produto: ${itemCarrinho.produto.nome} - Quantidade: ${itemCarrinho.quantidade} - Total: R$ ${itemCarrinho.calcularTotal().toFixed(2)}`;
        cardPedido.appendChild(itemProduto);
    });

    const subtotal = document.createElement("p");
    subtotal.textContent = `Subtotal: R$ ${pedido.calcularSubtotal().toFixed(2)}`;

    const total = document.createElement("p");
    total.textContent = `Subtotal: R$ ${pedido.calcularTotal().toFixed(2)}`;

    const tipoEntrega = document.createElement("p");
    tipoEntrega.textContent = `Tipo de Entrega: ${pedido.tipoEntrega}`;

    const statusPedido = document.createElement("p");
    statusPedido.textContent = `Status: ${pedido.status}`;

    const dataPedido = document.createElement("p");
    const dataFormatada = pedido.data.toLocaleString();
    dataPedido.textContent = `Data: ${dataFormatada}`;

    cardPedido.append(
        subtotal,
        total,
        nomeCliente,
        tipoEntrega,
        statusPedido,
        dataPedido
    );

    pedidosContainer.appendChild(cardPedido);
};

function inicializarPaginaPedidos() {
    exibirPedidos();
}

document.addEventListener("DOMContentLoaded", inicializarPaginaPedidos);