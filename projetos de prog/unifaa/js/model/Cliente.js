class Cliente {
    constructor(obj){
        obj = obj || {}// Isso é um tratamento para evitar undefined quando tentar acessar alguma propriedade.
        this.id = obj.id;
        this.nome = obj.nome;
        this.valor = obj.valor;
        this.quantidadeEstoque = obj.quantidadeEstoque;
        this.observacao = obj.observacao;
        this.dataCadastro = obj.dataCadastro;
    }

    validar(){
        // return (!this.cpfOuCnpj || !this.email) ? false  : true;  
        return !!(this.cpfOuCnpj && this.email);  
    }
}