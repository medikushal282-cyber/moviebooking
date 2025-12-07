import { useState } from "react";
import { Mail, Phone, Chrome } from "lucide-react";

export function AuthCard() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "mobile">("email");

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${isSignUp ? "Sign up" : "Login"} with ${authMethod}`);
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      {/* Glassmorphic Card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-white/80 text-sm">
            {isSignUp
              ? "Sign up to get started"
              : "Sign in to continue"}
          </p>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setAuthMethod("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
              authMethod === "email"
                ? "bg-white/20 text-white shadow-lg"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <Mail size={18} />
            <span className="text-sm">Email</span>
          </button>
          <button
            onClick={() => setAuthMethod("mobile")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
              authMethod === "mobile"
                ? "bg-white/20 text-white shadow-lg"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <Phone size={18} />
            <span className="text-sm">Mobile</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-white/90 text-sm mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="identifier"
              className="block text-white/90 text-sm mb-2"
            >
              {authMethod === "email" ? "Email Address" : "Mobile Number"}
            </label>
            <input
              id="identifier"
              type={authMethod === "email" ? "email" : "tel"}
              placeholder={
                authMethod === "email"
                  ? "you@example.com"
                  : "+1 (555) 123-4567"
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent backdrop-blur-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white/90 text-sm mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent backdrop-blur-sm"
            />
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-white/90 text-sm mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          )}

          {!isSignUp && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 rounded bg-white/10 border-white/20"
                />
                Remember me
              </label>
              <a href="#" className="text-white/90 hover:text-white">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-white text-purple-600 rounded-xl hover:bg-white/90 transition-all shadow-lg"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-white/60">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
        >
          <Chrome size={20} />
          <span>Continue with Google</span>
        </button>

        {/* Toggle Sign Up/Login */}
        <div className="mt-6 text-center text-sm text-white/80">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
