import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa"; // Import sun and moon icons

const ThemeButton = () => {
    // changes the theme of the website
    const { theme, setTheme } = useTheme();
    
    return(
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-4xl m-0 p-0 h-full w-full flex text-light" >
          {theme === 'dark' ? (
            <FaSun />
          ) : (
            <FaMoon />
          )}
        </button>
    );
  }
  
export default ThemeButton;