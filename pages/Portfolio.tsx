import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../services/db';
import { Portfolio, Project } from '../types';
import { Github, Linkedin, Twitter, Globe, Mail } from 'lucide-react';

const MinimalTheme: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => (
  <div className="max-w-4xl mx-auto px-6 py-12">
    <header className="mb-16">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">{portfolio.displayName}</h1>
      <p className="text-xl text-gray-600 mb-6">{portfolio.title}</p>
      <p className="text-gray-700 leading-relaxed max-w-2xl">{portfolio.bio}</p>
      
      <div className="flex gap-4 mt-6">
        {portfolio.socialLinks.github && (
          <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
            <Github className="w-6 h-6" />
          </a>
        )}
        {portfolio.socialLinks.linkedin && (
          <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
            <Linkedin className="w-6 h-6" />
          </a>
        )}
      </div>
    </header>

    <section className="mb-16">
      <h2 className="text-2xl font-semibold border-b pb-2 mb-8">Projects</h2>
      <div className="grid gap-12">
        {portfolio.projects.map(project => (
          <div key={project.id} className="group">
            <div className="aspect-video w-full bg-gray-100 mb-4 overflow-hidden rounded-lg">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const ModernTheme: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => (
  <div className="min-h-screen bg-slate-50">
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-xl tracking-tight">{portfolio.displayName}</span>
        <div className="flex gap-4">
           {portfolio.socialLinks.github && <a href={portfolio.socialLinks.github} className="text-slate-600 hover:text-primary-600"><Github className="w-5 h-5"/></a>}
           {portfolio.socialLinks.twitter && <a href={portfolio.socialLinks.twitter} className="text-slate-600 hover:text-primary-600"><Twitter className="w-5 h-5"/></a>}
        </div>
      </div>
    </div>

    <section className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block p-1 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full mb-6">
          <div className="bg-white rounded-full p-1">
             <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">
               {portfolio.displayName.charAt(0)}
             </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          {portfolio.title}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          {portfolio.bio}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {portfolio.skills.map(skill => (
            <span key={skill} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-10">Selected Work</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolio.projects.map(project => (
          <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-100">
             <div className="aspect-[4/3] bg-slate-200 overflow-hidden">
                {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />}
             </div>
             <div className="p-6">
               <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
               <p className="text-slate-600 text-sm mb-4 line-clamp-3">{project.description}</p>
               <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
               </div>
             </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export const PortfolioView: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!username) return;
      try {
        const data = await db.getPortfolioByUsername(username);
        setPortfolio(data);
      } catch (e) {
        setError('Could not load portfolio');
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, [username]);

  useEffect(() => {
    if (portfolio) {
      document.title = `${portfolio.displayName} | FolioCraft`;
    } else {
      document.title = 'FolioCraft AI';
    }
    return () => {
      document.title = 'FolioCraft AI';
    }
  }, [portfolio]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!portfolio) return <div className="h-screen flex items-center justify-center flex-col gap-4">
    <h1 className="text-2xl font-bold text-gray-800">Portfolio Not Found</h1>
    <p className="text-gray-500">This portfolio is either unpublished or does not exist.</p>
  </div>;

  return (
    <>
      {portfolio.theme === 'modern' ? (
        <ModernTheme portfolio={portfolio} />
      ) : (
        <MinimalTheme portfolio={portfolio} />
      )}
    </>
  );
};