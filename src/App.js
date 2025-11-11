import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import LandingPage from "./components/screen/landing-page/landing-page";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyNotes from "./components/screen/mynotes/mynotes";
import LoginScreen from "./components/screen/LoginScreen/LoginScreen";
import RegisterScreen from "./components/screen/RegisterScreen/RegisterScreen";

import SingleNote from "./components/screen/SingleNote/SingleNote";
import { useState } from "react";
import profileScreen from "./components/screen/profilScreen/profileScreen";
import StaticExample from "./components/screen/models/models";
import ResetPasswordScreen from "./components/screen/ResetPasswordScreen";

function App() {
  const [search] = useState("");
  console.log(search);
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" Component={LandingPage} />
          <Route path="/login" Component={LoginScreen} />
          <Route path="/profile" Component={profileScreen} />
          <Route path="/register" Component={RegisterScreen} />
          <Route path="/createnote" element={<StaticExample />} />
          <Route path="/note/:id" element={<SingleNote />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordScreen />}
          />
          <Route
            path="/mynotes"
            Component={() => <MyNotes search={search} />}
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
