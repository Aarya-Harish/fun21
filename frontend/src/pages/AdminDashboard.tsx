import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Tooltip,
  Checkbox,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  People,
  PersonAdd,
  Assignment,
  CheckCircle,
  Cancel,
  School,
  Delete,
  AdminPanelSettings,
  Group,
  TrendingUp,
  Assessment,
  History,
  Security,
  Analytics,
  Settings,
  Dashboard,
} from '@mui/icons-material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import { User, UserRole, UserStatus, TeacherStudentAllocation } from '../types';
import ActivityLogs from '../components/ActivityLogs';
import MagicBento, { BentoCardProps } from '../components/MagicBento';
import './AdminDashboard.css';

// Fix for Grid typing issues
const GridItem = (props: any) => <Grid {...props} />;

const AdminDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/pending" element={<PendingApprovalsPage />} />
      <Route path="/allocations" element={<StudentAllocationPage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/logs" element={<ActivityLogsPage />} />
    </Routes>
  );
};

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    pendingActivities: 0,
    totalActivities: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allUsers, pendingUsers, teachers, students, pendingActivities, allActivities] = await Promise.all([
          adminApi.getAllUsers(),
          adminApi.getPendingUsers(),
          adminApi.getTeachers(),
          adminApi.getStudents(),
          adminApi.getPendingActivities(),
          adminApi.getAllActivities(),
        ]);

        setStats({
          totalUsers: allUsers.data.length,
          pendingUsers: pendingUsers.data.length,
          approvedUsers: allUsers.data.filter(u => u.status === UserStatus.APPROVED).length,
          totalTeachers: teachers.data.length,
          totalStudents: students.data.length,
          pendingActivities: pendingActivities.data.length,
          totalActivities: allActivities.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Magic Bento data for Admin Dashboard
  const bentoData: BentoCardProps[] = [
    {
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      title: 'Total Users',
      description: 'All registered users in the system',
      label: 'Users',
      icon: <People sx={{ fontSize: 40 }} />,
      value: stats.totalUsers,
      size: 'medium',
      onClick: () => navigate('/admin/users')
    },
    {
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #f57c00 100%)',
      title: 'Pending Approvals',
      description: 'Users waiting for approval',
      label: 'Pending',
      icon: <PersonAdd sx={{ fontSize: 40 }} />,
      value: stats.pendingUsers,
      size: 'medium',
      onClick: () => navigate('/admin/pending')
    },
    {
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      title: 'Approved Users',
      description: 'Successfully approved users',
      label: 'Approved',
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      value: stats.approvedUsers,
      size: 'medium',
      onClick: () => navigate('/admin/users')
    },
    {
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #7b1fa2 100%)',
      title: 'Teachers',
      description: 'Total number of teachers',
      label: 'Teachers',
      icon: <School sx={{ fontSize: 40 }} />,
      value: stats.totalTeachers,
      size: 'medium',
      onClick: () => navigate('/admin/users')
    },
    {
      color: '#00BCD4',
      gradient: 'linear-gradient(135deg, #00BCD4 0%, #0097a7 100%)',
      title: 'Student Allocations',
      description: 'Manage student-teacher assignments',
      label: 'Allocate',
      icon: <Group sx={{ fontSize: 40 }} />,
      size: 'large',
      onClick: () => navigate('/admin/allocations')
    },
    {
      color: '#FF5722',
      gradient: 'linear-gradient(135deg, #FF5722 0%, #d84315 100%)',
      title: 'All Activities',
      description: 'View all student activities',
      label: 'Activities',
      icon: <Assignment sx={{ fontSize: 40 }} />,
      value: stats.totalActivities,
      size: 'medium',
      onClick: () => navigate('/admin/activities')
    },
    {
      color: '#795548',
      gradient: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
      title: 'System Logs',
      description: 'Monitor system activity logs',
      label: 'Logs',
      icon: <History sx={{ fontSize: 40 }} />,
      size: 'medium',
      onClick: () => navigate('/admin/logs')
    },
    {
      color: '#607D8B',
      gradient: 'linear-gradient(135deg, #607D8B 0%, #455a64 100%)',
      title: 'System Analytics',
      description: 'Platform performance metrics',
      label: 'Analytics',
      icon: <Analytics sx={{ fontSize: 40 }} />,
      size: 'medium',
      onClick: () => navigate('/admin/users')
    }
  ];

  const handleCardClick = (card: BentoCardProps) => {
    if (card.onClick) {
      card.onClick();
    }
  };

  console.log('Rendering Admin MagicBento with data:', bentoData);

  return (
    <MagicBento
      data={bentoData}
      enableParticles={true}
      enableGlow={true}
      enableTilt={true}
      glowColor="25, 118, 210"
      onCardClick={handleCardClick}
      title="Admin Dashboard"
    />
  );
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ role?: UserRole; status?: UserStatus }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminApi.getAllUsers(filter.role, filter.status);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filter]);

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.APPROVED:
        return 'success';
      case UserStatus.PENDING:
        return 'warning';
      case UserStatus.REJECTED:
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          User Management
        </Typography>
        <Box display="flex" gap={2}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={filter.role || ''}
              label="Role"
              onChange={(e) => setFilter({ ...filter, role: e.target.value as UserRole || undefined })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
              <MenuItem value={UserRole.TEACHER}>Teacher</MenuItem>
              <MenuItem value={UserRole.STUDENT}>Student</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter.status || ''}
              label="Status"
              onChange={(e) => setFilter({ ...filter, status: e.target.value as UserStatus || undefined })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={UserStatus.PENDING}>Pending</MenuItem>
              <MenuItem value={UserStatus.APPROVED}>Approved</MenuItem>
              <MenuItem value={UserStatus.REJECTED}>Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Registered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role.toUpperCase()}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={getStatusColor(user.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.department || '-'}</TableCell>
                <TableCell>{user.student_id || user.employee_id || '-'}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            No users found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const PendingApprovalsPage: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await adminApi.getPendingUsers();
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: number, status: UserStatus) => {
    setProcessing(userId);
    try {
      await adminApi.approveUser({ user_id: userId, status });
      await fetchPendingUsers(); // Refresh the list
    } catch (error) {
      console.error('Error processing approval:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #0d1421 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%)',
        p: 3,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(25, 118, 210, 0.3) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(156, 39, 176, 0.3) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(0, 188, 212, 0.2) 0%, transparent 60%),
            radial-gradient(circle at 10% 90%, rgba(255, 193, 7, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 90% 10%, rgba(76, 175, 80, 0.15) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          mb: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.4) 0%, rgba(156, 39, 176, 0.4) 50%, rgba(0, 188, 212, 0.3) 100%)',
            borderRadius: 3,
            zIndex: -1
          }
        }}
      >
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{
            color: 'white',
            textShadow: '0 4px 8px rgba(0,0,0,0.5), 0 0 20px rgba(25, 118, 210, 0.3)',
            fontWeight: '900',
            mb: 2,
            background: 'linear-gradient(45deg, #ffffff 0%, #64b5f6 25%, #e91e63 50%, #ff9800 75%, #ffffff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            animation: 'textGlow 3s ease-in-out infinite alternate'
          }}
        >
          👥 Pending User Approvals
        </Typography>
        <Typography 
          variant="h6" 
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            fontStyle: 'italic',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Review and approve new user registrations
        </Typography>
      </Box>

      <TableContainer 
        component={Paper}
        sx={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(30px)',
          border: '3px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 3,
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(25, 118, 210, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%)',
            animation: 'shimmer 4s ease-in-out infinite',
            pointerEvents: 'none'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Role</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Department</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Registered</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role.toUpperCase()}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.department || '-'}</TableCell>
                <TableCell>{user.student_id || user.employee_id || '-'}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircle />}
                      onClick={() => handleApproval(user.id, UserStatus.APPROVED)}
                      disabled={processing === user.id}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<Cancel />}
                      onClick={() => handleApproval(user.id, UserStatus.REJECTED)}
                      disabled={processing === user.id}
                    >
                      Reject
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pendingUsers.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            No pending approvals
          </Typography>
          <Typography variant="body2" color="textSecondary">
            All user registrations have been processed!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const StudentAllocationPage: React.FC = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [allocations, setAllocations] = useState<TeacherStudentAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [allocationDialog, setAllocationDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teachersRes, studentsRes, allocationsRes] = await Promise.all([
        adminApi.getTeachers(),
        adminApi.getStudents(),
        adminApi.getAllocations(),
      ]);
      
      setTeachers(teachersRes.data);
      setStudents(studentsRes.data);
      setAllocations(allocationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateStudents = async () => {
    if (!selectedTeacher || selectedStudents.length === 0) return;

    setSubmitting(true);
    try {
      await adminApi.allocateStudents({
        teacher_id: selectedTeacher,
        student_ids: selectedStudents,
      });
      
      setAllocationDialog(false);
      setSelectedTeacher(null);
      setSelectedStudents([]);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error allocating students:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAllocation = async (allocationId: number) => {
    try {
      await adminApi.removeAllocation(allocationId);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error removing allocation:', error);
    }
  };

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Student-Teacher Allocations
        </Typography>
        <Button
          variant="contained"
          startIcon={<School />}
          onClick={() => setAllocationDialog(true)}
        >
          Allocate Students
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Teacher</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Teacher Department</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Allocated On</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allocations.map((allocation) => (
              <TableRow key={allocation.id}>
                <TableCell>{allocation.teacher_name}</TableCell>
                <TableCell>{allocation.student_name}</TableCell>
                <TableCell>
                  {teachers.find(t => t.id === allocation.teacher_id)?.department || '-'}
                </TableCell>
                <TableCell>
                  {students.find(s => s.id === allocation.student_id)?.student_id || '-'}
                </TableCell>
                <TableCell>
                  {new Date(allocation.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="Remove Allocation">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveAllocation(allocation.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {allocations.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            No allocations found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start by allocating students to teachers.
          </Typography>
        </Box>
      )}

      {/* Allocation Dialog */}
      <Dialog open={allocationDialog} onClose={() => setAllocationDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Allocate Students to Teacher</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Teacher</InputLabel>
            <Select
              value={selectedTeacher || ''}
              label="Select Teacher"
              onChange={(e) => setSelectedTeacher(e.target.value as number)}
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.full_name} - {teacher.department}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Select Students:
          </Typography>
          
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {students.map((student) => (
              <ListItem key={student.id}>
                <Checkbox
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleStudentToggle(student.id)}
                />
                <ListItemText
                  primary={student.full_name}
                  secondary={`${student.student_id} - ${student.department}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAllocationDialog(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleAllocateStudents}
            variant="contained"
            disabled={!selectedTeacher || selectedStudents.length === 0 || submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Allocate Students'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ status?: string }>({});

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await adminApi.getAllActivities();
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(activity => 
    !filter.status || activity.status === filter.status
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        All Activities
      </Typography>

      {/* Filter */}
      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filter.status || ''}
            label="Filter by Status"
            onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="under_review">Under Review</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Activities Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Files</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {activity.student_name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {activity.student_email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {activity.title}
                  </Typography>
                  {activity.description && (
                    <Typography variant="caption" color="textSecondary">
                      {activity.description.substring(0, 100)}...
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={activity.activity_type.replace('_', ' ').toUpperCase()}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={activity.status.toUpperCase()}
                    size="small"
                    color={
                      activity.status === 'approved' ? 'success' :
                      activity.status === 'rejected' ? 'error' :
                      activity.status === 'pending' ? 'warning' : 'default'
                    }
                  />
                </TableCell>
                <TableCell>{activity.credits}</TableCell>
                <TableCell>
                  <Chip
                    label={activity.files_count || 0}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {new Date(activity.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredActivities.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No activities found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const ActivityLogsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Activity Logs
      </Typography>
      <ActivityLogs isAdmin={true} />
    </Box>
  );
};

export default AdminDashboard;
