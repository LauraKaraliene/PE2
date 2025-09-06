import Toaster from "../components/ui/Toaster";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
