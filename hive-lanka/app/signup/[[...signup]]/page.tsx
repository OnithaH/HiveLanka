import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Join Hive Lanka Today</h1>
        <p className="auth-subtitle">Start buying or selling Sri Lankan handicrafts</p>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl",
            }
          }}
          forceRedirectUrl="/onboarding"
          signInUrl="/signin"
        />
      </div>
    </div>
  );
}