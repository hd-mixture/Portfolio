"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type PersonaType = 'developer' | 'designer';

interface PersonaContextType {
  persona: PersonaType;
  setPersona: (persona: PersonaType) => void;
  togglePersona: () => void;
  isInitialized: boolean;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<PersonaType>('developer');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check local storage for saved preference on mount
    const savedPersona = localStorage.getItem('portfolio-persona') as PersonaType;
    if (savedPersona === 'developer' || savedPersona === 'designer') {
      setPersonaState(savedPersona);
      if (savedPersona === 'designer') {
        document.body.classList.add('designer-mode');
      }
    }
    setIsInitialized(true);
  }, []);

  const setPersona = (newPersona: PersonaType) => {
    setPersonaState(newPersona);
    localStorage.setItem('portfolio-persona', newPersona);
    if (newPersona === 'designer') {
      document.body.classList.add('designer-mode');
    } else {
      document.body.classList.remove('designer-mode');
    }
  };

  const togglePersona = () => {
    setPersona(persona === 'developer' ? 'designer' : 'developer');
  };

  return (
    <PersonaContext.Provider value={{ persona, setPersona, togglePersona, isInitialized }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
