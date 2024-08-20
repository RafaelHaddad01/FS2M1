import { Router } from "express";
import VendedoresCtrl from "../Controle/vendedoresCtrl.js";

//rotas é o mapeamento das requisições da web para um determinado
//endpoint da aplicação

const vendCtrl = new VendedoresCtrl();
const rotaVendedores = new Router();

rotaVendedores
.get('/',vendCtrl.consultar)
.get('/:termo', vendCtrl.consultar)
.post('/',vendCtrl.gravar)
.patch('/',vendCtrl.atualizar)
.put('/',vendCtrl.atualizar)
.delete('/',vendCtrl.excluir);

export default rotaVendedores;