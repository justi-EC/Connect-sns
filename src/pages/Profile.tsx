import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser, updateProfile } from 'firebase/auth';
import { Main } from './Home';
import { appAuth } from '../firebase/config';
import { SubmitButton } from '../components/Generator';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useDispatch } from 'react-redux/es/exports';
import { userActions } from '../store/userSlice';
import { CgHello } from 'react-icons/cg';
import { DefaultMotion, DelayMotion } from '../utils/Motion';

const Profile = () => {
  const navigate = useNavigate();
  const userObj = useSelector((state: RootState) => state.user.userObj);
  const dispatch = useDispatch();
  const [newDisplayName, setnewDisplayName] = useState('');

  const onLogOutClick = () => {
    appAuth.signOut();
    navigate('/');
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setnewDisplayName(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newDisplayName === userObj!.displayName) {
      alert('기존 이름과 동일합니다.');
    } else if (newDisplayName.length === 0) {
      alert('이름을 입력하세요.');
    } else {
      await updateProfile(appAuth.currentUser!, {
        displayName: newDisplayName,
      });
      alert('이름이 변경되었습니다.');
      dispatch(userActions.refreshUser());
    }
  };

  const onDeactivateClick = async () => {
    const confirm = window.confirm(`정말 아이디를 삭제하시겠습니까?`);
    if (confirm) {
      try {
        const result = await deleteUser(appAuth.currentUser!);
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
      <DefaultMotion>
        <ProfileText>
          <span>
            <CgHello size={40} />
          </span>
          <span>안녕하세요. {userObj!.displayName}님!</span>
        </ProfileText>
      </DefaultMotion>
      <DelayMotion>
        <Container>
          <Form onSubmit={onSubmit}>
            <EditNameInput
              type="text"
              placeholder="변경할 이름을 입력"
              onChange={onChangeName}
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
      </DelayMotion>
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
  height: 70vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileText = styled.div`
  display: flex;
  margin: 3rem;
  font-weight: bold;
  font-size: 40px;
  font-family: var(--font-NanumGothic);
  span {
    margin-right: 0.5rem;
  }
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
  color: #393939;
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
