import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { activityService } from '@/services/activityService';
import { Activity, CreateActivityPayload, UpdateActivityPayload } from '@/types/activity';
import ActivityCard from '@/components/ActivityCard';
import ActivityDialog from '@/components/ActivityDialog';
import { Plus, LogOut, Activity as ActivityIcon, TrendingUp } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadActivities();
  }, [navigate]);

  const loadActivities = async () => {
    try {
      const data = await activityService.getActivities();
      setActivities(data);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateActivity = async (data: CreateActivityPayload) => {
    setIsSubmitting(true);
    try {
      await activityService.createActivity(data);
      toast.success('Activity created successfully');
      setDialogOpen(false);
      loadActivities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateActivity = async (data: UpdateActivityPayload) => {
    if (!selectedActivity) return;
    setIsSubmitting(true);
    try {
      await activityService.updateActivity(selectedActivity.id, data);
      toast.success('Activity updated successfully');
      setDialogOpen(false);
      setSelectedActivity(null);
      loadActivities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteActivity = async () => {
    if (!deleteId) return;
    try {
      await activityService.deleteActivity(deleteId);
      toast.success('Activity deleted successfully');
      setDeleteId(null);
      loadActivities();
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  const handleNewActivity = () => {
    setSelectedActivity(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedActivity(null);
  };

  const stats = {
    total: activities.length,
    completed: activities.filter(a => a.status === 'completed').length,
    inProgress: activities.filter(a => a.status === 'in_progress').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <ActivityIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Fitness Tracker</h1>
              <p className="text-sm text-muted-foreground">Track your progress</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ActivityIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold mt-1 text-success">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold mt-1 text-warning">{stats.inProgress}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <ActivityIcon className="h-6 w-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Activities</h2>
          <Button onClick={handleNewActivity} className="shadow-hover">
            <Plus className="h-4 w-4 mr-2" />
            New Activity
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border/50 shadow-card">
            <ActivityIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No activities yet</p>
            <Button onClick={handleNewActivity}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Activity
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={handleEdit}
                onDelete={setDeleteId}
              />
            ))}
          </div>
        )}
      </main>

      <ActivityDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={selectedActivity ? handleUpdateActivity : handleCreateActivity}
        activity={selectedActivity}
        isLoading={isSubmitting}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteActivity} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
