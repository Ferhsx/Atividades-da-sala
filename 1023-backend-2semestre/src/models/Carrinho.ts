import { ObjectId } from 'mongodb';

export interface ItemCarrinho {
  produtoId: ObjectId;
  nome: string;
  preco: number;
  quantidade: number;
  urlfoto?: string;
}

export interface Carrinho {
  _id?: ObjectId;
  usuarioId: ObjectId;
  itens: ItemCarrinho[];
  total: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

