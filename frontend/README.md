# Documentação do Front-end  
## Catálogo Comunitário de Serviços Locais

---

# 1. Visão Geral

O front-end é desenvolvido em **Next.js**, responsável por entregar a interface do Catálogo Comunitário de Serviços Locais. Ele conecta consumidores e prestadores, permitindo cadastro, autenticação, busca de serviços, favoritos, gerenciamento de serviços e chats em tempo real.

---

# 2. Objetivos do Front-end

- Entregar uma interface rápida, responsiva e intuitiva.  
- Garantir integração limpa com a API NestJS usando Axios + interceptors.  
- Suportar os perfis *Consumidor* e *Prestador*, com fluxos completos para ambos.  
- Permitir escalabilidade futura: caching, modularidade e code-splitting.

---

# 3. Arquitetura

**Framework:** Next.js (App Router)  
**Linguagem:** TypeScript  
**Estado:** Context API + SWR/React Query  
**HTTP:** Axios com interceptors (auth + error handling)  
**Chat:** Socket.io (com hook `useChat`)  
**Estilização:** SCSS + CSS Modules  
**Build/Deploy:** Vercel  

Arquitetura orientada a módulos, com separação entre páginas, componentes, hooks e utilitários.
---

# 4. API — Contratos Essenciais

### **Auth**
**POST /api/auth/register**  
Campos: nome, email, senha, telefone, role, cep, state, city, number  
Resposta: `{ user, token }`

**POST /api/auth/login**  
Resposta: `{ user, token }`

### **Usuário**
**GET /api/users/me** — retorna dados do usuário logado  
**PUT /api/users/me** — atualiza perfil

### **Serviços**
- **POST /api/services**
- **GET /api/services** (filtros: busca, categoria, faixa de preço)
- **GET /api/services/:id**
- **PUT /api/services/:id**
- **DELETE /api/services/:id**
- **POST /api/services/:id/images**

### **Favoritos**
- GET /api/favorites  
- POST /api/favorites  
- DELETE /api/favorites/:id  

### **Chats**
- GET /api/conversations  
- GET /api/conversations/:id/messages  
- WebSocket: enviar/receber mensagens

---

# 5. Fluxos Principais do Usuário (MVP)

### **Consumidor**
- Cadastro e login  
- Buscar serviços com filtros  
- Ver detalhes de serviço  
- Favoritar/Desfavoritar  
- Chat para contato/contratação  
- Dashboard com histórico, favoritos e notas pessoais  

### **Prestador**
- Cadastro/Login com role "provider"  
- Criar, editar e remover serviços  
- Upload de até 5 imagens  
- Chat com consumidores  
- Dashboard de gerenciamento  

---

# 6. Componentes Fundamentais

### **ServiceBanner**
Exibe miniatura, nome, categoria, preço, localização e ações (favoritar/contratar).

### **ServiceModal**
Formulário de criação/edição de serviços (name, description, price, category, images…).

### **Sidebar**
Menu dinâmico baseado no tipo de usuário.

### **api.ts**
Instância Axios com:
- Interceptor de request → adiciona token  
- Interceptor de response → trata erros e expirações  

---

# 7. Estilo e UX

- Totalmente responsivo  
- Inputs e modais com acessibilidade (labels, aria, focos)  
- Feedback visual para ações (toast: sucesso/erro)  
- Imagens otimizadas com `next/image`  
- Páginas com layout consistente usando App Router  

---
