import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

// Login Page Wrapper
const LoginPageWrapper = () => {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <LoginPage
      onLogin={(user) => {
        login(user);
        navigate("/home");
      }}
    />
  );
};

// Home Page Wrapper
const HomePageWrapper = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelectProject = (project) => {
    // Store project in sessionStorage for the project page
    sessionStorage.setItem('selectedProject', JSON.stringify(project));
    navigate(`/project/${project._id || project.id}`);
  };

  return (
    <HomePage
      userId={currentUser?._id || currentUser?.id}
      setSelectedProject={handleSelectProject}
      onLogout={() => {
        logout();
        navigate("/login");
      }}
    />
  );
};

// Project Page Wrapper
const ProjectPageWrapper = () => {
  const { currentUser } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!currentUser || !projectId) {
        setLoading(false);
        return;
      }

      try {
        // Try to get from sessionStorage first (faster)
        const savedProject = sessionStorage.getItem('selectedProject');
        if (savedProject) {
          try {
            const parsed = JSON.parse(savedProject);
            if (parsed._id === projectId || parsed.id === projectId) {
              setProject(parsed);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('Error parsing saved project:', error);
          }
        }

        // If not in sessionStorage, fetch from API
        const { getProjects } = await import('./api/projectApi');
        const response = await getProjects(currentUser._id || currentUser.id);
        const foundProject = response.projects.find(
          p => (p._id === projectId || p.id === projectId)
        );

        if (foundProject) {
          const mappedProject = {
            id: foundProject._id || foundProject.id,
            _id: foundProject._id || foundProject.id,
            name: foundProject.title,
            description: foundProject.description
          };
          setProject(mappedProject);
          sessionStorage.setItem('selectedProject', JSON.stringify(mappedProject));
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error('Error loading project:', error);
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, currentUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-amber-900">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/home" replace />;
  }

  return (
    <ProjectPage
      project={project}
      goBack={() => navigate("/home")}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePageWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <ProtectedRoute>
                <ProjectPageWrapper />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
