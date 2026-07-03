"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 surface-panel hover:shadow-xl transition-all px-4 py-3 rounded-2xl mb-8"
    >
      <ArrowLeft size={18} />

      <span>Voltar</span>
    </button>
  );
}