// ==========================================
// TELA DO CARRINHO (VALIDAR FORMULÁRIO E FINALIZAR)
// ==========================================
const meuFormulario = document.getElementById('meuFormulario');
if (meuFormulario) {
    meuFormulario.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        localStorage.removeItem('carrinhoTemporario'); 
        window.location.href = "../html/pedidoEnviado.html";
    });
}


// ==========================================
// TELA DO CARRINHO (FORMAS DE PAGAMENTO)
// ==========================================
const formasPagamento = document.querySelectorAll('.formaPagamento');
if (formasPagamento.length > 0) {
    formasPagamento.forEach(opcao => {
        opcao.addEventListener('click', function() {
            formasPagamento.forEach(item => item.classList.remove('selecionado'));
            this.classList.add('selecionado');
        });
    });
}

// ==========================================
// TELA DO CARRINHO (RECEBIMENTO E RECALCULO)
// ==========================================
const opcoesRecebimento = document.querySelectorAll('.recebimento');
if (opcoesRecebimento.length > 0) {
    opcoesRecebimento.forEach(opcao => {
        opcao.addEventListener('click', function() {
            opcoesRecebimento.forEach(item => item.classList.remove('selecionado'));
            this.classList.add('selecionado');
            
            if (typeof subtotalAtual !== 'undefined') {
                atualizarTudo(subtotalAtual);
            } else {
                let sacola = JSON.parse(localStorage.getItem('carrinhoTemporario')) || [];
                let subtotalCalculado = sacola.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
                atualizarTudo(subtotalCalculado);
            }
        });
    });
}

// ==========================================
// TELA DE SUCESSO (GERAR DADOS DO PEDIDO ENVIADO)
// ==========================================
function gerarDadosPedido() {
    const elCodigo = document.getElementById('codigoPedido');
    const elDataHora = document.getElementById('dataHoraPedido');
    const elTempo = document.getElementById('tempoEstimado');

    if (!elCodigo || !elDataHora || !elTempo) return;

    const numeroAleatorio = Math.floor(10000 + Math.random() * 90000);
    elCodigo.innerText = `#${numeroAleatorio}`;

    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');

    elDataHora.innerText = `${dia}/${mes}/${ano} às ${horas}:${minutos}H`;

    elTempo.innerText = "35 a 50 minutos";
}
gerarDadosPedido();
