export interface ProdutoType {
  _id: string;
  id?: number;
  nome: string;
  preco: number;
  urlfoto: string;
  descricao: string;
}

export interface ItemCarrinho {
  _id: string;
  produto: ProdutoType;
  quantidade: number;
  criadoEm: string;
}
