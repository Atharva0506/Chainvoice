import React, { useState, useEffect } from 'react';

export default function PRDemoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show the modal in the PR Preview environment
    if (import.meta.env.VITE_IS_PR_PREVIEW === 'true') {
      const hasSeenModal = sessionStorage.getItem('hasSeenPRDemoModal');
      if (!hasSeenModal) {
        setIsOpen(true);
      }
    }
  }, []);

  const closeModal = () => {
    sessionStorage.setItem('hasSeenPRDemoModal', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e2330] border border-green-500/30 rounded-2xl p-8 max-w-xl w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <svg className="w-24 h-24 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-green-500">✨</span> PR Preview Environment
        </h2>
        
        <div className="text-green-400 font-semibold mb-6 text-sm uppercase tracking-wider">
          Live Testing & Demo Mode
        </div>

        <div className="space-y-4 text-gray-300">
          <p>
            Welcome to the automated <strong>Pull Request Preview Environment</strong> for Chainvoice!
          </p>
          <div className="bg-black/30 p-4 rounded-xl border border-gray-700/50">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              What is happening right now?
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>An ephemeral <strong>Anvil Blockchain</strong> has been spun up in the cloud.</li>
              <li>The smart contracts from <em>this specific PR</em> were automatically compiled and deployed.</li>
              <li>A secure <strong>Cloudflare Tunnel</strong> is securely hosting this frontend instance.</li>
            </ul>
          </div>
          <p className="text-sm italic text-gray-400">
            Feel free to connect your wallet and test the full-stack dApp safely without touching the production network!
          </p>
        </div>

        <button 
          onClick={closeModal}
          className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg shadow-green-500/20"
        >
          Got it, let's test!
        </button>
      </div>
    </div>
  );
}
