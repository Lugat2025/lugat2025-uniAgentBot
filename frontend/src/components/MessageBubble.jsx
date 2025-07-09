export default function MessageBubble({ message, isUser }) {
  return (
    <div className={`chat-bubble ${isUser ? "chat-right" : "chat-left"}`}>
      <strong>{message.sender}: </strong> {message.text}
    </div>
  );
}
