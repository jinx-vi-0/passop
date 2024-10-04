import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import passwordRules from "./variables.json";
import "react-toastify/dist/ReactToastify.css";

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

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    setPasswordArray(passwords);
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
          item.id === form.id ? { ...form } : item
        );
        setPasswordArray(updatedPasswords);
        await fetch("http://localhost:3000/", {
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
    <>
      <ToastContainer />
      <div className="p-3 md:mycontainer min-h-[88.2vh]">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-800">&lt;</span>
          <span>Pass</span>
          <span className="text-green-800">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">
          Your own Password Manager
        </p>

        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            className="rounded-full border border-green-500 w-full p-4 py-1"
            type="text"
            name="site"
            id="site"
          />
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
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 rounded-full px-8 py-2 w-fit border border-green-900"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default Manager;
