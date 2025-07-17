import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  fetchCalendarDates,
  safeApiCall,
} from "../../services/DashboardService";
import { StatusColor } from "../../utils/AssignColors";
import { StatusEnum } from "../../pages/Projects";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function DashboardCalendar() {
  const [selectedDate, setSelectedDate] = useState(false);
  const [calendarDates, setCalendarDates] = useState([]);
  const [showTaskDeadlines, setShowTaskDeadlines] = useState(false);
  const deadlines = calendarDates
    ? calendarDates.map((c) => new Date(c.DueBy))
    : [];

  async function fetchCalendarData() {
    const { data, error } = await safeApiCall(fetchCalendarDates);
    if (error) return setErr(error);
    setCalendarDates(data ?? []);
  }

  useEffect(() => {
    fetchCalendarData();
  }, [selectedDate]);

  function showCalendar() {
    setShowTaskDeadlines((prev) => {
      if (!prev) {
        setSelectedDate(new Date());
      } else {
        setSelectedDate(false);
      }
      return !prev;
    });
  }

  return (
    <div className="flex flex-col w-1/2 min-w-[320px] max-w-[350px] lg:mr-[3%]">
      <div className="bg-white rounded-xl shadow border-1 border-blue-500">
        <p className="p-4 font-bold flex justify-between">
          Task deadlines
          <span onClick={() => showCalendar()}>
            {!showTaskDeadlines ? (
              <ChevronDown className="cursor-pointer" />
            ) : (
              <ChevronUp className="cursor-pointer" />
            )}
          </span>
        </p>
        <div
          className={`origin-top transition-[max-height,transform] duration-500 ease-in-out overflow-hidden `}
          style={{
            maxHeight: showTaskDeadlines ? "500px" : "0px",
            transform: showTaskDeadlines ? "scaleY(1)" : "scaleY(0)",
          }}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ deadline: deadlines }}
            modifiersClassNames={{
              deadline: "bg-red-500 text-white rounded-full hover:!bg-red-600",
            }}
            classNames={{
              day: "rounded-full text-slate-700 hover:bg-slate-200 transition-colors",
              chevron: "fill-blue-600 transition hover:scale-125",
            }}
            className="bg-white p-4 pt-0 rounded-xl w-full shadow "
          />
        </div>
      </div>
      <div
        className={`mt-6 p-2 bg-white rounded-md border-1 border-blue-500 ${
          !showTaskDeadlines ? "hidden" : "block"
        }`}
      >
        <p
          className={`font-semibold ${!showTaskDeadlines ? "hidden" : "block"}`}
        >
          Tasks
        </p>
        {selectedDate
          ? calendarDates
              .filter(
                (t) =>
                  new Date(t.DueBy).toDateString() ===
                  new Date(selectedDate).toDateString()
              )
              .map((t) => (
                <div
                  className="underline decoration-gray-300 decoration-3 underline-offset-3 w-fit p-1 m-1 hover:decoration-gray-400"
                  key={t.TaskId}
                >
                  <Link to={`projects/${t.ProjectId}/tasks/${t.TaskId}`}>
                    <li
                      className={`list-disc`}
                      style={{ color: StatusColor(StatusEnum[t.Status]) }}
                    >
                      <span className="text-black">{t.Title}</span>
                    </li>
                  </Link>
                </div>
              ))
          : null}
      </div>
    </div>
  );
}
