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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People,
  Assignment,
  CheckCircle,
  Pending,
  Visibility,
  Download,
  Cancel,
  School,
  Group,
  TrendingUp,
  EmojiEvents,
  Star,
  Add,
  Assessment,
  History,
  RateReview,
} from '@mui/icons-material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { teacherApi } from '../services/api';
import { TeacherDashboardStats, Activity, ActivityStatus, User } from '../types';
import FileManager from '../components/FileManager';
import MagicBento, { BentoCardProps } from '../components/MagicBento';
import './TeacherDashboard.css';
// import ActivityLogs from '../components/ActivityLogs';

// Fix for Grid typing issues
const GridItem = (props: any) => <Grid {...props} />;

const TeacherDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/pending" element={<PendingActivitiesPage />} />
      <Route path="/activities" element={<AllActivitiesPage />} />
      <Route path="/approvals" element={<ApprovalsPage />} />
    </Routes>
  );
};

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardResponse = await teacherApi.getDashboard();
        setStats(dashboardResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Magic Bento data for Teacher Dashboard
  const bentoData: BentoCardProps[] = [
    {
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      title: 'Assigned Students',
      description: 'Students under your guidance',
      label: 'Students',
      icon: <People sx={{ fontSize: 40 }} />,
      value: stats?.total_students || 0,
      size: 'medium',
      onClick: () => navigate('/teacher/students')
    },
    {
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #f57c00 100%)',
      title: 'Pending Approvals',
      description: 'Activities waiting for your review',
      label: 'Pending',
      icon: <Pending sx={{ fontSize: 40 }} />,
      value: stats?.pending_approvals || 0,
      size: 'medium',
      onClick: () => navigate('/teacher/pending')
    },
    {
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      title: 'Activities Reviewed',
      description: 'Total activities you have reviewed',
      label: 'Reviewed',
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      value: stats?.total_activities_reviewed || 0,
      size: 'medium',
      onClick: () => navigate('/teacher/approvals')
    },
    {
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #7b1fa2 100%)',
      title: 'Recent Submissions',
      description: 'Latest student submissions',
      label: 'Recent',
      icon: <Assignment sx={{ fontSize: 40 }} />,
      value: stats?.recent_submissions?.length || 0,
      size: 'medium',
      onClick: () => navigate('/teacher/activities')
    },
    {
      color: '#00BCD4',
      gradient: 'linear-gradient(135deg, #00BCD4 0%, #0097a7 100%)',
      title: 'Review Activities',
      description: 'Start reviewing pending activities',
      label: 'Action',
      icon: <RateReview sx={{ fontSize: 40 }} />,
      size: 'large',
      onClick: () => navigate('/teacher/pending')
    },
    {
      color: '#FF5722',
      gradient: 'linear-gradient(135deg, #FF5722 0%, #d84315 100%)',
      title: 'All Activities',
      description: 'View all student activities',
      label: 'Overview',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      size: 'medium',
      onClick: () => navigate('/teacher/activities')
    },
    {
      color: '#795548',
      gradient: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
      title: 'Approval History',
      description: 'Track your review history',
      label: 'History',
      icon: <History sx={{ fontSize: 40 }} />,
      size: 'medium',
      onClick: () => navigate('/teacher/approvals')
    },
    {
      color: '#607D8B',
      gradient: 'linear-gradient(135deg, #607D8B 0%, #455a64 100%)',
      title: 'Teaching Analytics',
      description: 'Analyze your teaching impact',
      label: 'Analytics',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      size: 'medium',
      onClick: () => navigate('/teacher/approvals')
    }
  ];

  const handleCardClick = (card: BentoCardProps) => {
    if (card.onClick) {
      card.onClick();
    }
  };

  console.log('Rendering Teacher MagicBento with data:', bentoData);

  return (
    <MagicBento
      data={bentoData}
      enableParticles={true}
      enableGlow={true}
      enableTilt={true}
      glowColor="25, 118, 210"
      onCardClick={handleCardClick}
      title="Teacher Dashboard"
    />
  );
};

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await teacherApi.getAssignedStudents();
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

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
          👥 My Students
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
          View and manage your assigned students
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
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Student ID</TableCell>
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Department</TableCell>
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Phone</TableCell>
             </TableRow>
           </TableHead>
          <TableBody>
            {students.map((student, index) => (
              <TableRow 
                key={student.id}
                sx={{
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 30px rgba(25, 118, 210, 0.4), 0 0 20px rgba(233, 30, 99, 0.2)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  '& td': {
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    fontWeight: '500'
                  }
                }}
              >
                <TableCell>{student.full_name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.student_id || '-'}</TableCell>
                <TableCell>{student.department || '-'}</TableCell>
                <TableCell>{student.phone_number || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {students.length === 0 && (
        <Box 
          textAlign="center" 
          mt={4}
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            p: 4,
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 2
            }}
          >
            No students assigned
          </Typography>
          <Typography 
            variant="body2" 
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Contact your administrator to get students assigned to you.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const PendingActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [filesDialog, setFilesDialog] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: ActivityStatus.APPROVED,
    comments: '',
    credits_awarded: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  const fetchPendingActivities = async () => {
    try {
      const response = await teacherApi.getPendingActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching pending activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (activity: Activity) => {
    console.log('Reviewing activity:', activity);
    setSelectedActivity(activity);
    setReviewData({
      status: ActivityStatus.APPROVED,
      comments: '',
      credits_awarded: activity.credits,
    });
    setReviewDialog(true);
  };

  const handleViewFiles = (activity: Activity) => {
    setSelectedActivity(activity);
    setFilesDialog(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedActivity) return;

    console.log('Submitting review for activity:', selectedActivity.id);
    console.log('Review data:', reviewData);
    
    // Validate form data
    if (!reviewData.status) {
      alert('Please select a decision (Approve or Reject)');
      return;
    }
    
    if (reviewData.status === ActivityStatus.APPROVED && (!reviewData.credits_awarded || reviewData.credits_awarded <= 0)) {
      alert('Please enter a valid credits amount for approval');
      return;
    }
    
    setSubmitting(true);
    try {
      // Teachers can now approve or reject activities directly
      const response = await teacherApi.approveActivity({
        activity_id: selectedActivity.id,
        status: reviewData.status,
        comments: reviewData.comments,
        credits_awarded: reviewData.credits_awarded,
      });
      
      console.log('Review submitted successfully:', response.data);
      
      // Show success message
      alert(`Activity ${reviewData.status === ActivityStatus.APPROVED ? 'approved' : 'rejected'} successfully!`);
      
      setReviewDialog(false);
      setSelectedActivity(null);
      setReviewData({
        status: ActivityStatus.PENDING,
        comments: '',
        credits_awarded: 0
      });
      await fetchPendingActivities(); // Refresh the list
    } catch (error: any) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to submit review';
      alert(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  // const getStatusColor = (status: ActivityStatus) => {
  //   switch (status) {
  //     case ActivityStatus.APPROVED:
  //       return 'success';
  //     case ActivityStatus.PENDING:
  //       return 'warning';
  //     case ActivityStatus.REJECTED:
  //       return 'error';
  //     default:
  //       return 'default';
  //   }
  // };

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
        Pending Activities for Review
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Files</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.student_name}</TableCell>
                <TableCell>{activity.title}</TableCell>
                <TableCell>
                  {activity.activity_type.replace('_', ' ').toUpperCase()}
                </TableCell>
                <TableCell>{activity.credits}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={activity.files_count || 0}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {(activity.files_count || 0) > 0 && (
                      <Tooltip title="View Files">
                        <IconButton
                          size="small"
                          onClick={() => handleViewFiles(activity)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(activity.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleReview(activity)}
                    >
                      Review
                    </Button>
                    {(activity.files_count || 0) > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Download />}
                        onClick={() => handleViewFiles(activity)}
                      >
                        Files
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {activities.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            No pending activities
          </Typography>
          <Typography variant="body2" color="textSecondary">
            All activities have been reviewed!
          </Typography>
        </Box>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Review Activity: {selectedActivity?.title}
        </DialogTitle>
        <DialogContent>
          {selectedActivity && (
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Student: {selectedActivity.student_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Type: {selectedActivity.activity_type.replace('_', ' ').toUpperCase()}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Requested Credits: {selectedActivity.credits}
              </Typography>
              {selectedActivity.description && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Description:
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedActivity.description}
                  </Typography>
                </Box>
              )}
              
              {/* File Management */}
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Uploaded Files:
                </Typography>
                <FileManager
                  activityId={selectedActivity.id}
                  canUpload={false}
                  canDelete={false}
                />
              </Box>

              <Box mt={3}>
                <Typography variant="h6" gutterBottom color="primary">
                  Review Decision
                </Typography>
                
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Decision *</InputLabel>
                  <Select
                    value={reviewData.status}
                    label="Decision *"
                    onChange={(e) => setReviewData({ ...reviewData, status: e.target.value as ActivityStatus })}
                  >
                    <MenuItem value={ActivityStatus.APPROVED}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircle color="success" />
                        <Typography>Approve Activity</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value={ActivityStatus.REJECTED}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Cancel color="error" />
                        <Typography>Reject Activity</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {reviewData.status === ActivityStatus.APPROVED && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom color="success.main">
                      Performance Scoring
                    </Typography>
                    <TextField
                      fullWidth
                      margin="normal"
                      type="number"
                      label="Credits to Award *"
                      value={reviewData.credits_awarded}
                      onChange={(e) => setReviewData({ ...reviewData, credits_awarded: parseFloat(e.target.value) || 0 })}
                      inputProps={{ min: 0, step: 0.5, max: 10 }}
                      helperText="Enter performance score (0-10 credits) based on quality and effort"
                      required
                    />
                  </Box>
                )}

                {reviewData.status === ActivityStatus.REJECTED && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Please provide clear feedback on why this activity was rejected so the student can improve.
                    </Typography>
                  </Alert>
                )}

                <TextField
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  label="Review Comments & Feedback"
                  value={reviewData.comments}
                  onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
                  placeholder={
                    reviewData.status === ActivityStatus.APPROVED 
                      ? "Provide constructive feedback on the student's work. Highlight strengths and areas for improvement..."
                      : "Explain why this activity was rejected. Provide specific guidance on how the student can improve..."
                  }
                  required
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            color={reviewData.status === ActivityStatus.APPROVED ? "success" : reviewData.status === ActivityStatus.REJECTED ? "error" : "primary"}
            disabled={submitting || !reviewData.status || (reviewData.status === ActivityStatus.APPROVED && (!reviewData.credits_awarded || reviewData.credits_awarded <= 0))}
            startIcon={reviewData.status === ActivityStatus.APPROVED ? <CheckCircle /> : reviewData.status === ActivityStatus.REJECTED ? <Cancel /> : <Assignment />}
          >
            {submitting 
              ? <CircularProgress size={24} />
              : reviewData.status === ActivityStatus.APPROVED 
                ? 'Approve Activity' 
                : reviewData.status === ActivityStatus.REJECTED 
                  ? 'Reject Activity' 
                  : 'Submit Review'
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Files Dialog */}
      <Dialog
        open={filesDialog}
        onClose={() => setFilesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Files for: {selectedActivity?.title}
        </DialogTitle>
        <DialogContent>
          {selectedActivity && (
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Student: {selectedActivity.student_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Activity Type: {selectedActivity.activity_type.replace('_', ' ').toUpperCase()}
              </Typography>
              
              <Box mt={2}>
                <FileManager
                  activityId={selectedActivity.id}
                  canUpload={false}
                  canDelete={false}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilesDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const AllActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [filesDialog, setFilesDialog] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await teacherApi.getAllActivities(
          undefined,
          filter === 'all' ? undefined : filter
        );
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [filter]);

  const handleViewFiles = (activity: Activity) => {
    setSelectedActivity(activity);
    setFilesDialog(true);
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.APPROVED:
        return 'success';
      case ActivityStatus.PENDING:
        return 'warning';
      case ActivityStatus.REJECTED:
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
         display="flex" 
         justifyContent="space-between" 
         alignItems="center" 
         mb={4}
         sx={{
           background: 'rgba(255, 255, 255, 0.1)',
           backdropFilter: 'blur(20px)',
           borderRadius: 3,
           p: 3,
           border: '2px solid rgba(255, 255, 255, 0.2)',
           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
         }}
       >
        <Typography 
          variant="h4"
          sx={{
            color: 'white',
            textShadow: '0 4px 8px rgba(0,0,0,0.5), 0 0 20px rgba(25, 118, 210, 0.3)',
            fontWeight: '900',
            background: 'linear-gradient(45deg, #ffffff 0%, #64b5f6 25%, #e91e63 50%, #ff9800 75%, #ffffff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
        >
          📋 All Activities
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: 'white' }}>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
              }
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
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
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Student</TableCell>
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Title</TableCell>
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Type</TableCell>
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Status</TableCell>
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Credits</TableCell>
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Files</TableCell>
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Submitted</TableCell>
               <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Actions</TableCell>
             </TableRow>
           </TableHead>
          <TableBody>
            {activities.map((activity, index) => (
              <TableRow 
                key={activity.id}
                sx={{
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 30px rgba(25, 118, 210, 0.4), 0 0 20px rgba(233, 30, 99, 0.2)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  '& td': {
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    fontWeight: '500'
                  }
                }}
              >
                <TableCell>{activity.student_name}</TableCell>
                <TableCell>{activity.title}</TableCell>
                <TableCell>
                  {activity.activity_type.replace('_', ' ').toUpperCase()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={activity.status}
                    color={getStatusColor(activity.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{activity.credits}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={activity.files_count || 0}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {(activity.files_count || 0) > 0 && (
                      <Tooltip title="View Files">
                        <IconButton
                          size="small"
                          onClick={() => handleViewFiles(activity)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(activity.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {(activity.files_count || 0) > 0 && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => handleViewFiles(activity)}
                    >
                      View Files
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {activities.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            No activities found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {filter === 'all' ? 'No activities have been submitted yet.' : `No ${filter} activities found.`}
          </Typography>
        </Box>
      )}

      {/* Files Dialog */}
      <Dialog
        open={filesDialog}
        onClose={() => setFilesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Files for: {selectedActivity?.title}
        </DialogTitle>
        <DialogContent>
          {selectedActivity && (
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Student: {selectedActivity.student_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Activity Type: {selectedActivity.activity_type.replace('_', ' ').toUpperCase()}
              </Typography>
              
              <Box mt={2}>
                <FileManager
                  activityId={selectedActivity.id}
                  canUpload={false}
                  canDelete={false}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilesDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ApprovalsPage: React.FC = () => {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ status?: string; dateRange?: string }>({});

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await teacherApi.getApprovalHistory();
        setApprovals(response.data);
      } catch (error) {
        console.error('Error fetching approval history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const filteredApprovals = approvals.filter(approval => {
    if (filter.status && approval.status !== filter.status) return false;
    if (filter.dateRange) {
      const approvalDate = new Date(approval.created_at);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - approvalDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filter.dateRange) {
        case 'today':
          return daysDiff === 0;
        case 'week':
          return daysDiff <= 7;
        case 'month':
          return daysDiff <= 30;
        default:
          return true;
      }
    }
    return true;
  });

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
          📊 Approval History
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
          Track and manage student activity approvals
        </Typography>
      </Box>

      {/* Filters */}
      <Box 
        mb={4} 
        display="flex" 
        gap={2} 
        flexWrap="wrap"
        sx={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(25px)',
          borderRadius: 3,
          p: 3,
          border: '3px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(25, 118, 210, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
            animation: 'shimmer 3s ease-in-out infinite'
          }
        }}
      >
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: 'white' }}>Filter by Status</InputLabel>
          <Select
            value={filter.status || ''}
            label="Filter by Status"
            onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              }
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: 'white' }}>Date Range</InputLabel>
          <Select
            value={filter.dateRange || ''}
            label="Date Range"
            onChange={(e) => setFilter({ ...filter, dateRange: e.target.value || undefined })}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              }
            }}
          >
            <MenuItem value="">All Time</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Approval History Table */}
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Student</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Activity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Decision</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Credits Awarded</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Comments</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Approved Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApprovals.map((approval, index) => (
              <TableRow 
                key={approval.id}
                sx={{
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 30px rgba(25, 118, 210, 0.4), 0 0 20px rgba(233, 30, 99, 0.2)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  '& td': {
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    fontWeight: '500'
                  }
                }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {approval.student_name || 'Unknown Student'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {approval.student_id}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {approval.activity_title || 'Unknown Activity'}
                    </Typography>
                    {approval.activity_description && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        {approval.activity_description.substring(0, 50)}...
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={approval.activity_type?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={approval.status?.toUpperCase() || 'UNKNOWN'}
                    size="small"
                    color={
                      approval.status === 'approved' ? 'success' :
                      approval.status === 'rejected' ? 'error' : 'default'
                    }
                    icon={
                      approval.status === 'approved' ? <CheckCircle /> :
                      approval.status === 'rejected' ? <Cancel /> : undefined
                    }
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="bold">
                      {approval.credits_awarded || 0}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      credits
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      maxWidth: 200, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={approval.comments || 'No comments'}
                  >
                    {approval.comments || 'No comments'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {new Date(approval.approved_at || approval.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(approval.approved_at || approval.created_at).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Files">
                      <IconButton size="small" color="secondary">
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredApprovals.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No approval history found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {filter.status || filter.dateRange 
              ? 'Try adjusting your filters' 
              : 'You haven\'t reviewed any activities yet'
            }
          </Typography>
        </Box>
      )}

      {/* Summary Stats */}
      {filteredApprovals.length > 0 && (
        <Box mt={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Summary Statistics
            </Typography>
            <Grid container spacing={2}>
              <GridItem item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {filteredApprovals.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Reviews
                  </Typography>
                </Box>
              </GridItem>
              <GridItem item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {filteredApprovals.filter(a => a.status === 'approved').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Approved
                  </Typography>
                </Box>
              </GridItem>
              <GridItem item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="error.main">
                    {filteredApprovals.filter(a => a.status === 'rejected').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Rejected
                  </Typography>
                </Box>
              </GridItem>
              <GridItem item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {filteredApprovals.reduce((sum, a) => sum + (a.credits_awarded || 0), 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Credits Awarded
                  </Typography>
                </Box>
              </GridItem>
            </Grid>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default TeacherDashboard;
