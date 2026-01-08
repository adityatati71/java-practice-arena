import { Code2, Play, Send, Settings, LogOut, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Timer } from './Timer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface IDEHeaderProps {
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  problemTitle?: string;
}

export function IDEHeader({ onRun, onSubmit, isRunning, problemTitle }: IDEHeaderProps) {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="h-14 bg-ide-header border-b border-ide-border flex items-center justify-between px-4">
      {/* Left - Logo & Problem Title */}
      <div className="flex items-center gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">JavaCode</span>
        </div>
        {problemTitle && (
          <>
            <div className="w-px h-6 bg-ide-border" />
            <span className="text-sm text-muted-foreground">{problemTitle}</span>
          </>
        )}
      </div>

      {/* Center - Timer */}
      <Timer initialSeconds={3600} />

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onRun}
          disabled={isRunning}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          Run
        </Button>
        
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={isRunning}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
          Submit
        </Button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled className="text-muted-foreground">
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
