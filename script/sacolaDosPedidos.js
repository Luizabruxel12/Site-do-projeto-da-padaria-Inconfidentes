window.onload = function(){ mostrarProdutos(); };


// FUNÇÃO DE MOSTRAR OS PRODUTOS
function mostrarProdutos(){ 
    let sacola = JSON.parse(localStorage.getItem('carrinhoTemporario')) || []; 
    let caixa = document.getElementById('itensCarrinho'); 
    caixa.innerHTML = ""; 

    if (sacola.length === 0) { 
        caixa.innerHTML = "<p style='text-align:center; padding: 20px;'>Seu carrinho está vazio.</p>"; 
        atualizarTudo(0); 
        return; 
    } 

    let subtotalGeral = 0; 

    sacola.forEach(item => { 
        let valorTotalItem = item.preco * item.quantidade; 
        subtotalGeral += valorTotalItem; 

        // CRIA O VISUAL (Corrigido para alterarQuantidade)
        caixa.innerHTML += ` 
        <div class="espacoItemCarrinho"> 
            <div class="itemImagem"> 
                <img class="imagemCard" src="${item.imagem || 'placeholder.jpg'}" alt="${item.nome}"> 
                <div class="infoCarrinho" > 
                    <h4>${item.nome}</h4> 
                    <div class="itemQuantidadeEExclusao"> 
                        <!-- Seletor de quantidade (- 1 +) --> 
                        <div class="itemQuantidade"> 
                            <button onclick="alterarQuantidade('${item.id}', -1)" class="botao-quantidade">-</button> 
                            <span class="quantidade">${item.quantidade}</span> 
                            <button onclick="alterarQuantidade('${item.id}', 1)" class="botao-quantidade">+</button> 
                        </div> 
                        <!-- Botão de Lixeira para remover tudo --> 
                        <button class="botaoDeletar" onclick="deletarItem('${item.id}')"><img src="../src/lixeira.png"></button> 
                        <p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p> 
                    </div> 
                </div> 
            </div> 
        </div> `; 
    }); 

    atualizarTudo(subtotalGeral); 
} 

// Nome da função corrigido para bater com o HTML dos botões
function alterarQuantidade(id, modificador) { 
    let sacola = JSON.parse(localStorage.getItem('carrinhoTemporario')) || []; 
    let item = sacola.find(produto => produto.id == id); 

    if (item){ 
        item.quantidade += modificador; 
        
        // Se a quantidade chegar a zero ou menos, remove do carrinho
        if (item.quantidade <= 0) { 
            sacola = sacola.filter(produto => produto.id != id); 
        } 
        
        localStorage.setItem('carrinhoTemporario', JSON.stringify(sacola)); 
        mostrarProdutos(); 
    } 
} 

function deletarItem(id) { 
    let sacola = JSON.parse(localStorage.getItem('carrinhoTemporario')) || []; 
    sacola = sacola.filter(produto => produto.id != id); 
    localStorage.setItem('carrinhoTemporario', JSON.stringify(sacola)); 
    mostrarProdutos(); 
} 

function atualizarTudo(subtotal) { 
    let taxaEntrega = subtotal > 0 ? 15.00 : 0.00; 
    
    // REGRA DO CUPOM EM TEMPO REAL: 
    // Se o cupom estiver ativo E o subtotal continuar acima de R$ 30, o desconto será de 10% do subtotal.
    // Caso contrário (se o usuário removeu itens e baixou de R$ 30), o cupom perde a validade automaticamente.
    let taxaDesconto = 0.00;
    if (cupomAtivo && subtotal > 30.00) {
        taxaDesconto = subtotal * 0.10; // Calcula 10% do subtotal (sem frete)
    } else if (cupomAtivo && subtotal <= 30.00) {
        // Alerta visual discreto na mensagem caso o valor caia abaixo do mínimo
        const divMensagem = document.getElementById("mensagemCupom");
        if (divMensagem) {
            divMensagem.innerText = "Cupom removido: o valor mínimo deve ser maior que R$ 30,00.";
            divMensagem.className = "mensagem-cupom erro";
        }
        cupomAtivo = false; // Desativa o cupom de vez
    }

    let totalGeral = subtotal + taxaEntrega - taxaDesconto; 

    // Atualiza os produtos adicionados
    let sacola = JSON.parse(localStorage.getItem('carrinhoTemporario')) || [];
    let quantidadeDeProdutos = sacola.reduce((acumulador, item) => acumulador + item.quantidade, 0);
    
    let elementoQtd = document.getElementById('QtdItensSacola');
    if (elementoQtd) {
        elementoQtd.innerText = `${quantidadeDeProdutos} produtos adicionados`;
    }

    // Atualiza as telas de valores
    document.getElementById('subtotalValor').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`; 
    document.getElementById('entregaValor').innerText = `R$ ${taxaEntrega.toFixed(2).replace('.', ',')}`; 
    document.getElementById('descontoValor').innerText = `R$ ${taxaDesconto.toFixed(2).replace('.', ',')}`; 
    
    let elementoTotal = document.getElementById('totalValor');
    if (elementoTotal) {
        elementoTotal.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    }
}

function irParaPagamento() { 
    let sacola = JSON.parse(localStorage.getItem('carrinhoTemporario')) || []; 
    if (sacola.length === 0) { 
        alert("Seu carrinho está vazio! Escolha algum produto."); 
        return; 
    } 
    window.location.href = "../html/paginaDePagamento.html"; 
}

function cancelarPedido() {
    localStorage.removeItem('carrinhoTemporario');
    window.location.href = "../html/cardapio.html";
}

// CUPOM
function alternarCupom() {
    const divInserir = document.getElementById("campoCupom");
    const barraCupom = document.querySelector(".adicionarCupom");

    if (divInserir) {
        divInserir.classList.toggle("mostrar");
    }

    if (barraCupom) {
        barraCupom.classList.toggle("ativo");
    }
}
window.alternarCupom = alternarCupom;


let cupomAtivo = false;


// 2. FUNÇÃO VALIDARCUPOM ATUALIZADA
function validarCupom() {
    const inputCupom = document.getElementById("cupomTexto");
    const divMensagem = document.getElementById("mensagemCupom");
    
    if (!inputCupom || !divMensagem) return;

    const codigoDigitado = inputCupom.value.trim().toUpperCase();
    const cupomSalvo = "INCONFIDENTES15";

    divMensagem.className = "mensagem-cupom";

    if (codigoDigitado === "") {
        divMensagem.innerText = "Por favor, digite um cupom.";
        divMensagem.classList.add("erro");
        return;
    }

    if (codigoDigitado === cupomSalvo) {
        let sacola = JSON.parse(localStorage.getItem('carrinhoTemporario')) || [];
        let subtotalAtual = sacola.reduce((acumulador, item) => acumulador + (item.preco * item.quantidade), 0);

        if (subtotalAtual <= 30.00) {
            divMensagem.innerHTML = `Este cupom só é válido para compras acima de R$ 30,00.`;
            divMensagem.classList.add("erro");
            cupomAtivo = false;
            mostrarProdutos();
            return;
        }

        divMensagem.innerHTML = `
            <button class="botao-fechar-cupom" onclick="removerCupom()">&times;</button>
            <img src="../src/cupomAceito.png" alt="Sucesso">
            <div class="texto-mensagem-container">
                <strong>Inconfidentes15</strong>
                <p>10% de desconto em pedidos acima de R$30,00 sem frete.</p>
            </div>
        `;
        divMensagem.classList.add("sucesso");
    
        cupomAtivo = true;
        mostrarProdutos();

    } else {
        divMensagem.innerText = "Cupom inválido ou expirado.";
        divMensagem.classList.add("erro");
        
        cupomAtivo = false;
        mostrarProdutos();
    }
}
// Vincula a função modificada ao escopo global
window.validarCupom = validarCupom;

function removerCupom() {
    const divMensagem = document.getElementById("mensagemCupom");
    const inputCupom = document.getElementById("cupomTexto");

    cupomAtivo = false; // Desativa a regra de desconto

    if (divMensagem) {
        divMensagem.innerHTML = "";
        divMensagem.className = "mensagem-cupom"; // Limpa as classes de estilo e esconde a div
    }

    if (inputCupom) {
        inputCupom.value = ""; // Limpa o campo de texto digitado
    }

    mostrarProdutos(); // Recalcula o carrinho sem o desconto
}
window.removerCupom = removerCupom;