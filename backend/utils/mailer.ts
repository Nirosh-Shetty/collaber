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
  username: string | "User",
  codeOrLink: string,
  type: MailTemplateType
): Promise<any> => {
  let subject = "";
  let htmlContent = "";

  if (type === "otp") {
    subject = "Your Verification Code";
    htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Email Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="color: #333333;">Hello ${username || "User"},</h2>
        <p style="color: #555555;">Thank you for signing up. Use the verification code below to complete your registration:</p>
        <div style="font-size: 32px; font-weight: bold; color: #2c3e50; text-align: center; margin: 20px 0;">${codeOrLink}</div>
        <p style="color: #777777;">If you didn’t request this, please ignore this email.</p>
        <p style="color: #777777;">– The Team</p>
      </div>
    </body>
  </html>
  `;
  } else if (type === "resetPassword") {
    subject = "Reset Your Password";
    htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="color: #333333;">Hello ${username || "User"},</h2>
        <p style="color: #555555;">We received a request to reset your password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${codeOrLink}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #777777;">If you didn’t request this, you can safely ignore this email.</p>
        <p style="color: #777777;">– The Team</p>
      </div>
    </body>
  </html>
  `;
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
