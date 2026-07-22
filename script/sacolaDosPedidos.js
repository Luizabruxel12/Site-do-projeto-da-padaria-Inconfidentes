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
                        <button class="botaoDeletar" onclick="deletarItem('${item.id}')">x</button> 
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
    let taxaDesconto = 0.00; 
    let totalGeral = subtotal + taxaEntrega - taxaDesconto; 

    // Atualiza as telas de valores
    document.getElementById('subtotalValor').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`; 
    document.getElementById('entregaValor').innerText = `R$ ${taxaEntrega.toFixed(2).replace('.', ',')}`; 
    document.getElementById('descontoValor').innerText = `R$ ${taxaDesconto.toFixed(2).replace('.', ',')}`; 
    
    // Adicionado: Atualiza o ID do valor total final na interface (verifique se este ID existe no seu HTML)
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


