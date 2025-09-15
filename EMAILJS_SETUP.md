# EmailJS Setup Instructions

This document provides step-by-step instructions to configure EmailJS for sending contact replies directly to users' emails.

## Prerequisites

1. EmailJS account (free tier available)
2. Email service provider (Gmail, Outlook, etc.)

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication process
5. Note down the **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template structure:

```html
Subject: {{subject}}

Dear {{to_name}},

{{message}}

---
Best regards,
{{from_name}}
{{from_email}}

Priority: {{priority}}
{{#cc}}CC: {{cc}}{{/cc}}
{{#bcc}}BCC: {{bcc}}{{/bcc}}
```

4. Save the template and note the **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `user_abcdefghijk`)

## Step 5: Update Environment Variables

Update your `.env` file with the actual values:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID="service_abc123"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="template_xyz789"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="user_abcdefghijk"
```

## Step 6: Test the Integration

1. Restart your development server: `npm run dev`
2. Go to the admin contacts page
3. Try replying to a contact
4. Check if the email is sent successfully

## Template Variables

The following variables are automatically populated:

- `{{to_email}}` - Recipient's email
- `{{to_name}}` - Recipient's name
- `{{from_name}}` - Your business name
- `{{from_email}}` - Your business email
- `{{subject}}` - Email subject
- `{{message}}` - Email message content
- `{{reply_to}}` - Reply-to address
- `{{cc}}` - CC recipients (optional)
- `{{bcc}}` - BCC recipients (optional)
- `{{priority}}` - Email priority

## Features Included

✅ **Direct Email Sending** - Emails sent directly to users
✅ **Template Support** - Pre-built reply templates
✅ **CC/BCC Support** - Additional recipients
✅ **Priority Settings** - Email priority levels
✅ **Copy to Self** - Send copy to admin
✅ **Validation** - Form and configuration validation
✅ **Error Handling** - User-friendly error messages

## Troubleshooting

### "Email service is not configured" Error
- Check that all environment variables are set correctly
- Restart your development server
- Verify EmailJS credentials in dashboard

### Emails Not Sending
- Check EmailJS dashboard for quota limits
- Verify email service authentication
- Check browser console for errors

### Template Not Working
- Ensure template ID matches exactly
- Check template syntax in EmailJS dashboard
- Verify all required variables are included

## Security Notes

- Environment variables are client-side accessible (NEXT_PUBLIC_*)
- EmailJS public key is safe to expose
- Service and template IDs are not sensitive
- No server-side secrets are exposed

## Support

For EmailJS-specific issues, visit:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Support](https://www.emailjs.com/support/)
