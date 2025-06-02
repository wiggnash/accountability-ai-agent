// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import Challenges from "./pages/Challenges";
import { AuthProvider } from "./context/AuthContext";

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

// Temporary Home Page Component (until you create the real one)
const TemporaryHome: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AI Learning Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your learning journey and share your progress with AI-powered
            posts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => (window.location.href = "/register")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </button>
              </>
            ) : (
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Coming Soon
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                🎯 Challenges
              </h3>
              <p className="text-gray-600 text-sm">
                Join learning challenges like #100DaysOfCode
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🤖 AI Posts</h3>
              <p className="text-gray-600 text-sm">
                Generate engaging LinkedIn posts automatically
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📊 Progress</h3>
              <p className="text-gray-600 text-sm">
                Track your learning streak and achievements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Temporary Dashboard Component (until you create the real one)
const TemporaryDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Your dashboard is being built. Come back soon to track your learning
            progress!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              🎯 Active Challenges
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              No active challenges yet
            </p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Browse Challenges
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              📝 Recent Posts
            </h3>
            <p className="text-gray-600 text-sm mb-4">No posts created yet</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Create Your First Post
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">🔥 Streak</h3>
            <p className="text-gray-600 text-sm mb-4">
              Start your learning streak!
            </p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Log Today's Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// App Router Component (separate from the provider)
const AppRouter: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<TemporaryHome />} />
          <Route path="/challenges" element={<Challenges />} />
          {/* <Route path="/challenge/:slug" element={<ChallengeDetails />} /> */}

          {/* Auth Routes (redirect to dashboard if logged in) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes (require authentication) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TemporaryDashboard />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/challenge/:slug/day/:dayNumber"
            element={
              <ProtectedRoute>
                <DailyLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          /> */}

          {/* Catch all route - 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
