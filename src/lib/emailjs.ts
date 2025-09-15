import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

// Initialize EmailJS
if (typeof window !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailParams {
  to_email: string;
  to_name: string;
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  reply_to: string;
  cc?: string;
  bcc?: string;
  priority?: string;
}

export const sendEmail = async (params: EmailParams): Promise<void> => {
  try {
    const templateParams = {
      to_email: params.to_email,
      to_name: params.to_name,
      from_name: params.from_name,
      from_email: params.from_email,
      subject: params.subject,
      message: params.message,
      reply_to: params.reply_to,
      cc: params.cc || '',
      bcc: params.bcc || '',
      priority: params.priority || 'Normal',
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status !== 200) {
      throw new Error(`EmailJS error: ${response.text}`);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email. Please try again.');
  }
};

export const validateEmailJSConfig = (): boolean => {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
};
