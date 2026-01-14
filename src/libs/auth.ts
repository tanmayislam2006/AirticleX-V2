import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';

// ===============================
// Mail Transporter
// ===============================
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

// ===============================
// Better Auth Config
// ===============================
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  trustedOrigins: [process.env.APP_URL!],

  // -------------------------------
  // User extra fields
  // -------------------------------
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'USER',
      },
      phone: {
        type: 'string',
        required: false,
      },
      status: {
        type: 'string',
        defaultValue: 'ACTIVE',
      },
    },
  },

  // -------------------------------
  // Email + Password Auth
  // -------------------------------
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  // -------------------------------
  // Email Verification
  // -------------------------------
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url, token }) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      await transporter.sendMail({
        from: '"ArticleX" <no-reply@articlex.com>',
        to: user.email,
        subject: 'Verify your ArticleX account',

        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
    }

    .card {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      padding: 28px;
      text-align: center;
    }

    .header img {
      width: 140px;
      margin-bottom: 10px;
    }

    .content {
      padding: 36px;
      color: #334155;
      line-height: 1.7;
    }

    .content h2 {
      margin-top: 0;
      color: #0f172a;
      font-size: 22px;
    }

    .button-wrapper {
      text-align: center;
      margin: 32px 0;
    }

    .verify-btn {
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      display: inline-block;
    }

    .verify-btn:hover {
      background-color: #1d4ed8;
    }

    .link-box {
      background: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      font-size: 13px;
      word-break: break-all;
      color: #2563eb;
    }

    .footer {
      background: #f1f5f9;
      padding: 18px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="card">

      <!-- Header -->

      <!-- Content -->
      <div class="content">
        <h2>Verify your email address</h2>

        <p>
          Hi there 👋 <br /><br />
          Welcome to <strong>ArticleX</strong> — your modern blogging platform.
        </p>

        <p>
          Please confirm your email address to activate your account and start publishing content.
        </p>

        <div class="button-wrapper">
          <a href="${verificationUrl}" class="verify-btn">
            Verify Email
          </a>
        </div>

        <p>
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <div class="link-box">
          ${url}
        </div>

        <p style="margin-top: 24px;">
          If you didn’t create this account, you can safely ignore this email.
        </p>

        <p>
          — The <strong>ArticleX</strong> Team
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        © 2026 ArticleX · All rights reserved
      </div>

    </div>
  </div>
</body>
</html>
`,
      });
    },
  },

  // -------------------------------
  // Google OAuth
  // -------------------------------
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
