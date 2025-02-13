import { Fragment } from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <h1>Auth Layout</h1>
      <Fragment>{children}</Fragment>
    </div>
  );
}
