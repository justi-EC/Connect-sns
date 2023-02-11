import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Profile from "../pages/Profile";
import { DocumentData } from "firebase/firestore";

interface Props {
  isLoggedIn: boolean;
  userObj: DocumentData | null;
  refreshUser: () => void;
}

const AppRouter = ({ isLoggedIn, userObj, refreshUser }: Props) => {
  return (
    <Routes>
      {isLoggedIn ? (
        <Route
          path={"/"}
          element={<Home userObj={userObj} refreshUser={refreshUser} />}
        />
      ) : (
        <Route path={"/"} element={<Auth />} />
      )}
      <Route
        path="/profile"
        element={<Profile userObj={userObj} refreshUser={refreshUser} />}
      />
    </Routes>
  );
};

export default AppRouter;
