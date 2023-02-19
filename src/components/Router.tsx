import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import Profile from '../pages/Profile';
import DetailPage from '../pages/DetailPage';
interface Props {
  isLoggedIn: boolean;
}

const Router = ({ isLoggedIn }: Props) => {
  return (
    <Routes>
      {isLoggedIn ? (
        <Route path={'/'} element={<Home />} />
      ) : (
        <Route path={'/'} element={<Auth />} />
      )}
      <Route path="/profile" element={<Profile />} />
      <Route path="/detail" element={<DetailPage />} />
    </Routes>
  );
};

export default Router;
