import React from "react";
import { Navigate } from "react-router-dom";

interface LoginProps {
  children: React.ReactNode;
  path: string;
}

export function Login(props: LoginProps) {
  const isAuthorized = localStorage.getItem("Authorization") === "true";
  if (isAuthorized) {
    return <Navigate to="/login" />;
  }
  return props.children;
}





