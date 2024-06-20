import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./home/home-page";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LogIn from "./accounts/login";
import SignUp from "./accounts/signup";
import Decks from "./decks/decks_list";

// const URL = import.meta.env.VITE_APP_API_HOST
// if (!URL) {
//     throw Error('VITE_APP_API_HOST was undefined')
// }

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<HomePage />} />
          <Route path="login/" index element={<LogIn />} />
          <Route path="signup/" index element={<SignUp />} />
          <Route path="decks/" index element={<Decks />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
