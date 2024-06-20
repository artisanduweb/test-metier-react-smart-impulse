import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.svg";
import { ChevronsRight } from "lucide-react";

const App = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((result) => {
        setProjects(result);
        // by default, load data from the first project
        if (result) {
          fetch(`/api/energy?uuid=${result[0].uuid}`)
            .then((res) => res.json())
            .then((result) => {
              setData(result);
            });
        }
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header" style={{ border: "1px solid red" }}>
        <img src={logo} className="App-logo" alt="logo" />
        <p>Project list:</p>
        <ul>
          {projects.map((project) => (
            <li key={project.name}>{project.name}</li>
          ))}
        </ul>
        <p>Data size: {data.length}</p>
        <Button
          size="lg"
          className="m-4"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </header>
    </div>
  );
};
export default App;
