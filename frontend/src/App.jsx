import React, { useState } from "react";
import "./index.css";
import "./app.css";
import { getStudent, sendMessageToAgent } from "./api/chat";

export default function App() {
  const [userId, setUserId] = useState("");
  const [isIdSet, setIsIdSet] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Merhaba! Lütfen öğrenci ID'nizi girin." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLoading(true);

    if (!isIdSet) {
      try {
        const data = await getStudent(input);

        if (data.success) {
          setUserId(input);
          setIsIdSet(true);
          setStudentInfo(data.student);

          const welcomeMessage = `Merhaba ${data.student.name}! 👋\n\n📋 Bilgileriniz:\n• Bölüm: ${data.student.major}\n• Dönem: ${data.student.semester}. dönem\n• AGNO: ${data.student.agno}\n\nSize nasıl yardımcı olabilirim?`;

          setMessages((prev) => [...prev, { sender: "bot", text: welcomeMessage }]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `Üzgünüm, "${input}" ID'sine ait öğrenci bulunamadı. Lütfen ID'nizi kontrol edin.`,
            },
          ]);
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Bağlantı hatası. Lütfen tekrar deneyin." },
        ]);
      }

      setLoading(false);
      setInput("");
      return;
    }

    // ID set edildiyse mesajı LLM'e gönder
    try {
      const data = await sendMessageToAgent(input, userId);
      const botReply = data.response;

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      const errorMessage = error.message.includes("fetch")
        ? "Backend sunucusuna bağlanılamadı. Backend'in çalıştığından emin olun."
        : `Hata: ${error.message}`;

      setMessages((prev) => [...prev, { sender: "bot", text: errorMessage }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="app-container">
      <div className="chat-card">
        <div className="chat-header">
          <h2 className="chat-title">Lügat Chatbot</h2>
          {isIdSet && studentInfo && (
            <div className="user-info">
              <span className="user-name">{studentInfo.name}</span>
              <span className="user-id">ID: {userId}</span>
            </div>
          )}
        </div>

        <div className="chat-window">
          {messages.map((msg, i) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={i}
                className={`message ${isUser ? "message-user" : "message-bot"}`}
              >
                <div className="message-content">
                  {msg.text.split("\n").map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < msg.text.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="message message-bot">
              <div className="message-content typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder={
              isIdSet ? "Sorunuzu yazın..." : "Öğrenci ID'nizi girin..."
            }
            className="message-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            disabled={loading}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? "⏳" : "📤"}
          </button>
        </div>
      </div>
    </div>
  );
}
