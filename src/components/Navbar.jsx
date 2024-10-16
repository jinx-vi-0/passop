import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext/index';
import { doSignOut } from '../firebase/auth'
import UserAccount from "./UserAccount";

const Navbar = () => {
  const { currentUser } = useAuth();
  const { userLoggedIn } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  const navigate = useNavigate();
  // function to download passwords
  const downloadPasswords = async () => {
    try {
      const response = await fetch("http://localhost:3000/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "passwords.json";
      link.click();

      toast("Passwords downloaded!", { theme: "dark" });
    } catch (error) {
      console.error("Error downloading passwords:", error);
      toast("Error downloading passwords", { theme: "dark" });
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // function to import passwords
  const importPasswords = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target.result;
      const passwords = JSON.parse(fileContent);

      // Ensure each password entry contains the correct fields
      const formattedPasswords = passwords.map((password) => ({
        site: password.site,
        username: password.username,
        password: password.password,
      }));

      // Send passwords to the backend for import
      try {
        const response = await fetch("http://localhost:3000/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedPasswords),
        });

        if (response.ok) {
          toast("Passwords imported successfully!", { theme: "dark" });
          getPasswords(); // Refresh the password list after importing
        } else {
          toast("Error importing passwords", { theme: "dark" });
        }
      } catch (error) {
        console.error("Error importing passwords:", error);
        toast("Error importing passwords", { theme: "dark" });
      }
    };

    reader.readAsText(file);
  };

  return (
    <nav className="bg-slate-800  text-white">
      <div className="mycontainer flex justify-between h-16  items-center px-2 lg:px-4 py-5 ">
        {/* Left side: Logo */}
        <div className="logo font-bold text-white text-2xl">
          <a href="/" className="block">
            <span className="text-green-600"> &lt;</span>
            <span>Pass</span>
            <span className="text-green-600">OP/&gt;</span>
          </a>
        </div>
        <div className="flex gap-4 justify-center items-center">
        {/* Right side: Buttons */}
        <div className={`lg:flex-row flex-col lg:flex bg-slate-800 px-6 py-2 ${isVisible ? "" : "hidden"} items-center gap-4 lg:relative absolute lg:top-0 top-16 shadow-2xl z-50 right-0 `}>
          <button
            onClick={downloadPasswords}
            className="flex justify-center items-center w-28 lg:mb-0 mb-2 gap-2 font-semibold bg-green-500 hover:bg-green-600 rounded-full px-2 lg:px-4 py-1 border border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/ternnbni.json"
              trigger="hover"
            ></lord-icon>
            Export
          </button>

          <input
            type="file"
            accept=".json"
            onChange={importPasswords}
            className="hidden"
            id="upload-passwords-input"
          />

          <button
            onClick={() =>
              document.getElementById("upload-passwords-input").click()
            }
            className="flex justify-center items-center w-28 lg:mb-0 mb-2 gap-2  font-semibold bg-green-500 hover:bg-green-600 rounded-full  px-2 lg:px-4 py-1 border border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/xcrjfuzb.json"
              trigger="hover"
            ></lord-icon>
            Import
          </button>

          {userLoggedIn ?
            <button
              onClick={() => { doSignOut().then(() => { navigate('/login') }) }} // Navigate to the login page
              className="flex justify-center items-center w-28 lg:mb-0 mb-2 gap-2 font-semibold bg-green-500 hover:bg-green-600 rounded-full  px-2 lg:px-4 py-1 border border-green-900"
            >
              <lord-icon
                src="https://cdn.lordicon.com/xcrjfuzb.json"
                trigger="hover"
              ></lord-icon>
              Sign out
            </button>
            :
            <button
              onClick={() => navigate('/sign-in')} // Navigate to the login page
              className="flex justify-center items-center w-28 lg:mb-0 mb-2 gap-2 font-semibold  bg-green-500 hover:bg-green-600 rounded-full  px-2 lg:px-4 py-1 border border-green-900"
            >
              <lord-icon
                src="https://cdn.lordicon.com/xcrjfuzb.json"
                trigger="hover"
              ></lord-icon>
              SignIn
            </button>


          }


        </div>
        <div className="flex">
          {userLoggedIn ? <UserAccount email={currentUser.email} username={currentUser.displayName} />
            : ''}
          <a
            href="https://github.com/jinx-vi-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="text-white mx-2 rounded-full flex justify-center items-center ring-white ring-1 transition duration-300 ease-in-out hover:shadow-lg hover:bg-gray-700">
              <img
                className="invert w-10 p-1"
                src="/icons/github.png"
                alt="github logo"
              />
            </button>
          </a>
          <button className="text-xl hover:bg-gray-700 px-2 py-1 rounded-md lg:hidden block" onClick={toggleVisibility}>&#9776;</button>
        </div>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
