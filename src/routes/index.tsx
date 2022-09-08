import {
    Routes,
    Route,
} from "react-router-dom";
import Main from "../views/main";
import Home from "../views/home";
import Alunos from "../views/alunos";
import Livros from "../views/livros";
import Generos from "../views/generos";
import Locacoes from "../views/locacoes";

export default function Router() {
    return(
        <Routes>
            <Route path="/" element={<Main />}  >
                <Route path="" element={<Home/>} />
                <Route path="alunos" element={<Alunos/>} />
                <Route path="livros" element={<Livros/>} />
                <Route path="generos" element={<Generos/>} />
                <Route path="locacoes" element={<Locacoes/>} />
            </Route>
        </Routes>
    )
}
