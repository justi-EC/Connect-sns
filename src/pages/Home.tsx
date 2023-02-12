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
import { appFireStore } from '../firebase/config';
import Profile from './Profile';
import Generator from '../components/Generator';
import Feed from '../components/Feed';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { dataActions } from '../store/dataSlice';

const Home = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const userObj = useSelector((state: RootState) => state.user.userObj);
  const feeds = useSelector((state: RootState) => state.data.feeds);

  const getFeeds = async () => {
    const q = query(
      collection(appFireStore, 'feeds'),
      orderBy('createdAt', 'desc'),
    );
    onSnapshot(q, (snapshot) => {
      const feedArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(dataActions.setFeeds(feedArr));
    });
  };

  useEffect(() => {
    getFeeds();
  }, []);

  return (
    <Main>
      <HomeFeedContainer>
        <Generator />
        {feeds.length !== 0 ? (
          <>
            {feeds.map((feed) => {
              return (
                <Feed
                  feedData={feed}
                  key={feed.id}
                  isOwner={feed.creatorId === userObj!.uid}
                />
              );
            })}
          </>
        ) : (
          <Message>피드가 비어있습니다.</Message>
        )}
      </HomeFeedContainer>
      {location.pathname === '/profile' && <Profile />}
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

export const Message = styled.p`
  margin: 1rem;
  font-size: 1rem;
`;
