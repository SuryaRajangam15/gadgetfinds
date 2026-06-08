export async function sendTelegramRequest({ product, budget, message }) {
  // TELEGRAM CONFIG
  const BOT_TOKEN = "8800706964:AAGZAE6W0KjCDz-pUhPysmaDTA1jVPryPCI";

  const CHAT_ID = "950269754";

  // CLEAN MESSAGE
  const text = `
📦 NEW GADGET REQUEST

🛍 Gadget:
${product}

💰 Expected Budget:
${budget}

📝 Extra Details:
${message || "No extra details"}

🌐 From:
gadgetfinds.pages.dev
`;

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,

    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        chat_id: CHAT_ID,

        text,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to send");
  }

  return response.json();
}
