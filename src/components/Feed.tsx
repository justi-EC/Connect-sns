import {
  DocumentData,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BsThreeDots } from 'react-icons/bs';
import { appFireStore } from '../firebase/config';
import { timeStamp } from '../utils/timeStamp';
import Menu from './Menu';
import { SubmitButton } from './Generator';
import { useDispatch } from 'react-redux';
import { dataActions } from '../store/dataSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiFillHeart } from 'react-icons/ai';
import { AiOutlineHeart } from 'react-icons/ai';
import { getAuth } from 'firebase/auth';

interface Props {
  feedData: DocumentData;
  isOwner: boolean;
}

const Feed = ({ feedData, isOwner }: Props) => {
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMain, setIsMain] = useState(true);
  const [likeClicked, setLikeClicked] = useState(false);
  const [isImgHide, setIsImgHide] = useState(false);
  const [newFeed, setNewFeed] = useState(feedData.text);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const feedRef = doc(appFireStore, 'feeds', `${feedData.id}`);

  const toggleOpen = () => setOpen((prev) => !prev);

  const UserInfoOpen = () => {
    dispatch(dataActions.showUserPosts(feedData.creatorId));
    navigate('/detail');
  };

  const toggleEditing = () => {
    setIsImgHide(false);
    setEditing((prev) => !prev);
    toggleOpen();
  };

  const toggleCancel = () => {
    setIsImgHide(false);
    setEditing((prev) => !prev);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isImgHide) {
      await updateDoc(feedRef, { text: newFeed, attachmentUrl: '' });
      alert('수정이 완료되었습니다.');
      setEditing(false);
    } else {
      await updateDoc(feedRef, { text: newFeed });
      alert('수정이 완료되었습니다.');
      setEditing(false);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    setNewFeed(value);
  };

  const isClickedLike = async () => {
    setLikeClicked((prev) => !prev);
    const user = getAuth().currentUser;
    const userId = user!.uid;

    if (!likeClicked) {
      await updateDoc(feedRef, {
        like: increment(1),
        likeList: arrayUnion(userId),
      });
    } else {
      await updateDoc(feedRef, {
        like: increment(-1),
        likeList: arrayRemove(userId),
      });
    }
  };

  const editImageDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsImgHide((prev) => !prev);
  };

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsMain(false);
    }
  }, [location]);

  useEffect(() => {
    const user = getAuth().currentUser;
    const userId = user?.uid;
    if (user) {
      const unsubscribe = onSnapshot(feedRef, (snapshot) => {
        const data = snapshot.data();
        if (data && data.likeList) {
          if (userId && data.likeList.includes(userId)) {
            setLikeClicked(true);
          } else {
            setLikeClicked(false);
          }
        }
      });
      return unsubscribe;
    }
  }, [feedRef]);
  return (
    <div>
      <Wrapper>
        <Author>
          <span>{feedData.displayName}</span> &bull;{' '}
          <time>{timeStamp(feedData.createdAt)}</time>
          {isMain && <span onClick={UserInfoOpen}>작성글 보기</span>}
          {isOwner && (
            <MenuButton onClick={toggleOpen}>
              {open ? null : <BsThreeDots size={24} />}
            </MenuButton>
          )}
          {open ? (
            <Menu
              toggleEditing={toggleEditing}
              feedObj={feedData}
              feedRef={feedRef}
              isOpen={open}
              toggleOpen={toggleOpen}
            />
          ) : null}
        </Author>
        {editing ? (
          <>
            <form onSubmit={onSubmit}>
              <TextInput
                value={newFeed}
                required
                placeholder="수정할 내용을 입력하세요."
                onChange={onChange}
              />
              {feedData.attachmentUrl && (
                <Img src={feedData.attachmentUrl} alt="" hide={isImgHide} />
              )}
              {feedData.attachmentUrl && (
                <ImgDeleteButton onClick={editImageDelete} hide={isImgHide}>
                  이미지 삭제
                </ImgDeleteButton>
              )}
              <ButtonWrapper>
                <SubmitButton type="submit" value="수정" />
                <CancelButton onClick={toggleCancel}>취소</CancelButton>
              </ButtonWrapper>
            </form>
          </>
        ) : (
          <>
            <FeedText>{feedData.text}</FeedText>
            {feedData.attachmentUrl && (
              <Img src={feedData.attachmentUrl} alt="" hide={isImgHide} />
            )}
          </>
        )}

        <div>
          {likeClicked ? (
            <button onClick={isClickedLike}>
              <AiFillHeart size={30} />
            </button>
          ) : (
            <button onClick={isClickedLike}>
              <AiOutlineHeart size={30} />
            </button>
          )}
          <span>{feedData.like}</span>
        </div>
      </Wrapper>
    </div>
  );
};

export default Feed;

const ImgDeleteButton = styled.button<{ hide: boolean }>`
  display: ${({ hide }) => (hide ? `none` : `block`)};
  font-size: 20px;
  font-family: var(--font-Noto-Sans-KR);
  color: #3f3fa2;
  transition: 0.2s;
`;

const FeedText = styled.div`
  line-height: 1.3rem;
  white-space: pre-wrap;
  margin-bottom: 2rem;
`;

const Img = styled.img<{ hide: boolean }>`
  margin-top: 1.5rem;
  border-radius: 1.5rem;
  border: solid 1px #ccc;
  display: ${({ hide }) => (hide ? `none` : `block`)};
`;

const Author = styled.div`
  color: #bbb;
  margin-bottom: 1rem;
  span:nth-child(1) {
    color: #000;
  }
  span:nth-child(3) {
    margin-left: 1rem;
    color: #3f3fa2;
    cursor: pointer;
    transition: 0.2s;
  }
`;

const MenuButton = styled.button`
  background-color: transparent;
  border: none;
  float: right;
  svg {
    padding: 0.2rem;
    border-radius: 50%;
    &:hover {
      cursor: pointer;
      background-color: rgba(222, 238, 241, 0.8);
      color: #000000;
      transition: 0.2s;
    }
  }
`;

const Wrapper = styled.div`
  padding: 1.5rem;
  border-bottom: solid 1px #eee;
  position: relative;

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  div {
    margin-top: 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
  }
`;

const TextInput = styled.textarea`
  overflow-wrap: break-word;
  width: inherit;
  border-bottom: solid 1px #eee;
  font-size: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  resize: none;
  border: solid 2px #eee;
  &:focus {
    outline: none;
    border: solid 2px #b7b7b7;
  }
  font-family: var(--font-Noto-Sans-KR);
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  background-color: #eee;
  border: none;
  font-size: 1rem;
  padding: 0 1.3rem;
  border-radius: 0.5rem;
  margin-left: 0.5rem;
  &:hover {
    cursor: pointer;
    background-color: rgb(227, 227, 227);
    transition: 0.2s;
  }
  font-family: var(--font-Noto-Sans-KR);
`;
