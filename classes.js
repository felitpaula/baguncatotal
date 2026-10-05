class Produto {
    constructor(nome, descricao, preco, categoria, imagem) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
        this.imagem = imagem;
    }

    get id() {
        return this._id;
    }
    set id(id) {
        this._id = Number(id);
    }

    get nome() {
        return this._nome;
    }
    set nome(nome) {
        this._nome = nome;
    }

    get descricao() {
        return this._descricao;
    }
    set descricao(descricao) {
        this._descricao = descricao;
    }

    get preco() {
        return this._preco;
    }
    set preco(preco) {
        this._preco = Number(preco);
    }

    get categoria() {
        return this._categoria;
    }
    set categoria(categoria) {
        this._categoria = categoria;
    }

    get imagem() {
        return this._imagem;
    }
    set imagem(imagem) {
        this._imagem = imagem;
    }
}

class BdProdutos {
    constructor() {
        this._produtos = [];
        this.carregarProdutos();
    }

    get produtos() {
        return this._produtos;
    }

    getIdDoUltimoProduto() {
        const ultimoProduto = this._produtos[this._produtos.length - 1];
        const id = ultimoProduto ? ultimoProduto.id : 0;
        return id;
    }

    getProximoId() {
        return this.getIdDoUltimoProduto() + 1;
    }

    adicionarProduto(produto) {
        produto.id = this.getProximoId();
        this._produtos.push(produto);
        this.salvarProdutos();
    }
    
    removerProduto(id) {
        id = Number(id);
        this._produtos = this._produtos.filter((produto) => produto.id !== id);
        this.salvarProdutos();
    }

    editarProduto(id, produtoEditado) {
        id = Number(id);
        const produto = this._produtos.find(
            (produto) => produto.id === id
        );
        if (produto) {
            produto.nome = produtoEditado.nome;
            produto.descricao = produtoEditado.descricao;
            produto.preco = produtoEditado.preco;
            produto.categoria = produtoEditado.categoria;
            produto.imagem = produtoEditado.imagem;
            this.salvarProdutos();
        }
    }

    buscarProdutoPorId(id) {
            return this._produtos.find(
            (produto) => produto.id === Number(id)
        );
    }

    salvarProdutos() {
        localStorage.setItem("produtos", JSON.stringify(this._produtos));
    }

    carregarProdutos() {
        this._produtos = [];
        const produtosJSON = JSON.parse(localStorage.getItem("produtos")) ?? [];
        produtosJSON.forEach((produtoJSON) => {
            const produto = new Produto(
                produtoJSON._nome,
                produtoJSON._descricao,
                produtoJSON._preco,
                produtoJSON._categoria,
                produtoJSON._imagem
            );
            produto.id = produtoJSON._id;
            this._produtos.push(produto);
        });
    }
}

class ItemCarrinho {
    constructor(produto, quantidade) {
        this.produto = produto;
        this.quantidade = quantidade;
    }

    get produto() {
        return this._produto;
    }
    set produto(produto) {
        this._produto = produto;
    }

    get quantidade() {
        return this._quantidade;
    }
    set quantidade(quantidade) {
        this._quantidade = Number(quantidade);
    }

    calcularTotal() {
        return this.produto.preco * this.quantidade;
    }
}

class Carrinho {
    constructor(bdProdutos = null) {
        this._itensCarrinho = [];
        this._bdProdutos = bdProdutos;

        if (bdProdutos) {
            this.carregarCarrinho();
        }
    }

    get itensCarrinho() {
        return this._itensCarrinho;
    }
    set itensCarrinho(itensCarrinho) {
        this._itensCarrinho = itensCarrinho.map((item) => {
            const produto = new Produto(
                item.produto.nome,
                item.produto.descricao,
                item.produto.preco,
                item.produto.categoria,
                item.produto.imagem
            );

            produto.id = item.produto.id;

            return new ItemCarrinho(
                produto,
                item.quantidade
            );
        });
    }

    get bdProdutos() {
        return this._bdProdutos;
    }
    set bdProdutos(bdProdutos) {
        this._bdProdutos = bdProdutos;
    }

    adicionarItemAoCarrinho(produto, quantidade = 1) {
        this.carregarCarrinho();
        quantidade = Number(quantidade);
        const itemExistente = this._itensCarrinho.find(
            (item) => item.produto.id === produto.id
        );
        
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            const item = new ItemCarrinho(produto, quantidade);
            this._itensCarrinho.push(item);
        }
        this.salvarCarrinho();
    }

    alterarQuantidade(id, quantidade) {
        quantidade = Number(quantidade);
        const item = this._itensCarrinho.find(
            (item) => item.produto.id === Number(id)
        );
        if (item) {
            if (quantidade <= 0) {
                this.removerItemDoCarrinho(id);
            } else {
                item.quantidade = quantidade;
            }
        }
        this.salvarCarrinho();
    }

    removerItemDoCarrinho(id) {
        this._itensCarrinho = this._itensCarrinho.filter(
            (item) => item.produto.id !== Number(id)
        );
        this.salvarCarrinho();
    }

    limparCarrinho() {
        this._itensCarrinho = [];
        this.salvarCarrinho();
    }

    calcularSubtotal() {
        return this._itensCarrinho.reduce(
            (total, item) => total + item.calcularTotal(),
            0
        );
    }

    calcularEntrega(tipoEntrega) {
        let taxaEntrega = 0;
        switch (tipoEntrega) {
            case "Delivery":
                taxaEntrega = 2.50;
                break;
            case "Retirada":
                taxaEntrega = 0;
                break;
        }
        return taxaEntrega;
    }

    calcularTotal(tipoEntrega) {
        const subtotal = this.calcularSubtotal();
        const taxaEntrega = this.calcularEntrega(tipoEntrega);
        return subtotal + taxaEntrega;
    }

    verificarProdutosDisponiveis(bdProdutos) {
        return this._itensCarrinho.every((item) => {
            return bdProdutos.buscarProdutoPorId(item.produto.id);
        });
    }

    salvarCarrinho() {
        const carrinhoJSON = this._itensCarrinho.map((item) => {
            return {
                produtoId: item.produto.id,
                quantidade: item.quantidade
            };
        });

        localStorage.setItem(
            "carrinho",
            JSON.stringify(carrinhoJSON)
        );
    }

    carregarCarrinho() {
        const carrinhoJSON =
            JSON.parse(localStorage.getItem("carrinho")) ?? [];
        this._itensCarrinho = [];
        carrinhoJSON.forEach((itemJSON) => {
            const produto = this.bdProdutos.buscarProdutoPorId(
                itemJSON.produtoId
            );

            if (produto) {
                this._itensCarrinho.push(
                    new ItemCarrinho(
                        produto,
                        itemJSON.quantidade
                    )
                );
            }
        });
    }
}

class Pedido {
    constructor(nomeCliente, carrinho, tipoEntrega, status = "Pendente", data = new Date()) {
        this.nomeCliente = nomeCliente;
        this.carrinho = carrinho;
        this.tipoEntrega = tipoEntrega;
        this.status = status;
        this.data = data;
    }

    get id() {
        return this._id;
    }
    set id(id) {
        this._id = Number(id);
    }

    get nomeCliente() {
        return this._nomeCliente;
    }
    set nomeCliente(nomeCliente) {
        this._nomeCliente = nomeCliente;
    }

    get carrinho() {
        return this._carrinho;
    }
    set carrinho(carrinho) {
        const carrinhoNoPedido = new Carrinho();
        carrinhoNoPedido.itensCarrinho = carrinho.itensCarrinho;
        this._carrinho = carrinhoNoPedido;
    }
    
    get tipoEntrega() {
        return this._tipoEntrega;
    }
    set tipoEntrega(tipoEntrega) {
        this._tipoEntrega = tipoEntrega;
    }

    get status() {
        return this._status;
    }
    set status(status) {
        this._status = status;
    }

    get data() {
        return this._data;
    }
    set data(data) {
        this._data = new Date(data);
    }

    calcularSubtotal() {
        return this.carrinho.calcularSubtotal();
    }

    calcularEntrega() {
        return this.carrinho.calcularEntrega(this.tipoEntrega);
    }

    calcularTotal() {
        return this.carrinho.calcularTotal(this.tipoEntrega);
    }
}

class BdPedidos {
    constructor() {
        this._pedidos = [];
        this.carregarPedidos();
    }

    get pedidos() {
        return this._pedidos;
    }

    getIdDoUltimoPedido() {
        const ultimoPedido = this._pedidos[this._pedidos.length - 1];
        const id = ultimoPedido ? ultimoPedido.id : 0;
        return id;
    }

    getProximoId() {
        return this.getIdDoUltimoPedido() + 1;
    }

    adicionarPedido(pedido) {
        pedido.id = this.getProximoId();
        this._pedidos.push(pedido);
        this.salvarPedidos();
    }

    removerPedido(id) {
        id = Number(id);
        this._pedidos = this._pedidos.filter((pedido) => pedido.id !== id);
        this.salvarPedidos();
    }

    editarPedido(id, pedidoEditado) {
        id = Number(id);

        const pedido = this._pedidos.find(
            (pedido) => pedido.id === id
        );

        if (pedido) {
            pedido.nomeCliente = pedidoEditado.nomeCliente;
            pedido.carrinho = pedidoEditado.carrinho;
            pedido.tipoEntrega = pedidoEditado.tipoEntrega;
            pedido.status = pedidoEditado.status;
            pedido.data = pedidoEditado.data;

            this.salvarPedidos();
        }
    }

    alterarStatusPedido(id, novoStatus) {
        id = Number(id);
        const pedido = this._pedidos.find((pedido) => pedido.id === id);
        if (pedido) {
            pedido.status = novoStatus;
            this.salvarPedidos();
        }
    }

    salvarPedidos() {
        localStorage.setItem("pedidos", JSON.stringify(this._pedidos));
    }

    carregarPedidos() {
        const pedidosJSON =
            JSON.parse(localStorage.getItem("pedidos")) ?? [];

        this._pedidos = [];    

        pedidosJSON.forEach((pedidoJSON) => {

            const carrinho = new Carrinho();

            const itensCarrinho =
                pedidoJSON._carrinho._itensCarrinho.map((itemJSON) => {

                    const produto = new Produto(
                        itemJSON._produto._nome,
                        itemJSON._produto._descricao,
                        itemJSON._produto._preco,
                        itemJSON._produto._categoria,
                        itemJSON._produto._imagem
                    );

                    produto.id = itemJSON._produto._id;

                    return new ItemCarrinho(
                        produto,
                        itemJSON._quantidade
                    );
                });

            carrinho.itensCarrinho = itensCarrinho;

            const pedido = new Pedido(
                pedidoJSON._nomeCliente,
                carrinho,
                pedidoJSON._tipoEntrega,
                pedidoJSON._status,
                pedidoJSON._data
            );

            pedido.id = pedidoJSON._id;

            this._pedidos.push(pedido);
        });
    }
}

const bdProdutos = new BdProdutos();
const bdPedidos = new BdPedidos();
const carrinho = new Carrinho(bdProdutos);