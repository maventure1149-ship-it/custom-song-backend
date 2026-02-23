export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { story, recipient, sender, style } = req.body;

  const prompt = `
Write original personalized song lyrics.

Recipient: ${recipient}
From: ${sender}
Story details: ${story}
Style: ${style}

Structure:
Verse 1
Chorus
Verse 2
Chorus
Bridge
Final Chorus

Make lyrics emotional, vivid, and singable.
`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt
    })
  });

  const data = await response.json();

  const lyrics =
    data.output_text ||
    data.output?.[0]?.content
      ?.filter(c => c.type === "output_text")
      .map(c => c.text)
      .join("\n");

  res.status(200).json({ lyrics });
}
