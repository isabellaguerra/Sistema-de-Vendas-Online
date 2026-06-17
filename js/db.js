// === SYNC ENTRE ABAS ===
window.addEventListener("storage", (e) => {
  if (e.key === "pedidos" || e.key === "produtos" || e.key === "usuarios") {
    if (
      window.location.pathname.includes("admin") ||
      window.location.pathname.includes("pedidos") ||
      window.location.pathname.includes("login")
    ) {
      location.reload();
    }
  }
});

// garante mudanças sejam detectadas entre abas
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  originalSetItem.call(this, key, value);
  originalSetItem.call(this, `${key}_sync`, Date.now().toString());
};

const DB = {
  usuarios: {
    getAll() {
      const data = localStorage.getItem("usuarios");
      return data ? JSON.parse(data) : [];
    },

    getByEmail(email) {
      const usuarios = this.getAll();
      return usuarios.find((u) => u.email === email);
    },

    create(usuario) {
      const usuarios = this.getAll();
      if (this.getByEmail(usuario.email)) {
        throw new Error("Email já cadastrado");
      }

      const novoUsuario = {
        id: Date.now(),
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        telefone: usuario.telefone || "",
        endereco: usuario.endereco || "",
        tipo: usuario.tipo || "cliente", // 'cliente' ou 'admin'
        dataCadastro: new Date().toISOString(),
        ativo: true,
      };

      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      return novoUsuario;
    },

    update(id, dadosAtualizados) {
      const usuarios = this.getAll();
      const index = usuarios.findIndex((u) => u.id === id);

      if (index === -1) {
        throw new Error("Usuário não encontrado");
      }

      usuarios[index] = { ...usuarios[index], ...dadosAtualizados };
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      return usuarios[index];
    },

    delete(id) {
      const usuarios = this.getAll();
      const filtered = usuarios.filter((u) => u.id !== id);
      localStorage.setItem("usuarios", JSON.stringify(filtered));
      return true;
    },
  },

  produtos: {
    getAll() {
      const data = localStorage.getItem("produtos");
      return data ? JSON.parse(data) : [];
    },

    getById(id) {
      const produtos = this.getAll();
      return produtos.find((p) => p.id === id);
    },

    getAtivos() {
      return this.getAll().filter((p) => p.ativo);
    },

    create(produto) {
      const produtos = this.getAll();
      const maxId =
        produtos.length > 0 ? Math.max(...produtos.map((p) => p.id)) : 0;

      const novoProduto = {
        id: maxId + 1,
        nome: produto.nome,
        descricao: produto.descricao || "",
        preco: produto.preco,
        imagem: produto.imagem || "",
        categoria: produto.categoria || "Outros",
        ativo: produto.ativo !== undefined ? produto.ativo : true,
        dataCadastro: new Date().toISOString(),
      };

      produtos.push(novoProduto);
      localStorage.setItem("produtos", JSON.stringify(produtos));
      return novoProduto;
    },

    update(id, dadosAtualizados) {
      const produtos = this.getAll();
      const index = produtos.findIndex((p) => p.id === id);

      if (index === -1) {
        throw new Error("Produto não encontrado");
      }

      produtos[index] = { ...produtos[index], ...dadosAtualizados };
      localStorage.setItem("produtos", JSON.stringify(produtos));
      return produtos[index];
    },

    delete(id) {
      const produtos = this.getAll();
      const filtered = produtos.filter((p) => p.id !== id);
      localStorage.setItem("produtos", JSON.stringify(filtered));
      return true;
    },
  },

  pedidos: {
    getAll() {
      const data = localStorage.getItem("pedidos");
      return data ? JSON.parse(data) : [];
    },

    getById(id) {
      const pedidos = this.getAll();
      return pedidos.find((p) => p.id === id);
    },

    getByCliente(clienteId) {
      return this.getAll().filter((p) => p.clienteId === clienteId);
    },

    getByStatus(status) {
      return this.getAll().filter((p) => p.status === status);
    },

    create(pedido) {
      const pedidos = this.getAll();

      const novoPedido = {
        id: Date.now(),
        clienteId: pedido.clienteId,
        clienteNome: pedido.clienteNome,
        clienteTelefone: pedido.clienteTelefone,
        itens: pedido.itens,
        total: pedido.total,
        status: "pendente", // pendente, confirmado, preparando, pronto, entregue, cancelado
        tipoPedido: pedido.tipoPedido || "retirada", // retirada ou entrega
        endereco: pedido.endereco || "",
        observacoes: pedido.observacoes || "",
        dataPedido: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
      };

      pedidos.push(novoPedido);
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
      this.notificarWhatsApp(novoPedido);
      return novoPedido;
    },

    update(id, dadosAtualizados) {
      const pedidos = this.getAll();
      const index = pedidos.findIndex((p) => p.id === id);

      if (index === -1) {
        throw new Error("Pedido não encontrado");
      }

      pedidos[index] = {
        ...pedidos[index],
        ...dadosAtualizados,
        dataAtualizacao: new Date().toISOString(),
      };

      localStorage.setItem("pedidos", JSON.stringify(pedidos));
      return pedidos[index];
    },

    delete(id) {
      const pedidos = this.getAll();
      const filtered = pedidos.filter((p) => p.id !== id);
      localStorage.setItem("pedidos", JSON.stringify(filtered));
      return true;
    },

    notificarWhatsApp(pedido) {
      const telefoneConfeitaria = "5513991255976";

      let mensagem = `NOVO PEDIDO - Trilha dos Doces\n\n`;
      mensagem += `Pedido: #${pedido.id}\n`;
      mensagem += `Cliente: ${pedido.clienteNome}\n`;
      mensagem += `Telefone: ${pedido.clienteTelefone}\n\n`;
      mensagem += `Itens:\n`;

      pedido.itens.forEach((item) => {
        mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
      });

      mensagem += `\nTotal: R$ ${pedido.total.toFixed(2)}\n`;
      mensagem += `Tipo entrega: ${pedido.tipoPedido === "entrega" ? "Entrega" : "Retirada"}\n`;

      if (pedido.endereco) {
        mensagem += `Endereço: ${pedido.endereco}\n`;
      }

      if (pedido.observacoes) {
        mensagem += `📝 Obs: ${pedido.observacoes}\n`;
      }

      const url = `https://wa.me/${telefoneConfeitaria}?text=${encodeURIComponent(mensagem)}`;
      // Abre em nova aba (não bloqueia o fluxo do site)
      window.open(url, "_blank");
    },
  },

  utils: {
    clearAll() {
      if (confirm("⚠️ Tem certeza? Isso vai apagar TODOS os dados!")) {
        localStorage.clear();
        console.log("✅ Banco de dados limpo");
      }
    },

    // Inicializar com dados de exemplo
    seed() {
      try {
        DB.usuarios.create({
          nome: "Administrador",
          email: "admin@trilhadosdoces.com",
          senha: "admin123",
          telefone: "(13) 99125-5976",
          tipo: "admin",
        });
      } catch (e) {
        console.log("Admin já existe");
      }

      const produtosExemplo = [
        {
          nome: "CupCakes",
          descricao: "Deliciosos cupcakes com cobertura cremosa",
          preco: 12.9,
          imagem: "https://servidor-estaticos-ashy.vercel.app/cupcake.png",
          categoria: "Doces",
        },
        {
          nome: "Kit Salgados 50un",
          descricao: "Mix de coxinha, empada e risoles",
          preco: 89.9,
          imagem: "https://servidor-estaticos-ashy.vercel.app/salgados.png",
          categoria: "Salgados",
        },
        {
          nome: "Bolo de Chocolate 2kg",
          descricao: "Bolo artesanal de chocolate com cobertura",
          preco: 89.9,
          imagem: "https://servidor-estaticos-ashy.vercel.app/bolo.png",
          categoria: "Bolos",
        },
      ];

      produtosExemplo.forEach((p) => {
        try {
          DB.produtos.create(p);
        } catch (e) {
          // Produto já existe
        }
      });

      console.log("✅ Banco inicializado com dados de exemplo");
    },
  },
};

if (!localStorage.getItem("initialized")) {
  DB.utils.seed();
  localStorage.setItem("initialized", "true");
}
