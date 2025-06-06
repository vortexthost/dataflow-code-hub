
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-background border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">DataMigrate Pro</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">Início</a>
            <a href="/demo" className="text-muted-foreground hover:text-primary transition-colors">Demo</a>
            <a href="/modelos" className="text-muted-foreground hover:text-primary transition-colors">Modelos</a>
            <a href="/admin" className="text-muted-foreground hover:text-primary transition-colors">Admin</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
