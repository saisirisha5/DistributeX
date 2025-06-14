import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import  Home  from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';

import NotAuthorized from './pages/NotAuthorized';

import StudentHome from './pages/student/StudentHome';
import TeacherHome from './pages/Teacher/TeacherHome';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import TestDetail from './pages/Teacher/TestDetail'; 
import ProtectedRoute from './components/ProtectedRoute';
import AvailableTests from './pages/student/AvailableTests';
import EnrollPage from './pages/student/EnrollPage';
import AdminTestsPage from './pages/Admin/AdminTestsPage';
import AdminTestDetail from './pages/Admin/AdminTestDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
           <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
             <Route path="/unauthorized" element={<NotAuthorized />} />

             <Route path="/student/home" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentHome />
            </ProtectedRoute>
          } />
             <Route path="/student/tests" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AvailableTests />
            </ProtectedRoute>
          } />
            
            <Route path="/student/tests/enroll/:testId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <EnrollPage/>
              </ProtectedRoute>
            } />

            <Route path="/teacher/home" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherHome />
            </ProtectedRoute>
          } />

           <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />

           <Route path="/teacher/test/:id" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TestDetail />
            </ProtectedRoute>
          } />

           <Route path="/admin/tests" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTestsPage />
            </ProtectedRoute>
          } />

           <Route path="/test/details/:id" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTestDetail />
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
    </Router>
    </AuthProvider>
    
  );
}

export default App;
