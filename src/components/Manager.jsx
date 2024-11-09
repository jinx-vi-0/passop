import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import passwordRules from "./variables.json";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({
    _id: "",
    site: "",
    username: "",
    password: "",
  });
  const [passwordArray, setPasswordArray] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [urlErrors, setUrlErrors] = useState([]);
  const [isSiteFocused, setIsSiteFocused] = useState(false); // To track input focus

  const handleSiteFocus = () => setIsSiteFocused(true);
  const handleSiteBlur = () => setIsSiteFocused(false);

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    setPasswordArray(passwords);
  };

  // function to add favicon before a website
  // domain format examples = google.com || dev.to || youtube.com
  const getFavicon = (domain) => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=25`;
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    passwordRef.current.type =
      passwordRef.current.type === "password" ? "text" : "password";
    ref.current.src =
      passwordRef.current.type === "password"
        ? "icons/eye.png"
        : "icons/eyecross.png";
  };

  const generatePassword = () => {
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    const allChars = lowerCase + upperCase + numbers + symbols;
    let generatedPassword = "";
    generatedPassword += lowerCase[Math.floor(Math.random() * lowerCase.length)];  // At least one lowercase
    generatedPassword += upperCase[Math.floor(Math.random() * upperCase.length)];  // At least one uppercase
    generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];      // At least one number
    generatedPassword += symbols[Math.floor(Math.random() * symbols.length)]; 

    while(generatedPassword.length < 15 ){
      const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
      generatedPassword += randomChar;
    }
    // Set the generated password into the form's password field
    setForm((prevForm) => ({ ...prevForm, password: generatedPassword }));
  };
  
  const validatePassword = (password) => {
    const errors = Object.keys(passwordRules)
      .map((rule) => {
        const isValid = eval(passwordRules[rule].validate);
        return isValid ? null : passwordRules[rule].message;
      })
      .filter(Boolean);
    setPasswordErrors(errors);

    return errors.length === 0;
  };
  const savePassword = async () => {
    const errors = [];

    // Validate Site URL
    if (form.site.length <= 3 || !validateURL(form.site)) {
      errors.push(
        "Error: Invalid site name. Ensure it meets the required format."
      );
    }

    // Validate Username
    if (form.username.length < 3) {
      errors.push("Error: Username must be at least 3 characters long.");
    }

    // Validate Password
    const passwordValidationResult = validatePassword(form.password);
    if (!passwordValidationResult) {
      errors.push("Error: Password does not meet the required criteria.");
    }

    // If there are errors, show them in toast and return
    if (errors.length > 0) {
      errors.forEach((error) =>
        toast(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      );
      return; // Exit if there are validation errors
    }

    if (form.id) {
      const updatedPasswords = passwordArray.map((item) =>
        item._id === form.id ? { ...form } : item
      );
      setPasswordArray(updatedPasswords);
      await fetch(`http://localhost:3000/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      const newPassword = { ...form, id: uuidv4() };
      setPasswordArray([...passwordArray, newPassword]);
      await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPassword),
      });
    }

    // Clear form and show success toast
    setForm({ id: "", site: "", username: "", password: "" });
    toast("Password saved!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const deletePassword = async (id) => {
    const confirmDelete = confirm("Do you really want to delete this password?");
    
    if (confirmDelete) {
        try {
            // Send DELETE request to the server
            const response = await fetch(`http://localhost:3000/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            // Check if the response is OK (status in the range 200-299)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete password");
            }

            // Update local state only after successful deletion
            setPasswordArray(passwordArray.filter((item) => item._id !== id));

            // Show success message
            toast("Password Deleted!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (error) {
            // Handle errors (e.g., network issues, server errors)
            console.error("Error deleting password:", error);
            toast.error(`Error: ${error.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }
};

  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find((item) => item._id === id);
    setForm({ ...passwordToEdit });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      validatePassword(e.target.value);
      setIsTyping(e.target.value.length > 0);
    }

    if (e.target.name === "site") {
      validateURL(e.target.value);
    }
  };

  const validateURL = (url) => {
    const urlPattern =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/\S*)?$/;
    let errors = [];

    if (!urlPattern.test(url)) {
      errors.push("Invalid URL format. Must be in format: example.com");
    }
    if (url.length === 0) {
      errors.push("URL field cannot be empty.");
    }
    setUrlErrors(errors);

    return errors.length === 0;
  };

  return (
    <>
      <ToastContainer />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        
      </div>
      <div className="p-3 md:mycontainer min-h-[88.2vh]">
        <h1 className="lg:text-4xl text-2xl font-bold text-center">
          <span className="text-green-800">&lt;</span>
          <span>Pass</span>
          <span className="text-green-800">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">
          Your own Password Manager
        </p>

        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <div className="relative w-full">
            <input
              value={form.site}
              onChange={handleChange}
              onFocus={handleSiteFocus}
              onBlur={handleSiteBlur}
              placeholder="Enter website URL"
              className="rounded-full border border-green-500 w-full p-4 py-1"
              type="text"
              name="site"
              id="site"
            />
            {isSiteFocused && urlErrors.length > 0 && (
              <div className="absolute  -top-20 mt-2 p-2 left-0 border rounded-lg bg-red-100 text-red-700 opacity-75 ">
                <ul>
                  {urlErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1"
              type="text"
              name="username"
              id="username"
            />
            <div className="flex flex-col relative">
              <div className="relative">
                <input
                  ref={passwordRef}
                  value={form.password}
                  onChange={handleChange}
                  onBlur={() => setIsTyping(false)}
                  placeholder="Enter Password"
                  className="rounded-full border border-green-500 w-full p-4 py-1"
                  type="password"
                  name="password"
                  id="password"
                />
                <span
                  className="absolute right-[3px] top-[4px] cursor-pointer"
                  onClick={showPassword}
                >
                  <img
                    ref={ref}
                    className="p-1"
                    width={26}
                    src="icons/eye.png"
                    alt="eye"
                  />
                </span>
              </div>
              {isTyping && (
                <div className="flex flex-col items-start w-full absolute top-10">
                  <div className="mt-2 p-2 border rounded bg-gray-100">
                    <ul>
                      <li
                        style={{
                          color: form.password.length >= 8 ? "green" : "red",
                        }}
                      >
                        8-20 Characters
                      </li>
                      <li
                        style={{
                          color: /[A-Z]/.test(form.password) ? "green" : "red",
                        }}
                      >
                        At least one capital letter
                      </li>
                      <li
                        style={{
                          color: /\d/.test(form.password) ? "green" : "red",
                        }}
                      >
                        At least one number
                      </li>
                      <li
                        style={{
                          color: !/\s/.test(form.password) ? "green" : "red",
                        }}
                      >
                        No spaces
                      </li>
                      <li
                        style={{
                          color: /[!@#$%^&*(),.?\\":{}|<>]/.test(form.password)
                            ? "green"
                            : "red",
                        }}
                      >
                        Password must contain at least one special character
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col">
            <div className="flex justify-center gap-2 lg:gap-4 mt-4">
              <button
                onClick={savePassword}
                className="flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 rounded-full px-3 lg:px-8 py-1 lg:py-2 w-fit border border-green-900"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/jgnvfzqg.json"
                  trigger="hover"
                ></lord-icon>
                {form._id ? "Update" : "Save"}
              </button>

              <button
                onClick={generatePassword}
                className="flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 rounded-full px-5 lg:px-8 py-1 lg:py-2 w-fit border border-green-900"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/jxnudnip.json"
                  trigger="hover"
                ></lord-icon>
                Generate Password
              </button>
            </div>
          </div>
        </div>
        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div>No passwords to show</div>}
          {passwordArray.length !== 0 && (
            <div className="overflow-x-auto">
              <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="py-2">Site</th>
                    <th className="py-2">Username</th>
                    <th className="py-2">Password</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-green-100">
                  {passwordArray.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center">
                          <img src={getFavicon(item.site)} className="mr-3" />
                          <a
                            href={item.site}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.site}
                          </a>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center">
                          <span>{item.username}</span>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center">
                          <span>{"*".repeat(item.password.length)}</span>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="justify-center py-2 border border-white text-center">
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => {
                            editPassword(item._id);
                          }}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/gwlusjdu.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => {
                            deletePassword(item._id);
                          }}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/skkahier.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
