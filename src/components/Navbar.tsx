import { Link } from "react-router";
import { NeoButton } from "./NeoComponents";
import { useAuth } from "@/hooks/use-auth";
import { User } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="border-b-4 border-black bg-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">
          Deepfake<span className="text-primary">Hunters</span>
        </Link>
        
        <div className="flex gap-4 items-center">
          <Link to="/dashboard">
            <NeoButton variant="ghost" className="hidden md:flex">Dashboard</NeoButton>
          </Link>
          
          {isAuthenticated ? (
            <Link to={`/profile/${user?._id}`}>
              <NeoButton variant="outline" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </NeoButton>
            </Link>
          ) : (
            <Link to="/auth">
              <NeoButton>Login</NeoButton>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
