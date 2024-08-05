import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./home/home-page";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LogIn from "./accounts/login";
import SignUp from "./accounts/signup";
import Decks from "./decks/decks_list";
import DeckDetail from "./decks/deck_detail"
import DeckEdit from "./decks/deck_edit";
import DeckCreate from "./decks/deck_create";
import Reading from "./readings/reading";
import ReadingHistory from "./readings/reading_hx";

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
          <Route path="decks/">
            <Route index element={<Decks />} />
            <Route path=":id/" element={<DeckDetail />} />
            <Route path="create/" element={<DeckCreate />} />
            <Route path=":id/edit/" element={<DeckEdit />} />
          </Route>
          <Route path='reading/'>
            <Route index element={<Reading />} />
            <Route path="history/" element={<ReadingHistory />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
