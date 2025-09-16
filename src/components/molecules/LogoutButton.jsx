import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../App';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="small" 
      onClick={handleLogout}
      className="text-gray-600 hover:text-gray-800"
    >
      <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton;