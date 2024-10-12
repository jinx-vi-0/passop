import { useState } from 'react';

const UserAccount = ({ email, username }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Extract the first letter of the email for the avatar
    const avatarLetter = email.charAt(0).toUpperCase();

    return (
        <div className="relative">
            <div
                className="flex items-center justify-center w-10 h-10 bg-green-800 text-white rounded-full cursor-pointer absolute -top-[1.2rem] right-[28rem]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {avatarLetter}
            </div>

            {isHovered && (
                <div className="absolute bg-gray-800 top-[2rem] right-[22rem] py-2 pr-10 pl-2 text-start rounded-lg font-normal">
                    <span className="text-gray-200 text-sm">PassOp Account</span><br />
                    <span className="text-gray-400 text-sm">{email}</span>
                    {username && <span className="text-gray-400 text-sm">{username}</span>}<br />
                </div>
            )}
        </div>
    );
};

export default UserAccount;
