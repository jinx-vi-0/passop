import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import passwordRules from "./variables.json";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaSave } from "react-icons/fa";
const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({
    id: "",
    site: "",
    username: "",
    password: "",
  });
  const [passwordArray, setPasswordArray] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

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

  const generatePassword = (event) => {
    event.preventDefault();
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    const allChars = lowerCase + upperCase + numbers + symbols;
    let generatedPassword = "";

    for (let i = 0; i < 12; i++) {
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
    if (
      form.site.length > 3 &&
      form.username.length >= 3 &&
      validatePassword(form.password)
    ) {
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
    } else {
      toast(
        "Error: Password not saved! Ensure the password meets all criteria."
      );
    }
  };

  const deletePassword = async (id) => {
    const confirmDelete = confirm(
      "Do you really want to delete this password?"
    );
    if (confirmDelete) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast("Password Deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find((item) => item.id === id);
    setForm({ ...passwordToEdit });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      validatePassword(e.target.value);
      setIsTyping(e.target.value.length > 0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* <ToastContainer />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div> */}
      <div className="">
       
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">
            <span className="text-green-500">Pass</span>OP - Your own Password
            Manager
          </h2>
        </div>
        {/*Form section */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
          <form>
            <div className="grid grid-cols-1 gap-2">
              <label className="text-gray-700 font-semibold">Website URL</label>
              <input
                value={form.site}
                onChange={handleChange}
                placeholder="Enter website URL"
                className="rounded-full border border-green-500 w-full p-4 py-1"
                type="text"
                name="site"
                id="site"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-gray-700 font-semibold">Username</label>
              <input
                value={form.username}
                onChange={handleChange}
                placeholder="Enter Username"
                className="rounded-full border border-green-500 w-full p-4 py-1"
                type="text"
                name="username"
                id="username"
              />
            </div>
            <div className="flex flex-col w-full items-center space-x-2">
              <div className="grid grid-cols-1  relative w-full">
                <label className="text-gray-700 font-semibold">Password</label>

                {/* Password Field and Generate Button Container */}
                <div className="relative flex items-center w-full">
                  <input
                    ref={passwordRef}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={() => setIsTyping(false)}
                    placeholder="Enter Password"
                    className="rounded-full border border-green-500 w-full p-4 py-1"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    id="password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute text-lg  md:top-2 right-32  md:right-44 text-gray-500"
                  >
                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                  </button>

                  
                  <button
                    onClick={generatePassword}
                    className="ml-4 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 md:whitespace-nowrap text-sm "
                  >
                    Generate Password
                  </button>
                </div>
              </div>

             
              {isTyping && (
                <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-md w-full">
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <span
                        className={`${
                          form.password.length >= 8
                            ? "text-green-600"
                            : "text-red-500"
                        } font-semibold`}
                      >
                        {form.password.length >= 8 ? "✔️" : "❌"} 8-20
                        Characters
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`${
                          /[A-Z]/.test(form.password)
                            ? "text-green-600"
                            : "text-red-500"
                        } font-semibold`}
                      >
                        {/[A-Z]/.test(form.password) ? "✔️" : "❌"} At least one
                        capital letter
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`${
                          /\d/.test(form.password)
                            ? "text-green-600"
                            : "text-red-500"
                        } font-semibold`}
                      >
                        {/\d/.test(form.password) ? "✔️" : "❌"} At least one
                        number
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`${
                          !/\s/.test(form.password)
                            ? "text-green-600"
                            : "text-red-500"
                        } font-semibold`}
                      >
                        {!/\s/.test(form.password) ? "✔️" : "❌"} No spaces
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`${
                          /[!@#$%^&*(),.?\\":{}|<>]/.test(form.password)
                            ? "text-green-600"
                            : "text-red-500"
                        } font-semibold`}
                      >
                        {/[!@#$%^&*(),.?\\":{}|<>]/.test(form.password)
                          ? "✔️"
                          : "❌"}{" "}
                        At least one special character
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            

            <div className="flex justify-center mt-4">
              <button
                onClick={savePassword}
                type="submit"
                className="bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center"
              >
                <FaSave className="mr-2" /> Save
              </button>
            </div>
          </form>
        </div>
        {/*Password List */}
        <div className="passwords mt-10 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg ">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Your Passwords
          </h3>
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
                            editPassword(item.id);
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
                            deletePassword(item.id);
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
    </div>
  );
};

export default Manager;
