import "./TypingIndicator.css";

export default function TypingIndicator() {
  return (
    <div className="typing-bubble">
      <span className="typing-text">Bot yazıyor</span>
      <span className="typing-dot dot1"></span>
      <span className="typing-dot dot2"></span>
      <span className="typing-dot dot3"></span>
    </div>
  );
}

