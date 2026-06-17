Sistema completo de gestão de pedidos online para confeitaria, desenvolvido com tecnologias web modernas.

📋 Sobre o Projeto
Trilha dos Doces é uma plataforma web completa para gerenciamento de uma confeitaria online. O sistema oferece funcionalidades desde o catálogo de produtos até o processamento de pedidos, incluindo um painel administrativo robusto para gestão do negócio.

🎯 Principais Características
Sistema de Autenticação: Login, cadastro e controle de sessões
Catálogo: Visualização de produtos com fotos e descrições
Carrinho de Compras: Adicione e remova itens instantaneamente
Painel Administrativo: Gestão completa de produtos, pedidos e clientes
Dashboard com Métricas: Visualização de estatísticas e desempenho do negócio
Sistema de Pedidos: Três formas de pagamento (WhatsApp, PIX, Retirada)
Notificações WhatsApp: Integração automática para comunicação com clientes
Design Responsivo: Interface adaptada para desktop, tablet e mobile
Persistência de Dados: Sistema de banco de dados local com sincronização entre abas
✨ Funcionalidades Detalhadas
Para Clientes
✅ Cadastro e login de usuários
🛒 Carrinho de compras interativo
💳 Múltiplas opções de pagamento (WhatsApp, PIX, Pagar na retirada)
📝 Adicionar observações aos pedidos
📱 Envio automático de pedido via WhatsApp
🔔 Confirmação visual de pedidos realizados
Para Administradores
📊 Dashboard com visão geral do negócio
📦 CRUD completo de produtos (Criar, Ler, Atualizar, Deletar)
📋 Gestão de pedidos com atualização de status
👥 Visualização de clientes cadastrados
💰 Controle de vendas e receita total
🔍 Filtros de pedidos por status
📱 Comunicação rápida com clientes via WhatsApp
✅ Aceitar/Recusar pedidos com notificação automática
🛠️ Tecnologias Utilizadas
Frontend
HTML5: Estrutura semântica e acessível
CSS3:
JavaScript (ES6+):
Arquitetura
MVC Pattern: Separação clara entre lógica e apresentação
Component-based: Código modular e reutilizável
LocalStorage Database: Sistema de persistência de dados client-side
📁 Estrutura do Projeto
trilha-dos-doces/
├── 📄 index.html              # Página inicial
├── 📄 login.html              # Página de login
├── 📄 cadastro.html           # Página de cadastro de usuários
├── 📄 pedido.html             # Página de catálogo e carrinho
├── 📄 admin.html              # Painel administrativo
│
├── 📁 css/
│   ├── base.css               # Estilos globais e variáveis CSS
│   ├── home.css               # Estilos da página inicial
│   ├── login.css              # Estilos de login e cadastro
│   ├── pedido.css             # Estilos da página de pedidos
│   ├── admin.css              # Estilos do painel admin
│   └── modal.css              # Estilos de modais reutilizáveis
│
├── 📁 js/
│   ├── db.js                  # Sistema de banco de dados (CRUD)
│   ├── auth.js                # Sistema de autenticação
│   ├── login.js               # Lógica da página de login
│   ├── pedido.js              # Lógica do carrinho e checkout
│   ├── produtos.js            # Renderização de produtos
│   └── admin.js               # Lógica do painel administrativo
│
└── 📄 README.md               # Documentação do projeto
🚀 Como Executar o Projeto
Opção 1: Servidor Local Simples
Clone o repositório

git clone https://github.com/seu-usuario/trilha-dos-doces.git
cd trilha-dos-doces
Abra com Live Server (VS Code)

Instale a extensão "Live Server"
Clique com o botão direito em index.html
Selecione "Open with Live Server"
Opção 2: Servidor Python
# Python 3
python -m http.server 8000

# Acesse: http://localhost:8000
Opção 3: Servidor Node.js
# Instale o http-server globalmente
npm install -g http-server

# Execute no diretório do projeto
http-server

# Acesse: http://localhost:8080
👤 Credenciais de Acesso
Para Clientes
Criar conta através da página de cadastro
Ou use qualquer conta de teste criada
🎨 Paleta de Cores
--cor-amarelo:        #f7d85b    /* Amarelo principal */
--cor-amarelo-claro:  #ffeeb0    /* Amarelo claro */
--cor-marrom:         #6b3b10    /* Marrom principal */
--cor-marrom-escuro:  #4a2506    /* Marrom escuro */
--cor-fundo:          #fffaf2    /* Fundo bege claro */
--cor-card:           #fff3cf    /* Fundo de cards */
📱 Responsividade
O projeto possui breakpoints otimizados para diferentes dispositivos:

Desktop: > 900px (layout padrão com sidebar)
Tablet: 768px - 900px (layout adaptado)
Mobile: < 768px (layout vertical, menu colapsável)
💾 Sistema de Banco de Dados
Estrutura de Dados
// Usuários
{
  id: number,
  nome: string,
  email: string,
  senha: string,
  telefone: string,
  endereco: string,
  tipo: "cliente" | "admin",
  dataCadastro: ISO Date,
  ativo: boolean
}

// Produtos
{
  id: number,
  nome: string,
  descricao: string,
  preco: number,
  imagem: string (URL),
  categoria: string,
  ativo: boolean,
  dataCadastro: ISO Date
}

// Pedidos
{
  id: number,
  clienteId: number,
  clienteNome: string,
  clienteTelefone: string,
  itens: Array<{
    produtoId: string,
    nome: string,
    preco: number,
    quantidade: number
  }>,
  total: number,
  status: "pendente" | "confirmado" | "preparando" | "pronto" | "entregue" | "cancelado",
  tipoPedido: "retirada" | "entrega",
  formaPagamento: "whatsapp" | "pix" | "retirada",
  endereco: string,
  observacoes: string,
  dataPedido: ISO Date,
  dataAtualizacao: ISO Date
}
Operações Disponíveis
CRUD Completo: Create, Read, Update, Delete
Queries Especializadas:
Sincronização: Atualizações em tempo real entre múltiplas abas
🔔 Integração WhatsApp
O sistema envia notificações automáticas via WhatsApp para:

✅ Novos pedidos (para a confeitaria)
✅ Confirmação de pedidos (para clientes)
✅ Cancelamentos (para clientes)
💬 Comunicação direta cliente-confeitaria
Número da Confeitaria: (13) 99125-5976

🎓 Conceitos Aplicados
Este projeto demonstra aplicação prática de:

✅ HTML Semântico: Tags apropriadas para cada conteúdo
✅ CSS Avançado: Grid, Flexbox, Variables, Animations
✅ JavaScript Moderno: ES6+, Classes, Modules
✅ Design Patterns: MVC, Observer (Storage Events)
✅ LocalStorage API: Persistência de dados
✅ Responsive Design: Mobile-first approach
✅ UX/UI: Interface intuitiva e acessível
✅ CRUD Operations: Operações completas de banco de dados
✅ State Management: Gestão de estado da aplicação
✅ Event Handling: Gestão eficiente de eventos
🔐 Segurança
⚠️ Nota Importante: Este é um projeto acadêmico/demonstrativo.

Limitações de segurança conhecidas:

Senhas armazenadas sem hash (texto puro)
LocalStorage acessível pelo navegador
Sem validação server-side
Sem proteção contra XSS/CSRF
Para uso em produção, implemente:

Backend com Node.js/PHP/Python
Banco de dados real (PostgreSQL, MySQL)
Autenticação JWT ou sessões seguras
Hash de senhas (bcrypt)
Sanitização de inputs
HTTPS obrigatório
🤝 Contribuindo
Contribuições são bem-vindas! Para contribuir:

Fork o projeto
Crie uma branch (git checkout -b feature/NovaFuncionalidade)
Commit suas mudanças (git commit -m 'Adiciona nova funcionalidade')
Push para a branch (git push origin feature/NovaFuncionalidade)
Abra um Pull Request
📝 Roadmap de Melhorias
 Adicionar filtro de produtos por categoria
 Implementar histórico de pedidos para clientes
 Sistema de avaliações e comentários
 Relatórios de vendas em PDF
 Sistema de cupons de desconto
 Integração com API de pagamento real
 Notificações push no navegador
 PWA (Progressive Web App)
 Dark mode
👥 Autores
Projeto desenvolvido como trabalho acadêmico por:

Troli - isso e aquilo lá
📄 Licença
