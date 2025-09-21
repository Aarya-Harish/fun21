import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  People,
  Notifications,
  AccountCircle,
  ExitToApp,
  School,
  CheckCircle,
  PendingActions,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { notificationApi } from '../services/api';
import { UserRole } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<null | HTMLElement>(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch notifications
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const [notificationsResponse, unreadResponse] = await Promise.all([
            notificationApi.getNotifications(false, 10), // Get recent 10 notifications
            notificationApi.getUnreadCount()
          ]);
          setNotifications(notificationsResponse.data);
          setUnreadCount(unreadResponse.data.unread_count);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getMenuItems = () => {
    if (!user) return [];

    const baseItems = [
      {
        text: 'Dashboard',
        icon: <Dashboard />,
        path: `/${user.role}`,
        roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
      },
    ];

    const roleSpecificItems = {
      [UserRole.ADMIN]: [
        { text: 'User Management', icon: <People />, path: '/admin/users' },
        { text: 'Pending Approvals', icon: <PendingActions />, path: '/admin/pending' },
        { text: 'Student Allocation', icon: <School />, path: '/admin/allocations' },
        { text: 'All Activities', icon: <Assignment />, path: '/admin/activities' },
      ],
      [UserRole.TEACHER]: [
        { text: 'My Students', icon: <People />, path: '/teacher/students' },
        { text: 'Pending Reviews', icon: <PendingActions />, path: '/teacher/pending' },
        { text: 'All Activities', icon: <Assignment />, path: '/teacher/activities' },
        { text: 'Approval History', icon: <CheckCircle />, path: '/teacher/approvals' },
      ],
      [UserRole.STUDENT]: [
        { text: 'My Activities', icon: <Assignment />, path: '/student/activities' },
        { text: 'Add Activity', icon: <Assignment />, path: '/student/add-activity' },
        { text: 'Performance', icon: <Dashboard />, path: '/student/performance' },
      ],
    };

    return [...baseItems, ...(roleSpecificItems[user.role] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Magical Header */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: 64,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden'
        }}
      >
        {/* Magical Background Effects */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(25, 118, 210, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(156, 39, 176, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(0, 188, 212, 0.05) 0%, transparent 50%)
            `,
            pointerEvents: 'none'
          }}
        />
        
        {/* Animated Particles */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'rgba(25, 118, 210, 0.6)',
              borderRadius: '50%',
              top: '20%',
              left: '10%',
              animation: 'float 3s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(25, 118, 210, 0.6)'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '3px',
              height: '3px',
              background: 'rgba(156, 39, 176, 0.6)',
              borderRadius: '50%',
              top: '60%',
              right: '15%',
              animation: 'float 4s ease-in-out infinite reverse',
              boxShadow: '0 0 6px rgba(156, 39, 176, 0.6)'
            }
          }}
        />

        <Toolbar sx={{ position: 'relative', zIndex: 1 }}>
          {/* Magical Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ 
              mr: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
              }
            }}
          >
            <MenuIcon sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
          </IconButton>
          
          {/* Magical Logo Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              px: 2,
              py: 1,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)'
              }
            }}
          >
            <Logo size="small" showText={true} variant="horizontal" />
          </Box>

          {user && (
            <>
              {/* Magical Notification Button */}
              <IconButton
                color="inherit"
                onClick={(e) => setNotificationMenuAnchor(e.currentTarget)}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  mx: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
                  }
                }}
              >
                <Badge 
                  badgeContent={unreadCount} 
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
                      animation: 'pulse 2s infinite'
                    }
                  }}
                >
                  <Notifications sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                </Badge>
              </IconButton>

              {/* Magical Profile Section */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
                  }
                }}
                onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
              >
                <Tooltip title={`${user.full_name} (${user.role})`}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {user.profile_picture ? (
                      <Avatar
                        src={`http://localhost:8000${user.profile_picture}`}
                        alt={user.full_name}
                        sx={{ 
                          width: 32, 
                          height: 32,
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                    ) : (
                      <AccountCircle sx={{ 
                        fontSize: 32,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }} />
                    )}
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        ml: 1,
                        color: 'white',
                        fontWeight: 500,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {user.full_name} ({user.role})
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
            </>
          )}
        </Toolbar>
      </Box>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(25, 118, 210, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white', 
              mb: 2, 
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontWeight: 600
            }}
          >
            Navigation
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  mb: 1,
                  background: location.pathname === item.path 
                    ? 'rgba(25, 118, 210, 0.2)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: location.pathname === item.path 
                    ? '1px solid rgba(25, 118, 210, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: location.pathname === item.path 
                      ? 'rgba(25, 118, 210, 0.3)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
                    borderColor: 'rgba(25, 118, 210, 0.4)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    color: 'white',
                    '& .MuiListItemText-primary': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Magical Notifications Menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={() => setNotificationMenuAnchor(null)}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '350px',
            background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 46, 0.95) 50%, rgba(22, 33, 62, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(25, 118, 210, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            color: 'white'
          },
        }}
      >
        <MenuItem 
          onClick={handleMarkAllAsRead}
          sx={{
            background: 'rgba(25, 118, 210, 0.1)',
            border: '1px solid rgba(25, 118, 210, 0.3)',
            borderRadius: 1,
            m: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(25, 118, 210, 0.2)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          <Typography variant="body2" sx={{ color: '#64b5f6', fontWeight: 600 }}>
            Mark All as Read
          </Typography>
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
              onClick={() => {
                if (!notification.is_read) {
                  handleMarkAsRead(notification.id);
                }
                setNotificationMenuAnchor(null);
              }}
              sx={{
                background: notification.is_read 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(25, 118, 210, 0.1)',
                border: notification.is_read 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(25, 118, 210, 0.3)',
                borderRadius: 1,
                m: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: notification.is_read 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(25, 118, 210, 0.2)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                }
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="bold" sx={{ color: 'white' }}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  {new Date(notification.created_at).toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>

      {/* Magical Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={() => setProfileMenuAnchor(null)}
        PaperProps={{
          style: {
            background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 46, 0.95) 50%, rgba(22, 33, 62, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(25, 118, 210, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            color: 'white',
            minWidth: '200px'
          },
        }}
      >
        <MenuItem 
          onClick={() => {
            navigate('/profile');
            setProfileMenuAnchor(null);
          }}
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 1,
            m: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
            <Person fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ color: 'white', fontWeight: 500 }}>Profile</Typography>
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <MenuItem 
          onClick={handleLogout}
          sx={{
            background: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: 1,
            m: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(244, 67, 54, 0.2)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)'
            }
          }}
        >
          <ListItemIcon sx={{ color: '#f44336', minWidth: 36 }}>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ color: '#f44336', fontWeight: 500 }}>Logout</Typography>
        </MenuItem>
      </Menu>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '100vh',
          p: 3,
          mt: 8, // Account for AppBar height
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

