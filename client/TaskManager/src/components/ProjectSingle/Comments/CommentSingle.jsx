import { TransformDate } from "../../../utils/TransformDate";
import edit from "../../../assets/pen-edit.png";
import check from "../../../assets/check.png";
import cancel from "../../../assets/cancel.png";
import bin from "../../../assets/bin.png";
import { useState } from "react";
import { UserFormHandleChange } from "../../../utils/UserFormHandleChange";
import { safeApiCall } from "../../../services/DashboardService";
import { deleteComment, updateComment } from "../../../services/CommentService";
import CommentSingleImg from "./CommentSingleImg";

export default function CommentSingle({ c, currentUser, fetchCommentsData }) {
  const [formData, setFormData] = useState({
    Body: c.Body,
    Image: c.Image,
  });
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [err, setErr] = useState(false);

  async function handleUpdate(e) {
    e.preventDefault();

    const { data, error } = await safeApiCall(() =>
      updateComment(c.TaskId, c.CommentId, formData)
    );
    if (error) return setErr(error);

    setToggleUpdate(false);
    fetchCommentsData();
  }

  async function handleDelete() {
    const { data, error } = await safeApiCall(() =>
      deleteComment(c.TaskId, c.CommentId)
    );
    if (error) return setErr(error);

    fetchCommentsData();
  }

  return (
    <div className="border-b-1 border-gray-200 pb-1">
      {currentUser === c.CommentBy && (
        <div className="flex flex-row justify-end pt-2">
          <img
            src={!toggleUpdate ? edit : check}
            onClick={(e) => {
              !toggleUpdate
                ? setToggleUpdate((prev) => !prev)
                : handleUpdate(e);
            }}
            className="h-5 w-5 cursor-pointer transition-all duration-400 ease-in-out hover:scale-125 mr-4"
          />
          <img
            src={!toggleUpdate ? bin : cancel}
            onClick={(e) => {
              toggleUpdate ? setToggleUpdate((prev) => !prev) : handleDelete();
            }}
            className="h-5 w-5 cursor-pointer transition-all duration-400 ease-in-out hover:scale-125"
          />
        </div>
      )}
      <div className="flex flex-row justify-between pt-2">
        <p>{TransformDate(c.CreatedAt)}</p>
        <p>{c.FullName}</p>
      </div>
      <div className="flex flex-row justify-between pt-4">
        {!toggleUpdate ? (
          <>
            <p className="w-full pr-4">{c.Body}</p>
            {c.ImageUrl && <CommentSingleImg ImageUrl={c.ImageUrl} />}
          </>
        ) : (
          <form>
            <textarea
              className="border border-gray-300 rounded-md p-2 my-4 w-full max-w-[750px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
              name="Body"
              placeholder="Write your comment..."
              value={formData.Body}
              onChange={(e) => UserFormHandleChange(e, setFormData, setErr)}
              rows={5}
            ></textarea>
          </form>
        )}
      </div>
    </div>
  );
}
