import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import { dbService } from '../firebase/config';
import Profile from './Profile';
import Generator from '../components/Generator';
import Feed from '../components/Feed';

interface Props {
  userObj: DocumentData | null;
  refreshUser: () => void;
}

const Home = ({ userObj, refreshUser }: Props) => {
  const [feeds, setFeeds] = useState<DocumentData[]>([]);
  const location = useLocation();

  const getFeeds = async () => {
    const q = query(
      collection(dbService, 'feeds'),
      orderBy('createdAt', 'desc'),
    );
    onSnapshot(q, (snapshot) => {
      const feedArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeeds(feedArr);
    });
  };

  useEffect(() => {
    getFeeds();
  }, []);

  return (
    <Main>
      <HomeFeedContainer>
        <Generator userObj={userObj} />
        {feeds.length !== 0 ? (
          <>
            {feeds.map((feed) => {
              return (
                <Feed
                  key={feed.id}
                  feedObj={feed}
                  isOwner={feed.creatorId === userObj!.uid}
                  displayName={feed.displayName}
                />
              );
            })}
          </>
        ) : (
          <Message>피드가 비어있습니다.</Message>
        )}
      </HomeFeedContainer>
      {location.pathname === '/profile' && (
        <Profile userObj={userObj} refreshUser={refreshUser} />
      )}
    </Main>
  );
};

export default Home;

export const Main = styled.main`
  width: 1024px;
  @media screen and (max-width: 768px) {
    min-width: 85%;
  }
`;

export const HomeFeedContainer = styled.div`
  border-left: solid 1px #eee;
  border-right: solid 1px #eee;
`;

const Message = styled.p`
  margin: 1rem;
  font-size: 1rem;
`;
