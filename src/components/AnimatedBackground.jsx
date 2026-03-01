import React, { useEffect, useState, useMemo } from 'react';

const AnimatedBackground = ({ theme }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Normalize mouse position to range [-1, 1]
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Generate random stable positions and parameters for the icons
    const iconsOptions = useMemo(() => {
        const options = [];
        const numIcons = 15; // Number of floating icons

        // Use the icons array from the theme, or fallback to the single icon if not available
        const themeIcons = theme.icons || (theme.icon ? [theme.icon] : []);

        if (themeIcons.length === 0) return options;

        for (let i = 0; i < numIcons; i++) {
            const RandomIcon = themeIcons[i % themeIcons.length];
            options.push({
                IconComponent: RandomIcon,
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                size: Math.random() * 40 + 30, // Size between 30 and 70
                opacity: Math.random() * 0.15 + 0.05, // Opacity between 0.05 and 0.20
                rotate: Math.random() * 360,
                // Parallax multiplier (depth effect)
                depth: Math.random() * 20 + 10,
                // Subtle continual rotation direction
                spinDuration: Math.random() * 30 + 30 // 30s to 60s
            });
        }
        return options;
    }, [theme]);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0, // Should be behind everything
                background: theme.gradient || 'var(--bg-color)'
            }}
        >
            {/* Base pattern overlay if provided by the theme */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: theme.backgroundImage && theme.backgroundImage !== 'none' ? `url(${theme.backgroundImage})` : theme.pattern,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.1,
                pointerEvents: 'none',
                filter: 'grayscale(20%) contrast(120%)'
            }} />

            {/* Floating Icons */}
            {iconsOptions.map((opt) => (
                <div
                    key={opt.id}
                    style={{
                        position: 'absolute',
                        left: opt.left,
                        top: opt.top,
                        opacity: opt.opacity,
                        color: theme.primary,
                        transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth snap
                        transform: `
                            translate(
                                ${mousePosition.x * opt.depth}px, 
                                ${mousePosition.y * opt.depth}px
                            ) 
                            rotate(${opt.rotate}deg)
                        `,
                        animation: `continuousRotate ${opt.spinDuration}s linear infinite`
                    }}
                >
                    <opt.IconComponent size={opt.size} strokeWidth={1.5} />
                </div>
            ))}

            {/* Global style for continuous rotation (could also go in a CSS file) */}
            <style>{`
                @keyframes continuousRotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AnimatedBackground;
