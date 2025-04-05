# Eva Journey Automation

Sistema de automação de jornadas para colaboradores da Eva.

## Descrição

O Eva Journey Automation é um sistema que permite automatizar jornadas personalizadas para colaboradores. As jornadas são sequências de ações que podem incluir envio de e-mails, mensagens no WhatsApp, chamadas para APIs externas, etc.

## Arquitetura

O sistema é construído seguindo os princípios da arquitetura hexagonal e programação funcional:

- **Domain**: Contém as entidades e regras de negócio
- **Application**: Contém os casos de uso da aplicação
- **Infrastructure**: Contém as implementações concretas (repositórios, serviços, etc.)

## Tecnologias

- Node.js
- Express
- MongoDB
- Redis
- Bull (para jobs em background)
- fp-ts (para programação funcional)

## Requisitos

- Node.js 14+
- MongoDB
- Redis

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/your-username/eva-journey.git
cd eva-journey
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o MongoDB e Redis:
```bash
# Certifique-se que o MongoDB e Redis estão rodando
```

5. Inicie o servidor:
```bash
npm run dev
```

## API Endpoints

### Associar Jornada a Colaborador
```
POST /api/employee-journeys/associate
```
Body:
```json
{
  "employeeId": "employee_id",
  "journeyId": "journey_id",
  "startDate": "2024-04-05T00:00:00Z"
}
```

### Listar Jornadas de um Colaborador
```
GET /api/employee-journeys/employee/:employeeId
```

## Testes

Para executar os testes:
```bash
npm test
```

Para executar os testes em modo watch:
```bash
npm run test:watch
```

## Estrutura do Projeto

```
src/
├── domain/
│   ├── entities/
│   └── ports/
├── application/
│   └── use-cases/
└── infrastructure/
    ├── api/
    ├── repositories/
    ├── services/
    └── queue/
```

## Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 