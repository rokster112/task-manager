import { useEffect, useState } from "react";
import { safeApiCall } from "../../../services/DashboardService";
import { fetchComments, postComment } from "../../../services/CommentService";
import { UserFormHandleChange } from "../../../utils/UserFormHandleChange";
import Avatar from "../Avatar";
import CommentSingle from "./CommentSingle";
import { ClipLoader } from "react-spinners";
import React from "react";

const override = {
  margin: "0 auto",
  display: "block",
  marginTop: "20px",
};

export default function Comments({ currentUser, taskId, id, taskMembers }) {
  const [comments, setComments] = useState([]);
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Body: "",
  });
  const [blurContent, setBlurContent] = useState(true);

  //! I will probably have to delete the image once a comment is deleted as well, to avoid bugs in the future.
  // async function uploadImage(file) {
  //   const imageRef = ref(storage, `images/${file.name}`);
  //   await uploadBytes(imageRef, file);
  //   const downloadURL = await getDownloadURL(imageRef);
  //   return downloadURL;
  // }
  // How it should look: CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@do36w9yv0
  // API SECRET = fgpvApYSx3ZR03B0jWtWX9zSCqk
  // API KEY = 613989425535592
  // API NAME = do36w9yv0
  async function fetchCommentsData() {
    const { data, error } = await safeApiCall(() => fetchComments(taskId));
    if (error) return setErr(error);

    if (data && data.length > 0 && taskMembers.length > 0) {
      const finalData = data.map((c) => {
        const foundMember = taskMembers.find((m) => {
          return m.UserId === c.CommentBy;
        });

        return {
          ...c,
          FullName: foundMember.FullName,
          AvatarUrl: foundMember.AvatarUrl,
        };
      });
      return setComments(finalData);
    }
    setComments([]);
  }
  console.log(comments);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const commentData = new FormData();
      commentData.append("Body", formData.Body);
      if (formData.Image) {
        commentData.append("Image", formData.Image);
      }
      const { data, error } = await safeApiCall(() =>
        postComment(taskId, commentData)
      );
    } catch (error) {
      setErr(error);
    } finally {
      setLoading(false);
      setFormData({ Body: "", Image: null });
      fetchCommentsData();
    }
  }

  function handleFileUpload(e) {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  }
  useEffect(() => {
    fetchCommentsData();
  }, [taskMembers]);
  const currentUserObj = taskMembers.find((m) => m.UserId === currentUser);
  console.log(comments);
  return (
    <div className="bg-[#feffff] rounded-xl p-2 pb-6 m-2 mb-0 md:p-6 md:m-6 md:mb-0 shadow-xl">
      <h3 className="font-semibold text-lg">Comments</h3>
      <div>
        {comments.length > 0 ? (
          comments.map((c) => (
            <CommentSingle
              key={c.CommentId}
              c={c}
              currentUser={currentUser}
              fetchCommentsData={fetchCommentsData}
              handleFileUpload={handleFileUpload}
            />
          ))
        ) : (
          <h1>No comments to display. Add your comment to get started!</h1>
        )}
      </div>
      {!loading ? (
        <form
          className="flex flex-col items-center justify-center mx-5 mt-4"
          onSubmit={(e) => handleSubmit(e)}
        >
          {currentUserObj && (
            <Avatar
              avatarUrl={currentUserObj.AvatarUrl}
              name={currentUserObj.FullName}
              height={"sm:h-12"}
              width={"sm:w-12"}
              minHeight={"h-8"}
              minWidth={"w-8"}
            />
          )}
          <textarea
            className="border border-gray-300 rounded-md p-2 my-4 w-full max-w-[750px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            name="Body"
            placeholder="Write your comment..."
            value={formData.Body}
            onChange={(e) => UserFormHandleChange(e, setFormData, setErr)}
            rows={5}
          ></textarea>
          <label className="inline-block mb-4 px-1 py-1 bg-blue-100 text-gray-500 rounded cursor-pointer hover:bg-blue-200 hover:text-black transition">
            + Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              name="Image"
              onChange={(e) => handleFileUpload(e)}
            />
          </label>
          {formData.Image && (
            <p className="mb-4 text-sm text-gray-500">{formData.Image.name}</p>
          )}

          <button
            className="bg-custom-blue rounded-md w-fit p-2 border-1 text-white font-semibold border-blue-700 cursor-pointer transition duration-400 ease-in-out hover:bg-blue-700"
            type="submit"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <ClipLoader
          loading={loading}
          color="#325bff"
          size={60}
          // className="flex justify-center items-center"
          cssOverride={override}
        />
      )}
    </div>
  );
}
