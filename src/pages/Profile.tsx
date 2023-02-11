import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser, updateProfile } from 'firebase/auth';
import { Main } from './Home';
import { authService } from '../firebase/config';
import { SubmitButton } from '../components/Generator';
import { DocumentData } from 'firebase/firestore';

interface Props {
  userObj: DocumentData | null;
  refreshUser: () => void;
}

const Profile = ({ userObj, refreshUser }: Props) => {
  const navigate = useNavigate();
  const [newDisplayName, setnewDisplayName] = useState(userObj!.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    navigate('/');
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setnewDisplayName(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userObj!.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser!, {
        displayName: newDisplayName,
      });
    }
    refreshUser();
    alert('이름이 변경되었습니다.');
  };

  const onDeactivateClick = async () => {
    const confirm = window.confirm(`정말 아이디를 삭제하시겠습니까?`);
    if (confirm) {
      try {
        const result = await deleteUser(authService.currentUser!);
        alert(`아이디를 성공적으로 삭제했습니다.`);
        navigate('/');
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  };

  return (
    <Main>
      <Container>
        <Form onSubmit={onSubmit}>
          <EditNameInput
            type="text"
            placeholder="변경할 이름을 입력"
            onChange={onChange}
          />
          <UpdateButton type="submit" value="이름 변경" />
        </Form>
        <LogoutButton as="button" onClick={onLogOutClick}>
          로그아웃
        </LogoutButton>
        <DeactivateButton as="button" onClick={onDeactivateClick}>
          계정 삭제
        </DeactivateButton>
      </Container>
    </Main>
  );
};

export default Profile;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: solid 1px #eee;
  border-right: solid 1px #eee;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const EditNameInput = styled.input`
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.7rem 0;
  border: none;
  color: gray;
  margin-bottom: 5rem;
  border-bottom: solid 2px lightgray;
  font-family: var(--font-Noto-Sans-KR);
  &:focus {
    outline: none;
    border-bottom: solid 2px gray;
  }
`;

const UpdateButton = styled(SubmitButton)`
  width: 10rem;
`;

const LogoutButton = styled(SubmitButton)`
  background-color: #eee;
  color: #717171;
  width: 10rem;
  margin-bottom: 1.5rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const DeactivateButton = styled(SubmitButton)`
  width: 10rem;
  background-color: #eee;
  color: #d60000;
  margin-top: 0.5rem;
  &:hover {
    background-color: rgba(165, 4, 4, 0.7);
    color: #fff;
  }
`;
