import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

function carregarFavoritos(chave) {
    try {
        const dados = JSON.parse(localStorage.getItem(chave) || "[]" );

        return Array.isArray(dados) ? dados.filter((id) => typeof id === "string") : [];

    } catch {
        return [];
    }
}

function alternarItem(setLista, id) {
    if (!id) return;

    setLista((atual) => atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]);
}


export function AppProvider({ children }) {

    const [tema, setTema] = useState(() => {
        const temaSalvo = localStorage.getItem("sporthub_tema");

        return temaSalvo === "light" || temaSalvo === "dark" ? temaSalvo : "dark";
    });

    function alternarTema() {
        setTema((temaAtual) => 
            temaAtual == "dark" ? "light" : "dark"
        );
    }

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", tema);

        localStorage.setItem("sporthub_tema", tema);
    }, [tema]);

    const [partidasFavoritas, setPartidasFavoritas] = useState(
        () => carregarFavoritos("sporthub_partidas_favoritas")
    );

    const [timesFavoritos, setTimesFavoritos] = useState (
        () => carregarFavoritos("sporthub_times_favoritos")
    );

    useEffect(() => {
        localStorage.setItem("sporthub_partidas_favoritas", JSON.stringify(partidasFavoritas));
    }, [partidasFavoritas]);

    useEffect(() => {
        localStorage.setItem("sporthub_times_favoritos", JSON.stringify(timesFavoritos));
    }, [timesFavoritos]);

    function alternarPartidaFavorita(id) {
        alternarItem(
            setPartidasFavoritas,
            id
        );
    }

    function alternarTimeFavorito(id) {
        alternarItem(
            setTimesFavoritos,
            id
        )
    }

    function ehPartidaFavorita(id) {
        return partidasFavoritas.includes(id);
    }

    function ehTimeFavorito(id) {
        return timesFavoritos.includes(id);
    }

    return (
        <AppContext.Provider
            value={{
                tema, 
                alternarTema,

                partidasFavoritas,
                timesFavoritos,

                alternarPartidaFavorita,
                alternarTimeFavorito,

                ehPartidaFavorita,
                ehTimeFavorito
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const contexto = useContext(AppContext);

    if (!contexto) {
        throw new Error("useApp deve ser utilizado dentro de AppProvider");
    }

    return contexto;
}
