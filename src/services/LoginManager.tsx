import CookieJar from "./CookieJar";
import SpringWrapper from "./SpringWrapper";
import TokenManager from "./TokenManager";

class LoginManager {
  async registerUser(details: {
    username: string;
    name: string;
    password: string;
  }) {
    const response = await SpringWrapper.registerUser(details);
    if (response?.status === 202) {
      console.log("You successfully signed up.");
      await TokenManager.fetchToken(details);
      return true;
    } else return response?.data;
  }

  async userExists(username: string) {
    return ((await SpringWrapper.userExists(username)) as string).endsWith(
      "exists"
    );
  }

  addLoginCookie(name: string) {
    CookieJar.add({ key: "LOGIN", value: name });
  }

  getLoginCookie() {
    return CookieJar.get("LOGIN");
  }

  clearLoginCookie() {
    CookieJar.clear("LOGIN");
  }
}

export default new LoginManager();
