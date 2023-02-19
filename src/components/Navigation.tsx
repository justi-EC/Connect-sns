import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import {
  IoPersonCircleOutline,
  IoPersonCircleSharp,
  IoFileTrayFullSharp,
} from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { dataActions } from '../store/dataSlice';
import { RootState } from '../store/store';

const Navigation = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const userObj = useSelector((state: RootState) => state.user.userObj);
  const linkStyle = { textDecoration: 'none', color: 'inherit' };

  return (
    <header>
      <Nav>
        <ul>
          <li>
            <Link to="/" style={linkStyle}>
              {location.pathname === '/' ? <AiFillHome /> : <AiOutlineHome />}
              <span>Home</span>
            </Link>
          </li>
          <li>
            <IoFileTrayFullSharp />
            <Link to="detail" style={linkStyle}>
              <span
                onClick={() =>
                  dispatch(dataActions.showUserPosts(userObj!.uid))
                }
              >
                My Post
              </span>
            </Link>
          </li>
          <li>
            <Link to="/profile" style={linkStyle}>
              {location.pathname === '/profile' ? (
                <IoPersonCircleSharp />
              ) : (
                <IoPersonCircleOutline />
              )}
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </Nav>
    </header>
  );
};

export default Navigation;

const Nav = styled.nav`
  padding: 1.3rem;
  font-size: 1.2rem;
  box-sizing: border-box;
  min-width: max-content;

  ul {
    list-style-type: none;
  }

  li {
    padding: 0.5rem 1.2rem;
    margin-bottom: 1rem;

    &:hover {
      background-color: #eee;
      border-radius: 1.5rem;
    }
  }
  span {
    margin-left: 0.3rem;
    line-height: 2rem;
  }
`;
