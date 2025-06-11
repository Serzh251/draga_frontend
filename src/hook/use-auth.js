import { useSelector } from 'react-redux';

export function useAuth() {
  const { token, currentUser, firstName, isAuth, isAdmin } = useSelector((state) => state.user);

  return {
    token,
    firstName,
    currentUser,
    isAuth: isAuth,
    isAdmin,
  };
}
