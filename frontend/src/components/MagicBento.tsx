import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import { 
  CheckCircle, 
  Pending, 
  Star, 
  EmojiEvents, 
  Assignment, 
  Upload,
  Add,
  TrendingUp,
  School,
  Group
} from '@mui/icons-material';
import './MagicBento.css';

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  icon?: React.ReactNode;
  value?: string | number;
  gradient?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export interface MagicBentoProps {
  data: BentoCardProps[];
  enableParticles?: boolean;
  enableGlow?: boolean;
  enableTilt?: boolean;
  glowColor?: string;
  onCardClick?: (card: BentoCardProps) => void;
  title?: string;
}

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  enableParticles?: boolean;
  enableTilt?: boolean;
  glowColor?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({
  children,
  className = '',
  enableParticles = true,
  enableTilt = true,
  glowColor = '132, 0, 255',
  onClick,
  style
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const particleIdRef = useRef(0);

  const createParticle = useCallback((x: number, y: number) => {
    const id = particleIdRef.current++;
    return {
      id,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      delay: Math.random() * 0.5
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (enableParticles && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const newParticles = Array.from({ length: 8 }, () => 
        createParticle(
          Math.random() * rect.width,
          Math.random() * rect.height
        )
      );
      setParticles(newParticles);
    }
  }, [enableParticles, createParticle]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setParticles([]);
    
    // Reset card transform
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableTilt || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }
  }, [enableTilt]);

  return (
    <div
      ref={cardRef}
      className={`magic-bento-card ${className} ${isHovered ? 'hovered' : ''}`}
      style={{
        ...style,
        '--glow-color': glowColor,
        cursor: onClick ? 'pointer' : 'default'
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {enableParticles && particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
      {children}
    </div>
  );
};

const MagicBento: React.FC<MagicBentoProps> = ({
  data,
  enableParticles = true,
  enableGlow = true,
  enableTilt = true,
  glowColor = '25, 118, 210',
  onCardClick,
  title = 'Dashboard'
}) => {
  const theme = useTheme();
  
  console.log('MagicBento component rendering with data:', data);

  const getCardSize = (size?: string) => {
    switch (size) {
      case 'small':
        return { gridColumn: 'span 1', gridRow: 'span 1' };
      case 'large':
        return { gridColumn: 'span 2', gridRow: 'span 2' };
      default:
        return { gridColumn: 'span 1', gridRow: 'span 1' };
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        padding: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Magic Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(${glowColor}, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontWeight: 700,
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #fff, #e3f2fd)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 3,
            maxWidth: '1400px',
            margin: '0 auto'
          }}
        >
          {data.map((card, index) => (
            <ParticleCard
              key={index}
              enableParticles={enableParticles}
              enableTilt={enableTilt}
              glowColor={glowColor}
              onClick={() => onCardClick?.(card)}
              style={{
                ...getCardSize(card.size),
                background: card.gradient || `linear-gradient(135deg, ${card.color || '#1976d2'} 0%, ${card.color || '#1976d2'}dd 100%)`,
                border: `1px solid rgba(${glowColor}, 0.3)`,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    {card.label}
                  </Typography>
                  {card.icon && (
                    <Box
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                      }}
                    >
                      {card.icon}
                    </Box>
                  )}
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {card.value && (
                    <Typography
                      variant="h2"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        mb: 1,
                        fontSize: { xs: '2rem', md: '3rem' }
                      }}
                    >
                      {card.value}
                    </Typography>
                  )}
                  
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {card.title}
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.6
                    }}
                  >
                    {card.description}
                  </Typography>
                </Box>
              </CardContent>
            </ParticleCard>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MagicBento;
