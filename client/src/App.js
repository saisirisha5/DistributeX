import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import  Home  from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';

import NotAuthorized from './pages/NotAuthorized';

import StudentHome from './pages/Student/StudentHome';
import TeacherHome from './pages/Teacher/TeacherHome';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

import ProtectedRoute from './components/ProtectedRoute';

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
