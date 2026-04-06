import { SignedIn, SignedOut, SignIn, UserButton, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard.js';
import { setGetToken } from './utils/api.js';

function AuthInit() {
  const { getToken } = useAuth();

  useEffect(() => {
    setGetToken(() => getToken());
  }, [getToken]);

  return null;
}

export default function App() {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900">CallFirst</h1>
              <p className="text-slate-500 text-sm">Sign in to your dashboard</p>
            </div>
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-sm border border-slate-200 rounded-xl',
                },
              }}
            />
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <AuthInit />
        <div className="fixed top-2.5 right-14 z-20">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        </div>
        <Dashboard />
      </SignedIn>
    </>
  );
}
