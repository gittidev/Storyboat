import { Navigate, Outlet } from 'react-router-dom';

export type ProtectedRouteProps = {
  isAuthentication: boolean;
  redirectPath?: string;
};

function ProtectedRoute({ 
  isAuthentication,
  redirectPath = "/",
}: ProtectedRouteProps) {
  if (!isAuthentication) {
    // 유저 정보나 인증 정보가 없다면 리다이렉트
    return <Navigate to={redirectPath} />;
  }

  // 유저 정보와 인증 정보가 있다면 자식 컴포넌트를 보여줌
  return <Outlet />;
}

export default ProtectedRoute;
