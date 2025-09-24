import React from 'react';

interface ProdutoType {
  _id: string;
  id: number;
  nome: string;
  preco: number;
  urlfoto: string;
  descricao: string;
}

interface ProdutoCardProps {
  produto: ProdutoType;
  onAddToCart: (produto: ProdutoType) => void;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({ produto, onAddToCart }) => {
  return (
    <div className="produto-card">
      <img 
        src={produto.urlfoto} 
        alt={produto.nome} 
        className="produto-imagem"
      />
      <div className="produto-info">
        <h3>{produto.nome}</h3>
        <p className="produto-descricao">{produto.descricao}</p>
        <p className="produto-preco">R$ {produto.preco.toFixed(2)}</p>
        <button 
          onClick={() => onAddToCart(produto)}
          className="botao-adicionar"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProdutoCard;
