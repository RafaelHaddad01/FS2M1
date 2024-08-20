import Produto from '../Modelo/produto.js';
import Vendedores from '../Modelo/vendedores.js';
import conectar from './conexao.js';

export default class ProdutoDAO {

    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS produto(
                prod_codigo INT NOT NULL AUTO_INCREMENT,
                prod_descricao VARCHAR(100) NOT NULL,
                prod_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
                vend_codigo INT NOT NULL,
                CONSTRAINT pk_produto PRIMARY KEY(prod_codigo),
                CONSTRAINT fk_vendedores FOREIGN KEY (vend_codigo) REFERENCES vendedores(vend_codigo)
            )
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }


    async gravar(produto) {
        if (produto instanceof Produto) {
            const sql = `INSERT INTO produto(prod_descricao, prod_qtdEstoque, vend_codigo)
                VALUES(?,?,?)`;
            const parametros = [produto.descricao, produto.qtdEstoque, produto.vendedor.codigo];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            produto.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    async atualizar(produto) {
        if (produto instanceof Produto) {
            const sql = `UPDATE produto SET prod_descricao = ?, prod_qtdEstoque = ?, vend_codigo= ?
            WHERE prod_codigo = ?`;
            const parametros = [produto.descricao, produto.qtdEstoque, produto.vendedor.codigo, produto.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(produto) {
        if (produto instanceof Produto) {
            const sql = `DELETE FROM produto WHERE prod_codigo = ?`;
            const parametros = [produto.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        if (!termo){
            termo="";
        }
        //termo é um número
        const conexao = await conectar();
        let listaProdutos = [];
        if (!isNaN(parseInt(termo))){
            //consulta pelo código do produto
            const sql = `SELECT p.prod_codigo, p.prod_descricao,
              p.prod_qtdEstoque, v.vend_codigo, v.vend_nome
              FROM produto p 
              INNER JOIN vendedores v ON p.vend_codigo = v.vend_codigo
              WHERE p.prod_codigo = ?
              ORDER BY p.prod_descricao               
            `;
            const parametros=[termo];
            const [registros, campos] = await conexao.execute(sql,parametros);
            for (const registro of registros){
                const produto = new Produto(registro.prod_codigo,registro.prod_descricao,
                                            registro.prod_qtdEstoque
                                            );
                listaProdutos.push(produto);
            }
        }
        else
        {
            //consulta pela descrição do produto
            const sql = `SELECT p.prod_codigo, p.prod_descricao,
                         p.prod_qtdEstoque, v.vend_codigo, v.vend_nome
                         FROM produto p 
                         INNER JOIN vendedores v ON p.vend_codigo = v.vend_codigo 
                         WHERE p.prod_descricao like ?
                         ORDER BY p.prod_descricao`;
            const parametros=['%'+termo+'%'];
            const [registros, campos] = await conexao.execute(sql,parametros);
            for (const registro of registros){
                const vendedores = new Vendedores(registro.vend_codigo, registro.vend_nome);
                const produto = new Produto(registro.prod_codigo,registro.prod_descricao,
                                            registro.prod_qtdEstoque,
                                            vendedores
                                            );
                listaProdutos.push(produto);
            }
        }

        return listaProdutos;
    }
}