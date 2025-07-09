// src/api/chat.js

const BASE_URL = ""; // Vite proxy kullanacağız

// Öğrenci ID doğrulama
export async function getStudent(userId) {
  const response = await fetch(`${BASE_URL}/get_student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Bağlantı hatası");
  }

  return await response.json();
}

// Mesaj gönderme
export async function sendMessageToAgent(message, userId = "u0001") {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: message,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Sunucu hatası");
  }

  return await response.json();
}
