// Simple mock or API fetch for AI radio

export async function askAIRadio(query, isUpgraded) {
  if (!isUpgraded) {
    // Return nonsense or random delayed reply simulating awful service
    const nonsense = [
      "Вычисляю ответ... осталось 100 лет.",
      "Бззт... 404 Радио не найдено. Слушай звук тишины.",
      "Не могли бы вы повторить? Я был занят индексацией вашей истории браузера.",
      "Ошибка: Обнаружено слишком много логики. Возврат в базовый режим."
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
          {"role": "system", "content": "Ты полезный, очень краткий музыкальный ИИ-диджей."},
          {"role": "user", "content": query}
        ]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.warn("AI API fallback active:", error);
    return `Вы попросили: "${query}". В настоящее время я нахожусь в режиме Офлайн Премиум, поэтому я сделаю вид, что выполнил ваш запрос. Наслаждайтесь воображаемыми мелодиями!`;
  }
}
