import { useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import "./ChatBox.css";
import { getStudent, sendMessageToAgent } from "../api/chat"; // ✅

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Merhaba! Lütfen öğrenci ID'nizi girin.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState(null); // ✅
  const [studentInfo, setStudentInfo] = useState(null); // ✅

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage = {
      sender: userId || "kullanici",
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Eğer öğrenci ID henüz girilmediyse, önce onu kontrol et
    if (!userId) {
      try {
        const result = await getStudent(input);
        setUserId(input);
        setStudentInfo(result.student);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `✅ Hoş geldiniz ${result.student.name}. Bölüm: ${result.student.major}, AGNO: ${result.student.agno}`,
            timestamp: Date.now(),
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "❌ Öğrenci ID bulunamadı veya bağlantı hatası.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // Öğrenci ID varsa → LLM'den cevap al
    try {
      const res = await sendMessageToAgent(input, userId);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.response,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ LLM sistemine ulaşılamadı.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">Lügat Chatbot</h2>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} isUser={msg.sender === userId} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          placeholder={userId ? "Mesaj yaz..." : "Öğrenci ID'nizi girin..."}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="chat-send-button" onClick={handleSend}>
          Gönder
        </button>
      </div>
    </div>
  );
}
