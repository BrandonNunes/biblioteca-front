import {Container, MainContainer} from "./styles";
import {Outlet, useNavigate} from "react-router-dom";
import { Menubar } from 'primereact/menubar';

export default function Main() {
    const navigate = useNavigate();
    const items = [
        {
            label:'Home',
            icon:'pi pi-fw pi-home',
            command: () => navigate('/')
        },
        {
            label:'Alunos',
            icon:'pi pi-fw pi-users',
            command: () => navigate('/alunos')
        },
        {
            label:'Livros',
            icon:'pi pi-fw pi-book',
            items:[
                {
                    label:'Todos os livros',
                    icon:'pi pi-fw pi-book',
                    command: () => navigate('/livros')
                },
                {
                    label:'Generos',
                    icon:'pi pi-fw pi-book',
                    command: () => navigate('/generos')
                },
            ]
        },
        {
            label:'Locações',
            icon:'pi pi-fw pi-bookmark',
            command: () => navigate('/locacoes')
        }
    ];
    return (
        <MainContainer>
            <Menubar model={items}/>
            <Container>
                <Outlet />
            </Container>
        </MainContainer>
    )
}
