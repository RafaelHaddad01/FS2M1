import ProdutoDAO from "../Persistencia/produtoDAO.js";
import Vendedores from "./vendedores.js";

export default class Produto{
    #codigo;
    #descricao;
    #qtdEstoque;
    #vendedor;


    constructor(codigo=0,descricao="", qtdEstoque=0, vendedor=null
                ){
        this.#codigo=codigo;
        this.#descricao=descricao;
        this.#qtdEstoque=qtdEstoque;
        this.#vendedor=vendedor;
    }

    get codigo(){
        return this.#codigo;
    }
    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao(novaDesc){
        this.#descricao=novaDesc;
    }

    get qtdEstoque(){
        return this.#qtdEstoque;
    }

    set qtdEstoque(novaQtd){
        this.#qtdEstoque = novaQtd;
    }

    get vendedor(){
        return this.#vendedor;
    }

    set vendedor(novoVend){
        if (novoVend instanceof Vendedores){
        this.#vendedor = novoVend;
        }
    }


    toJSON(){
        return {
            codigo:this.#codigo,
            descricao:this.#descricao,
            qtdEstoque:this.#qtdEstoque,
            vendedor:this.#vendedor
        }
    }

     //camada de modelo acessa a camada de persistencia
     async gravar(){
        const prodDAO = new ProdutoDAO();
        await prodDAO.gravar(this);
     }
 
     async excluir(){
        const prodDAO = new ProdutoDAO();
        await prodDAO.excluir(this);
     }
 
     async alterar(){
        const prodDAO = new ProdutoDAO();
        await prodDAO.atualizar(this);
     }
 
     async consultar(termo){
        const prodDAO = new ProdutoDAO();
        return await prodDAO.consultar(termo);
     }

}