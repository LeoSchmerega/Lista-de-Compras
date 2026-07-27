import React from "react";

const ItemLista = ({
  checkList,
  listaMercado,
  setListaMercado,
  alternarCheckList,
}) => {
  const removerItemLista = () => {
    const novaListaMercadoFiltrada = listaMercado.filter(
      (itemAtual) => itemAtual.id !== checkList.id,
    );

    setListaMercado(novaListaMercadoFiltrada);
  };

  return (
    <li className={`item-row ${checkList.concluido ? "concluido" : ""}`}>
      <div className="item-conteudo">
        {/* Botão semântico para Acessibilidade (A11y) */}
        <button
          type="button"
          role="checkbox"
          aria-checked={checkList.concluido}
          aria-label={`Marcar ${checkList.nome} como ${
            checkList.concluido ? "pendente" : "concluido"
          }`}
          className={`checkbox-custom ${checkList.concluido ? "checked" : ""}`}
          onClick={() => alternarCheckList(checkList.id)}
        >
          {checkList.concluido && "✓"}
        </button>

        <span
          className="texto-item"
          onClick={() => alternarCheckList(checkList.id)}
        >
          {checkList.nome}
        </span>
      </div>

      <button
        onClick={removerItemLista}
        type="button"
        className="btn-remover"
        title="Remover item"
        aria-label={`Remover ${checkList.nome}`}
      >
        ✕
      </button>
    </li>
  );
};

export default ItemLista;
