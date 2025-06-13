import React from "react";
import { NavBar } from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario } = useAuth() as { usuario: any };

  if (!usuario) {
    // Público: solo centrado
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    );
  }

  // Privado: sidebar + contenido, envuelto en SidebarProvider
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-row bg-gray-50">
        <NavBar />
        <main className="flex-1 flex items-center justify-center h-screen">
          <div className="w-full max-w-2xl">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
