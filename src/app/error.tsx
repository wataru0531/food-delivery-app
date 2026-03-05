
// エラーページ

'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
 
type ErrorPageProps = {
  error: Error & { digest?:string };
  reset: () => void;
}

export default function ErrorPage({ error, reset,}: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("error.tsxで受け取ったエラー", error);
  }, [error])

  return (
    <div className="p-4 min-h-screen bg-green-50 flex items-center justify-center ">
      <div className="p-8 space-y-6 w-full max-w-md text-center bg-white rounded-2xl shadow-xl">
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <AlertCircle className="w-10 h-10 text-green-600"/>
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800">操作中に問題が発生しました。</p>
        <p className="text-gray-600">ご注文の捜査中にエラーが発生しました。もう一度お試しいただけますか？</p>
        <p className="text-sm text-gray-400">{ error.message }</p>

        <button 
          className="px-5 py-2 5 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 md:cursor-pointer transition"
          onClick={ () => reset() }
        >再試行する</button>

      </div>
    </div>
  )
}