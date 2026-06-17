if (!Auth.requireAdmin()) {
  // Redirecionar se não for admin
}

const Admin = {
  usuario: null,
  pedidosFiltrados: [],

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.usuario = Auth.getUsuarioLogado();

      if (this.usuario) {
        document.getElementById("adminNome").textContent =
          this.usuario.nome.split(" ")[0];
      }

      // CORREÇÃO 1: Adicionado 'this.' antes das chamadas
      this.carregarDashboard();
      this.carregarProdutos();
      this.carregarPedidos();

      // CORREÇÃO 2: Adicionado 'this.' nos callbacks dos eventos
      document.querySelectorAll(".admin-tab").forEach((tab) => {
        tab.addEventListener("click", () => this.trocarTab(tab.dataset.tab));
      });

      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () =>
          this.filtrarPedidos(btn.dataset.status),
        );
      });

      const btnNovo = document.getElementById("btnNovoProduto");
      if (btnNovo) {
        btnNovo.addEventListener("click", () => {
          this.abrirModalProduto();
        });
      }

      const formProd = document.getElementById("formProduto");
      if (formProd) {
        formProd.addEventListener("submit", (e) => this.salvarProduto(e));
      }

      const fecharX = document.getElementById("fecharModalProdutoX");
      if (fecharX)
        fecharX.addEventListener("click", () => this.fecharModalProduto());

      const fecharBtn = document.getElementById("cancelarModalProduto");
      if (fecharBtn)
        fecharBtn.addEventListener("click", () => this.fecharModalProduto());

      const modal = document.getElementById("modalProduto");
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target.id === "modalProduto") {
            this.fecharModalProduto();
          }
        });
      }
    });
  },

  trocarTab(tabName) {
    document.querySelectorAll(".admin-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });
    document.querySelectorAll(".admin-section").forEach((section) => {
      section.classList.toggle("active", section.id === `${tabName}-section`);
    });
  },

  carregarDashboard() {
    const produtos = DB.produtos.getAll();
    const pedidos = DB.pedidos.getAll();
    const clientes = DB.usuarios.getAll().filter((u) => u.tipo === "cliente");
    const totalVendas = pedidos
      .filter((p) => p.status === "entregue")
      .reduce((sum, p) => sum + p.total, 0);
    const pedidosPendentes = pedidos.filter(
      (p) => p.status === "pendente",
    ).length;

    document.getElementById("dashboardCards").innerHTML = `
            <div class="stat-card"><div class="stat-card__icon">📦</div><div class="stat-card__info"><h3>Total de Produtos</h3><p>${produtos.length}</p></div></div>
            <div class="stat-card"><div class="stat-card__icon">📋</div><div class="stat-card__info"><h3>Total de Pedidos</h3><p>${pedidos.length}</p></div></div>
            <div class="stat-card"><div class="stat-card__icon">⏳</div><div class="stat-card__info"><h3>Pedidos Pendentes</h3><p>${pedidosPendentes}</p></div></div>
            <div class="stat-card"><div class="stat-card__icon">💰</div><div class="stat-card__info"><h3>Total em Vendas</h3><p>R$ ${totalVendas.toFixed(2)}</p></div></div>
            <div class="stat-card"><div class="stat-card__icon">👥</div><div class="stat-card__info"><h3>Total de Clientes</h3><p>${clientes.length}</p></div></div>
        `;

    const pedidosRecentes = pedidos.slice(-5).reverse();
    const tbody = document.getElementById("pedidosRecentes");

    if (pedidosRecentes.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center; color: #7a6a55;">Nenhum pedido encontrado</td></tr>';
      return;
    }

    tbody.innerHTML = pedidosRecentes
      .map(
        (p) => `
            <tr>
                <td>#${p.id}</td>
                <td>${p.clienteNome}</td>
                <td>R$ ${p.total.toFixed(2)}</td>
                <td><span class="badge badge--${p.status}">${this.formatarStatus(p.status)}</span></td>
                <td>${new Date(p.dataPedido).toLocaleDateString("pt-BR")}</td>
            </tr>
        `,
      )
      .join("");
  },

  carregarProdutos() {
    const produtos = DB.produtos.getAll();
    const tbody = document.getElementById("listaProdutosAdmin");

    if (produtos.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align: center; color: #7a6a55;">Nenhum produto cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = produtos
      .map(
        (p) => `
            <tr data-produto-id="${p.id}">
                <td><img src="${p.imagem || "https://via.placeholder.com/50"}" alt="${p.nome}" onerror="this.src='https://via.placeholder.com/50?text=Sem+Img'" style="width:50px; height:50px; object-fit:cover;"></td>
                <td>${p.nome}</td>
                <td>${p.categoria}</td>
                <td>R$ ${p.preco.toFixed(2)}</td>
                <td><span class="badge badge--${p.ativo ? "ativo" : "inativo"}">${p.ativo ? "Ativo" : "Inativo"}</span></td>
                <td class="btn-actions">
                    <button class="btn-icon btn-editar-produto" data-id="${p.id}" title="Editar">✏️</button>
                    <button class="btn-icon btn-icon--danger btn-deletar-produto" data-id="${p.id}" title="Deletar">🗑️</button>
                </td>
            </tr>
        `,
      )
      .join("");

    // Reatribuir eventos após renderizar o HTML
    tbody.querySelectorAll(".btn-editar-produto").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Procura o botão mais próximo caso o clique seja no ícone
        const target = e.target.closest("button");
        const id = Number(target.dataset.id);
        this.editarProduto(id); // Usa this.
      });
    });

    tbody.querySelectorAll(".btn-deletar-produto").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.target.closest("button");
        const id = Number(target.dataset.id);
        this.deletarProduto(id); // Usa this.
      });
    });
  },

  abrirModalProduto(produtoId = null) {
    const modal = document.getElementById("modalProduto");
    const form = document.getElementById("formProduto");
    form.reset();

    if (produtoId) {
      const produto = DB.produtos.getById(produtoId);
      document.getElementById("modalProdutoTitulo").textContent =
        "Editar Produto";
      document.getElementById("produtoId").value = produto.id;
      document.getElementById("produtoNome").value = produto.nome;
      document.getElementById("produtoDescricao").value =
        produto.descricao || "";
      document.getElementById("produtoPreco").value = produto.preco;
      document.getElementById("produtoImagem").value = produto.imagem || "";
      document.getElementById("produtoCategoria").value = produto.categoria;
      document.getElementById("produtoAtivo").checked = produto.ativo;
    } else {
      document.getElementById("modalProdutoTitulo").textContent =
        "Novo Produto";
      document.getElementById("produtoId").value = "";
    }
    modal.classList.add("active");
  },

  fecharModalProduto() {
    document.getElementById("modalProduto").classList.remove("active");
  },

  salvarProduto(e) {
    e.preventDefault();
    const id = document.getElementById("produtoId").value;
    const dados = {
      nome: document.getElementById("produtoNome").value,
      descricao: document.getElementById("produtoDescricao").value,
      preco: parseFloat(document.getElementById("produtoPreco").value),
      imagem: document.getElementById("produtoImagem").value,
      categoria: document.getElementById("produtoCategoria").value,
      ativo: document.getElementById("produtoAtivo").checked,
    };

    try {
      if (id) {
        DB.produtos.update(Number(id), dados);
        alert("✅ Produto atualizado com sucesso!");
      } else {
        DB.produtos.create(dados);
        alert("✅ Produto criado com sucesso!");
      }
      this.fecharModalProduto();
      this.carregarProdutos();
      this.carregarDashboard();
    } catch (error) {
      alert(`❌ Erro: ${error.message}`);
    }
  },

  editarProduto(id) {
    this.abrirModalProduto(id);
  },

  deletarProduto(id) {
    if (!confirm("⚠️ Tem certeza que deseja deletar este produto?")) return;
    try {
      DB.produtos.delete(id);
      alert("✅ Produto deletado com sucesso!");
      this.carregarProdutos();
      this.carregarDashboard();
    } catch (error) {
      alert(`❌ Erro: ${error.message}`);
    }
  },

  carregarPedidos(filtro = "todos") {
    const todosPedidos = DB.pedidos.getAll().reverse();
    this.pedidosFiltrados =
      filtro === "todos"
        ? todosPedidos
        : todosPedidos.filter((p) => p.status === filtro);
    this.renderizarPedidos();
  },

  renderizarPedidos() {
    const tbody = document.getElementById("listaPedidosAdmin");

    // CORREÇÃO 3: Usar 'this.pedidosFiltrados'
    if (this.pedidosFiltrados.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align: center; color: #7a6a55;">Nenhum pedido encontrado</td></tr>';
      return;
    }

    // CORREÇÃO 4: Usar 'this.pedidosFiltrados' e 'this.formatarStatus'
    tbody.innerHTML = this.pedidosFiltrados
      .map(
        (p) => `
            <tr style="background: ${p.status === "pendente" ? "#fff3cd" : "transparent"};">
                <td><strong>#${p.id}</strong></td>
                <td>${p.clienteNome}</td>
                <td>
                    <a href="https://wa.me/55${p.clienteTelefone.replace(/\D/g, "")}" target="_blank" style="color: #25D366; text-decoration: none;" title="Abrir WhatsApp">
                        📱 ${p.clienteTelefone}
                    </a>
                </td>
                <td><strong>R$ ${p.total.toFixed(2)}</strong></td>
                <td>${formatarFormaPagamento(p.formaPagamento)}</td>
                <td>
                    <select onchange="Admin.atualizarStatusPedido(${p.id}, this.value)" style="padding: 0.3rem; border-radius: 8px; font-weight: 600; border: 2px solid var(--cor-amarelo);">
                        <option value="pendente" ${p.status === "pendente" ? "selected" : ""}>⏳ Pendente</option>
                        <option value="confirmado" ${p.status === "confirmado" ? "selected" : ""}>✅ Confirmado</option>
                        <option value="preparando" ${p.status === "preparando" ? "selected" : ""}>👨‍🍳 Preparando</option>
                        <option value="pronto" ${p.status === "pronto" ? "selected" : ""}>🎉 Pronto</option>
                        <option value="entregue" ${p.status === "entregue" ? "selected" : ""}>✅ Entregue</option>
                        <option value="cancelado" ${p.status === "cancelado" ? "selected" : ""}>❌ Cancelado</option>
                    </select>
                </td>
                <td>${new Date(p.dataPedido).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                <td class="btn-actions">
                    ${p.status === "pendente"
            ? `<button class="btn-icon" onclick="aceitarPedido(${p.id})" title="Aceitar Pedido" style="background: #d4edda;">✅</button>
                           <button class="btn-icon btn-icon--danger" onclick="recusarPedido(${p.id})" title="Recusar Pedido">❌</button>`
            : ""
          }
                    <button class="btn-icon" onclick="contatarCliente(${p.id})" title="Contatar Cliente">💬</button>
                </td>
            </tr>
            <tr>
                <td colspan="8" style="padding: 0;">
                    <details class="pedido-details">
                        <summary>📦 Ver detalhes completos do pedido</summary>
                        <div class="pedido-details-content">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                                <div>
                                    <strong>🛒 Itens do Pedido:</strong>
                                    ${p.itens
            .map(
              (item) => `
                                        <div class="pedido-item">
                                            <strong>${item.quantidade}x ${item.nome}</strong><br>
                                            <span style="color: #7a6a55;">R$ ${item.preco.toFixed(2)} cada = R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                                        </div>
                                    `,
            )
            .join("")}
                                </div>
                                <div>
                                    <p><strong>📦 Tipo:</strong> ${p.tipoPedido === "entrega" ? "🚚 Entrega" : "🏪 Retirada"}</p>
                                    ${p.endereco ? `<p><strong>📍 Endereço:</strong> ${p.endereco}</p>` : ""}
                                    <p><strong>💳 Pagamento:</strong> ${formatarFormaPagamento(p.formaPagamento)}</p>
                                    ${p.observacoes ? `<p><strong>📝 Observações:</strong><br>${p.observacoes}</p>` : ""}
                                </div>
                            </div>
                        </div>
                    </details>
                </td>
            </tr>
        `,
      )
      .join("");
  },

  filtrarPedidos(status) {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.status === status);
    });
    this.carregarPedidos(status);
  },

  atualizarStatusPedido(id, novoStatus) {
    try {
      DB.pedidos.update(id, { status: novoStatus });
      this.carregarPedidos();
      this.carregarDashboard();
      alert(`✅ Status atualizado para: ${this.formatarStatus(novoStatus)}`);
    } catch (error) {
      alert(`❌ Erro: ${error.message}`);
    }
  },

  verDetalhesPedido(id) {
    // ... (seu código de detalhes)
  },

  formatarStatus(status) {
    const map = {
      pendente: "Pendente",
      confirmado: "Confirmado",
      preparando: "Preparando",
      pronto: "Pronto",
      entregue: "Entregue",
      cancelado: "Cancelado",
    };
    return map[status] || status;
  },
};

// ============================================================================
// FUNÇÕES GLOBAIS (Chamadas pelo HTML onclick="")
// ============================================================================

function aceitarPedido(id) {
  if (confirm("✅ Aceitar este pedido e notificar o cliente?")) {
    try {
      DB.pedidos.update(id, { status: "confirmado" });

      const pedido = DB.pedidos.getById(id);
      const msg = `✅ *PEDIDO CONFIRMADO #${pedido.id}*\n\nOlá ${pedido.clienteNome}! Seu pedido foi aceito e está sendo preparado com carinho! 🍰\n\n*Previsão:* Em breve entraremos em contato\n*Total:* R$ ${pedido.total.toFixed(2)}`;

      const url = `https://wa.me/55${pedido.clienteTelefone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");

      // CORREÇÃO 5: Chamar através do objeto Admin
      Admin.carregarPedidos();
      Admin.carregarDashboard();
      alert("✅ Pedido aceito! WhatsApp aberto para notificar cliente.");
    } catch (error) {
      alert(`❌ Erro: ${error.message}`);
    }
  }
}

function recusarPedido(id) {
  const motivo = prompt("❌ Por que está recusando este pedido?");
  if (!motivo) return;

  try {
    DB.pedidos.update(id, { status: "cancelado" });

    const pedido = DB.pedidos.getById(id);
    const msg = `❌ *PEDIDO CANCELADO #${pedido.id}*\n\nOlá ${pedido.clienteNome}, infelizmente não podemos aceitar este pedido.\n\n*Motivo:* ${motivo}\n\nDesculpe o transtorno! 😔`;

    const url = `https://wa.me/55${pedido.clienteTelefone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");

    // CORREÇÃO 6: Chamar através do objeto Admin
    Admin.carregarPedidos();
    Admin.carregarDashboard();
    alert("❌ Pedido cancelado. WhatsApp aberto para notificar cliente.");
  } catch (error) {
    alert(`❌ Erro: ${error.message}`);
  }
}

function contatarCliente(id) {
  const pedido = DB.pedidos.getById(id);
  const msg = `🍰 *Trilha dos Doces*\n\nOlá ${pedido.clienteNome}! Sobre seu pedido #${pedido.id}...\n\n`;
  const url = `https://wa.me/55${pedido.clienteTelefone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

function formatarFormaPagamento(forma) {
  const map = {
    whatsapp: "💬 WhatsApp",
    pix: "📱 PIX",
    retirada: "🏪 Na Retirada",
    dinheiro: "💵 Dinheiro",
    cartao: "💳 Cartão",
  };
  return map[forma] || forma || "Não informado";
}

// ✅ INICIALIZAÇÃO AUTOMÁTICA
Admin.init();
