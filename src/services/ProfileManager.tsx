import SpringWrapper from "./SpringWrapper";
import TokenManager from "./TokenManager";

class ProfileManager {
  async status(id: string | undefined) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return await SpringWrapper.status(token, id);
    }
  }

  async statusByPortal(id: string) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return await SpringWrapper.statusByPortal(token, id);
    }
  }

  async statuses() {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return await SpringWrapper.statuses(token);
    }
  }

  async markStatus(id: string, status: string) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      await SpringWrapper.mark(token, id, status);
    }
  }

  async updateName(oldName: string, newName: string) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return await SpringWrapper.changeName(token, oldName, newName);
    }
  }

  async portal(id: string) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return await SpringWrapper.portal(token, id);
    }
    return false;
  }

  async enroll(id: string) {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      return await SpringWrapper.enroll(token, id);
    }
    return false;
  }
}

export default new ProfileManager();
