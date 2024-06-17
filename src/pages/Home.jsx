import { useEffect, useState } from "react"
import logo from '../assets/logo.svg';
import { Button  } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(
        (result) => {
          setProjects(result);
          // by default, load data from the first project
          if (result) {
            fetch(`/api/energy?uuid=${result[0].uuid}`)
              .then(res => res.json())
              .then(
                (result) => {
                  setData(result);
                }
              )
          }
        }
      )  
  })
  return (
    <div className="App">
      <header className="App-header" style={{border: "1px solid red"}}>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Project list:
        </p>
        <ul>
         {projects.map(project =>
           <li key={project.name}>{project.name}</li>)
         }
        </ul>
        <p>
          Data size: {data.length}
        </p>
        <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
      </header>
    </div>
  );
}
export default App
