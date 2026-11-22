
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import "./Toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
    const proximoId = useRef(0);

    function mostrarToast(mensagem, tipo = "sucesso") {
        const tiposValidos = ["sucesso", "erro", "info"];

        setToast({
            id: ++proximoId.current,
            mensagem,
            tipo: tiposValidos.includes(tipo) ? tipo : "info"
        });
    }

    function fecharToast() {
        setToast(null);
    }

    useEffect(() => {
        if (!toast) return;

        const temporizador = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => clearTimeout(temporizador);
    }, [toast]);

    const icones = {
        sucesso: CheckCircle,
        erro: AlertCircle,
        info: Info
    };

    const Icone = toast ? icones[toast.tipo] : null;

    return (
        <ToastContext.Provider value={{ mostrarToast }}>
            {children}

            {toast && (
                <div
                    key={toast.id}
                    className={`toast toast-${toast.tipo}`}
                    role={toast.tipo === "erro" ? "alert" : "status"}
                    aria-live={toast.tipo === "erro" ? "assertive" : "polite"}
                    aria-atomic="true"
                >
                    <div className="toast-icone">
                        <Icone size={21} />
                    </div>

                    <span className="toast-mensagem">
                        {toast.mensagem}
                    </span>

                    <button
                        type="button"
                        className="toast-fechar"
                        onClick={fecharToast}
                        aria-label="Fechar notificação"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const contexto = useContext(ToastContext);

    if (!contexto) {
        throw new Error("useToast deve ser utilizado dentro de ToastProvider");
    }

    return contexto;
}
