import './Header.css'
function Header(){
    return(
        <header>
            <nav>
                <div className="header-links">
                    <a href="">Central do Vendedor</a>
                    <a href="">Vender na Shopee</a>
                    <a href="">Baixe o App</a>
                    <a href="">Siga-nos no</a>
                    <a href="">Instagram</a>
                    <a href="">X</a>
                    <a href="">TikTok</a>
                </div>
                <ul>
                    <li>
                        <a href="">Notificações</a>
                    </li>
                    <li>
                        <a href="">Ajuda</a>
                    </li>
                    <li>
                        <a href="">Português (BR)</a>
                    </li>
                    <li>
                        <a href="">Cadastrar</a>
                    </li>
                    <li>
                        <a href="">Entre</a>
                    </li>
                </ul>
            </nav>
            <div className="header-container">
                <div className='logo'><img src="https://i.redd.it/4z67svdd5t8e1.jpeg" alt="logo" />
                </div>
                <div className='cima'>
                <div>
                    <input type="text" placeholder="Buscar na Shopee"/>
                    <button>Pesquisar</button>
                </div>
                <div>Carrinho</div>
                </div>
            </div>
        </header>
    )
}
export default Header;