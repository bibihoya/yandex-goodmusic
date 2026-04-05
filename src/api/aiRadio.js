// Simple mock or API fetch for AI radio

export async function askAIRadio(query, isUpgraded) {
  if (!isUpgraded) {
    // Return nonsense or random delayed reply simulating awful service
    const nonsense = [
      "I am currently computing the answer... 100 years remaining.",
      "Bzzt... 404 Radio Not Found. Listen to the sound of silence.",
      "Could you repeat that? I was busy indexing your browser history.",
      "Error: Too much logic detected. Reverting to basic mode."
    ];
    return new Promise(resolve => {
        setTimeout(() => resolve(nonsense[Math.floor(Math.random() * nonsense.length)]), 1500 + Math.random() * 2000);
    });
  }

  // To avoid breaking during hackathon if OpenRouter fails or key is missing, 
  // we first try actual fetch, then fallback.
  try {
    const key = import.meta.env.VITE_OPENROUTER_KEY;
    if (!key) throw new Error("No key");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemma-2-9b-it",
        "messages": [
          {"role": "system", "content": "You are a helpful, very brief music DJ AI."},
          {"role": "user", "content": query}
        ]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.warn("AI API fallback active:", error);
    return `You asked for: "${query}". I am currently in Offline Premium mode, so I will pretend I fulfilled your request. Enjoy the imaginary tunes!`;
  }
}
