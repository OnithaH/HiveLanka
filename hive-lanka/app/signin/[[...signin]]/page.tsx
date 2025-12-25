import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Welcome Back to Hive Lanka</h1>
        <SignIn 
          appearance={{
            elements:  {
              rootBox: "mx-auto",
              card: "shadow-xl",
            }
          }}
          forceRedirectUrl="/"
          signUpUrl="/signup"
        />
      </div>
    </div>
  );
}