const URL = 'http://localhost:3400/produtos'

let listaClientes = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaCliente = document.querySelector('table>tbody');
let modalCliente = new bootstrap.Modal(document.getElementById('modal-cliente'));
const EMAIL = "admin@admin.com";
const SENHA = '123456';

autenticar(EMAIL, SENHA); //pq é impossivel dar certo sem autenticar...

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    quantidadeEstoque: document.querySelector("#quantidadeEstoque"),
    observacao: document.querySelector("#observacao"),

    valor: document.querySelector("#valor"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar:document.querySelector("#btn-salvar"),
    btnCancelar:document.querySelector("#btn-cancelar")
}


btnAdicionar.addEventListener('click', () =>{
    limparModalCliente();
    modalCliente.show();
});

// Obter os clientes da API, pq obetando produtos não deu certo
function obterClientes() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization' : obterToken()
        }
    })
    .then(response => response.json())
    .then(clientes => {
        listaClientes = clientes;
        popularTabela(clientes);
    })
    .catch((erro) => {});
}

obterClientes();

function popularTabela(clientes){

    // Limpando a tabela 
    tabelaCliente.textContent = '';

    clientes.forEach(cliente => { 
        criarLinhaNaTabela(cliente);
    });
}

function criarLinhaNaTabela(cliente){

    //1° Criando uma linha na tabela.
    let tr  = document.createElement('tr');

    //2° Criar as tds dos conteudos da tabela
    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdQuantidadeEstoque = document.createElement('td');
    let tdObservacao = document.createElement('td');

    /*//!Se fosse para clientes...
    let  tdCPF = document.createElement('td');
    let  tdEmail = document.createElement('td');
    let  tdTelefone = document.createElement('td');
    */
    let  tdDataCadastro = document.createElement('td');
    let  tdAcoes = document.createElement('td');

    // 3° Atualizar as tds com base no cliente
    tdId.textContent = cliente.id
    tdNome.textContent = cliente.nome;
    tdValor.textContent = cliente.valor;
    tdQuantidadeEstoque.textContent = cliente.quantidadeEstoque;
    tdObservacao.textContent = cliente.observacao;

    /*//!
    tdCPF.textContent = cliente.cpfOuCnpj;
    tdEmail.textContent = cliente.email;
    tdTelefone.textContent = cliente.telefone;
    */
    tdDataCadastro.textContent = new Date(cliente.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Editar
                            </button>
                            <button onclick="excluirCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Excluir
                        </button>`

    // 4° Adicionando as TDs à Tr
    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdQuantidadeEstoque);
    tr.appendChild(tdObservacao);
    /*//Dados clientes
    tr.appendChild(tdCPF);
    tr.appendChild(tdEmail);
    tr.appendChild(tdTelefone);
    */
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    // 5° Adicionar a tr na tabela.
    tabelaCliente.appendChild(tr);
}


formModal.btnSalvar.addEventListener('click', () => {

    // 1° Capturar os dados da tela do modal e transformar em um cliente
    let cliente = obterClienteDoModal();

    // 2° Verificar se os campos obrigatorios foram preenchidos

    /* se houvesse autenticação
    if(!cliente.validar()){
        alert("E-mail e CPF são obrigatórios.");
        return;
    }
    */
   
    // 3° Adicionar dados ao Backend
    adicionarClienteNoBackend(cliente);
});


function obterClienteDoModal(){
    return new Cliente({
        id: formModal.id.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value)
        ? new Date(formModal.dataCadastro.value).toISOString()
        : new Date().toISOString()
});
}

function adicionarClienteNoBackend(cliente){

fetch(URL, {
    method: 'POST',
    headers: {
        Authorization: obterToken(),
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(cliente)
})
.then(response => response.json())
.then(response => {
    let novoCliente = new Cliente(response);
    listaClientes.push(novoCliente);

    popularTabela(listaClientes);

    // Fechar modal
    
    modalCliente.hide();

        // Mandar mensagem de cliente cadastrado com sucesso!
        alert(`O produto ${cliente.nome}, foi cadastrado com sucesso!`)
    })
}

function limparModalCliente(){
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.valor.value = '';
    formModal.quantidadeEstoque.value = '';
    formModal.observacao.value = '';
    formModal.dataCadastro.value = '';

} 
function excluirCliente(id){
    let cliente = listaClientes.find(cliente => cliente.id == id);

    if(confirm("Deseja realmente excluir o produto " + cliente.nome)){
        excluirCienteNoBackEnd(id);
    }
}

function excluirCienteNoBackEnd(id){
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: obterToken()
        }
    })
    .then(() => {
        removerClienteDaLista(id);
        popularTabela(listaClientes);
    })
}

function removerClienteDaLista(id){
    let indice = listaClientes.findIndex(cliente => cliente.id == id);

    listaClientes.splice(indice, 1);
}