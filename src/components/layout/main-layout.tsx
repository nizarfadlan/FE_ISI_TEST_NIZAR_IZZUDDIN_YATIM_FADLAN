import Link from "next/link";
import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Logo
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/users">Users</NavLink>
                <NavLink href="/todos">Todos</NavLink>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="mt-auto bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2024 Next.js Tailwind UI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200"
    >
      {children}
    </Link>
  );
}
