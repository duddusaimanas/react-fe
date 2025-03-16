import Cookies from "js-cookie";

class CookieJar {
  get(key: string) {
    return Cookies.get(key);
  }

  add(cookie: { key: string; value: string }) {
    Cookies.set(cookie.key, cookie.value);
  }

  clear(key: string) {
    Cookies.remove(key);
  }
}

export default new CookieJar();
