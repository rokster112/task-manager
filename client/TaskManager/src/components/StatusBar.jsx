import { StatusEnum } from "../pages/Projects";
import { StatusColor } from "../utils/AssignColors";

export default function StatusBar({
  projects,
  handleSelectStatus,
  selectedStatus,
}) {
  let statusObj = {};

  for (const index in projects) {
    for (const key in StatusEnum) {
      if (!statusObj[StatusEnum[key]]) {
        statusObj[StatusEnum[key]] = 0;
      }
      if (projects[index].Status === Number(key)) {
        statusObj[StatusEnum[key]] += 1;
      }
    }
  }

  const totalStatusAmount = Object.values(statusObj).reduce(
    (prev, cur) => prev + cur,
    0
  );

  statusObj["All"] = totalStatusAmount;

  const statusBar = Object.entries(statusObj).map(([key, value]) => {
    const percentage = Math.round((100 / totalStatusAmount) * value);
    const colorStyle = StatusColor(key);
    return (
      <div
        onClick={(e) => handleSelectStatus(e)}
        data-value={key}
        key={key}
        className="h-[60px] w-[67px] xs:h-[62px] xs:w-[69px] sm:h-20 sm:w-24 md:h-24 md:w-30  lg:w-46 lg:h-32 xl:w-50 rounded-md bg-transparent xs:bg-white flex flex-col items-center justify-center shadow-2xl cursor-pointer transition ease-in-out hover:scale-125"
        style={{
          border: `${
            StatusEnum[selectedStatus] === key ? "1px solid green" : ""
          }`,
        }}
      >
        <div
          className={`rounded-full h-10 w-10 sm:w-12 sm:h-12 md:w-16 md:h-16`}
          style={{
            background: `conic-gradient(${colorStyle} 0% ${percentage}%, #e5e7eb ${percentage}% 100%)`,
          }}
        >
          <div className="relative left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-8 w-8 md:h-10 md:w-10 bg-white"></div>
        </div>
        <p className="text-[8.5px] xs:text-[9.5px] md:text-lg xs:font-semibold">
          {key}: {value}
        </p>
      </div>
    );
  });

  return statusBar;
}
