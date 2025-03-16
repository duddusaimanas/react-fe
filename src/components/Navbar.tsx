import { useCallback, useEffect, useState } from "react";
import ProfileView from "./ProfileView";
import LoginView from "./LoginView";
import TokenManager from "../services/TokenManager";
import SearchView from "./SearchView";
import Pud from "../services/entity/Pud";
import SearchResultView from "./SearchResultView";
import SearchResultType from "../services/entity/SearchResultType";
import ChatIcon from "./icons/ChatIcon";
import ChatView from "./ChatView";

interface Status {
  profileStatus: Pud;
  setProfileStatus: (newValue: Pud) => void;
}

function Navbar({ profileStatus, setProfileStatus }: Status) {
  const [loginView, setLoginView] = useState(false);
  const [profileView, setProfileView] = useState(false);
  const [chatView, setChatView] = useState(false);

  const [searchItem, setSearchItem] = useState("");

  const [searchResultView, setSearchResultView] = useState(false);
  const [searchResultValue, setSearchResultValue] = useState<Pud>();
  const [searchResultType, setSearchResultType] = useState<SearchResultType>();

  useEffect(() => {
    if (profileView) {
      setSearchResultView(false);
      setChatView(false);
    }
  }, [profileView]);

  useEffect(() => {
    if (searchResultView) {
      setProfileView(false);
      setChatView(false);
    }
  }, [searchResultView]);

  useEffect(() => {
    if (chatView) {
      setProfileView(false);
      setSearchResultView(false);
    }
  }, [chatView]);

  const onLoad = useCallback(async () => {
    const token = await TokenManager.manageToken();
    if (typeof token == "string") {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const [loggedIn, setLoggedIn] = useState(
    TokenManager.getTokenFromCookies() != null
  );

  useEffect(() => {
    setProfileView(false);
    setSearchResultView(false);
  }, [loggedIn]);

  return (
    <>
      <div className="flex items-center bg-teal-600">
        <img
          className="relative h-16 max-w-16 left-8 p-2 hover:translate-y-px"
          onClick={() => {
            setSearchItem("");
            setLoginView(false);
            setProfileView(false);
            setSearchResultView(false);
            setChatView(false);
          }}
          src="/pudc_x512_y512.png"
          draggable="false"
          alt="PudcIcon"
        />
        <div className="ml-auto items-center">
          {loggedIn && (
            <>
              <SearchView
                profileStatus={profileStatus}
                searchItem={searchItem}
                setSearchItem={setSearchItem}
                setSearchResultView={setSearchResultView}
                setSearchResultValue={setSearchResultValue}
                setSearchResultType={setSearchResultType}
              />
              <button
                id="ProfileButton"
                onClick={() => setProfileView(!profileView)}
                className="mr-8 p-2 text-white font-sans font-semibold rounded-lg hover:bg-teal-500"
              >
                Profile
              </button>
            </>
          )}
          <button
            id="LoginButton"
            onClick={() => {
              if (!loggedIn) setLoginView(!loginView);
              else {
                setLoggedIn(false);
              }
            }}
            className="mr-8 p-2 text-white font-sans font-semibold rounded-lg hover:bg-teal-500"
          >
            {loggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </div>
      {loggedIn && profileView && (
        <ProfileView
          profileView={profileView}
          profileStatus={profileStatus}
          setProfileStatus={setProfileStatus}
        ></ProfileView>
      )}
      {loggedIn && searchResultView && (
        <SearchResultView
          profileStatus={profileStatus}
          searchResultView={searchResultView}
          searchResultValue={searchResultValue}
          searchResultType={searchResultType}
          searchItem={searchItem}
        ></SearchResultView>
      )}
      {!loggedIn && loginView && (
        <LoginView loggedIn={loggedIn} setLoggedIn={setLoggedIn}></LoginView>
      )}
      {loggedIn && !chatView && (
        <ChatIcon
          className="absolute right-8 bottom-8 size-8 hover:scale-125 stroke-teal-600 hover:fill-yellow-300/[2] hover:stroke-fuchsia-500 transition-all"
          onClick={() => {
            setChatView(true);
          }}
        ></ChatIcon>
      )}
      {chatView && <ChatView></ChatView>}
    </>
  );
}
export default Navbar;
