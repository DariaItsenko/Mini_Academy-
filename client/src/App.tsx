import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './context/AuthContext';

import { AccountSidebar } from './components/AccountSidebar';
import { InstallPWA } from './components/InstallPWA';

import HomePage from './pages/HomePage';

import RegisterPage from './pages/RegisterPage';

import LoginPage from './pages/LoginPage';

import ProfilePage from './pages/ProfilePage';

import StatisticsPage from './pages/StatisticsPage';

import ShopPage from './pages/ShopPage';

import SubjectTopicsPage from './pages/SubjectTopicsPage';

import TopicSubtopicsPage from './pages/TopicSubtopicsPage';

import SubtopicPage from './pages/SubtopicPage';

import {
  LegacySubtopicRedirect,
  LegacySubtopicTabRedirect,
  LegacyAdminEditorRedirect,
} from './pages/LegacyCurriculumRedirect';

import ExercisePage from './pages/ExercisePage';

import AdminPage from './pages/admin/AdminPage';

import AdminAssignmentsPage from './pages/admin/AdminAssignmentsPage';

import AdminSubjectPage from './pages/admin/AdminSubjectPage';

import AdminTopicPage from './pages/admin/AdminTopicPage';

import AdminSubtopicEditorPage from './pages/admin/AdminSubtopicEditorPage';

import AdminLoginPage from './pages/AdminLoginPage';



import type { ReactNode } from 'react';



function ProtectedRoute({ children }: { children: ReactNode }) {

  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;

}



function AdminRoute({ children }: { children: ReactNode }) {

  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!user?.isAdmin) return <Navigate to="/admin-login" replace />;

  return <>{children}</>;

}



export default function App() {

  return (

    <>

      <InstallPWA />

      <AccountSidebar />

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin-login" element={<AdminLoginPage />} />

        <Route

          path="/profile"

          element={

            <ProtectedRoute>

              <ProfilePage />

            </ProtectedRoute>

          }

        />

        <Route

          path="/statistics"

          element={

            <ProtectedRoute>

              <StatisticsPage />

            </ProtectedRoute>

          }

        />

        <Route

          path="/shop"

          element={

            <ProtectedRoute>

              <ShopPage />

            </ProtectedRoute>

          }

        />

        <Route path="/subject/:subject" element={<SubjectTopicsPage />} />

        <Route path="/subject/:subject/:topicId" element={<TopicSubtopicsPage />} />

        <Route path="/subject/:subject/:topicId/:subtopicId" element={<SubtopicPage />} />

        {/* Legacy URLs (section/topic naming) */}

        <Route path="/subject/:subject/:sectionId/:topicId" element={<LegacySubtopicRedirect />} />

        <Route path="/subject/:subject/:sectionId/:topicId/video" element={<LegacySubtopicTabRedirect tab="video" />} />

        <Route path="/subject/:subject/:sectionId/:topicId/lecture" element={<LegacySubtopicTabRedirect tab="lecture" />} />

        <Route path="/subject/:subject/:sectionId/:topicId/assignment" element={<LegacySubtopicTabRedirect tab="assignments" />} />

        <Route path="/math" element={<Navigate to="/subject/math" replace />} />

        <Route

          path="/exercise/:id"

          element={

            <ProtectedRoute>

              <ExercisePage />

            </ProtectedRoute>

          }

        />

        <Route

          path="/admin"

          element={

            <AdminRoute>

              <AdminPage />

            </AdminRoute>

          }

        />

        <Route

          path="/admin/assignments"

          element={

            <AdminRoute>

              <AdminAssignmentsPage />

            </AdminRoute>

          }

        />

        <Route

          path="/admin/subject/:subject"

          element={

            <AdminRoute>

              <AdminSubjectPage />

            </AdminRoute>

          }

        />

        <Route

          path="/admin/subject/:subject/:topicId"

          element={

            <AdminRoute>

              <AdminTopicPage />

            </AdminRoute>

          }

        />

        <Route

          path="/admin/subject/:subject/:topicId/:subtopicId"

          element={

            <AdminRoute>

              <AdminSubtopicEditorPage />

            </AdminRoute>

          }

        />

        <Route path="/admin/curriculum" element={<Navigate to="/admin" replace />} />
        <Route
          path="/admin/curriculum/:subject/:sectionId/:topicId"
          element={
            <AdminRoute>
              <LegacyAdminEditorRedirect />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

    </>

  );

}


