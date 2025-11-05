import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, CreateActivityPayload, UpdateActivityPayload } from '@/types/activity';

interface ActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityPayload | UpdateActivityPayload) => void;
  activity?: Activity | null;
  isLoading: boolean;
}

const ActivityDialog = ({ open, onClose, onSubmit, activity, isLoading }: ActivityDialogProps) => {
  const [formData, setFormData] = useState<CreateActivityPayload>({
    activity_type: 'workout',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    duration_minutes: 0,
    steps: null,
    status: 'planned',
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        activity_type: activity.activity_type,
        title: activity.title,
        description: activity.description,
        date: activity.date,
        duration_minutes: activity.duration_minutes,
        steps: activity.steps,
        status: activity.status,
      });
    } else {
      setFormData({
        activity_type: 'workout',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        duration_minutes: 0,
        steps: null,
        status: 'planned',
      });
    }
  }, [activity, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {activity ? 'Edit Activity' : 'Create New Activity'}
          </DialogTitle>
          <DialogDescription>
            {activity ? 'Update your activity details' : 'Add a new activity to your fitness journey'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity_type">Activity Type</Label>
              <Select
                value={formData.activity_type}
                onValueChange={(value: any) => setFormData({ ...formData, activity_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workout">Workout</SelectItem>
                  <SelectItem value="meal">Meal</SelectItem>
                  <SelectItem value="steps">Steps</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Morning Run"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your activity..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          {formData.activity_type === 'steps' && (
            <div className="space-y-2">
              <Label htmlFor="steps">Steps</Label>
              <Input
                id="steps"
                type="number"
                min="0"
                placeholder="Enter step count"
                value={formData.steps || ''}
                onChange={(e) => setFormData({ ...formData, steps: parseInt(e.target.value) || null })}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : activity ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDialog;
