import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div>
      <ul>
        <li><Link to="/admin">Admin</Link></li>
        <li><Link to="/teacher">Teacher</Link></li>
        <li><Link to="/student">Student</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;