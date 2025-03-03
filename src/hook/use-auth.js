import { useSelector } from 'react-redux';

export function useAuth() {
  const { token, currentUser, firstName, isAuth } = useSelector(
    (state) => state.user
  );

  return {
    token,
    firstName,
    currentUser,
    isAuth: isAuth,
  };
}
