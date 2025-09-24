import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../database/banco-mongo';
import { Carrinho, ItemCarrinho } from '../models/Carrinho';

interface Produto {
    _id: ObjectId;
    id?: number;
    nome: string;
    preco: number;
    urlfoto: string;
    descricao: string;
}

class CarrinhoController {
    // Adicionar item ao carrinho
    async adicionar(req: Request, res: Response) {
        try {
            const { produtoId, quantidade = 1, usuarioId } = req.body;

            if (!produtoId || !usuarioId) {
                return res.status(400).json({ 
                    message: 'ID do produto e ID do usuário são obrigatórios' 
                });
            }

            // Busca o produto no banco de dados
            const produto = await this.buscarProduto(produtoId);
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            // Verifica se já existe um carrinho para o usuário
            let carrinho = await db.collection<Carrinho>('carrinhos').findOne({
                usuarioId: new ObjectId(usuarioId)
            });

            const itemCarrinho: ItemCarrinho = {
                produtoId: produto._id,
                nome: produto.nome,
                preco: produto.preco,
                quantidade: Number(quantidade),
                urlfoto: produto.urlfoto
            };

            const dataAtual = new Date();

            if (!carrinho) {
                // Cria um novo carrinho se não existir
                const novoCarrinho: Carrinho = {
                    _id: new ObjectId(),
                    usuarioId: new ObjectId(usuarioId),
                    itens: [itemCarrinho],
                    total: produto.preco * Number(quantidade),
                    criadoEm: dataAtual,
                    atualizadoEm: dataAtual
                };

                await db.collection<Carrinho>('carrinhos').insertOne(novoCarrinho);
                return res.status(201).json(novoCarrinho);
            } else {
                // Atualiza o carrinho existente
                const itemExistenteIndex = carrinho.itens.findIndex(
                    item => item.produtoId.toString() === produtoId
                );

                if (itemExistenteIndex >= 0) {
                    // Atualiza a quantidade se o item já existir
                    carrinho.itens[itemExistenteIndex].quantidade += Number(quantidade);
                } else {
                    // Adiciona um novo item
                    carrinho.itens.push(itemCarrinho);
                }

                // Atualiza o total e a data de atualização
                carrinho.total = this.calcularTotal(carrinho.itens);
                carrinho.atualizadoEm = dataAtual;

                await db.collection<Carrinho>('carrinhos').updateOne(
                    { _id: carrinho._id },
                    { 
                        $set: { 
                            itens: carrinho.itens,
                            total: carrinho.total,
                            atualizadoEm: carrinho.atualizadoEm
                        } 
                    }
                );

                const carrinhoAtualizado = await db.collection<Carrinho>('carrinhos').findOne({
                    _id: carrinho._id
                });

                return res.status(200).json(carrinhoAtualizado);
            }
        } catch (error) {
            console.error('Erro ao adicionar item ao carrinho:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    // Listar itens do carrinho
    async listar(req: Request, res: Response) {
        try {
            const { usuarioId } = req.query;

            if (!usuarioId) {
                return res.status(400).json({ 
                    message: 'ID do usuário é obrigatório' 
                });
            }

            const carrinho = await db.collection<Carrinho>('carrinhos').findOne({
                usuarioId: new ObjectId(usuarioId as string)
            });

            if (!carrinho) {
                return res.status(200).json({ 
                    itens: [],
                    total: 0,
                    mensagem: 'Carrinho vazio' 
                });
            }

            res.status(200).json(carrinho);
        } catch (error) {
            console.error('Erro ao listar carrinho:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    // Atualizar quantidade de um item
    async atualizarQuantidade(req: Request, res: Response) {
        try {
            const { carrinhoId, itemId } = req.params;
            const { quantidade } = req.body;

            if (!carrinhoId || !itemId || quantidade === undefined) {
                return res.status(400).json({ 
                    message: 'ID do carrinho, ID do item e quantidade são obrigatórios' 
                });
            }

            const carrinho = await db.collection<Carrinho>('carrinhos').findOne({
                _id: new ObjectId(carrinhoId)
            });

            if (!carrinho) {
                return res.status(404).json({ message: 'Carrinho não encontrado' });
            }

            const itemIndex = carrinho.itens.findIndex(
                item => item.produtoId.toString() === itemId
            );

            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item não encontrado no carrinho' });
            }

            // Atualiza a quantidade
            carrinho.itens[itemIndex].quantidade = Number(quantidade);
            
            // Remove o item se a quantidade for zero ou menor
            if (carrinho.itens[itemIndex].quantidade <= 0) {
                carrinho.itens.splice(itemIndex, 1);
            }

            // Atualiza o total e a data de atualização
            carrinho.total = this.calcularTotal(carrinho.itens);
            carrinho.atualizadoEm = new Date();

            // Se não há mais itens, remove o carrinho
            if (carrinho.itens.length === 0) {
                await db.collection<Carrinho>('carrinhos').deleteOne({
                    _id: carrinho._id
                });
                return res.status(200).json({ 
                    itens: [],
                    total: 0,
                    mensagem: 'Carrinho vazio' 
                });
            }

            // Atualiza o carrinho
            await db.collection<Carrinho>('carrinhos').updateOne(
                { _id: carrinho._id },
                { 
                    $set: { 
                        itens: carrinho.itens,
                        total: carrinho.total,
                        atualizadoEm: carrinho.atualizadoEm
                    } 
                }
            );

            res.status(200).json(carrinho);
        } catch (error) {
            console.error('Erro ao atualizar quantidade do item:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    // Remover item do carrinho
    async removerItem(req: Request, res: Response) {
        try {
            const { carrinhoId, itemId } = req.params;

            if (!carrinhoId || !itemId) {
                return res.status(400).json({ 
                    message: 'ID do carrinho e ID do item são obrigatórios' 
                });
            }

            const carrinho = await db.collection<Carrinho>('carrinhos').findOne({
                _id: new ObjectId(carrinhoId)
            });

            if (!carrinho) {
                return res.status(404).json({ message: 'Carrinho não encontrado' });
            }

            const itemIndex = carrinho.itens.findIndex(
                item => item.produtoId.toString() === itemId
            );

            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item não encontrado no carrinho' });
            }

            // Remove o item
            carrinho.itens.splice(itemIndex, 1);

            // Atualiza o total e a data de atualização
            carrinho.total = this.calcularTotal(carrinho.itens);
            carrinho.atualizadoEm = new Date();

            // Se não há mais itens, remove o carrinho
            if (carrinho.itens.length === 0) {
                await db.collection<Carrinho>('carrinhos').deleteOne({
                    _id: carrinho._id
                });
                return res.status(200).json({ 
                    itens: [],
                    total: 0,
                    mensagem: 'Carrinho vazio' 
                });
            }

            // Atualiza o carrinho
            await db.collection<Carrinho>('carrinhos').updateOne(
                { _id: carrinho._id },
                { 
                    $set: { 
                        itens: carrinho.itens,
                        total: carrinho.total,
                        atualizadoEm: carrinho.atualizadoEm
                    } 
                }
            );

            res.status(200).json(carrinho);
        } catch (error) {
            console.error('Erro ao remover item do carrinho:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    // Remover carrinho inteiro
    async removerCarrinho(req: Request, res: Response) {
        try {
            const { carrinhoId } = req.params;

            if (!carrinhoId) {
                return res.status(400).json({ 
                    message: 'ID do carrinho é obrigatório' 
                });
            }

            const result = await db.collection<Carrinho>('carrinhos').deleteOne({
                _id: new ObjectId(carrinhoId)
            });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Carrinho não encontrado' });
            }

            res.status(200).json({ message: 'Carrinho removido com sucesso' });
        } catch (error) {
            console.error('Erro ao remover carrinho:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    // Métodos auxiliares
    private async buscarProduto(produtoId: string): Promise<Produto | null> {
        try {
            let produto: Produto | null = null;
            
            if (ObjectId.isValid(produtoId)) {
                produto = await db.collection<Produto>('produtos').findOne({ 
                    _id: new ObjectId(produtoId) 
                });
            }
            
            if (!produto) {
                produto = await db.collection<Produto>('produtos').findOne({ 
                    _id: new ObjectId(produtoId) 
                });
            }

            return produto;
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return null;
        }
    }

    private calcularTotal(itens: ItemCarrinho[]): number {
        return itens.reduce((total, item) => {
            return total + (item.preco * item.quantidade);
        }, 0);
    }
}

export default new CarrinhoController();