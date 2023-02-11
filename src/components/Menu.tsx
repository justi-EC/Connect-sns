import { ref } from 'firebase/storage';
import { DocumentData, DocumentReference, deleteDoc } from 'firebase/firestore';
import { deleteObject } from 'firebase/storage';
import styled from 'styled-components';
import { IoMdClose } from 'react-icons/io';
import { storageService } from '../firebase/config';

interface Props {
  toggleEditing: () => void;
  feedObj: DocumentData;
  feedTextRef: DocumentReference<DocumentData>;
  isOpen: boolean;
  toggleOpen: () => void;
}

const Menu = ({
  toggleEditing,
  feedObj,
  feedTextRef,
  isOpen,
  toggleOpen,
}: Props) => {
  const attachmentUrlRef = ref(storageService, feedObj.attachmentUrl);

  const onDeleteClick = async () => {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (ok) {
      await deleteDoc(feedTextRef);
      await deleteObject(attachmentUrlRef);
    }
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

const Popup = styled.div<{ isOpen: boolean }>`
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

const EditButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 1rem;
  &:hover {
    cursor: pointer;
    background-color: #f7f7f7;
    transition: 0.2s;
  }
  font-family: var(--font-Noto-Sans-KR);
`;

const DeleteButton = styled(EditButton)``;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1rem;
  align-self: flex-end;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  &:hover {
    cursor: pointer;
  }
`;
