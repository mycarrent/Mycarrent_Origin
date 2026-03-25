import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";

const LOGO_LIGHT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452232695/Geqw5Dwwk2pA5LmRx3Tkji/1718725111378__1_-removebg(1)_20260319_113407_0000_3211d834.webp";
const LOGO_DARK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452232695/Geqw5Dwwk2pA5LmRx3Tkji/1718725111378__w_-removebg(1)_20260323_184415_0000_8da86558.webp";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      setLocation("/");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {/* Logo Section */}
      <div className="mb-12 text-center">
        <img
          src={LOGO_LIGHT}
          alt="My Car Rent"
          className="h-24 w-auto mx-auto mb-6 block dark:hidden"
        />
        <img
          src={LOGO_DARK}
          alt="My Car Rent"
          className="h-24 w-auto mx-auto mb-6 hidden dark:block"
        />
        <h1 className="text-3xl font-bold text-foreground mb-2">My Car Rent</h1>
        <p className="text-muted-foreground text-lg">Track your car expenses with ease</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-lg p-8 border border-border">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Google OAuth Button */}
        <a href={getLoginUrl()}>
          <Button
            className="w-full h-12 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
            size="lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </Button>
        </a>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Alternative Login Methods (Placeholder) */}
        <Button
          variant="outline"
          className="w-full h-12 text-base font-semibold rounded-lg border border-border hover:bg-muted transition-all duration-200"
          disabled
        >
          Email (Coming Soon)
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-muted-foreground max-w-sm">
        <p>
          By signing in, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
