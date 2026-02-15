import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sparkles, Layers, Rocket, Code2 } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
             <Code2 className="text-white w-5 h-5" />
          </div>
          FolioCraft AI
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          <Button onClick={() => navigate('/signup')}>Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Portfolio Builder
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Build your portfolio <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">in minutes, not days.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Create a stunning, professional developer portfolio with the help of AI. 
            Write better bios, enhance project descriptions, and publish with one click.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => navigate('/signup')} className="w-full sm:w-auto">
              Start Building for Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/demo')} className="w-full sm:w-auto">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 dark:bg-slate-800 py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Writing Assistant</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Stuck on your bio? Let our AI write professional copy for you based on your skills and experience.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Modern Templates</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Choose from professionally designed templates that look great on any device automatically.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Instant Publish</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Get a unique public URL for your portfolio instantly. No complex deployment steps required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};