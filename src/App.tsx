import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { appAuth } from './firebase/config';
import Navigation from './components/Navigation';
import AppRouter from './components/Router';
import LoadingSpinner from './components/LoadingSpinner';
import { useDispatch } from 'react-redux';
import { userActions } from './store/userSlice';
import { useSelector } from 'react-redux/es/exports';
import { RootState } from './store/store';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';

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
        {init ? (
          <AppRouter isLoggedIn={Boolean(userObj)} />
        ) : (
          <LoadingSpinner />
        )}
        <FloatingButton onClick={ScrollToTop}>
          <BsFillArrowUpCircleFill size={80} />
        </FloatingButton>
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

const FloatingButton = styled.div`
  position: fixed;
  cursor: pointer;
  left: 86rem;
  top: 40rem;
  &:hover {
    opacity: 90%;
  }
`;
