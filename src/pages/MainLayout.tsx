import React from "react";
import { NavBar } from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario } = useAuth() as { usuario: any };

  if (!usuario) {
    // Público: solo centrado
    return (
      <div className="">
        <div className="">{children}</div>
      </div>
    );
  }

  // Privado: sidebar + contenido, envuelto en SidebarProvider
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-row">
        <NavBar />
        <main className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
