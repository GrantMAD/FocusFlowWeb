'use client';

import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function VerifyEmailPage() {
  const supabase = createClient();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-purple-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
          <p className="text-gray-500">
            We've sent a verification link to your email address. 
            Please click the link to confirm your account.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <p className="text-sm text-gray-400">
            Once verified, refresh this page or sign in again.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              I've verified my email
            </button>
            
            <button
              onClick={() => supabase.auth.signOut().then(() => window.location.href = '/sign-in')}
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
