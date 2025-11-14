# Documentação do Back-end  
## Catálogo Comunitário de Serviços Locais

---

# 1. Visão Geral

O back-end é desenvolvido em **NestJS** com **TypeScript**, responsável por:  

- Expor uma **API RESTful** para CRUD de usuários, serviços, favoritos, notas, mensagens e histórico.  
- Gerenciar **autenticação e autorização** via JWT.  
- Controlar **upload de imagens** de serviços (Cloudinary).  
- Suportar **chat em tempo real** com Socket.io.  
- Persistir dados em **PostgreSQL** com **TypeORM**.  

---

# 2. Objetivos do Back-end

- Fornecer contratos de API claros, versionados e consistentes.  
- Garantir autenticação e autorização robusta.  
- Permitir fácil manutenção, testes e deploy contínuo.  
- Garantir integridade de dados (validações, constraints, relacionamentos).  

---

# 3. Arquitetura e Tecnologias

- **Framework:** NestJS  
- **Linguagem:** TypeScript  
- **ORM:** TypeORM  
- **Banco de Dados:** PostgreSQL  
- **Autenticação:** JWT  
- **Upload de arquivos:** Cloudinary 
- **Chat:** Socket.io  
- **Testes:** Jest (unit e integração)  
- **Deploy:** Railway  

**Estrutura modular:** cada recurso (usuário, serviço, favoritos, notas, mensagens) é isolado em módulo próprio (`module`, `controller`, `service`, `entity`, `dto`).  

---

# 4. Endpoints da API (RESTful)

### **Auth**
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/auth/register | Cadastro de usuário |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| POST | /api/auth/forgot-password | Recuperação de senha |

### **Usuário**
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/users/me | Dados do usuário logado |
| PUT | /api/users/me | Atualiza perfil |

### **Serviços**
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/services | Cria serviço |
| GET | /api/services | Lista serviços (filtros opcionais) |
| GET | /api/services/:id | Detalha serviço |
| PUT | /api/services/:id | Atualiza serviço |
| DELETE | /api/services/:id | Remove serviço |
| POST | /api/services/:id/images | Upload de imagens |

### **Favoritos**
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/favorites | Lista favoritos do usuário |
| POST | /api/favorites | Adiciona favorito |
| DELETE | /api/favorites/:id | Remove favorito |

### **Notas**
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/notes | Lista notas do usuário |
| POST | /api/notes | Cria nota |
| PUT | /api/notes/:id | Atualiza nota |
| DELETE | /api/notes/:id | Remove nota |

### **Conversas / Mensagens**
- **REST:** GET /api/conversations, GET /api/conversations/:id/messages  
- **Realtime:** Socket.io namespace `/chat` com eventos `message:send`, `message:receive`  

### **Histórico**
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/history | Lista histórico de serviços do usuário |

---

# 5. Entidades Principais

- **User:** id, name, email, passwordHash, role, phone, location  
- **Service:** id, name, description, price, category, location, providerId, images  
- **ServiceImage:** id, serviceId, url, publicId  
- **Favorite:** id, userId, serviceId  
- **Note:** id, userId, content, createdAt  
- **Conversation:** id, participants  
- **Message:** id, conversationId, senderId, content, timestamp  
- **History:** id, userId, serviceId, timestamp  

---

# 6. Autenticação & Autorização

- **JWT access token** (validade curta, ex: 1h)  
- **Refresh token** para manter sessão  
- **Guards** por rota: `@UseGuards(JwtAuthGuard)`  
- Senha criptografada com **bcrypt**  

---

# 7. Upload de Imagens

- Recebido via `multipart/form-data`  
- Backend faz upload para Cloudinary 
- Validações:
  - Máx 5 imagens por serviço  

---

# 8. Testes

- **Unitários:** Jest para serviços e helpers  
- **Integração:** Supertest para endpoints (auth, services, favorites, chat)  
- Testes automatizados incluem:
  - Criação/atualização/deleção de serviços  
  - Login e refresh token  
  - Upload de imagens  
  - Conversas em tempo real  

---

