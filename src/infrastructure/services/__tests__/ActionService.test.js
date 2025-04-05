const { Either } = require('fp-ts/lib/Either');
const ActionService = require('../ActionService');
const nodemailer = require('nodemailer');
const axios = require('axios');

jest.mock('nodemailer');
jest.mock('axios');

describe('ActionService', () => {
  let actionService;
  let mockTransporter;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn(),
    };

    nodemailer.createTransport.mockReturnValue(mockTransporter);

    actionService = new ActionService({
      email: {
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'test@example.com',
          pass: 'password123',
        },
      },
      whatsapp: {
        apiKey: 'whatsapp-api-key',
        apiUrl: 'https://api.whatsapp.com/v1',
      },
    });

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('deve enviar um email com sucesso', async () => {
      // Arrange
      const emailConfig = {
        to: 'employee@example.com',
        subject: 'Bem-vindo!',
        body: 'Bem-vindo à equipe!',
      };

      mockTransporter.sendMail.mockResolvedValue({
        messageId: '123',
      });

      // Act
      const result = await actionService.sendEmail(emailConfig);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: 'employee@example.com',
        subject: 'Bem-vindo!',
        text: 'Bem-vindo à equipe!',
      });
      expect(result).toEqual(Either.right({
        success: true,
        messageId: '123',
      }));
    });

    it('deve retornar erro quando falha ao enviar email', async () => {
      // Arrange
      const emailConfig = {
        to: 'employee@example.com',
        subject: 'Bem-vindo!',
        body: 'Bem-vindo à equipe!',
      };

      const error = new Error('Falha ao enviar email');
      mockTransporter.sendMail.mockRejectedValue(error);

      // Act
      const result = await actionService.sendEmail(emailConfig);

      // Assert
      expect(result).toEqual(Either.left(error));
    });
  });

  describe('sendWhatsApp', () => {
    it('deve enviar uma mensagem de WhatsApp com sucesso', async () => {
      // Arrange
      const whatsappConfig = {
        to: '5511999999999',
        message: 'Bem-vindo à equipe!',
      };

      axios.post.mockResolvedValue({
        data: {
          messageId: '123',
        },
      });

      // Act
      const result = await actionService.sendWhatsApp(whatsappConfig);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.whatsapp.com/v1/messages',
        {
          to: '5511999999999',
          message: 'Bem-vindo à equipe!',
        },
        {
          headers: {
            Authorization: 'Bearer whatsapp-api-key',
          },
        }
      );
      expect(result).toEqual(Either.right({
        success: true,
        messageId: '123',
      }));
    });

    it('deve retornar erro quando falha ao enviar mensagem de WhatsApp', async () => {
      // Arrange
      const whatsappConfig = {
        to: '5511999999999',
        message: 'Bem-vindo à equipe!',
      };

      const error = new Error('Falha ao enviar mensagem');
      axios.post.mockRejectedValue(error);

      // Act
      const result = await actionService.sendWhatsApp(whatsappConfig);

      // Assert
      expect(result).toEqual(Either.left(error));
    });
  });

  describe('callApi', () => {
    it('deve fazer uma chamada de API com sucesso usando método POST', async () => {
      // Arrange
      const apiConfig = {
        url: 'https://api.example.com/webhook',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'api-key-123',
        },
        body: {
          employeeId: '123',
          event: 'onboarding_started',
        },
      };

      axios.post.mockResolvedValue({
        data: {
          success: true,
          id: '123',
        },
      });

      // Act
      const result = await actionService.callApi(apiConfig);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.example.com/webhook',
        {
          employeeId: '123',
          event: 'onboarding_started',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'api-key-123',
          },
        }
      );
      expect(result).toEqual(Either.right({
        success: true,
        data: {
          success: true,
          id: '123',
        },
      }));
    });

    it('deve fazer uma chamada de API com sucesso usando método GET', async () => {
      // Arrange
      const apiConfig = {
        url: 'https://api.example.com/status/123',
        method: 'GET',
        headers: {
          'X-API-Key': 'api-key-123',
        },
      };

      axios.get.mockResolvedValue({
        data: {
          status: 'active',
        },
      });

      // Act
      const result = await actionService.callApi(apiConfig);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.example.com/status/123',
        {
          headers: {
            'X-API-Key': 'api-key-123',
          },
        }
      );
      expect(result).toEqual(Either.right({
        success: true,
        data: {
          status: 'active',
        },
      }));
    });

    it('deve retornar erro quando falha ao fazer chamada de API', async () => {
      // Arrange
      const apiConfig = {
        url: 'https://api.example.com/webhook',
        method: 'POST',
        body: {
          employeeId: '123',
          event: 'onboarding_started',
        },
      };

      const error = new Error('Falha na chamada de API');
      axios.post.mockRejectedValue(error);

      // Act
      const result = await actionService.callApi(apiConfig);

      // Assert
      expect(result).toEqual(Either.left(error));
    });

    it('deve retornar erro quando método HTTP não é suportado', async () => {
      // Arrange
      const apiConfig = {
        url: 'https://api.example.com/webhook',
        method: 'PUT',
        body: {
          employeeId: '123',
        },
      };

      // Act
      const result = await actionService.callApi(apiConfig);

      // Assert
      expect(result).toEqual(Either.left(new Error('Método HTTP não suportado: PUT')));
    });
  });
}); 