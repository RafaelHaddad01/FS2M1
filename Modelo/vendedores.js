import vendedoresDAO from "../Persistencia/vendedoresDAO.js";
//não esqueça do .js no final da importação

export default class Vendedores {
    //definição dos atributos privados
    #codigo;
    #nome;

    constructor(codigo=0, nome=''){
        this.#codigo=codigo;
        this.#nome=nome;
    }

    //métodos de acesso públicos

    get codigo(){
        return this.#codigo;
    }

    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome = novoNome;
    }

    //override do método toJSON
    toJSON()     
    {
        return {
            codigo:this.#codigo,
            nome:this.#nome
        }
    }

    //camada de modelo acessa a camada de persistencia
    async gravar(){
        const vendDAO = new vendedoresDAO();
        await vendDAO.gravar(this);
    }

    async excluir(){
        const vendDAO = new vendedoresDAO();
        await vendDAO.excluir(this);
    }

    async atualizar(){
        const vendDAO = new vendedoresDAO();
        await vendDAO.atualizar(this);

    }

    async consultar(parametro){
        const vendDAO = new vendedoresDAO();
        return await vendDAO.consultar(parametro);
    }

    async possuiProdutos(){
        const vendDAO = new vendedoresDAO();
        return await vendDAO.possuiProdutos(this);
    }
}