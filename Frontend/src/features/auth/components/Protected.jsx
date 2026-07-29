import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react';
import { ScaleLoader } from "react-spinners";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#0d0d0d',
        }}
      >
        <ScaleLoader
          color="#ffffff"
          loading={loading}
          height={35}
          width={4}
          radius={2}
          margin={2}
        />
      </main>
    );
  }

  if (!user) {
    return <Navigate to={'/login'} />;
  }

  return children;
};

export default Protected;