import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../firebase/auth';

const UserAccount = ({ email, username }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    // Extract the first letter of the email for the avatar
    const avatarLetter = email.charAt(0).toUpperCase();
    const name = username ? username.substring(0, 16) : '';

    // Function to handle sign out
    const handleLogout = async () => {
        try {
            await doSignOut(); // Sign out the user
            navigate('/login'); // Redirect to the login page
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-center h-full gap-1">
                <div
                    className="flex items-center justify-center w-10 h-10 bg-green-800 text-white rounded-full cursor-pointer font-extralight"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {avatarLetter}
                </div>
                <div className="capitalize">
                    {name}
                </div>

                {/* Logout Button */}
                <button className="flex ml-2 cursor-pointer" onClick={handleLogout}>
                    <LogoutIcon className="text-red-500 ml-2 hover:text-red-600" />
                </button>
            </div>

            {isHovered && (
                <div className="absolute bg-gray-900 py-4 pr-10 pl-2 text-start rounded-lg font-normal">
                    <span className="text-gray-200 text-sm">PassOp Account</span><br />
                    <span className="text-gray-400 text-sm">{email}</span><br />
                    {username && <span className="text-gray-400 text-sm">{username}</span>}<br />
                </div>
            )}
        </div>
    );
};

export default UserAccount;
