
import Cookies from 'js-cookie';

export const isRefreshTokenValid = (): boolean => {
  const refreshToken = Cookies.get('refreshToken');
  return refreshToken !== undefined;
}