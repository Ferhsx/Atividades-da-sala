import Router from 'express'
import CarrinhoController from './carrinho/carrinho'
import ProdutosController from './produtos/produtos'
import UsuariosController from './usuarios/usuarios'

const rotas = Router()
//carrinho rotas
rotas.get('/carrinho', CarrinhoController.listar)
rotas.post('/carrinho', CarrinhoController.adicionar)

//produtos rotas
rotas.get('/produtos', ProdutosController.listar)
rotas.post('/produtos', ProdutosController.adicionar)

//usuarios rotas
rotas.get('/usuarios', UsuariosController.listar)
rotas.post('/usuarios', UsuariosController.adicionar)

export default rotas