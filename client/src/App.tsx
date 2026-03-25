/**
 * App.tsx — Root component with routing, providers, and layout
 * Design: Clean Light Mode — orange & white, soft shadows
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { DataProvider, useData } from "./contexts/DataContext";
import { Moon, Sun } from "lucide-react";
import BottomNav from "./components/BottomNav";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Vehicles from "./pages/Vehicles";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { useAuth } from "./_core/hooks/useAuth";

const LOGO_LIGHT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452232695/Geqw5Dwwk2pA5LmRx3Tkji/1718725111378__1_-removebg(1)_20260319_113407_0000_3211d834.webp";
const LOGO_DARK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452232695/Geqw5Dwwk2pA5LmRx3Tkji/1718725111378__w_-removebg(1)_20260323_184415_0000_8da86558.webp";
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Component />;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/add" component={() => <ProtectedRoute component={AddEntry} />} />
      <Route path="/history" component={() => <ProtectedRoute component={History} />} />
      <Route path="/reports" component={() => <ProtectedRoute component={Reports} />} />
      <Route path="/vehicles" component={() => <ProtectedRoute component={Vehicles} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function HeaderContent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg border-b border-border" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
      <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center justify-between">
        <img
          src={theme === 'dark' ? LOGO_DARK : LOGO_LIGHT}
          alt="My Car Rent"
          className="h-9 w-auto"
        />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>
    </header>
  );
}

function AppContentInner() {
  const { loading: dataLoading } = useData();
  const { isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Router />;
  }

  if (dataLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header — clean with subtle shadow */}
      <HeaderContent />

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-28">
        <Router />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

function AppContent() {
  return <AppContentInner />;
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" switchable={true}>
      <ErrorBoundary>
        <TooltipProvider>
          <DataProvider>
            <AppContent />
            <Toaster
              position="top-center"
              toastOptions={{
                className: "!rounded-xl !shadow-md !border !border-orange-100",
              }}
            />
          </DataProvider>
        </TooltipProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
