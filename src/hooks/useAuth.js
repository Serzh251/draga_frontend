import { useSelector } from 'react-redux';

export function useAuth() {
  const { token, currentUser, firstName, isAuth, isAdmin } = useSelector((state) => state.user);
  const authStatus = isAuth === null ? 'loading' : isAuth ? 'authenticated' : 'unauthenticated';

  return {
    token,
    firstName,
    currentUser,
    isAuth: isAuth,
    isAdmin,
    authStatus,
  };
}
