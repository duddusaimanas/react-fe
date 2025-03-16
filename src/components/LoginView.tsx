import { useEffect, useState } from "react";
import LoginManager from "../services/LoginManager";
import TokenManager from "../services/TokenManager";
import Spinner from "./icons/Spinner";
import CloseButton from "./icons/CloseButton";

interface Credentials {
  username: string;
  password: string;
  name: string;
}

interface Login {
  loggedIn: boolean;
  setLoggedIn: (newValue: boolean) => void;
}

function LoginView({ loggedIn, setLoggedIn }: Login) {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
    name: "",
  });

  const [submitAlertPopup, setSubmitAlertPopup] = useState({
    state: false,
    reason: "",
  });
  const [usernameAlertPopup, setUsernameAlertPopup] = useState({
    state: false,
    reason: "",
  });

  const [spinner, setSpinner] = useState(false);
  const [signUpPopup, setSignUpPopup] = useState(false);

  useEffect(() => {
    if (!loggedIn) {
      console.log("You logged out..");
      TokenManager.clearTokenFromCookies();
      setUsernameAlertPopup({ state: false, reason: "" });
      setSubmitAlertPopup({ state: false, reason: "" });
      setCredentials({ username: "", password: "", name: "" });
    }
  }, [loggedIn]);

  async function manageLogin() {
    setSubmitAlertPopup({ state: false, reason: "" });
    setSpinner(true);
    const isValid = await TokenManager.fetchToken(credentials);
    if (isValid) {
      console.log("You are logged in.");
      setCredentials({ username: "", password: "", name: "" });
      setLoggedIn(true);
    } else {
      setSubmitAlertPopup({
        state: true,
        reason: "Couldn't confirm that username / password match",
      });
    }
    setSpinner(false);
  }

  async function manageSignUp() {
    setSubmitAlertPopup({ state: false, reason: "" });
    setSpinner(true);
    if (checkCredentials()) {
      const registerUserResponse = await LoginManager.registerUser(credentials);
      if (registerUserResponse instanceof Boolean && registerUserResponse) {
        setCredentials({ username: "", password: "", name: "" });
        setLoggedIn(true);
      } else
        setSubmitAlertPopup({
          state: true,
          reason: registerUserResponse,
        });
    } else
      setSubmitAlertPopup({
        state: true,
        reason: "Couldn't confirm username / password match",
      });
    setSpinner(false);
  }

  const checkCredentials = () =>
    credentials.username.length > 3 && credentials.password.length > 7;

  return (
    <div className="absolute right-0 p-8 w-80 grid shadow-lg rounded-b-md">
      <label
        className="block p-2 text-gray-600 font-sans font-semibold"
        htmlFor="username"
      >
        Id
      </label>
      <input
        type="text"
        className="block p-2 border-2 rounded-lg"
        placeholder="input username"
        autoComplete="username"
        value={credentials.username}
        onChange={async (e) => {
          setCredentials({ ...credentials, username: e.target.value });
          if (signUpPopup) {
            if (e.target.value.length > 3) {
              const userExists = await LoginManager.userExists(e.target.value);
              setUsernameAlertPopup({
                state: userExists,
                reason: "Already taken.",
              });
            } else {
              if (e.target.value.length !== 0) {
                setUsernameAlertPopup({
                  state: true,
                  reason: "Should be atleast 4 letters.",
                });
              } else {
                setUsernameAlertPopup({
                  state: false,
                  reason: "",
                });
              }
            }
          }
        }}
        id="username"
      />
      {signUpPopup && usernameAlertPopup.state && (
        <div
          className="flex items-center bg-red-100 border border-red-600 text-red-500 p-2 mt-2 rounded"
          role="alert"
        >
          <span className="block p-2 text-sm font-sans font-semibold">
            {usernameAlertPopup.reason}
          </span>
        </div>
      )}
      {signUpPopup && (
        <>
          <label
            className="block p-2 text-gray-600 font-sans font-semibold"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            className="block p-2 border-2 rounded-lg"
            placeholder="input name"
            value={credentials.name}
            onChange={(e) =>
              setCredentials({ ...credentials, name: e.target.value })
            }
            id="name"
          />
        </>
      )}
      <label
        className="block p-2 text-gray-600 font-sans font-semibold"
        htmlFor="password"
      >
        Password
      </label>
      <input
        type="password"
        className="block p-2 border-2 rounded-lg"
        placeholder="********"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        id="password"
      />
      <div className="flex items-center justify-center space-x-2 p-2">
        <span className="block text-gray-600 font-sans font-semibold">
          {signUpPopup ? "Existing user?" : "New user?"}
        </span>
        <button
          onClick={() => {
            setSubmitAlertPopup({ state: false, reason: "" });
            setUsernameAlertPopup({ state: false, reason: "" });
            setCredentials({ username: "", name: "", password: "" });
            setSignUpPopup(!signUpPopup);
            setSpinner(false);
          }}
          className="block font-sans font-semibold text-teal-600 hover:text-teal-500"
        >
          {signUpPopup ? "Back to login" : "Create an account"}
        </button>
      </div>
      <button
        className={`${
          usernameAlertPopup.state
            ? "bg-teal-600 text-white"
            : "bg-fuchsia-600 hover:bg-fuchsia-500 text-yellow-300/[2] hover:translate-y-px"
        } p-2 font-sans font-semibold rounded-lg shadow-lg`}
        disabled={usernameAlertPopup.state ? true : undefined}
        onClick={() => {
          if (signUpPopup) manageSignUp();
          else manageLogin();
        }}
      >
        {spinner ? Spinner() : "Submit"}
      </button>
      {submitAlertPopup?.state && (
        <div
          className="flex items-center bg-red-100 border border-red-600 text-red-500 p-2 mt-2 rounded"
          role="alert"
        >
          <span className="block p-2 text-sm font-sans font-semibold">
            {submitAlertPopup.reason}
          </span>
          {CloseButton({
            onClick: () =>
              setSubmitAlertPopup({ state: false, reason: "close" }),
          })}
        </div>
      )}
    </div>
  );
}

export default LoginView;
