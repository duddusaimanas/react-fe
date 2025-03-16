import axios from "axios";
import Pud from "./entity/Pud";
import ChatDetails from "./entity/ChatDetails";

const baseURL = "http://localhost:8080/";

class SpringWrapper {
  async fetchToken(credentials: { username: string; password: string }) {
    return axios
      .post(baseURL + "authenticate", null, {
        withCredentials: true,
        auth: credentials,
      })
      .catch((err) => console.log(err))
      .then((res) => {
        return res?.status === 204;
      });
  }

  async userExists(username: string) {
    return axios
      .get<string>(baseURL + "exists", {
        params: {
          username,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 200 && res.data);
  }

  async registerUser(credentials: {
    username: string;
    name: string;
    password: string;
  }) {
    return axios
      .post(baseURL + "register", credentials, {
        validateStatus(status) {
          return status < 500;
        },
      })
      .catch((err) => console.log(err));
  }

  async validateToken(token: string) {
    console.debug("validating token.. ", token);
    return axios
      .get<string>(baseURL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => console.log(err))
      .then((res) => res?.status === 200);
  }

  async refreshToken() {
    console.debug("refreshing token..");
    return axios
      .post(baseURL + "reAuthenticate", null, {
        withCredentials: true,
      })
      .catch((err) => console.log(err));
  }

  async status(token: string, id: string | undefined) {
    const params = id && { id };
    return axios
      .get<Pud>(baseURL + "status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 200 && res.data);
  }

  async mark(token: string, id: string, status: string) {
    axios
      .post(baseURL + id + "/mark", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { status },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 204);
  }

  async markById(token: string, id: string, userId: string, status: string) {
    axios
      .post(baseURL + "admin/" + id + "/mark/" + userId, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { status },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 204);
  }

  async portal(token: string, id: string) {
    return axios
      .get<boolean>(baseURL + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 200 && res.data);
  }

  async enroll(token: string, id: string) {
    return axios
      .post(baseURL + id + "/enroll", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 204);
  }

  async create(token: string) {
    return axios
      .post(baseURL + "admin/create", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 200 && res.data);
  }

  async reset(token: string, id: string) {
    axios
      .post(baseURL + "admin/" + id + "/reset", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 204);
  }

  async drop(token: string, id: string) {
    axios
      .post(baseURL + "admin/" + id + "/drop", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 204);
  }

  async changeName(token: string, oldName: string, newName: string) {
    axios
      .put(baseURL + "changeName", null, {
        params: {
          oldName,
          newName,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 204);
  }

  async statusByPortal(token: string, id: string) {
    return axios
      .get<Pud[]>(baseURL + id + "/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 200 && res.data);
  }

  async statuses(token: string) {
    return axios
      .get<Pud[]>(baseURL + "statuses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 200 && res.data);
  }

  async chat(token: string, text: string) {
    return axios
      .get(baseURL + "ai/", {
        params: {
          prompt: text,
          conversationId: "xxx",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "stream",
      })
      .catch((res) => console.log(res))
      .then((res) => res?.data);
  }

  async saveConversation(token: string, chatDetails: ChatDetails) {
    axios
      .post(baseURL + "ai/saveConversation", chatDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 204);
  }

  async retrieveConversations(token: string) {
    return axios
      .get<ChatDetails[]>(baseURL + "ai/retrieveConversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 200 && res.data);
  }

  async registerConversation(token: string, id: string) {
    axios
      .post(baseURL + id + "register", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((res) => console.log(res))
      .then((res) => res?.status === 204);
  }
}

export default new SpringWrapper();
