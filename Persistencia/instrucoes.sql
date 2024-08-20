CREATE DATABASE sistema;

USE sistema;

CREATE TABLE vendedores(
    vend_codigo INT NOT NULL AUTO_INCREMENT,
    vend_nome VARCHAR(100) NOT NULL,
    CONSTRAINT pk_vendedores PRIMARY KEY(vend_codigo)
);

CREATE TABLE produto(
    prod_codigo INT NOT NULL AUTO_INCREMENT,
    prod_descricao VARCHAR(100) NOT NULL,
    prod_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
    vend_codigo INT NOT NULL,
    CONSTRAINT pk_produto PRIMARY KEY(prod_codigo),
);