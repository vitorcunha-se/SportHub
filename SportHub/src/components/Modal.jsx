
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import "./Modal.css";

export default function Modal({
    aberto,
    titulo,
    descricao,
    children,
    rodape,
    aoFechar,
    tamanho = "medio",
    fecharAoClicarFora = true
}) {
    const modalRef = useRef(null);
    const tituloId = useId();
    const descricaoId = useId();

    useEffect(() => {
        if (!aberto) return;

        const focoAnterior = document.activeElement;
        const overflowAnterior = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        modalRef.current?.focus();

        function aoTeclar(evento) {
            if (evento.key === "Escape") {
                evento.preventDefault();
                aoFechar?.();
                return;
            }

            if (evento.key !== "Tab") return;

            const elementos = modalRef.current?.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
            );

            if (!elementos?.length) {
                evento.preventDefault();
                modalRef.current?.focus();
                return;
            }

            const primeiro = elementos[0];
            const ultimo = elementos[elementos.length - 1];
            const focoAtual = document.activeElement;

            if (
                evento.shiftKey &&
                (focoAtual === primeiro || focoAtual === modalRef.current)
            ) {
                evento.preventDefault();
                ultimo.focus();
            } else if (
                !evento.shiftKey &&
                (focoAtual === ultimo || focoAtual === modalRef.current)
            ) {
                evento.preventDefault();
                primeiro.focus();
            }
        }

        document.addEventListener("keydown", aoTeclar);

        return () => {
            document.removeEventListener("keydown", aoTeclar);
            document.body.style.overflow = overflowAnterior;

            if (typeof focoAnterior?.focus === "function") {
                focoAnterior.focus();
            }
        };
    }, [aberto, aoFechar]);

    if (!aberto) return null;

    function aoClicarFora(evento) {
        if (
            fecharAoClicarFora &&
            evento.target === evento.currentTarget
        ) {
            aoFechar?.();
        }
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={aoClicarFora}
        >
            <section
                ref={modalRef}
                className={`modal modal--${tamanho}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={tituloId}
                aria-describedby={descricao ? descricaoId : undefined}
                tabIndex="-1"
            >
                <header className="modal__cabecalho">
                    <h2 id={tituloId} className="modal__titulo">
                        {titulo}
                    </h2>

                    <button
                        type="button"
                        className="modal__fechar"
                        onClick={aoFechar}
                        aria-label="Fechar modal"
                    >
                        <X size={20} />
                    </button>
                </header>

                {descricao && (
                    <p
                        id={descricaoId}
                        className="modal__descricao"
                    >
                        {descricao}
                    </p>
                )}

                <div className="modal__conteudo">
                    {children}
                </div>

                {rodape && (
                    <footer className="modal__rodape">
                        {rodape}
                    </footer>
                )}
            </section>
        </div>
    );
}
