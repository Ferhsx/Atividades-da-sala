import { useEffect, useState } from 'react'
import './App.css'

interface ProdutoType {
  id: number
  nome: string
  preco: number
  urlfoto: string
  descricao: string
}

function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])

  useEffect(() => {
    fetch('/api/produtos')
      .then(response => response.json())
      .then(data => setProdutos(data))
  }, [])

  return (
    <>
      <h1>Produtos</h1>
      <ul style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        {produtos.map(produto => (
          <li key={produto.id} style={{ margin: '10px' }}>
            <img src={produto.urlfoto} alt={produto.nome} width={200} />
            <p>{produto.descricao}</p>
            <p>R$ {produto.preco}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
