import { useNavigate } from 'react-router-dom';
import { Code2, Play, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ide-bg">
      <header className="border-b border-ide-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">JavaCode</span>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button onClick={() => navigate('/ide')}>Go to IDE</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
                <Button onClick={() => navigate('/signup')}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Master <span className="text-primary">Java</span> Programming
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Practice coding problems, improve your skills, and prepare for interviews with our professional IDE.
          </p>
          <Button size="lg" onClick={() => navigate(user ? '/ide' : '/signup')} className="gap-2">
            <Play className="h-5 w-5" /> Start Coding
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card p-6 rounded-lg border border-ide-border text-center">
            <Code2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Professional IDE</h3>
            <p className="text-muted-foreground">Full-featured code editor with Java syntax highlighting</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-ide-border text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">Monitor your improvement with detailed statistics</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-ide-border text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Community</h3>
            <p className="text-muted-foreground">Join thousands of developers practicing daily</p>
          </div>
        </div>
      </main>
    </div>
  );
}
