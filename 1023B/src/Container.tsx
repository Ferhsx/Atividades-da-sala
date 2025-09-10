import React, { useEffect, useState } from "react"
import './Container.css'

interface ProdutosState {
  id: number,
  nome: string,
  preco: number,
  categoria: string
}

function Container() {
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [erroMensagem, setErroMensagem] = useState("");
  const [categoria, setCategoria] = useState("");
  const [produtos, setProdutos] = useState<ProdutosState[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/produtos")
        if (resposta.status == 200) {
          const result = await resposta.json()
          setProdutos(result)
        }
        if (resposta.status == 400) {
          const result = await resposta.json()
          setErroMensagem(result.mensagem)
        }

      } catch (erro: any) {
        setErroMensagem("Erro ao tentar realizar o fetch no backend")
      }
    }
    fetchData()
  }, [])
  async function trataForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const produtoNovo: ProdutosState = {
      id: parseInt(id),
      nome,
      preco: parseFloat(preco),
      categoria
    }
    try {
      const resposta = await fetch("http://localhost:8000/produtos", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(produtoNovo)
      })
      if (resposta.status == 200) {
        const result = await resposta.json()
        setProdutos([
          ...produtos, result
        ])
      }
      if (resposta.status == 400) {
        const result = await resposta.json()
        setErroMensagem(result.mensagem)
      }

    } catch (erro: any) {
      setErroMensagem("Erro ao tentar realizar o fetch no backend")
    }
  }
  function trataId(event: React.ChangeEvent<HTMLInputElement>) {
    setId(event.target.value)
  }
  function trataNome(event: React.ChangeEvent<HTMLInputElement>) {
    setNome(event.target.value)
  }
  function trataPreco(event: React.ChangeEvent<HTMLInputElement>) {
    setPreco(event.target.value)
  }
  function trataCategoria(event: React.ChangeEvent<HTMLInputElement>) {
    setCategoria(event.target.value)
  }
  return (
    <>
      <div className="container">
        {erroMensagem && <div className="mensagem-erro">
          <p>{erroMensagem}</p>
        </div>}
        <div className="container-cadastro">
          <h1>Cadastro produto</h1>
          <form onSubmit={trataForm}>
            <input type="text" name="id" id="id" placeholder="id" onChange={trataId} />
            <input type="text" name="nome" id="nome" placeholder="nome" onChange={trataNome} />
            <input type="text" name="preco" id="preco" placeholder="preco" onChange={trataPreco} />
            <input type="text" name="categoria" id="categoria" placeholder="categoria" onChange={trataCategoria} />
            <input type="submit" value="Cadastrar" />
          </form>
        </div>
        <div className="container-listagem">
          {produtos.map(produto => {
            return (
              <div className="container-produto">
                <div className="produto-nome">
                  {produto.nome}
                </div>
                <div className="produto-preco">
                  {produto.preco}
                </div>
                <div className="produto-categoria">
                  {produto.categoria}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
export default Container