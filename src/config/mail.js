export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'GoBarber Api <noreply@gobarber.com.br>',
  },
};

// Serviços de email:
// Amazon SES, Mailgun, Sparkpost, Mandril (Mailchimp)

// Serviço de email para desenvolvimento: Mailtrap
