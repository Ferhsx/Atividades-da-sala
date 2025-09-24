import React, { useEffect, useState } from 'react';
import type { ProdutoType } from '../types';
import { fetchCarrinho, adicionarAoCarrinho, removerDoCarrinho } from '../services/api';
import { formatarMoeda } from '../utils/formatadores';

interface ItemCarrinho {
  _id: string;
  produto: ProdutoType;
  quantidade: number;
  criadoEm: string;
}

const Carrinho: React.FC = () => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarCarrinho = async () => {
    try {
      setCarregando(true);
      const data = await fetchCarrinho();
      setItens(data);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      setErro('Erro ao carregar o carrinho. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCarrinho();
  }, []);

  const handleAumentarQuantidade = async (itemId: string) => {
    try {
      await adicionarAoCarrinho(itemId, 1);
      await carregarCarrinho();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      setErro('Erro ao atualizar a quantidade do item.');
    }
  };

  const handleDiminuirQuantidade = async (itemId: string, quantidadeAtual: number) => {
    try {
      if (quantidadeAtual <= 1) {
        await removerDoCarrinho(itemId);
      } else {
        await adicionarAoCarrinho(itemId, -1);
      }
      await carregarCarrinho();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      setErro('Erro ao atualizar a quantidade do item.');
    }
  };

  const handleRemoverItem = async (itemId: string) => {
    if (window.confirm('Tem certeza que deseja remover este item do carrinho?')) {
      try {
        await removerDoCarrinho(itemId);
        await carregarCarrinho();
      } catch (error) {
        console.error('Erro ao remover item:', error);
        setErro('Erro ao remover o item do carrinho.');
      }
    }
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      return total + (item.produto.preco * item.quantidade);
    }, 0);
  };

  if (carregando) {
    return <div className="carrinho-carregando">Carregando carrinho...</div>;
  }

  if (erro) {
    return <div className="carrinho-erro">{erro}</div>;
  }

  return (
    <div className="carrinho-container">
      <h2>Seu Carrinho</h2>
      
      {itens.length === 0 ? (
        <div className="carrinho-vazio">
          <p>Seu carrinho está vazio</p>
          <a href="/produtos" className="botao">Continuar Comprando</a>
        </div>
      ) : (
        <>
          <div className="itens-carrinho">
            {itens.map((item) => (
              <div key={item._id} className="item-carrinho">
                <img 
                  src={item.produto.urlfoto} 
                  alt={item.produto.nome} 
                  className="item-imagem"
                />
                <div className="item-detalhes">
                  <h3>{item.produto.nome}</h3>
                  <p className="item-preco">{formatarMoeda(item.produto.preco)}</p>
                  <div className="item-quantidade">
                    <button 
                      onClick={() => handleDiminuirQuantidade(item._id, item.quantidade)}
                      className="botao-quantidade"
                    >
                      -
                    </button>
                    <span>{item.quantidade}</span>
                    <button 
                      onClick={() => handleAumentarQuantidade(item.produto._id)}
                      className="botao-quantidade"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="item-acoes">
                  <button 
                    onClick={() => handleRemoverItem(item._id)}
                    className="botao-remover"
                    aria-label="Remover item"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="carrinho-resumo">
            <div className="resumo-linha">
              <span>Subtotal</span>
              <span>{formatarMoeda(calcularTotal())}</span>
            </div>
            <div className="resumo-linha">
              <span>Frete</span>
              <span>Grátis</span>
            </div>
            <div className="resumo-total">
              <span>Total</span>
              <span>{formatarMoeda(calcularTotal())}</span>
            </div>
            <button className="botao-finalizar">Finalizar Compra</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrinho;