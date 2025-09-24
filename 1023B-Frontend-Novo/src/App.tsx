import { useState } from 'react';
import './App.css';
import type { ProdutoType } from './types';

function App() {
  const [produto, setProduto] = useState<Omit<ProdutoType, 'id' | '_id'>>({
    nome: '',
    preco: 0,
    urlfoto: '',
    descricao: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduto(prev => ({
      ...prev,
      [name]: name === 'preco' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao adicionar produto');
      }

      // Limpa o formulário após o envio
      setProduto({
        nome: '',
        preco: 0,
        urlfoto: '',
        descricao: ''
      });
      
      alert('Produto cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert((error as Error).message || 'Erro ao cadastrar produto');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Loja Online</h1>
      </header>
      
      <main>
        <section className="form-section">
          <h2>Cadastrar Novo Produto</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome do Produto</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={produto.nome}
                onChange={handleInputChange}
                required
                placeholder="Digite o nome do produto"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="preco">Preço (R$)</label>
              <input
                type="number"
                id="preco"
                name="preco"
                value={produto.preco || ''}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                placeholder="0,00"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="urlfoto">URL da Imagem</label>
              <input
                type="url"
                id="urlfoto"
                name="urlfoto"
                value={produto.urlfoto}
                onChange={handleInputChange}
                required
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={produto.descricao}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Descreva o produto aqui..."
              />
            </div>
            
            <button type="submit" className="btn-primary">
              Cadastrar Produto
            </button>
          </form>
        </section>
      </main>
      
      <footer>
        <p>&copy; {new Date().getFullYear()} Loja Online - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

export default App;
