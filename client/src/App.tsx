/**
 * App.tsx — Root component with routing, providers, and layout
 * Design: Clean Light Mode — orange & white, soft shadows
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DataProvider, useData } from "./contexts/DataContext";
import BottomNav from "./components/BottomNav";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Vehicles from "./pages/Vehicles";
import Settings from "./pages/Settings";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452232695/Geqw5Dwwk2pA5LmRx3Tkji/my-car-rent-logo_efb7efea.webp";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/add" component={AddEntry} />
      <Route path="/history" component={History} />
      <Route path="/reports" component={Reports} />
      <Route path="/vehicles" component={Vehicles} />
      <Route path="/settings" component={Settings} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { loading } = useData();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header — clean with subtle shadow */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
        <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center">
          <img
            src={LOGO_URL}
            alt="My Car Rent"
            className="h-9 w-auto"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-28">
        <Router />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
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
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
