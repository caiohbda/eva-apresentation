const nodemailer = require('nodemailer');
const axios = require('axios');

const ActionService = () => {
  // Configuração do transporter do nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: process.env.EMAIL_SERVICE_PORT,
    secure: process.env.EMAIL_SERVICE_PORT === '465',
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS
    }
  });

  const sendEmail = async ({ to, subject, body }) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_SERVICE_USER,
        to,
        subject,
        html: body
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const sendWhatsApp = async ({ to, message }) => {
    try {
      await axios.post(
        `${process.env.WHATSAPP_API_URL}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  };

  const callApi = async ({ url, method, headers, body }) => {
    try {
      const response = await axios({
        url,
        method,
        headers: {
          ...headers,
          'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`
        },
        data: body
      });
      return response.data;
    } catch (error) {
      console.error('Error calling external API:', error);
      throw error;
    }
  };

  return {
    sendEmail,
    sendWhatsApp,
    callApi
  };
};

module.exports = ActionService; 