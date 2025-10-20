import * as React from "react"
import { MapView } from '../../components'
import WovenImageList from '../../components/WovenImageList'
import { Item } from '../../components/Item'
import { AuthContext } from '../../context/AuthContext'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'; // Necessário para Logout
import Typography from '@mui/material/Typography'; // Recomendado para texto
import "./style.css"

export default function NossoCantoSp () {
    const auth = React.useContext(AuthContext);

    // Se a aplicação renderizar em branco, DESCOMENTE ESTA LINHA para ver a mensagem de erro.
    if (!auth) return <div>Erro: AuthContext não encontrado.</div>;

    const { user, isAuthenticated, logout } = auth; // Desestruture após a verificação (ou diretamente se tiver certeza do Provider)

    console.log(isAuthenticated, AuthContext)
    const handleLogout = () => {
        logout();
        // Se estiver usando react-router-dom, adicione: navigate('/login');
    };

    return(
        <section className = "borderCanto">
            {
                isAuthenticated ? (
                    // 1. CONTEÚDO AUTENTICADO
                    <section className="nossocantosp">
                        
                        {/* 🛑 MOSTRAR NOME DO USUÁRIO E BOTÃO LOGOUT 🛑 */}
                        <Typography variant="h4" component="h1" gutterBottom>
                            Bem-vindo, {user?.username || 'Usuário'}!
                        </Typography>
                        <Button variant="outlined" color="secondary" onClick={handleLogout} style={{marginBottom: '20px'}}>
                            Sair (Logout)
                        </Button>
                        
                        <MapView 
                        width='100vw' 
                        heigth='450px' 
                        lat='-23.5487055' 
                        lng='-46.6438873' 
                        text="NossoCanto" 
                        className='mapMarcker' 
                        />
                        
                        <div className="images">
                            <Stack>
                                <Item>
                                    <WovenImageList />
                                </Item>
                            </Stack>
                        </div>
                    </section>

                ):(
                    // 2. CONTEÚDO NÃO AUTENTICADO
                    <div style={{textAlign: 'center', padding: '50px'}}>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Bem-vindo! Por favor, faça login.
                        </Typography>
                        <a href="/#/login" style={{textDecoration: 'none'}}>
                            <Button variant="contained" color="primary">
                            Ir para o Login
                            </Button>
                        </a>
                    </div>
                )
            }
        </section>  
    )
}
