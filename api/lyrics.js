export default async function handler(req, res) {
  // Allow POST requests only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional songwriter creating emotional, personalized song lyrics.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    const lyrics =
      data.choices?.[0]?.message?.content || "No lyrics generated.";

    res.status(200).json({ lyrics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
