import { useAuth0 } from '@auth0/auth0-react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  background-color: #f8f8f8;
  padding: 1rem;
`;

const Navbar = () => {
  const { user, isLoading, logout, isAuthenticated } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const router = useRouter();

  if (router.pathname === '/') {
    return null;
  }

  if (isLoading || !isAuthenticated) return <div></div>;

  return (
    <Nav>
      <div>HELLO {user?.email}</div>
      {/* navbar content goes here */}
      <div
        style={{ marginLeft: 'auto', cursor: 'pointer' }}
        onClick={handleLogout}
      >
        Logout
      </div>
    </Nav>
  );
};

export default Navbar;
