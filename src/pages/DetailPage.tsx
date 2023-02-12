import { useDispatch, useSelector } from 'react-redux';
import Feed from '../components/Feed';
import { RootState } from '../store/store';
import { HomeFeedContainer, Main, Message } from './Home';
import styled from 'styled-components';

const DetailPage = () => {
  const feeds = useSelector((state: RootState) => state.data.feeds);
  const userObj = useSelector((state: RootState) => state.user.userObj);
  const selectedUserId = useSelector(
    (state: RootState) => state.data.selectedUserId,
  );

  return (
    <>
      <Container>
        <p>작성한 글 목록</p>
        <HomeFeedContainer>
          {feeds.length !== 0 ? (
            <>
              {feeds
                .filter((feed) => feed.creatorId === selectedUserId)
                .map((feed) => {
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
      </Container>
    </>
  );
};

export default DetailPage;

const Container = styled(Main)`
  width: 1024px;

  p {
    text-align: center;
    font-weight: bold;
    margin: 3rem;
  }
`;
