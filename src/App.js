import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      data: [],
    };
  }

  componentDidMount() {
    fetch("/api/projects")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            projects: result
          });

          // by default, load data from the first project
          if (result) {
            fetch(`/api/energy?uuid=${result[0].uuid}`)
              .then(res => res.json())
              .then(
                (result) => {
                  this.setState({
                    data: result
                  });
                }
              )
          }
        }
      )
  }

  render () {
    const { projects, data } = this.state;
    const projectItems = projects.map(project =>
      <li key={project.name}>{project.name}</li>
    )
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Project list:
          </p>
          <ul>
            {projectItems}
          </ul>
          <p>
            Data size: {data.length}
          </p>
        </header>
      </div>
    );
  }
}

export default App;
