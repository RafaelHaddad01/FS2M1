import Vendedores from "../Modelo/vendedores.js";
import conectar from "./conexao.js";
//DAO = Data Access Object -> Objeto de acesso aos dados
export default class vendedoresDAO{

    constructor() {
        this.init();
    }
    
    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
                CREATE TABLE IF NOT EXISTS vendedores(
                    vend_codigo INT NOT NULL AUTO_INCREMENT,
                    vend_nome VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_vendedores PRIMARY KEY(vend_codigo)
                );`;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }
    async gravar(vendedores){
        if (vendedores instanceof Vendedores){
            const sql = "INSERT INTO vendedores(vend_nome) VALUES(?)"; 
            const parametros = [vendedores.nome];
            const conexao = await conectar(); //retorna uma conexão
            const retorno = await conexao.execute(sql,parametros); //prepara a sql e depois executa
            vendedores.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(vendedores){
        if (vendedores instanceof Vendedores){
            const sql = "UPDATE vendedores SET vend_nome = ? WHERE vend_codigo = ?"; 
            const parametros = [vendedores.nome, vendedores.codigo];
            const conexao = await conectar(); //retorna uma conexão
            await conexao.execute(sql,parametros); //prepara a sql e depois executa
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(vendedores){
        if (vendedores instanceof Vendedores){
            const sql = "DELETE FROM vendedores WHERE vend_codigo = ?"; 
            const parametros = [vendedores.codigo];
            const conexao = await conectar(); //retorna uma conexão
            await conexao.execute(sql,parametros); //prepara a sql e depois executa
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta){
        let sql='';
        let parametros=[];
        //é um número inteiro?
        if (!isNaN(parseInt(parametroConsulta))){
            //consultar pelo código da categoria
            sql='SELECT * FROM vendedores WHERE vend_codigo = ? order by vend_nome';
            parametros = [parametroConsulta];
        }
        else{
            //consultar pelo nome
            if (!parametroConsulta){
                parametroConsulta = '';
            }
            sql = "SELECT * FROM vendedores WHERE vend_nome like ?";
            parametros = ['%'+parametroConsulta+'%'];
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql,parametros);
        let listaCategorias = [];
        for (const registro of registros){
            const vendedores = new Vendedores(registro.vend_codigo,registro.vend_nome);
            listaCategorias.push(vendedores);
        }
        return listaCategorias;
    }

    async possuiProdutos(vendedores){
        if(vendedores instanceof Vendedores){
            const sql = `SELECT count(*) as qtd FROM produto p
                        INNER JOIN vendedores v ON p.vend_codigo = v.vend_codigo
                        WHERE v.vend_codigo = ? `;
            const parametros = [vendedores.codigo];
            const [registros] = await global.poolConexoes.execute(sql,parametros);
            return registros[0].qtd > 0;
        }
    }
}