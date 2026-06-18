import { useAuth } from '../contexts/AuthContext';
import { Role } from '../constants/constants';

export const useRole = () => {
  const { userInfo } = useAuth();
  
  // Support both camelCase and PascalCase from API/storage
  const role = userInfo?.role || userInfo?.Role || null;
  
  const isAdmin = role === Role.ADMIN;
  const isStaff = role === Role.STAFF;
  const isReader = role === Role.READER;

  return {
    role,
    isAdmin,
    isStaff,
    isReader,
  };
};

export default useRole;
