import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  createBrowserRouter,
} from "react-router-dom";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import { SidebarLayout, FullscreenLayout } from "@/app/layout";
import { ProjectDetail } from "@/pages/ProjectDetail";
import { Projects } from "@/pages/Projects";
import { NotFound } from "@/pages/NotFound";

export const RouteNames = Object.freeze({
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROJECT: "/project",
  PROJECT_DETAIL: "/project/:projectId",
});

export const router = createBrowserRouter(
  [
    {
      element: <FullscreenLayout />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
          exact: true,
        },
      ],
    },
    {
      element: <SidebarLayout />,
      children: [
        {
          path: "project/:projectId",
          element: <ProjectDetail />,
        },
        {
          element: <Projects />,
          path: "project",
        },
      ],
    },
  ],
);
