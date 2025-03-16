import ChatDetails from "./entity/ChatDetails";
import SpringWrapper from "./SpringWrapper";
import TokenManager from "./TokenManager";

class ChatManager {
  async chat(text: string) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return SpringWrapper.chat(token, text);
    }
  }

  async saveConversation(chatDetails: ChatDetails) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      SpringWrapper.saveConversation(token, chatDetails);
    }
  }

  async retrieveConversations() {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return SpringWrapper.retrieveConversations(token);
    }
  }

  async registerConversation(id: string) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      SpringWrapper.registerConversation(token, id);
    }
  }
}

export default new ChatManager();
