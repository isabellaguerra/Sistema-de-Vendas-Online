const Auth = {
  getUsuarioLogado() {
    const data = localStorage.getItem("usuarioLogado");
    return data ? JSON.parse(data) : null;
  },

  setUsuarioLogado(usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  },

  clearUsuarioLogado() {
    localStorage.removeItem("usuarioLogado");
  },

  estaLogado() {
    return this.getUsuarioLogado() !== null;
  },

  EhAdmin() {
    const usuario = this.getUsuarioLogado();
    return usuario && usuario.tipo === "admin";
  },

  cadastrar(dados) {
    try {
      if (!dados.nome || dados.nome.trim() === "") {
        throw new Error("Nome é obrigatório");
      }

      const emailNormalizado = dados.email.trim().toLowerCase();

      if (!emailNormalizado) {
        throw new Error("Email é obrigatório");
      }

      if (!dados.senha || dados.senha.length < 6) {
        throw new Error("Senha deve ter no mínimo 6 caracteres");
      }

      const usuarioExistente = DB.usuarios.getByEmail(emailNormalizado);
      if (usuarioExistente) {
        throw new Error("Email já cadastrado");
      }

      const novoUsuario = DB.usuarios.create({
        nome: dados.nome.trim(),
        email: emailNormalizado, // 👈 Aqui!
        senha: dados.senha,
        telefone: dados.telefone ? dados.telefone.trim() : "",
        endereco: dados.endereco ? dados.endereco.trim() : "",
        tipo: "cliente",
      });

      const { senha, ...usuarioSemSenha } = novoUsuario;
      return { success: true, usuario: usuarioSemSenha };
    } catch (error) {
      return { success: false, erro: error.message };
    }
  },

  login(email, senha) {
    try {
      if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios");
      }

      const emailNormalizado = email.trim().toLowerCase();

      const usuario = DB.usuarios.getByEmail(emailNormalizado);

      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }

      if (usuario.senha !== senha) {
        throw new Error("Senha incorreta");
      }

      if (!usuario.ativo) {
        throw new Error("Usuário inativo. Contate o administrador.");
      }

      const { senha: _, ...usuarioSemSenha } = usuario;
      this.setUsuarioLogado(usuarioSemSenha);

      return { success: true, usuario: usuarioSemSenha };
    } catch (error) {
      return { success: false, erro: error.message };
    }
  },

  logout() {
    this.clearUsuarioLogado();
    window.location.href = "index.html";
  },

  requireLogin() {
    if (!this.estaLogado()) {
      alert("⚠️ Você precisa fazer login para acessar esta página");
      window.location.href = "login.html";
      return false;
    }
    return true;
  },

  requireAdmin() {
    if (!this.estaLogado()) {
      alert("⚠️ Você precisa fazer login para acessar esta página");
      window.location.href = "login.html";
      return false;
    }

    if (!this.EhAdmin()) {
      alert("🚫 Acesso negado. Esta área é restrita a administradores.");
      window.location.href = "index.html";
      return false;
    }

    return true;
  },

  exibirNomeUsuario(elementoId) {
    const usuario = this.getUsuarioLogado();
    const elemento = document.getElementById(elementoId);

    if (elemento && usuario) {
      elemento.textContent = `Olá, ${usuario.nome.split(" ")[0]}!`;
    }
  },

  atualizarMenu() {
    const usuario = this.getUsuarioLogado();
    const btnEntrar = document.querySelector('a[href="login.html"]');

    if (usuario && btnEntrar) {
      // Troca "Entrar" por "Minha Conta" ou "Admin"
      if (usuario.tipo === "admin") {
        btnEntrar.textContent = "🔧 Admin";
        btnEntrar.href = "admin.html";
      } else {
        btnEntrar.textContent = `👤 ${usuario.nome.split(" ")[0]}`;
        btnEntrar.href = "#";
      }
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Auth.atualizarMenu();
});
