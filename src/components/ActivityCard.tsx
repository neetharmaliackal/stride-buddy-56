import { Activity as ActivityType } from '@/types/activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Dumbbell, Utensils, Footprints, Clock } from 'lucide-react';

interface ActivityCardProps {
  activity: ActivityType;
  onEdit: (activity: ActivityType) => void;
  onDelete: (id: number) => void;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'workout':
      return <Dumbbell className="h-5 w-5" />;
    case 'meal':
      return <Utensils className="h-5 w-5" />;
    case 'steps':
      return <Footprints className="h-5 w-5" />;
    default:
      return <Dumbbell className="h-5 w-5" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'in_progress':
      return 'secondary';
    case 'planned':
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-success/10 text-success border-success/20';
    case 'in_progress':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'planned':
      return 'bg-primary/10 text-primary border-primary/20';
    default:
      return '';
  }
};

const ActivityCard = ({ activity, onEdit, onDelete }: ActivityCardProps) => {
  return (
    <Card className="hover:shadow-hover transition-all duration-300 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground">
              {getActivityIcon(activity.activity_type)}
            </div>
            <div>
              <CardTitle className="text-lg">{activity.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(activity.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <Badge variant={getStatusVariant(activity.status)} className={getStatusColor(activity.status)}>
            {activity.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{activity.description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{activity.duration_minutes} minutes</span>
          {activity.steps && (
            <>
              <span className="mx-1">•</span>
              <Footprints className="h-4 w-4" />
              <span>{activity.steps.toLocaleString()} steps</span>
            </>
          )}
        </div>
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(activity)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            onClick={() => onDelete(activity.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
