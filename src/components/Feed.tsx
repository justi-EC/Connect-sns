import { DocumentData, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import styled from 'styled-components';
import { BsThreeDots } from 'react-icons/bs';
import { appFireStore } from '../firebase/config';
import { timeStamp } from '../utils/timeStamp';
import Menu from './Menu';
import { SubmitButton } from './Generator';
import { useDispatch } from 'react-redux';
import { dataActions } from '../store/dataSlice';
import { useNavigate } from 'react-router-dom';

interface Props {
  feedData: DocumentData;
  isOwner: boolean;
}

const Feed = ({ feedData, isOwner }: Props) => {
  const [editing, setEditing] = useState(false);
  const [newFeed, setNewFeed] = useState(feedData.text);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleOpen = () => setOpen((prev) => !prev);
  const feedTextRef = doc(appFireStore, 'feeds', `${feedData.id}`);

  const UserInfoOpen = () => {
    dispatch(dataActions.showUserPosts(feedData.creatorId));
    navigate('/detail');
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
    toggleOpen();
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateDoc(feedTextRef, { text: newFeed });
    setEditing(false);
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    setNewFeed(value);
  };

  return (
    <div>
      <Wrapper>
        <Author>
          <span>{feedData.displayName}</span> &bull;{' '}
          <time>{timeStamp(feedData.createdAt)}</time>
          <span onClick={UserInfoOpen}>작성글 보기</span>
          {isOwner && (
            <MenuButton onClick={toggleOpen}>
              {open ? null : <BsThreeDots size={24} />}
            </MenuButton>
          )}
          {open ? (
            <Menu
              toggleEditing={toggleEditing}
              feedObj={feedData}
              feedTextRef={feedTextRef}
              isOpen={open}
              toggleOpen={toggleOpen}
            />
          ) : null}
        </Author>
        {editing ? (
          <>
            {isOwner && (
              <>
                <EditForm onSubmit={onSubmit}>
                  <TextInput
                    value={newFeed}
                    required
                    placeholder="수정할 내용을 입력하세요."
                    onChange={onChange}
                  />
                  <ButtonWrapper>
                    <SubmitButton type="submit" value="수정" />
                    <CancelButton onClick={toggleEditing}>취소</CancelButton>
                  </ButtonWrapper>
                </EditForm>
              </>
            )}
          </>
        ) : (
          <FeedText>{feedData.text}</FeedText>
        )}
        {feedData.attachmentUrl && <Img src={feedData.attachmentUrl} alt="" />}
      </Wrapper>
    </div>
  );
};

export default Feed;

const FeedText = styled.div`
  line-height: 1.3rem;
  white-space: pre-wrap;
  margin-bottom: 2rem;
`;

const Img = styled.img`
  margin-top: 1.5rem;
  border-radius: 1.5rem;
  border: solid 1px #ccc;
`;

const Author = styled.div`
  color: #bbb;
  margin-bottom: 1rem;
  span:nth-child(1) {
    color: #000;
  }
  span:nth-child(3) {
    margin-left: 1rem;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      color: rgba(116, 173, 172, 0.8);
    }
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
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
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
  border-radius: 1.5rem;
  margin-left: 0.5rem;
  &:hover {
    cursor: pointer;
    background-color: rgb(227, 227, 227);
    transition: 0.2s;
  }
  font-family: var(--font-Noto-Sans-KR);
`;
