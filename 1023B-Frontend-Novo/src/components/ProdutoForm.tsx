import React, { useState } from 'react';

interface ProdutoType {
  _id: string;
  id: number;
  nome: string;
  preco: number;
  urlfoto: string;
  descricao: string;
}

interface ProdutoFormProps {
  onProdutoCadastrado: () => void;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ onProdutoCadastrado }) => {
  const [formData, setFormData] = useState<Omit<ProdutoType, 'id' | '_id'>>({
    nome: '',
    preco: 0,
    urlfoto: '',
    descricao: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco' ? parseFloat(value) || 0 : value
    }));
  };

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar produto');
      }

      // Limpar o formulário
      setFormData({
        nome: '',
        preco: 0,
        urlfoto: '',
        descricao: ''
      });

      // Notificar o componente pai para atualizar a lista
      onProdutoCadastrado();
      alert('Produto cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar produto. Por favor, tente novamente.');
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastrar Novo Produto</h2>
      <form onSubmit={handleForm} className="produto-form">
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Preço:</label>
          <input
            type="number"
            name="preco"
            value={formData.preco || ''}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label>URL da Imagem:</label>
          <input
            type="url"
            name="urlfoto"
            value={formData.urlfoto}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <button type="submit" className="botao-cadastrar">
          Cadastrar Produto
        </button>
      </form>
    </div>
  );
};

export default ProdutoForm;
