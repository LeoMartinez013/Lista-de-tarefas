const inputCliente = document.querySelector('#input-cliente')
const input = document.querySelector('#input-processo')
const button = document.querySelector('#button-add-processo')
const listaCompleta = document.querySelector('#list-processos')
const listaConcluida = document.querySelector('#list-processos-concluidos')
var clientes = [];

window.onload = function() {
  clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  console.log('NÃO CONCLUÍDOS===================================')
  mostrarClientes()
  console.log('CONCLUÍDOS===================================')
  mostrarClientesConcluidos()
}
//  Criação de processos
function adicionarNovoProcesso() {
  let dataAtual = new Date()
  let year = dataAtual.getFullYear()
  let month = dataAtual.getMonth() + 1
  if (month < 10) month = '0' + month
  let mesAtual = `${year}-${month}`
  let clienteNome = inputCliente.value;
  let cliente = clientes.find(c => c.cliente === clienteNome)

  if (!cliente) {
    cliente = {
      cliente: clienteNome,
      processos: []
    }
    clientes.push(cliente)
  }
    cliente.processos.push({
    po: input.value,
    concluido: false,
    modal: "Marítimo",
    filial: "São Paulo",
    quantidade: "",
    produto: "",
    etb: "",
    navio: "",
    container: "",
    bl: "",
    li: "",
    lcpo: "",
    descarga: "",
    apresDcts: "",
    inspecaoMAPA: "",
    deferimento: "",
    registroDI: "",
    numDI: "",
    desembaraco: "",
    envNFs: "",
    dctsTransporte: "",
    mesOperacao: mesAtual, // Mês atual
    etapa: "AG. Atração",
    historico: [
      "", "", "", "", "", "", "", "", "", "", 
      "", "", "", "", "",   "", "", "", "", "", 
      "", "", "", "", "", "", "", "", "", ""
    ],
  })

  input.value = ''
  localStorage.setItem('clientes', JSON.stringify(clientes))
  mostrarClientes()
}
//============================================================
//  PROCESSOS NÃO EMBARAÇADOS/CONCLUIDOS 
//============================================================
function mostrarClientes() {
  let novaLi = ''

  clientes.forEach((cliente, posicao) => {
    // Verifique se o cliente tem processos
    if (cliente.processos.length === 0) {
      return; // Continue para o próximo cliente se este não tiver processos
    }

    // Verifique se todos os processos do cliente estão concluídos
    if (cliente.processos.every(processo => processo.concluido)) {
      return; // Continue para o próximo cliente se todos os processos deste cliente estiverem concluídos
    }

    // Substitua os espaços por sublinhados
    let clienteNomeClasse = cliente.cliente.replace(/ /g, '_')
    console.log(cliente.cliente + ':')
    novaLi =
      novaLi +
      `
      <div class="cliente-titulo" onclick="esconderProcessos('${cliente.cliente}')">
        <div id="cliente-nome">${cliente.cliente}</div>
      </div>
      `
    novaLi = novaLi + `<div class="${clienteNomeClasse}" style="display: none;">` + mostrarProcessos(cliente.cliente) + `</div>`
  })
  
  listaCompleta.innerHTML = novaLi;
}

function mostrarProcessos(clienteNome) {
  let cliente = clientes.find(c => c.cliente === clienteNome)
  if (!cliente) return ''

  // Substitua os espaços por sublinhados
  let novaLi = ""

  cliente.processos.forEach((item, posicao) => {
    // Verifique se o processo está concluído
    if (item.concluido) {
      return; // Continue para o próximo processo se este estiver concluído
    }

    novaLi =
      novaLi +
      `
      <div class="processo ${item.concluido && 'concluido' || 'nao_concluido'}" onclick="window.location='../configuracao/painel.html?posicao=${posicao}&cliente=${clienteNome}'">
        <div class="po c1">${item.po}</div>
        <div class="bl c2"> ${item.bl || 'Vazio'}</div>
        <div class="etapa c3"> ${item.etapa || 'Vazio'}</div>
        <div class="mesOperacao c4"> ${item.mesOperacao || 'Vazio'}</div>
        <div class="c5">
          <img class="icone" src="../assets/trash.png" alt="excluir-processo" onclick="event.stopPropagation(); deletarProcesso('${clienteNome}', ${posicao})">
        </div>
      </div>
      `
      console.log(item)
  })
  return novaLi;
}
function esconderProcessos(clienteNome) {
  let clienteNomeClasse = clienteNome.replace(/ /g, '_');

  const processos = document.querySelectorAll('.' + clienteNomeClasse);
  for (let i = 0; i < processos.length; i++) {
    if (processos[i].style.display == 'none') {
      processos[i].style.display = 'grid'
    } else {
      processos[i].style.display = 'none'
    }
  }
}
//============================================================
//  PROCESSOS EMBARAÇADOS/CONCLUIDOS 
//============================================================
function mostrarClientesConcluidos() {
  let novaLi = ''

  clientes.forEach((cliente, posicao) => {
    // Verifique se o cliente tem processos
    if (cliente.processos.length === 0) {
      return; // Continue para o próximo cliente se este não tiver processos
    }
    if (!cliente.processos.some(processo => processo.concluido)) {
      return
      // Continue se algum dos processos deste cliente estiver concluído
    }

    // Substitua os espaços por sublinhados e adicione um sufixo
    let clienteNomeClasse = cliente.cliente.replace(/ /g, '_') + '_concluido'
    console.log(cliente.cliente + ':')
    novaLi =
      novaLi +
      `
      <div class="cliente-titulo" onclick="esconderProcessosConcluidos('${cliente.cliente}')">
        <div id="cliente-nome">${cliente.cliente}</div>
      </div>
      `
    novaLi = novaLi + `<div class="${clienteNomeClasse}" style="display: none;">` + mostrarProcessosConcluidos(cliente.cliente) + `</div>`
  })
  
  listaConcluida.innerHTML = novaLi; // Atualize a seção de processos concluídos
}

function mostrarProcessosConcluidos(clienteNome) {
  let cliente = clientes.find(c => c.cliente === clienteNome)
  if (!cliente) return ''

  // Substitua os espaços por sublinhados
  let novaLi = ""
  
  cliente.processos.forEach((item, posicao) => {
    // Verifique se o processo está concluído
    if (!item.concluido) {
      return; // Continue para o próximo processo se este não estiver concluído
    }

    novaLi =
      novaLi +
      `
      <div class="processo ${item.concluido && 'concluido' || 'nao_concluido'}" onclick="window.location='../configuracao/painel.html?posicao=${posicao}&cliente=${clienteNome}'">
        <div class="po c1">${item.po}</div>
        <div class="bl c2"> ${item.bl || 'Vazio'}</div>
        <div class="etapa c3"> ${item.etapa || 'Vazio'}</div>
        <div class="mesOperacao c4"> ${item.mesOperacao || 'Vazio'}</div>
        <div class="c5">
          <img class="icone" src="../assets/trash.png" alt="excluir-processo" onclick="event.stopPropagation(); deletarProcesso('${clienteNome}', ${posicao})">
        </div>
      </div>
      `
      console.log(item)
  })
  return novaLi;
}
function esconderProcessosConcluidos(clienteNome) {
  // Substitua os espaços por sublinhados e adicione um sufixo
  let clienteNomeClasse = clienteNome.replace(/ /g, '_') + '_concluido';

  const processos = document.querySelectorAll('.' + clienteNomeClasse);
  for (let i = 0; i < processos.length; i++) {
    if (processos[i].style.display == 'none') {
      processos[i].style.display = 'grid'
    } else {
      processos[i].style.display = 'none'
    }
  }
}
//===========================================================================
function concluirProcesso(posicao) {
  meusProcessos[posicao].concluido = !meusProcessos[posicao].concluido
  localStorage.setItem('meusProcessos', JSON.stringify(meusProcessos))
}

function deletarProcesso(clienteNome, posicao) {
  let cliente = clientes.find(c => c.cliente === clienteNome)
  if (cliente) {
    cliente.processos.splice(posicao, 1)
  }

  localStorage.setItem('clientes', JSON.stringify(clientes))
  mostrarClientes();
  mostrarClientesConcluidos()
}


//========================================================