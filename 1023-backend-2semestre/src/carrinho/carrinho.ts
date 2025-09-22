import { Request, Response } from 'express'
import { db } from '../database/banco-mongo'

class CarrinhoController {
    async adicionar(req: Request, res: Response) {
        try {
            const { produtoId, quantidade = 1 } = req.body

            if (!produtoId) {
                return res.status(400).json({ message: 'ID do produto é obrigatório' })
            }

            // Busca o produto
            const produto = await db.collection('produtos').findOne({ id: produtoId })
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado' })
            }

            // Adiciona ao carrinho
            const result = await db.collection('carrinho').insertOne({
                produto: {
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    urlfoto: produto.urlfoto,
                    descricao: produto.descricao
                },
                quantidade: parseInt(quantidade, 10),
                criadoEm: new Date()
            })

            res.status(201).json({
                _id: result.insertedId,
                produto: produto,
                quantidade: parseInt(quantidade, 10)
            })
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error)
            res.status(500).json({ message: 'Erro interno do servidor' })
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const itens = await db.collection('carrinho')
                .find()
                .sort({ criadoEm: -1 }) // Mais recentes primeiro
                .toArray()
            
            res.json(itens)
        } catch (error) {
            console.error('Erro ao listar carrinho:', error)
            res.status(500).json({ message: 'Erro interno do servidor' })
        }
    }
}

export default new CarrinhoController()