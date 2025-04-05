# Eva Journey API

API para gerenciamento de jornadas de funcionários, permitindo associar jornadas a funcionários e executar ações automaticamente.

## Visão Geral

O Eva Journey é um sistema que permite criar e gerenciar jornadas personalizadas para funcionários. Uma jornada é uma sequência de ações que são executadas automaticamente em momentos específicos, como:

- Envio de emails
- Mensagens no WhatsApp
- Chamadas para APIs externas

## Arquitetura

O sistema é construído seguindo os princípios da arquitetura hexagonal:

- **Domain**: Contém as entidades e regras de negócio
  - `Journey`: Representa uma jornada com suas ações
  - `JourneyAction`: Representa uma ação da jornada (email, WhatsApp, API)
  - `EmployeeJourney`: Representa a associação entre funcionário e jornada

- **Application**: Contém os casos de uso
  - `AssociateJourneyToEmployee`: Associa uma jornada a um funcionário

- **Infrastructure**: Implementações concretas
  - Repositórios MongoDB
  - Fila de ações em memória
  - API REST

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar o servidor
npm start
```

## Configuração

Crie um arquivo `.env` com as seguintes variáveis:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/eva-journey
```

## Endpoints

### Associar Jornada a Funcionário

```http
POST /api/employee-journeys
```

**Request Body:**
```json
{
  "employeeId": "507f1f77bcf86cd799439011",
  "journeyId": "507f1f77bcf86cd799439012",
  "startDate": "2024-03-20T10:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "employeeId": "507f1f77bcf86cd799439011",
    "journeyId": "507f1f77bcf86cd799439012",
    "startDate": "2024-03-20T10:00:00Z",
    "status": "pending",
    "currentActionIndex": 0,
    "completedActions": []
  }
}
```

### Listar Jornadas de um Funcionário

```http
GET /api/employee-journeys/:employeeId
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439013",
      "employeeId": "507f1f77bcf86cd799439011",
      "journeyId": "507f1f77bcf86cd799439012",
      "startDate": "2024-03-20T10:00:00Z",
      "status": "pending",
      "currentActionIndex": 0,
      "completedActions": []
    }
  ]
}
```

## Exemplos de Uso

### Criar uma Jornada de Onboarding

```javascript
// Criar uma jornada
const journey = {
  name: "Onboarding",
  description: "Jornada de integração",
  actions: [
    {
      type: "email",
      config: {
        to: "employee@example.com",
        subject: "Bem-vindo à Eva!",
        body: "Olá {nome}, bem-vindo à Eva!..."
      },
      delay: 0 // Enviar imediatamente
    },
    {
      type: "whatsapp",
      config: {
        to: "+5511999999999",
        message: "Olá {nome}, tudo bem?"
      },
      delay: 86400000 // Enviar após 24 horas
    }
  ]
};

// Associar a um funcionário
const response = await fetch('/api/employee-journeys', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    employeeId: "507f1f77bcf86cd799439011",
    journeyId: journey.id,
    startDate: new Date().toISOString()
  })
});
```

## Estrutura do Projeto

```
src/
├── application/
│   └── use-cases/
│       └── AssociateJourneyToEmployee.js
├── domain/
│   └── entities/
│       ├── EmployeeJourney.js
│       ├── Journey.js
│       └── JourneyAction.js
├── infrastructure/
│   ├── api/
│   │   ├── controllers/
│   │   │   └── EmployeeJourneyController.js
│   │   └── routes/
│   │       └── employeeJourneyRoutes.js
│   ├── queue/
│   │   ├── InMemoryQueue.js
│   │   └── JourneyActionQueue.js
│   └── repositories/
│       ├── MongoEmployeeJourneyRepository.js
│       ├── MongoEmployeeRepository.js
│       └── MongoJourneyRepository.js
└── index.js
```

## Testes

```bash
# Rodar testes
npm test

# Verificar cobertura
npm test -- --coverage
```

## Documentação da API

A documentação completa da API está disponível no arquivo `api-docs.yaml` no formato OpenAPI (Swagger). 