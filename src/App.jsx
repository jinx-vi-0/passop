import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import { ThemeProvider, useTheme } from "./components/ThemeContext";

function App() {
  return (
    <>
      <ThemeProvider>
        <Navbar />
        <MainContent />
        <Footer />
      </ThemeProvider>
    </>
  );
}

const MainContent = () => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`${
        isDarkMode
          ? "bg-green-950 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"
          : "bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]"
      } bg-[size:14px_24px]`}
    >
      <Manager />
    </div>
  );
};

export default App;
