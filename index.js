import express from 'express';
import cors from 'cors';
import rotaVendedores from './Rotas/rotaVendedores.js';
import rotaProduto from './Rotas/rotaProduto.js';

const host='0.0.0.0';
const porta=3000;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/vendedores',rotaVendedores);
app.use('/produto',rotaProduto);

app.listen(porta, host, ()=>{
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
})
