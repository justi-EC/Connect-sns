import { appFireStore, appStorage } from '../firebase/config';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { DocumentData, addDoc, collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import styled from 'styled-components';
import { ImFilePicture } from 'react-icons/im';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Generator = () => {
  const [feed, setFeed] = useState('');
  const [attachment, setAttachment] = useState<string | null>('');
  const userObj = useSelector((state: RootState) => state.user.userObj);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (feed) {
      let attachmentUrl = '';
      if (userObj) {
        if (attachment !== '') {
          const attachmentRef = ref(appStorage, `${userObj.uid}/${uuidv4()}`);
          await uploadString(attachmentRef, attachment!, 'data_url');
          attachmentUrl = await getDownloadURL(attachmentRef);
        }
        await addDoc(collection(appFireStore, 'feeds'), {
          text: feed,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          displayName: userObj.displayName,
          attachmentUrl,
          like: 0,
        });
        setFeed('');
        setAttachment('');
      }
    } else {
      alert('내용을 입력하세요.');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    setFeed(value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (files) {
      const theFile = files[0];
      const reader = new FileReader();
      reader.onloadend = (finishedEvent: ProgressEvent<FileReader>) => {
        const { result } = finishedEvent.currentTarget as FileReader;
        setAttachment(result as string);
      };
      reader.readAsDataURL(theFile);
      e.currentTarget.value = '';
    }
  };

  const onClearAttachment = () => setAttachment(null);

  return (
    <Form onSubmit={onSubmit}>
      <TextInputContainer>
        <TextInput
          placeholder="내용을 입력하세요."
          maxLength={200}
          onChange={onChange}
          value={feed}
        />
        {attachment && (
          <AttachmentWrapper>
            <img src={attachment} width="40%" alt="attachment" />
            <button onClick={onClearAttachment}>
              <IoMdClose fontSize="1.2rem" color="#fff" />
            </button>
          </AttachmentWrapper>
        )}
      </TextInputContainer>
      <ButtonWrapper>
        <label htmlFor="fileUpload">
          <ImFilePicture fontSize="1.5rem" color="#000000" />
        </label>
        <FileInput
          type="file"
          id="fileUpload"
          accept="image/*"
          onChange={onFileChange}
        />
        <SubmitButton type="submit" value="보내기" />
      </ButtonWrapper>
    </Form>
  );
};

export default Generator;

const Form = styled.form`
  border-bottom: solid 1px #eee;
  padding: 1rem;
`;

const TextInputContainer = styled.div`
  margin-bottom: 1rem;
`;

const TextInput = styled.textarea`
  padding: 0.8rem;
  width: 100%;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  border: solid 2px #eee;
  &:focus {
    border: solid 2px #b7b7b7;
  }
`;

const AttachmentWrapper = styled.div`
  position: relative;
  button {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 1rem;
    left: 1rem;
    &:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.8);
    }
    svg {
      vertical-align: bottom;
    }
  }
  img {
    border-radius: 1rem;
    margin-bottom: 1rem;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  label {
    border-radius: 50%;
    padding: 0.7rem;
    text-align: center;
    margin-right: 0.7rem;
    width: 3.4rem;
    &:hover {
      cursor: pointer;
      background-color: rgba(222, 238, 241, 0.8);
    }
  }
`;

const FileInput = styled.input`
  display: none;
`;

export const SubmitButton = styled.input`
  background-color: #000000;
  color: #ffffff;
  height: 4rem;
  padding: 0 1.3rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.8);
    transition: 0.2s;
  }
`;
