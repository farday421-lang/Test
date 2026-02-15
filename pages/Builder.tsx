import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/db';
import { gemini } from '../services/geminiService';
import { Portfolio, Project } from '../types';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Plus, Trash2, Wand2, Eye, Save, Share2, Upload, Layout, UserCircle, Briefcase } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'design', label: 'Design', icon: Layout },
];

export const Builder: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Portfolio State
  const [portfolio, setPortfolio] = useState<Portfolio>({
    userId: '',
    displayName: '',
    title: '',
    bio: '',
    skills: [],
    projects: [],
    theme: 'modern',
    socialLinks: {},
    isPublished: false
  });

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        const data = await db.getPortfolio(user.id);
        if (data) setPortfolio(data);
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await db.savePortfolio(user.id, portfolio);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const newStatus = !portfolio.isPublished;
      await db.savePortfolio(user.id, { ...portfolio, isPublished: newStatus });
      setPortfolio(prev => ({ ...prev, isPublished: newStatus }));
    } finally {
      setSaving(false);
    }
  };

  const handleAiBio = async () => {
    setAiLoading(true);
    const bio = await gemini.generateBio(portfolio.displayName, portfolio.skills);
    setPortfolio(prev => ({ ...prev, bio }));
    setAiLoading(false);
  };

  const handleAiProjectDesc = async (index: number) => {
    const project = portfolio.projects[index];
    if (!project.description) return;
    
    // Create a local loading state for specific project if needed, using global for simplicity
    setAiLoading(true);
    const enhanced = await gemini.enhanceDescription(project.description);
    
    const newProjects = [...portfolio.projects];
    newProjects[index] = { ...project, description: enhanced };
    setPortfolio(prev => ({ ...prev, projects: newProjects }));
    setAiLoading(false);
  };

  const addProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Project',
      description: '',
      imageUrl: '',
      tags: []
    };
    setPortfolio(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const newProjects = [...portfolio.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setPortfolio(prev => ({ ...prev, projects: newProjects }));
  };

  const removeProject = (index: number) => {
    const newProjects = portfolio.projects.filter((_, i) => i !== index);
    setPortfolio(prev => ({ ...prev, projects: newProjects }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProject(index, 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-500">Loading editor...</div>;

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-20 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-6 z-20">
        <div className="mb-8 p-2 bg-primary-100 text-primary-600 rounded-lg">
          <Layout className="w-6 h-6" />
        </div>
        <nav className="flex-1 flex flex-col gap-4 w-full px-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1
                ${activeTab === tab.id 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-4 w-full px-2">
           <button 
             onClick={handleSave}
             disabled={saving}
             className="p-3 text-slate-500 hover:text-primary-600 rounded-xl hover:bg-slate-50 transition-colors"
             title="Save"
           >
             <Save className={`w-6 h-6 ${saving ? 'animate-pulse' : ''}`} />
           </button>
        </div>
      </aside>

      {/* Main Editor Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {TABS.find(t => t.id === activeTab)?.label} Settings
          </h1>
          <div className="flex gap-3">
            {portfolio.isPublished && user && (
              <a 
                href={`/#/p/${user.username}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-primary-600 hover:underline px-3 py-2"
              >
                <Eye className="w-4 h-4" /> View Live
              </a>
            )}
            <Button 
              variant={portfolio.isPublished ? "outline" : "primary"}
              onClick={handlePublish}
              isLoading={saving}
              size="sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {portfolio.isPublished ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-3xl mx-auto space-y-8 pb-20">
            
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-medium mb-4 text-slate-900 dark:text-white">Personal Details</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input 
                      label="Display Name" 
                      value={portfolio.displayName} 
                      onChange={e => setPortfolio({...portfolio, displayName: e.target.value})} 
                    />
                    <Input 
                      label="Professional Title" 
                      value={portfolio.title} 
                      placeholder="e.g. Senior Frontend Engineer"
                      onChange={e => setPortfolio({...portfolio, title: e.target.value})} 
                    />
                  </div>
                </section>

                <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white">Bio & Skills</h2>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleAiBio}
                      isLoading={aiLoading}
                      className="text-purple-600 hover:bg-purple-50"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate with AI
                    </Button>
                  </div>
                  <TextArea 
                    label="About Me" 
                    rows={4}
                    value={portfolio.bio}
                    onChange={e => setPortfolio({...portfolio, bio: e.target.value})}
                    placeholder="Tell your story..."
                  />
                  <div className="mt-4">
                    <Input 
                      label="Skills (comma separated)" 
                      value={portfolio.skills.join(', ')}
                      onChange={e => setPortfolio({...portfolio, skills: e.target.value.split(',').map(s => s.trim())})}
                      placeholder="React, TypeScript, UI Design"
                    />
                  </div>
                </section>

                <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                   <h2 className="text-lg font-medium mb-4 text-slate-900 dark:text-white">Social Links</h2>
                   <div className="grid gap-4">
                     <Input 
                        label="GitHub URL" 
                        value={portfolio.socialLinks.github || ''}
                        onChange={e => setPortfolio({...portfolio, socialLinks: {...portfolio.socialLinks, github: e.target.value}})}
                        placeholder="https://github.com/..."
                     />
                     <Input 
                        label="LinkedIn URL" 
                        value={portfolio.socialLinks.linkedin || ''}
                        onChange={e => setPortfolio({...portfolio, socialLinks: {...portfolio.socialLinks, linkedin: e.target.value}})}
                        placeholder="https://linkedin.com/in/..."
                     />
                   </div>
                </section>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Projects</h2>
                  <Button onClick={addProject} size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Project
                  </Button>
                </div>

                {portfolio.projects.map((project, index) => (
                  <div key={project.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative group">
                    <button 
                      onClick={() => removeProject(index)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input 
                          label="Project Title"
                          value={project.title}
                          onChange={(e) => updateProject(index, 'title', e.target.value)}
                        />
                         <div>
                           <div className="flex justify-between mb-1">
                             <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                             <button 
                               onClick={() => handleAiProjectDesc(index)}
                               className="text-xs flex items-center text-purple-600 hover:text-purple-700"
                             >
                               <Wand2 className="w-3 h-3 mr-1" /> Enhance
                             </button>
                           </div>
                           <TextArea 
                            rows={3}
                            value={project.description}
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                          />
                        </div>
                        <Input 
                          label="Tags (comma separated)"
                          value={project.tags.join(', ')}
                          onChange={(e) => updateProject(index, 'tags', e.target.value.split(',').map(s => s.trim()))}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Project Image</label>
                        <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 transition-colors relative">
                          {project.imageUrl ? (
                            <img src={project.imageUrl} alt="Project" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                               <Upload className="w-8 h-8 mb-2" />
                               <span className="text-sm">Upload Image</span>
                            </div>
                          )}
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {portfolio.projects.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <p>No projects yet. Click "Add Project" to showcase your work.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'design' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {[
                  { id: 'minimal', name: 'Minimalist', desc: 'Clean, typography-focused layout.' },
                  { id: 'modern', name: 'Modern', desc: 'Bold headers and colorful accents.' },
                  { id: 'creative', name: 'Creative', desc: 'Unique grid layouts for visual impact.' },
                ].map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setPortfolio({...portfolio, theme: theme.id as any})}
                    className={`text-left p-6 rounded-2xl border-2 transition-all
                      ${portfolio.theme === theme.id 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'}`}
                  >
                    <div className="h-24 bg-slate-100 dark:bg-slate-900 rounded-lg mb-4"></div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{theme.name}</h3>
                    <p className="text-sm text-slate-500">{theme.desc}</p>
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};