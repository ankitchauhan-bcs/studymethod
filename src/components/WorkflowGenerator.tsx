import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Lightbulb, Zap, Rocket, Loader2, ArrowRight } from 'lucide-react';
import { generateMasteryWorkflow, WorkflowPlan } from '../lib/gemini';

export default function WorkflowGenerator() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowPlan | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setWorkflow(null);

    try {
      const result = await generateMasteryWorkflow(topic);
      setWorkflow(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate workflow. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans flex flex-col max-w-[1200px] mx-auto">
      <div className="w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16"
        >
          <div className="space-y-1 mb-8 md:mb-0">
            <p className="text-[10px] tracking-[0.3em] text-[#71717A] uppercase font-bold">Academic Framework v2.4</p>
            <h1 className="text-5xl md:text-6xl font-light tracking-tighter text-white">
              The Ultimate <span className="italic font-serif text-[#D4D4D8]">Mastery</span> Workflow
            </h1>
          </div>
          <div className="w-full md:w-auto flex flex-col items-end gap-6">
            <div className="text-right hidden md:block">
              <p className="text-[10px] tracking-widest text-[#71717A] uppercase">Cycle Progression</p>
              <div className="flex gap-1 mt-2 justify-end">
                <div className="w-8 h-1 bg-[#A1A1AA]"></div>
                <div className={`w-8 h-1 ${workflow ? 'bg-[#A1A1AA]' : 'bg-[#3F3F46]'}`}></div>
                <div className={`w-8 h-1 ${workflow ? 'bg-[#A1A1AA]' : 'bg-[#3F3F46]'}`}></div>
                <div className={`w-8 h-1 ${workflow ? 'bg-[#A1A1AA]' : 'bg-[#3F3F46]'}`}></div>
              </div>
            </div>
            
            <form onSubmit={handleGenerate} className="relative group w-full md:w-[400px]">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to master?"
                className="w-full text-sm px-4 py-4 pr-16 bg-[#0A0A0B] text-[#E4E4E7] border-b-2 border-[#27272A] focus:border-[#F4F4F5] rounded-none outline-none transition-all duration-300 placeholder:text-[#52525B]"
                disabled={loading}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="absolute right-0 top-3 p-2 text-[#F4F4F5] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </form>
            {error && <p className="text-red-500 mt-2 text-[10px] font-medium">{error}</p>}
          </div>
        </motion.div>

        <AnimatePresence>
          {!workflow && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-20 border border-[#27272A] p-12 text-center text-[#A1A1AA] flex flex-col items-center gap-4 max-w-2xl mx-auto"
            >
              <Lightbulb className="w-8 h-8 text-[#52525B]" />
              <p className="text-sm">Enter a topic above to generate a definitive 4-step mastery cycle.</p>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="relative">
                <div className="w-16 h-16 border-2 border-gray-200 rounded-full"></div>
                <div className="w-16 h-16 border-2 border-black rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
            </motion.div>
          )}

          {workflow && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="relative"
            >
              <div className="absolute left-8 top-8 bottom-8 w-px bg-[#27272A] hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                 <StepCard 
                  number="01" 
                  title="Learn Theory" 
                  subtitle="Gather Your Materials"
                  icon={<BookOpen className="w-4 h-4" />}
                  variants={itemVariants}
                >
                  <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">{workflow.theory.overview}</p>
                  <div className="mt-auto">
                    <h4 className="text-[10px] text-[#71717A] uppercase mb-3 block">Recommended Materials</h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {workflow.theory.recommendedMaterials.map((item, idx) => (
                        <li key={idx} className="flex items-start text-[#E4E4E7] bg-[#18181B] p-3 border-l-2 border-[#52525B] text-sm">
                          <span className="text-[#52525B] font-bold mr-3 mt-0.5 opacity-50">•</span>
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </StepCard>

                <StepCard 
                  number="02" 
                  title="Understand Basics & Concepts" 
                  subtitle="The Golden Questions"
                  icon={<Lightbulb className="w-4 h-4" />}
                  variants={itemVariants}
                >
                  <div className="space-y-4 h-full flex flex-col justify-center">
                    <div className="bg-[#18181B] p-5 border-l-2 border-[#A1A1AA]">
                      <h4 className="text-[10px] text-[#71717A] uppercase mb-2">Definition & Identity</h4>
                      <h5 className="font-serif italic text-lg text-[#F4F4F5] mb-2 font-medium">What is it?</h5>
                      <p className="text-[#A1A1AA] text-sm leading-relaxed">{workflow.basics.definitionAndIdentity}</p>
                    </div>
                    <div className="bg-[#18181B] p-5 border-l-2 border-[#52525B]">
                      <h4 className="text-[10px] text-[#71717A] uppercase mb-2">Utility & Potential</h4>
                      <h5 className="font-serif italic text-lg text-[#F4F4F5] mb-2 font-medium">What can it do?</h5>
                      <p className="text-[#A1A1AA] text-sm leading-relaxed">{workflow.basics.utilityAndPotential}</p>
                    </div>
                  </div>
                </StepCard>

                <StepCard 
                  number="03" 
                  title="Apply Immediately" 
                  subtitle="Bridge Knowing and Doing"
                  icon={<Zap className="w-4 h-4" />}
                  variants={itemVariants}
                >
                  <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6 flex-1">
                    Knowledge has a "half-life." If you don't use it, you lose it. Bridge the gap between knowing and doing immediately.
                  </p>
                  
                  <div className="bg-[#18181B] border border-[#27272A] p-5">
                    <h4 className="font-medium text-[#F4F4F5] mb-2">{workflow.apply.immediateTaskTitle}</h4>
                    <p className="text-[#A1A1AA] text-sm leading-relaxed">
                      {workflow.apply.immediateTaskDescription}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-6 justify-between border-t border-[#27272A] pt-4">
                     <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-[#F4F4F5] text-[#0A0A0B] text-[10px] font-bold uppercase tracking-tighter">Active Recall</div>
                        <div className="px-3 py-1 border border-[#3F3F46] text-[#A1A1AA] text-[10px] font-bold uppercase tracking-tighter">Short-term Loop</div>
                     </div>
                  </div>
                </StepCard>

                <StepCard 
                  number="04" 
                  title="Perform Practical" 
                  subtitle="Build From Scratch"
                  icon={
                    <div className="w-12 h-12 rounded-full border border-[#0A0A0B] flex items-center justify-center">
                      <Rocket className="w-5 h-5 ml-0.5" />
                    </div>
                  }
                  variants={itemVariants}
                  highlighted={true}
                >
                  <p className="text-[#3F3F46] text-sm leading-relaxed font-medium mb-6">
                    The magic happens here. Put away the guide and build from scratch. Trial and error is the best teacher you will ever have.
                  </p>

                  <div className="mb-6 pb-6 border-b border-[#D4D4D8]">
                    <h4 className="text-xl font-bold uppercase tracking-tight mb-2 text-[#0A0A0B]">{workflow.practical.projectTitle}</h4>
                    <p className="text-[#3F3F46] text-sm font-medium">{workflow.practical.projectDescription}</p>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-4">Execution Steps</h4>
                    <div className="space-y-4">
                      {workflow.practical.executionSteps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 group">
                          <div className="font-mono text-xs font-bold text-[#0A0A0B] mt-0.5">
                            {String(idx + 1).padStart(2, '0')}.
                          </div>
                          <p className="text-[#3F3F46] text-sm font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </StepCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-16 pt-8 border-t border-[#18181B] flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] text-[#52525B] uppercase tracking-[0.2em] gap-4">
          <div>Optimized for Cognitive Retention</div>
          <div className="flex flex-wrap gap-4 md:gap-8">
            <span>No Documentation Required</span>
            <span>Practical First Approach</span>
            <span>© 2024 Mastery Protocol</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StepCard({ number, title, subtitle, icon, children, variants, highlighted = false }: { number: string, title: string, subtitle: string, icon: React.ReactNode, children: React.ReactNode, variants: any, highlighted?: boolean }) {
  if (highlighted) {
    return (
      <motion.div variants={variants} className="bg-[#F4F4F5] text-[#0A0A0B] p-8 relative flex flex-col group">
        <span className="absolute top-6 right-8 font-mono text-xs opacity-40 uppercase">{number} // {subtitle}</span>
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-[#0A0A0B] flex items-center gap-3">
          {title}
        </h2>
        <div className="flex-1 flex flex-col pt-2">
          {children}
        </div>
        <div className="absolute bottom-8 right-8 text-[#0A0A0B] opacity-50 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={variants} className="border border-[#27272A] p-8 relative flex flex-col group hover:border-[#3F3F46] transition-colors">
      <span className="absolute top-6 right-8 font-mono text-xs text-[#52525B] uppercase hidden md:block">{number} // {subtitle}</span>
      <h2 className="text-2xl font-medium mb-6 text-[#F4F4F5] flex items-center gap-3">
        <span className="text-[#A1A1AA] md:hidden">{number}.</span>
        {title}
      </h2>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <div className="absolute bottom-8 right-8 text-[#52525B] opacity-50 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
    </motion.div>
  );
}
