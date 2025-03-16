import CookieJar from "./CookieJar";
import LoginManager from "./LoginManager";
import SpringWrapper from "./SpringWrapper";

class TokenManager {
  async fetchToken(credentials: { username: string; password: string }) {
    const token = await SpringWrapper.fetchToken(credentials);
    if (token) LoginManager.addLoginCookie(credentials.username);
    return token;
  }

  async manageToken() {
    let token = this.getTokenFromCookies();
    if (!(await this.isValidToken(token))) {
      if (typeof LoginManager.getLoginCookie() === "string") {
        await this.refreshToken();
        token = this.getTokenFromCookies();
      }
    }
    return token != null && token;
  }

  private async isValidToken(token: string | undefined) {
    if (token != null) {
      return await SpringWrapper.validateToken(token);
    }
    return false;
  }

  private async refreshToken() {
    const refresh = await SpringWrapper.refreshToken();
    if (refresh?.status !== 204) this.clearTokenFromCookies();
  }

  getTokenFromCookies() {
    return CookieJar.get("ACCESS_TOKEN");
  }

  clearTokenFromCookies() {
    return CookieJar.clear("ACCESS_TOKEN");
  }
}

export default new TokenManager();
