import { useEffect, useState } from "react";
import Avatar from "../components/ProjectSingle/Avatar";
import { useUser } from "../context/UserContext";
import { UserFormHandleChange } from "../utils/UserFormHandleChange";
import axios from "axios";
import edit from "../assets/edit-icon.png";
const API = import.meta.env.VITE_API;

export default function UserInfo() {
  const { user, refetchUserInfo } = useUser();
  const [editMode, setEditMode] = useState({
    profile: false,
    password: false,
  });
  const [err, setErr] = useState(false);
  const token = localStorage.getItem("authToken");
  const [formData, setFormData] = useState({
    Email: user?.Email || "",
    Password: "",
    OldPassword: "",
    FullName: user?.FullName || "",
    Position: user?.Position || "",
    AvatarUrl: user?.AvatarUrl || "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${API}/home/user-info/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditMode({ profile: false, password: false });
      refetchUserInfo();
    } catch (error) {
      setErr(error);
    }
  }

  function handleClearForm(onlyPassword = false) {
    if (onlyPassword) {
      setErr(false);
      setFormData((prev) => ({ ...prev, OldPassword: "", Password: "" }));
      return;
    }
    setFormData({
      Email: user?.Email || "",
      Password: "",
      OldPassword: "",
      FullName: user?.FullName || "",
      Position: user?.Position || "",
      AvatarUrl: user?.AvatarUrl || "",
    });
    setErr(false);
  }
  useEffect(() => {
    handleClearForm();
    if (!editMode.profile) setEditMode({ profile: false, password: false });
  }, [editMode.profile]);

  const labelStyle = "flex flex-col w-[100%] my-[2px]";
  const inputStyle =
    "bg-white shadow-xl border-1 border-gray-200 rounded-md w-[100%] pl-1 py-1";
  const pStyle = "bg-white border-b-1 border-gray-200 w-[100%] pl-1 py-1";

  //! at some point maybe I need to add tabs, of all projects I am assigned to, all Tasks, and think of something else.

  return (
    <div className="min-h-[calc(100vh-88px)] h-full flex flex-col items-center">
      {user && (
        <div
          style={{ height: !editMode.password && "80vh" }}
          className="flex flex-col justify-evenly items-center h-[85vh] sm:h-[87vh] w-[95%] xs:w-[85%] sm:w-[75%] md:w-[65%] lg:w-[55%] xl:w-[45%] bg-[#fafbff] rounded-md shadow-2xl"
        >
          <h1 className="text-2xl font-bold sm:text-4xl md:text-5xl mt-12 mb-8">
            Personal Details
          </h1>
          <Avatar
            avatarUrl={user?.AvatarUrl}
            name={user?.FullName}
            height={"sm:h-32"}
            width={"sm:w-32"}
            minHeight={"h-26"}
            minWidth={"w-26"}
            fontSize={"text-[32px] sm:text-[42px]"}
          />
          {!editMode.profile && (
            <>
              <p className="text-2xl font-bold sm:text-4xl mt-8">
                {user.FullName}
              </p>
              <img
                onClick={() =>
                  setEditMode((prev) => ({
                    ...prev,
                    profile: !prev.profile,
                  }))
                }
                className="h-6 w-6 cursor-pointer transition-all duration-400 ease-in-out hover:scale-150"
                src={edit}
              />
            </>
          )}
          <div className="flex flex-col w-[80%] sm:w-[70%] md:w-[65%] lg:w-[60%] xl:w-[55%]">
            {editMode.profile ? (
              <form id="submitForm" onSubmit={(e) => handleSubmit(e)}>
                <label className={`${labelStyle}`}>
                  Full Name
                  <input
                    required
                    className={`${inputStyle}`}
                    type="text"
                    name="FullName"
                    value={formData.FullName}
                    onChange={(e) =>
                      UserFormHandleChange(e, setFormData, setErr)
                    }
                  />
                </label>
                <label className={`${labelStyle}`}>
                  Position
                  <input
                    required
                    className={`${inputStyle}`}
                    type="text"
                    name="Position"
                    value={formData.Position}
                    onChange={(e) =>
                      UserFormHandleChange(e, setFormData, setErr)
                    }
                  />
                </label>
                <label className={`${labelStyle}`}>
                  Email
                  <input
                    required
                    className={`${inputStyle}`}
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={(e) =>
                      UserFormHandleChange(e, setFormData, setErr)
                    }
                  />
                </label>
                <label className={`${labelStyle}`}>
                  Avatar Url
                  <input
                    type="text"
                    name="AvatarUrl"
                    value={formData.AvatarUrl}
                    onChange={(e) =>
                      UserFormHandleChange(e, setFormData, setErr)
                    }
                    className={`${inputStyle}`}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }));
                    if (editMode.password) handleClearForm(true);
                  }}
                  className={`text-blue-500 flex w-fit transition duration-400 ease-in-out ${
                    editMode.password
                      ? "text-2xl justify-self-end items-center py-0"
                      : ""
                  } font-semibold cursor-pointer hover:bg-gray-200 p-2 rounded-md mt-2`}
                >
                  {editMode.password ? "×" : "Change Password"}
                </button>
                {editMode.password && (
                  <>
                    <label className={`${labelStyle}`}>
                      Old Password
                      <input
                        className={`${inputStyle}`}
                        type="password"
                        name="OldPassword"
                        required
                        value={formData.OldPassword}
                        onChange={(e) =>
                          UserFormHandleChange(e, setFormData, setErr)
                        }
                      />
                    </label>
                    <label className={`${labelStyle}`}>
                      New Password
                      <input
                        className={`${inputStyle}`}
                        type="password"
                        name="Password"
                        required
                        value={formData.Password}
                        onChange={(e) =>
                          UserFormHandleChange(e, setFormData, setErr)
                        }
                      />
                    </label>
                  </>
                )}
              </form>
            ) : (
              <>
                <label className={`${labelStyle}`}>
                  Position
                  <p className={`${pStyle}`}>{user.Position}</p>
                </label>
                <label className={`${labelStyle}`}>
                  Email
                  <p className={`${pStyle}`}>{user.Email}</p>
                </label>
                <label className={`${labelStyle}`}>
                  Account Created
                  <p className={`${pStyle}`}>{user.CreatedAt.slice(0, 10)}</p>
                </label>
              </>
            )}
            {err ? (
              <p className="text-red-600 text-center py-[3px] my-[3px] shadow-2xl">
                {err.response?.data.error}
              </p>
            ) : (
              ""
            )}
            {editMode.profile && (
              <div
                className={`flex flex-row justify-between ${
                  !err ? "mt-5" : ""
                }`}
              >
                <button
                  onClick={() =>
                    setEditMode((prev) => ({
                      ...prev,
                      profile: !prev.profile,
                    }))
                  }
                  className={`text-blue-500 font-semibold cursor-pointer ${
                    editMode.profile &&
                    "w-2/5 bg-white text-black py-2 border-1 border-gray-300 rounded-md"
                  } hover:bg-gray-100`}
                >
                  Cancel
                </button>
                <button
                  form="submitForm"
                  type="submit"
                  className="w-2/5 bg-custom-blue text-white font-bold rounded-md cursor-pointer hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
