import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <Link href="/" className="text-2xl font-bold text-gray-900">
        TaskFlow
      </Link>

      <nav className="flex items-center gap-5">
        <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
          Dashboard
        </Link>

        <Link
          href="/about"
          className="text-sm text-gray-600 hover:text-blue-600"
        >
          About
        </Link>
      </nav>
    </header>
  );
}
