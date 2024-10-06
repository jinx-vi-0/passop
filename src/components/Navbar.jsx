import React from "react";
import {  FaGithub } from 'react-icons/fa';
const Navbar = () => {
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
    <nav className="bg-slate-800 text-white">
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">
        {/* Left side: Logo */}
        <div className="logo font-bold text-white text-2xl">
        <span className="text-green-600"> &lt;</span>
        <span>Pass</span>
        <span className="text-green-600">OP/&gt;</span>
      </div>

        {/* Right side: Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={downloadPasswords}
            className="flex justify-center items-center gap-2 md:font-bold bg-green-500 hover:bg-green-600 rounded-md p-0.5  md:px-2 md:py-1 "
          >
            <lord-icon
              src="https://cdn.lordicon.com/ternnbni.json"
              
              trigger="hover"
            ></lord-icon>
            <span className="hidden md:block">Export</span>
            
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
            className="flex justify-center items-center gap-2 md:font-bold bg-green-500 hover:bg-green-600 rounded-md p-0.5  md:px-2 md:py-1 "
          >
            <lord-icon
              src="https://cdn.lordicon.com/xcrjfuzb.json"
              trigger="hover"
            ></lord-icon>
            <span className="hidden md:block">Import</span>
          </button>

          <a  href="https://github.com/jinx-vi-0" className="text-white text-xl" target='_blank' rel="noopener noreferrer" >
        
       
          <FaGithub className='text-3xl' />
        </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
