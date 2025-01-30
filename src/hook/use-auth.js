import {useSelector} from "react-redux";

export function useAuth() {
  const {token, currentUser, isAuth} = useSelector((state) => state.user);

  return {
    token,
    currentUser,
    isAuth: isAuth,
  };
}