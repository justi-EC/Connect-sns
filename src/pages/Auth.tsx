import { useRef, useState } from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { ArrowBack } from '@styled-icons/material-rounded';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import logoImg from '../assets/logo.png';
import { authService } from '../firebase/config';
import AuthForm from '../components/AuthForm';
import ReactTypingEffect from 'react-typing-effect';

type SocialProvider = GoogleAuthProvider | GithubAuthProvider;

const Auth = () => {
  const [newAccount, setNewAccount] = useState(true);
  const [isDisplay, setIsDisplay] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  let provider: SocialProvider;

  const onSocialClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
  };

  const toggleDisplay = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;
    if (name === 'SignUp') {
      setNewAccount(true);
    } else {
      setNewAccount(false);
    }
    setIsDisplay((prev) => !prev);
  };

  const scrollToElement = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <Div>
      <ImgContainer>
        <img src={logoImg} alt="Kiwitter" onClick={scrollToElement} />
      </ImgContainer>
      <TextWrapper onClick={scrollToElement}>
        <ReactTypingEffect text={['Connect.']} />
      </TextWrapper>
      <AuthContainer>
        {isDisplay ? (
          <BackButton onClick={toggleDisplay}>
            <ArrowBack width={80} height={80} />
          </BackButton>
        ) : (
          <span />
        )}

        <div>
          {isDisplay ? (
            <AuthForm newAccount={newAccount} setNewAccount={setNewAccount} />
          ) : (
            <>
              <SignUpButton onClick={onSocialClick} name="google">
                <FcGoogle />
                Google 계정으로 가입
              </SignUpButton>
              <SignUpButton onClick={onSocialClick} name="github">
                <FaGithub />
                GitHub 계정으로 가입
              </SignUpButton>
              <SignUpWithEmailBtn name="SignUp" onClick={toggleDisplay}>
                이메일 계정으로 가입
              </SignUpWithEmailBtn>
              <Text>이미 계정이 있으신가요?</Text>
              <SignInButton name="SignIn" onClick={toggleDisplay} ref={ref}>
                로그인
              </SignInButton>
            </>
          )}
        </div>
      </AuthContainer>
    </Div>
  );
};

export default Auth;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TextWrapper = styled.div`
  position: relative;
  bottom: 16.5rem;
  text-align: center;
  font-size: 2.8rem;
  font-family: var(--font-Montserrat);
  cursor: pointer;
`;

const ImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 20vw;
    min-width: 20rem;
    margin: 6rem;
    cursor: pointer;
  }

  background: #ffffff url('https://ifh.cc/g/W7wkth.png') repeat 0 0;
  -webkit-animation: 45s linear 0s normal none infinite animate;
  -moz-animation: 45s linear 0s normal none infinite animate;
  -ms-animation: 45s linear 0s normal none infinite animate;
  -o-animation: 45s linear 0s normal none infinite animate;
  animation: 45s linear 0s normal none infinite animate;

  @-webkit-keyframes animate {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 1000px 0;
    }
  }

  @-moz-keyframes animate {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 1000px 0;
    }
  }

  @-ms-keyframes animate {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 1000px 0;
    }
  }

  @-o-keyframes animate {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 1000px 0;
    }
  }

  @keyframes animate {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 1000px 0;
    }
  }
`;

export const Text = styled.p`
  font-size: 1rem;
  text-align: center;
  margin-top: 2rem;
`;

const AuthContainer = styled.div`
  display: flex;
  margin-bottom: 3rem;
  padding: 3rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Logo = styled.img`
  width: 3rem;
  margin-bottom: 1rem;
`;

const SignUpButton = styled.button`
  border: solid 1px #eee;
  background-color: transparent;
  padding: 0.5rem 0;
  width: 40rem;
  height: 4rem;
  border-radius: 1.5rem;
  font-size: 1.3rem;
  &:hover {
    cursor: pointer;
    background-color: rgba(224, 224, 224, 0.5);
    border: solid 1px transparent;
    transition: 0.1s;
  }
  & + button {
    margin-top: 2rem;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin-right: 0.5rem;
  }
  font-family: var(--font-Noto-Sans-KR);

  @media screen and (max-width: 768px) {
    width: 30rem;
  }
`;

const SignUpWithEmailBtn = styled(SignUpButton)`
  background-color: #000000;
  color: #ffffff;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const SignInButton = styled(SignUpButton)`
  color: #000000;
  font-weight: 700;
  margin-top: 1rem;
  &:hover {
    background-color: rgba(224, 224, 224, 0.5);
  }
`;

const BackButton = styled.button`
  border: solid 0px transparent;
  margin-right: 38rem;
  background-color: transparent;
  margin-top: -3rem;
  box-sizing: border-box;
  border-radius: 50%;
  padding: 0.4rem 0.5rem;
  &:hover {
    cursor: pointer;
    background-color: rgba(192, 192, 192, 0.3);
    transition: 0.2s;
  }

  @media screen and (max-width: 768px) {
    margin-right: 29rem;
  }
`;