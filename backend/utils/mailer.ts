import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

type MailTemplateType = "otp" | "resetPassword";

export const mailer = async (
  email: string,
  username: string,
  codeOrLink: string,
  type: MailTemplateType
): Promise<any> => {
  let subject = "";
  let htmlContent = "";

  if (type === "otp") {
    subject = "Email Verification Code";
    htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Verification Code</title>
        <style>
          body { font-family: 'Roboto', Verdana; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
          .otp { font-size: 24px; font-weight: bold; color: #2c3e50; }
          .link { color: #007bff; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello ${username},</h2>
          <p>Please use the following verification code:</p>
          <div class="otp">${codeOrLink}</div>
          <p>Or <a class="link" href="http://localhost:3000/verify/${username}?code=${codeOrLink}">click here to verify</a>.</p>
        </div>
      </body>
    </html>`;
  } else if (type === "resetPassword") {
    subject = "Reset Your Password";
    htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Reset Password</title>
        <style>
          body { font-family: 'Roboto', Verdana; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
          .link-btn { display: inline-block; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello ${username},</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <a class="link-btn" href="${codeOrLink}">Reset Password</a>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      </body>
    </html>`;
  }

  try {
    await transporter.sendMail({
      from: "niroshshetty@gmail.com",
      to: email,
      subject,
      html: htmlContent,
    });

    return {
      success: true,
      message: `${
        type === "otp" ? "Verification code" : "Password reset link"
      } sent to email.`,
    };
  } catch (error: any) {
    console.error("Mailer error:", error);
    return {
      success: false,
      message: `Failed to send email: ${error.message}`,
    };
  }
};
