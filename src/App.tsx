import { useState } from "react";
import Navbar from "./components/Navbar";
import Pud from "./services/entity/Pud";

function App() {
  const [profileStatus, setProfileStatus] = useState<Pud>({
    id: "",
    username: "",
    name: "",
    status: "",
    admin: false,
  });
  return (
    <>
      <Navbar
        profileStatus={profileStatus}
        setProfileStatus={setProfileStatus}
      />
    </>
  );
}

export default App;
