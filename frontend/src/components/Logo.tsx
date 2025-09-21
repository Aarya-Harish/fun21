import React from 'react';
import { Box, Typography } from '@mui/material';
import { School, Group, MenuBook, Psychology, AutoStories, Star, Rocket, Lightbulb } from '@mui/icons-material';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'horizontal' | 'vertical';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true, 
  variant = 'horizontal' 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { icon: 24, text: 'h6' };
      case 'large':
        return { icon: 48, text: 'h3' };
      default:
        return { icon: 32, text: 'h5' };
    }
  };

  const { icon: iconSize, text: textVariant } = getSize();

  const logoContent = (
    <Box
      display="flex"
      alignItems="center"
      gap={1.5}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        borderRadius: 3,
        p: 2,
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px) scale(1.02)',
          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6), 0 0 0 1px rgba(255,255,255,0.2)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
          animation: 'shimmer 3s infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse 4s infinite',
        },
        '@keyframes shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.3, transform: 'translate(-50%, -50%) scale(0.8)' },
          '50%': { opacity: 0.6, transform: 'translate(-50%, -50%) scale(1.2)' },
        },
      }}
    >
      {/* Main Icon - Modern School with trending design */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <School 
          sx={{ 
            color: 'white', 
            fontSize: iconSize,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            animation: 'float 3s ease-in-out infinite',
          }} 
        />
        
        {/* Floating particles around the main icon */}
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: iconSize * 0.4,
            height: iconSize * 0.4,
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
            animation: 'orbit 4s linear infinite',
            zIndex: 1,
          }}
        >
          <Star 
            sx={{ 
              color: '#1976d2', 
              fontSize: iconSize * 0.2,
            }} 
          />
        </Box>
        
        <Box
          sx={{
            position: 'absolute',
            top: -6,
            left: -6,
            width: iconSize * 0.35,
            height: iconSize * 0.35,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255,255,255,0.3)',
            animation: 'orbit 3s linear infinite reverse',
            zIndex: 1,
          }}
        >
          <Lightbulb 
            sx={{ 
              color: '#ff6b35', 
              fontSize: iconSize * 0.18,
            }} 
          />
        </Box>
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -6,
            right: -6,
            width: iconSize * 0.4,
            height: iconSize * 0.4,
            background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
            animation: 'orbit 5s linear infinite',
            zIndex: 1,
          }}
        >
          <Rocket 
            sx={{ 
              color: 'white', 
              fontSize: iconSize * 0.18,
            }} 
          />
        </Box>
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -8,
            left: -8,
            width: iconSize * 0.35,
            height: iconSize * 0.35,
            background: 'linear-gradient(45deg, #e91e63, #f06292)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(233, 30, 99, 0.4)',
            animation: 'orbit 6s linear infinite reverse',
            zIndex: 1,
          }}
        >
          <Group 
            sx={{ 
              color: 'white', 
              fontSize: iconSize * 0.16,
            }} 
          />
        </Box>
      </Box>

      {showText && (
        <Box
          display="flex"
          flexDirection={variant === 'vertical' ? 'column' : 'row'}
          alignItems={variant === 'vertical' ? 'center' : 'flex-start'}
          gap={0.5}
          sx={{ zIndex: 2, position: 'relative' }}
        >
          <Typography
            variant={textVariant as any}
            sx={{
              background: 'linear-gradient(45deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              letterSpacing: '1px',
              fontSize: size === 'small' ? '1.1rem' : size === 'large' ? '1.8rem' : '1.4rem',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              textTransform: 'uppercase',
              animation: 'textGlow 2s ease-in-out infinite alternate',
            }}
          >
            Smart Student
          </Typography>
          <Typography
            variant={textVariant as any}
            sx={{
              background: 'linear-gradient(45deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '900',
              textShadow: '0 4px 8px rgba(255, 215, 0, 0.4)',
              letterSpacing: '2px',
              fontSize: size === 'small' ? '1.2rem' : size === 'large' ? '2rem' : '1.6rem',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              textTransform: 'uppercase',
              animation: 'textGlow 2s ease-in-out infinite alternate',
            }}
          >
            Hub
          </Typography>
        </Box>
      )}
    </Box>
  );

  return logoContent;
};

export default Logo;
