import Link from "next/link";

// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-white border-t text-gray-600 py-4 text-center">
      <div className="max-w-7xl mx-auto px-4">
        © {new Date().getFullYear()}
        <Link 
          href={"https://dasamarpreet.github.io/apdas/"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        > PromptAce.
        </Link> All rights reserved.
      </div>
    </footer>
  );
}
