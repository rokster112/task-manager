export default function ThemeBtn({ theme, setTheme }) {
  const themeBlack = theme === "to-black" ? true : false;
  function handleTheme() {
    if (theme === "to-blue-200") {
      setTheme("to-black");
    } else {
      setTheme("to-blue-200");
    }
  }
  theme ? localStorage.setItem("theme", theme) : null;

  return (
    <div className=" w-full  flex flex-col  items-end justify-end">
      <div className="w-fit h-fit mr-4 xs:mr-8 mb-4">
        <p
          className={`${
            themeBlack ? "text-white" : "text-black"
          } font-semibold mb-1`}
        >
          Dark Mode
        </p>
        <button className="relative w-full h-6 sm:h-8 py-2 bg-white rounded-3xl flex">
          <span
            className={`z-1 h-6 sm:h-8 absolute top-0 bg-green-400 rounded-3xl transition-all duration-300 ease-in-out ${
              themeBlack ? "w-full" : "w-0"
            }`}
          ></span>
          <span
            onClick={handleTheme}
            className={`rounded-full z-1 absolute h-5 w-5 sm:h-7 sm:w-7 cursor-pointer ${
              themeBlack ? "bg-gray-300" : "bg-white"
            } border-1 border-gray-300 top-0 m-[2px] transition-[right] duration-300 ease-in-out ${
              themeBlack
                ? "right-0"
                : "right-[calc(100%-24px)] sm:right-[calc(100%-32px)]"
            }`}
          ></span>
        </button>
      </div>
    </div>
  );
}
