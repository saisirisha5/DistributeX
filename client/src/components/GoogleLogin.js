// src/components/GoogleLogin.js
import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


const GoogleLogin = ({ role = 'student' }) => {
 const navigate = useNavigate();

    const handleCredentialResponse = useCallback(async (response) => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/google', { // 👈 UPDATE THIS
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId: response.credential, role }),
        });

        let data;
        try {
        data = await res.json();
        } catch (jsonErr) {
        const fallback = await res.text();
        console.error("Non-JSON response:", fallback);
        alert("Unexpected server response");
        return;
        }

        if (res.ok) {
        localStorage.setItem('token', data.token);
        alert("Login successful!");
        const userRole = data.user.role;
        if (userRole === 'admin') {
            navigate('/admin/dashboard');
        } else if (userRole === 'teacher') {
            navigate('/teacher/home');
        } else if (userRole === 'student') {
            navigate('/student/home');
        } else {
            navigate('/unauthorized');
        }
        } else {
        alert("Login failed: " + data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong!");
    }
    }, [navigate, role]);

    useEffect(() => {
 //   console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

    if (window.google) {
        window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
        document.getElementById("google-button"),
        { theme: "outline", size: "large", width: 180  }
        );
    }
    }, [handleCredentialResponse]);


  return <div id="google-button"></div>;
};

export default GoogleLogin;
