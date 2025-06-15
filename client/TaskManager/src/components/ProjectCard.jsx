import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  // console.log("From project single");
  console.log("from project single", project);
  return (
    <Link
      to={`/projects/${project.Id}`}
      className="border-1 border-rose-500 m-4"
    >
      <h1>{project.Title}</h1>
      <div>
        {project.Users.map((u) => (
          <div key={u.UserId}>
            <p>{u.FullName}</p>
            <p>{u.Position}</p>
            {/* Havent used avatar yet */}
          </div>
        ))}
      </div>
      {/* This will be to display tasks */}
      {/* <div>{project.Tasks.map(t => <div><p>{t.Title}</p></div>)}</div> */}
      <p>Status: {project.Status}</p>
      <p>{project.StartDate}</p>
      <p>{project.EndDate}</p>
      <p>{project.CreatedAt}</p>
      <p>{project.Priority}</p>
      <p>{project.ClientName}</p>
      <p>{project.Description}</p>
      <div>
        <p>{project.HeadOfProject.FullName}</p>
        <p>{project.HeadOfProject.Position}</p>
        {/* Havent used avatar yet */}
      </div>
    </Link>
  );
}
