import ItemLista from "./ItemLista";
import { useState, useEffect } from "react";

function App() {
  const [listaMercado, setListaMercado] = useState(() => {
    const dadosSalvos = localStorage.getItem("@listaMercado:itens");
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  // Estado para controlar o input e mensagens de validação
  const [textoInput, setTextoInput] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const LIMITE_CARACTERES = 25;
  const MINIMO_CARACTERES = 2;

  useEffect(() => {
    localStorage.setItem("@listaMercado:itens", JSON.stringify(listaMercado));
  }, [listaMercado]);

  // Função central de validação e adição de itens
  const adicionarListaMercado = () => {
    const valorFormatado = textoInput.trim();

    // 1. Validação de tamanho mínimo
    if (valorFormatado.length < MINIMO_CARACTERES) {
      setMensagemErro(
        `O item deve ter pelo menos ${MINIMO_CARACTERES} caracteres.`,
      );
      return;
    }

    // 2. Validação de duplicados (Case Insensitive: ignora maiúsculas/minúsculas)
    const itemJaExiste = listaMercado.some(
      (item) => item.nome.toLowerCase() === valorFormatado.toLowerCase(),
    );

    if (itemJaExiste) {
      setMensagemErro("Este item já está na sua lista de compras.");
      return;
    }

    // Se passar por todas as validações:
    const novoItem = {
      id: Date.now(),
      nome: valorFormatado,
      concluido: false,
    };

    setListaMercado([...listaMercado, novoItem]);
    setTextoInput(""); // Limpa o campo
    setMensagemErro(""); // Limpa qualquer mensagem de erro anterior
  };

  const alternarCheckList = (alternarId) => {
    const listaAtualizada = listaMercado.map((item) => {
      if (item.id === alternarId) {
        return { ...item, concluido: !item.concluido };
      }
      return item;
    });

    setListaMercado(listaAtualizada);
  };

  // Atualiza o estado do texto e limpa erros enquanto o usuário digita
  const handleInputChange = (e) => {
    setTextoInput(e.target.value);
    if (mensagemErro) {
      setMensagemErro("");
    }
  };

  // Cálculos de métricas para o Header
  const totalItens = listaMercado.length;
  const itensRestantes = listaMercado.filter((item) => !item.concluido).length;

  // Ordenação Imutável (Pendentes no topo, Concluídos ao final)
  const listaOrdenada = [...listaMercado].sort((a, b) => {
    if (a.concluido === b.concluido) return 0;
    return a.concluido ? 1 : -1;
  });

  return (
    <main className="papel-container">
      <header className="header-container">
        <div>
          <h1 className="papel-titulo">🛒 Lista de Mercado</h1>
          <p className="papel-subtitulo">Organize suas compras rapidamente</p>
        </div>
        <span className="contador-badge">
          {totalItens === 0 ? (
            "0 itens"
          ) : (
            <>
              <span className="contador-destaque">{itensRestantes}</span> de{" "}
              {totalItens} restantes
            </>
          )}
        </span>
      </header>

      <div className="input-section">
        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              className={`input-field ${mensagemErro ? "input-erro" : ""}`}
              placeholder="🛒 Digite um item..."
              maxLength={LIMITE_CARACTERES}
              value={textoInput}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && adicionarListaMercado()}
            />

            {/* Contador visual de caracteres */}
            <span
              className={`contador-caracteres ${
                textoInput.length >= 45 ? "limite-proximo" : ""
              }`}
            >
              {textoInput.length}/{LIMITE_CARACTERES}
            </span>
          </div>

          <button
            onClick={adicionarListaMercado}
            type="button"
            className="btn-adicionar"
            disabled={!textoInput.trim()}
          >
            + Adicionar
          </button>
        </div>

        {/* Exibição elegante de mensagem de validação/erro */}
        {mensagemErro && (
          <p className="mensagem-erro-feedback">{mensagemErro}</p>
        )}
      </div>

      {listaMercado.length > 0 ? (
        <ul className="lista-pautada">
          {listaOrdenada.map((checkList) => (
            <ItemLista
              key={checkList.id}
              checkList={checkList}
              listaMercado={listaMercado}
              setListaMercado={setListaMercado}
              alternarCheckList={alternarCheckList}
            />
          ))}
        </ul>
      ) : (
        <div className="mensagem-vazia">
          <span>🛒</span>
          <p>Não possui itens no momento!</p>
        </div>
      )}
    </main>
  );
}

export default App;
