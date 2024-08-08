import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { refreshTokenState } from './recoil/atoms/authAtom';

interface ProtectedRouteProps {
  // isAuthentication: boolean;
  redirectPath: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath }) => {
 const refreshToken = useRecoilValue(refreshTokenState)
  
  if (!refreshToken) {
    return <Navigate to={redirectPath} replace/>;
  }
  return <Outlet />;
};

export default ProtectedRoute;
