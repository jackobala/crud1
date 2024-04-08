function salvarToken(token){
    // Aqui salvo o usuario na Store
    localStorage.setItem('token', token)
}

function obterToken(token){
    // Obtenho o token da store
   return localStorage.getItem("token");
}

function salvarUsuario(usuario){
    // Aqui pego o usuario0 em obj e converto ele para json e salvo n a store.
   return localStorage.setItem('usuario', JSON.stringify(usuario));
}

function obterUsuario(usuario){
    // pego o usuario como json na store e converto ele para objeto e devolvo no return.
    let usuarioStore = localStorage.getItem("usuario");
    return JSON.parse(usuarioStore);
}

function sairDoSistema(){
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario');
    window.open('login.html', '_self');
}

function autenticar (email, senha){

    //1° Preciso saber qual a URL da API
    const URL = 'http://localhost:3400/login';

    //2° Criar um request para a api
    fetch(URL, {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, senha})
    })
    //3° Se der certo, direcionar para a tela de home
    .then(response => response = response.json())
    .then(response => {
        //console.log(response)

        if(!!response.mensagem){
            alert(response.mensagem);
            return;
        }


        // Aqui salvo o token e o usuario na storage
        salvarToken(response.token);
        salvarUsuario(response.usuario);

        
    })
    //4° Se der errado, mandar mensagem para o usuario.
    .catch(erro => {
        console.log(erro)
    })    
}