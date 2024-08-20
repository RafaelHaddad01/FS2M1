//camada de interface da API que traduz HTTP
import Vendedores from "../Modelo/vendedores.js";

export default class VendedoresCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            if (nome) {
                const vendedores = new Vendedores(0, nome);
                //resolver a promise
                vendedores.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": vendedores.codigo,
                        "mensagem": "Vendedor incluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao registrar o Vendedor:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o nome do vendedor!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um vendedor!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            if (codigo && nome) {
                const vendedor = new Vendedores(codigo, nome);
                //resolver a promise
                vendedor.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Vendedor atualizada com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao atualizar o vendedor:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código e o nome do vendedor!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um vendedor!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const vendedores = new Vendedores(codigo);
                vendedores.possuiProdutos().then(possui =>{
                    if (possui == false){
                        vendedores.excluir().then(() => {
                            resposta.status(200).json({
                                "status": true,
                                "mensagem": "Vendedor excluído com sucesso!"
                            });
                        })
                            .catch((erro) => {
                                resposta.status(500).json({
                                    "status": false,
                                    "mensag em": "Erro ao excluir o vendedor:" + erro.message
                                });
                            });
                    }
                    else{
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Esse vendedor possui produtos cadastrados e por isso nao pode ser excluido"
                        });
                    }
                })
                //resolver a promise
                
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do vendedor!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um vendedor!"
            });
        }
    }


    consultar(requisicao, resposta) {
        resposta.type('application/json');
        //express, por meio do controle de rotas, será
        //preparado para esperar um termo de busca
        let termo = requisicao.params.termo;
        if (!termo){
            termo = "";
        }
        if (requisicao.method === "GET"){
            const vendedores = new Vendedores();
            vendedores.consultar(termo).then((listaCategorias)=>{
                resposta.json(
                    {
                        status:true,
                        listaCategorias
                    });
            })
            .catch((erro)=>{
                resposta.json(
                    {
                        status:false,
                        mensagem:"Não foi possível obter os vendedores: " + erro.message
                    }
                );
            });
        }
        else 
        {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar os vendedores!"
            });
        }
    }
}