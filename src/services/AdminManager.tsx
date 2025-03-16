import SpringWrapper from "./SpringWrapper";
import TokenManager from "./TokenManager";

class AdminManager {
  async create() {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return await SpringWrapper.create(token);
    }
  }

  async reset(id: string) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return await SpringWrapper.reset(token, id);
    }
  }

  async drop(id: string) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return await SpringWrapper.drop(token, id);
    }
  }

  async markById(id: string, userId: string, status: string) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return await SpringWrapper.markById(token, id, userId, status);
    }
  }
}

export default new AdminManager();
