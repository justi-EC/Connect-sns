import { useState } from 'react';
import { appAuth } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import styled from 'styled-components';
import { SubmitButton } from './Generator';
import { useNavigate } from 'react-router-dom';

interface Props {
  newAccount: boolean;
  setNewAccount: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthForm = ({ newAccount, setNewAccount }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(appAuth, email, password);
        navigate('/profile');
      } else {
        data = await signInWithEmailAndPassword(appAuth, email, password);
      }
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('이미 사용중인 이메일 입니다.');
          break;
        case 'auth/wrong-password':
          setError('잘못된 비밀번호입니다.');
          break;
        default:
          setError('아이디와 비밀번호를 확인해주세요.');
          break;
      }
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <TextInput
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <TextInput
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <Error>{error}</Error>
        <SubmitButton
          type="submit"
          value={newAccount ? '회원가입' : '로그인'}
        />
      </Form>
      <SwitchButton onClick={toggleAccount}>
        {newAccount ? '로그인으로 이동' : '회원가입 하러 가기'}
      </SwitchButton>
    </>
  );
};

export default AuthForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TextInput = styled.input`
  border: solid 1px #eee;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  font-size: 1.3rem;
  width: 40rem;
  height: 3rem;
  font-family: var(--font-Noto-Sans-KR);

  @media screen and (max-width: 768px) {
    width: 30rem;
  }
`;

export const Error = styled.p`
  font-size: 0.8rem;
  color: #d60000;
`;

const SwitchButton = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
