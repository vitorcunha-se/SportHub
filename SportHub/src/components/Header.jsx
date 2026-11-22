
import logoDark from "../assets/logo_dark_sporthub.png";
import logoLight from "../assets/logo_light_sporthub.png";
import { Search, Bell } from "lucide-react";
import "./Header.css";
import ThemeToggle from "./ThemeToggle";
import { useApp } from "../context/AppContext.jsx";

export default function Header({ usuario, aoNavegar }) {
    const { tema } = useApp();

    const logo = tema === "light" ? logoLight : logoDark;

    return (
        <header className="header">

            <div className="logo">
                <button
                    className="logo-button"
                    onClick={() => aoNavegar("home")}
                    aria-label="Voltar para a página inicial"
                >
                    <img src={logo} alt="SportHub" className="logo-png" />
                </button>
            </div>

            <div className="search-bar">
                <Search size={18} className="search-icon" />

                <input
                    type="text"
                    placeholder="Buscar por times, jogadores, competições..."
                />
            </div>

            <div className="header-actions">
                <ThemeToggle />

                {usuario ? (
                    <>
                        <button className="notification-button">
                            <Bell size={21} />
                        </button>

                        <button className="user-button">
                            <div className="user-avatar">R</div>
                        </button>
                    </>
                ) : (
                    <div className="auth-buttons">
                        <button
                            className="login-button"
                            onClick={() => aoNavegar("login")}
                        >
                            Entrar
                        </button>

                        <button
                            className="register-button"
                            onClick={() => aoNavegar("login")}
                        >
                            Cadastrar
                        </button>
                    </div>
                )}
            </div>

        </header>
    );
}
