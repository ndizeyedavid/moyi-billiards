"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ContactMoyiPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/contact");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h2>
        <p className="text-gray-600">Taking you to the contact page</p>
      </div>
    </div>
  );
}
