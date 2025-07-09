from mistral_agent import predict_tool_call
from tool_registry import run_tool_by_name
from agent_memory import memory  # kullanıcı geçmişini yönetir

def process_message(user_id: str, message: str) -> dict:
    memory.add_message(user_id, message, sender="user")

    tool_call = predict_tool_call(message, user_id)
    result = run_tool_by_name(tool_call)

    memory.set_context(user_id, "last_tool", tool_call)
    memory.add_message(user_id, result, sender="agent")

    return {
        "tool_call": tool_call,
        "result": result
    }
