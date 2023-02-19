import { ref } from 'firebase/storage';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  deleteDoc,
} from 'firebase/firestore';
import { deleteObject } from 'firebase/storage';
import styled from 'styled-components';
import { IoMdClose } from 'react-icons/io';
import { appStorage } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

interface Props {
  toggleEditing: () => void;
  feedObj: DocumentData;
  feedRef: DocumentReference<DocumentData>;
  isOpen: boolean;
  toggleOpen: () => void;
}

const Menu = ({
  toggleEditing,
  feedObj,
  feedRef,
  isOpen,
  toggleOpen,
}: Props) => {
  const attachmentUrlRef = ref(appStorage, feedObj.attachmentUrl);
  const navigate = useNavigate();

  const onDeleteClick = async () => {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (ok) {
      await deleteDoc(feedRef);
      await deleteObject(attachmentUrlRef);
    }
    navigate('/');
  };

  return (
    <Popup isOpen={isOpen}>
      <CloseButton onClick={toggleOpen}>
        <IoMdClose />
      </CloseButton>
      <EditButton onClick={toggleEditing}>피드 수정하기</EditButton>
      <DeleteButton onClick={onDeleteClick}>피드 삭제하기</DeleteButton>
    </Popup>
  );
};

export default Menu;

export const Popup = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? `flex` : 'none')};
  flex-direction: column;
  border: solid 1px #eee;
  background-color: #fff;
  position: relative;
  width: 10rem;
  border-radius: 0.3rem;
  box-shadow: 0px 0px 7px 2px #eee;
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 100;
`;

export const EditButton = styled.button`
  padding: 1rem;
  &:hover {
    background-color: #f7f7f7;
    transition: 0.2s;
  }
`;

export const DeleteButton = styled(EditButton)``;

export const CloseButton = styled.button`
  font-size: 1rem;
  align-self: flex-end;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
`;
