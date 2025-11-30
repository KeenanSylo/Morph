import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import RootLayout from "./app/layout";
import LandingPage from "./app/page";
import CreatePage from "./app/create/page";

// Error Boundary to catch crashes and display them
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "#ff4444", background: "#1a1a1a", height: "100vh", fontFamily: "monospace" }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  // Default to Landing Page ("/"). Do not rely on window.location in sandbox.
  const [route, setRoute] = useState("/");

  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setRoute(customEvent.detail);
      }
    };
    
    // Listen for custom internal navigation events
    window.addEventListener("morph-navigate", handleNavigation);
    return () => window.removeEventListener("morph-navigate", handleNavigation);
  }, []);

  let Component;
  if (route === "/create") {
    Component = CreatePage;
  } else {
    Component = LandingPage;
  }

  return (
    <RootLayout>
      <Component />
    </RootLayout>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

