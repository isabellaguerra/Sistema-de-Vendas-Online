const ProdutosUI = {
  renderizar(containerId, opcoes = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} não encontrado`);
      return;
    }

    const produtos = opcoes.todosOsProdutos
      ? DB.produtos.getAll()
      : DB.produtos.getAtivos();

    if (produtos.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; color: #7a6a55;">Nenhum produto disponível no momento.</p>';
      return;
    }

    container.innerHTML = "";

    produtos.forEach((produto) => {
      const card = this.criarCard(produto, opcoes);
      container.appendChild(card);
    });
  },

  criarCard(produto, opcoes = {}) {
    const article = document.createElement("article");
    article.className = "card-produto";
    article.dataset.id = produto.id;
    article.dataset.nome = produto.nome;
    article.dataset.preco = produto.preco;
    article.dataset.img = produto.imagem;

    const imagemUrl =
      produto.imagem || "https://via.placeholder.com/200x200?text=Sem+Imagem";

    article.innerHTML = `
      <div class="card-produto__img">
        <img src="${imagemUrl}" alt="${produto.nome}" onerror="this.src='https://via.placeholder.com/200x200?text=Erro'">
      </div>
      <div class="card-produto__body">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao || "Delicioso produto artesanal"}</p>
        <p class="card-produto__preco">R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>
        ${this.criarBotoes(produto, opcoes)}
      </div>
    `;

    return article;
  },

  criarBotoes(produto, opcoes) {
    if (opcoes.modoAdmin) {
      return `
        <div style="display: flex; gap: 0.5rem; margin-top: var(--space-sm);">
          <button class="btn btn--outline btn-editar" data-id="${produto.id}" style="flex: 1; font-size: 0.85rem; padding: 0.5rem;">
            ✏️ Editar
          </button>
          <button class="btn btn--outline btn-deletar" data-id="${produto.id}" style="flex: 1; font-size: 0.85rem; padding: 0.5rem; border-color: #b3261e; color: #b3261e;">
            🗑️ Deletar
          </button>
        </div>
        ${!produto.ativo ? '<p style="color: #b3261e; font-size: 0.8rem; margin-top: 0.5rem;">⚠️ Inativo</p>' : ""}
      `;
    } else {
      return `
        <button class="btn btn--primary btn-add" data-id="${produto.id}">
          Adicionar ao pedido
        </button>
      `;
    }
  },

  atualizar(containerId, opcoes = {}) {
    this.renderizar(containerId, opcoes);
  },
};
