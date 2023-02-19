import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { appAuth } from './firebase/config';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';
import { useDispatch } from 'react-redux';
import { userActions } from './store/userSlice';
import { useSelector } from 'react-redux/es/exports';
import { RootState } from './store/store';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import Router from './components/Router';

function App() {
  const [init, setInit] = useState(false);
  const dispatch = useDispatch();
  const userObj = useSelector((state: RootState) => state.user.userObj);

  useEffect(() => {
    appAuth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          userActions.setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (user: any) => user.updateProfile(user),
          }),
        );
      } else {
        dispatch(userActions.setUserObj(null));
      }
      setInit(true);
    });
  }, []);

  const ScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Container>
        {Boolean(userObj) && <Navigation />}
        {init ? <Router isLoggedIn={Boolean(userObj)} /> : <LoadingSpinner />}
        {Boolean(userObj) && (
          <FloatingButton onClick={ScrollToTop}>
            <BsFillArrowUpCircleFill size={80} />
          </FloatingButton>
        )}
      </Container>
    </>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  justify-content: center;
  @media screen and (max-width: 768px) {
    margin-right: 4rem;
  }
`;

const FloatingButton = styled.button`
  z-index: 999;
  position: fixed;
  display: absolute;
  right: 120px;
  bottom: 50px;
  &:hover {
    opacity: 90%;
  }
`;
