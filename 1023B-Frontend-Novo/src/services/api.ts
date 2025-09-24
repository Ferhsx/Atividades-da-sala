import type { ItemCarrinho } from '../types';

const API_BASE_URL = '/api';

export const fetchCarrinho = async (): Promise<ItemCarrinho[]> => {
  const response = await fetch(`${API_BASE_URL}/carrinho`);
  if (!response.ok) {
    throw new Error('Erro ao carregar o carrinho');
  }
  return response.json();
};

export const adicionarAoCarrinho = async (produtoId: string, quantidade: number = 1): Promise<ItemCarrinho> => {
  const response = await fetch(`${API_BASE_URL}/carrinho`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      produtoId,
      quantidade,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao adicionar ao carrinho');
  }

  return response.json();
};

export const removerDoCarrinho = async (itemId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/carrinho/${itemId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao remover do carrinho');
  }
};
