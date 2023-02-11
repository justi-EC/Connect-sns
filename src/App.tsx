import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { authService } from './firebase/config';
import { User } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import Navigation from './components/Navigation';
import AppRouter from './components/Router';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<DocumentData | null>(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (user: any) => user.updateProfile(user),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user: User | null = authService.currentUser;
    if (user) {
      setUserObj({
        displayName: user.displayName,
        uid: user.uid,
        updateProfile: (user: any) => user.updateProfile(user),
      });
    }
  };

  return (
    <Container>
      {Boolean(userObj) && <Navigation />}
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        <LoadingSpinner />
      )}
    </Container>
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
