
import React from 'react';

export interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
    isActive?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-4 px-4 md:px-8 pt-4 animate-[fade-in-up_0.2s_ease-out]">
            <ol className="flex items-center space-x-2">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    
                    return (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <li className="text-gray-400 select-none">
                                    <span className="material-symbols-outlined text-[16px] align-middle">chevron_right</span>
                                </li>
                            )}
                            <li>
                                <button
                                    onClick={item.onClick}
                                    disabled={!item.onClick || isLast}
                                    className={`
                                        flex items-center transition-colors
                                        ${isLast 
                                            ? 'text-primary font-bold cursor-default pointer-events-none' 
                                            : 'text-gray-500 hover:text-primary cursor-pointer'
                                        }
                                    `}
                                >
                                    {/* Optional: Add specific icons for root 'Home' if desired */}
                                    {index === 0 && item.label === 'Home' && (
                                        <span className="material-symbols-outlined text-[18px] mr-1">home</span>
                                    )}
                                    {item.label}
                                </button>
                            </li>
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
