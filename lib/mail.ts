export async function deliverLoginCode(
  email: string,
  code: string,
): Promise<"sent" | "dev"> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    if (process.env.NODE_ENV === "production")
      throw new Error("email-not-configured");
    console.info(`Login code for ${email}: ${code}`);
    return "dev";
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Your Interview Prep login code",
      text: `Your login code is ${code}. It expires in 10 minutes.`,
    }),
  });
  if (!response.ok) throw new Error("email-failed");
  return "sent";
}
