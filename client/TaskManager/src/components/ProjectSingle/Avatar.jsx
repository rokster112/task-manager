import { useEffect, useState } from "react";

export default function Avatar({ avatarUrl, name }) {
  const [imageError, setImageError] = useState(false);
  const [bgColor, setBgColor] = useState({});

  function avatarDisplay() {
    const fullNameArr = name && name.trim().split(" ");
    return fullNameArr.length === 1
      ? (fullNameArr[0][0] + "." + fullNameArr[0].at(-1)).toUpperCase()
      : (
          fullNameArr[0][0] +
          "." +
          fullNameArr[fullNameArr.length - 1][0]
        ).toUpperCase();
  }

  const bgColorList = [
    "bg-indigo-500",
    "bg-blue-400",
    "bg-teal-400",
    "bg-gray-300",
    "bg-amber-400",
    "bg-purple-400",
  ];

  useEffect(() => {
    const savedColor = localStorage.getItem(`${name}-avatarColor`);
    if (savedColor && bgColorList.includes(savedColor)) {
      setBgColor(savedColor);
    } else {
      const index = Math.floor(Math.random() * bgColorList.length);
      const newColor = bgColorList[index];
      setBgColor(newColor);
      localStorage.setItem(`${name}-avatarColor`, newColor);
    }
  }, [name]);

  return (
    <>
      {!imageError && avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImageError(true)}
          className="w-12 h-12 sm:h-16 sm:w-16 rounded-full object-cover"
        />
      ) : (
        <p
          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${bgColor} flex items-center justify-center font-bold text-white`}
        >
          {avatarDisplay()}
        </p>
      )}
    </>
  );
}
