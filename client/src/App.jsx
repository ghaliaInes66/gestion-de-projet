import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";

function App() {
  const [page, setPage] = useState("login");
  const [selectedProject, setSelectedProject] = useState(null);

  if (page === "login") {
    return <LoginPage onLogin={() => setPage("home")} />;
  }

  if (page === "home") {
    return (
      <HomePage
        setSelectedProject={(project) => {
          setSelectedProject(project);
          setPage("project");
        }}
        onLogout={() => setPage("login")}
      />
    );
  }

  if (page === "project") {
    return (
      <ProjectPage
        project={selectedProject}
        goBack={() => setPage("home")}
      />
    );
  }
}

export default App;
