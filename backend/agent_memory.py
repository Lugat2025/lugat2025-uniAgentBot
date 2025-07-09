class AgentMemory:
    def __init__(self):
        self.memory = {}

    def init_user(self, user_id):
        if user_id not in self.memory:
            self.memory[user_id] = {
                "messages": [],
                "context": {}
            }

    def add_message(self, user_id, message, sender):
        self.init_user(user_id)
        self.memory[user_id]["messages"].append({
            "sender": sender,
            "text": message
        })

    def set_context(self, user_id, key, value):
        self.init_user(user_id)
        self.memory[user_id]["context"][key] = value

    def get_context(self, user_id, key):
        self.init_user(user_id)
        return self.memory[user_id]["context"].get(key, None)

memory = AgentMemory()
