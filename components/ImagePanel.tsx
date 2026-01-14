
import React from 'react';

interface ImagePanelProps {
  title: string;
  subtitle: string;
}

const ImagePanel: React.FC<ImagePanelProps> = ({ title, subtitle }) => {
  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuALIhoMq7jrCC11GuUIer1GD9-GsdpiYk3xqRbYMk5LMnFtZcolrLZ1-WXDps-pC8Nv_JzBbkWu0pEyrDQA4Zh5RQKpj4aFabFkMa3eXaXa3a9AEJ43N2r3Skn5IewnxBNvrY-3Zryq8lQrwCQUXc5qtg9UBG8oFhB-bA1X0ey64qtrVayw66pEhb7iA6zjLbgvw-VFX1ExfWjoI0xGLh3lDwJpVi2h5PGSA433fY94ebmFtAtASimbUpcSb2CVh41ho0ESFLGjfw";

  return (
    <div className="hidden md:flex md:w-1/2 lg:w-7/12 relative bg-primary overflow-hidden group/image-panel">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover/image-panel:scale-105"
        style={{ backgroundImage: `url("${imageUrl}")` }}
        aria-label="Abstract blue ocean waves pattern"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex flex-col justify-end p-12 lg:p-20">
        <div 
          className="max-w-lg space-y-4 translate-y-4 opacity-0" 
          style={{ animation: 'fade-in-up 0.8s ease-out forwards' }}
        >
          <div className="flex items-center gap-2 text-white mb-2">
            <span className="material-symbols-outlined text-[32px]">sailing</span>
            <span className="text-xl font-bold tracking-wider opacity-90">JMS</span>
          </div>
          <h2 className="text-white text-4xl lg:text-5xl font-bold leading-tight">{title}</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImagePanel;
