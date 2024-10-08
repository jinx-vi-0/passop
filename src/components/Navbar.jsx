import React from "react";
import { useTheme } from "./ThemeContext";
const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  // Function to download passwords
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

  // Function to import passwords
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
    <nav
      className={` text-white  theme-transition ${
        isDarkMode ? "bg-stone-950" : "bg-slate-800"
      }`}
    >
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">
        {/* Left side: Logo */}
        <div className="logo font-bold text-2xl">
          <span className="text-green-600"> &lt;</span>
          <span>Pass</span>
          <span className="text-green-600">OP/&gt;</span>
        </div>

        {/* Right side: Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={downloadPasswords}
            className="flex justify-center items-center gap-2 font-semibold bg-green-500 hover:bg-green-600 rounded-full px-4 py-1 border border-green-900"
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
            className="flex justify-center items-center gap-2 font-semibold bg-green-500 hover:bg-green-600 rounded-full px-4 py-1 border border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/xcrjfuzb.json"
              trigger="hover"
            ></lord-icon>
            Import
          </button>

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
