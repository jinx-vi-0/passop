import React from "react";
import { useTheme } from "./ThemeContext";

const Footer = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div
      className={`text-white flex flex-col justify-center items-center  w-full theme-transition ${
        isDarkMode ? "bg-stone-950" : "bg-slate-800"
      }`}
    >
      <div className="logo font-bold text-white text-2xl">
        <span className="text-green-600"> &lt;</span>
        <span>Pass</span>
        <span className="text-green-600">OP/&gt;</span>
      </div>
      <div className="flex justify-center items-center">
        {" "}
        Created with <img
          className="w-7 mx-2"
          src="icons/heart.png"
          alt=""
        />{" "}
        by jinx{" "}
      </div>
    </div>
  );
};

export default Footer;
