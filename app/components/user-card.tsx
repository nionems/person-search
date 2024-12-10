import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Edit } from 'lucide-react';
import MutableDialog from '@/components/mutable-dialog';
import { userFormSchema, UserFormData } from '@/app/actions/schemas';
import { UserForm } from './user-form';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  location?: string;
}

interface UserCardProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void; // Callback to update the user list
}

export function UserCard({ user, onUserUpdate }: UserCardProps) {
  const [editing, setEditing] = useState(false);

  const handleEditClick = () => {
    console.log('Edit button clicked'); // Debugging log
    setEditing(true);
  };

  const handleEditAction = async (data: UserFormData) => {
    try {
      const updatedUser = { ...user, ...data }; // Merge new data into existing user
      console.log('Updated user:', updatedUser); // Debugging log
      onUserUpdate(updatedUser);
      return {
        success: true,
        message: `User ${data.name} updated successfully`,
      };
    } catch (error) {
      console.error('Failed to update user:', error); // Debugging log
      return {
        success: false,
        message: 'Failed to update user',
      };
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
            alt={user.name}
          />
          <AvatarFallback>
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl flex items-center gap-2">
            {user.name}
            {/* Inline Edit Button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-gray-500 hover:text-gray-800"
              onClick={handleEditClick}
              aria-label="Edit User"
            >
              <Edit className="w-5 h-5" />
            </Button>
          </CardTitle>
          <Badge variant="secondary" className="w-fit mt-1">
            ID: {user.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{user.phoneNumber}</span>
        </div>
        {user.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
        )}
        {user.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{user.location}</span>
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <MutableDialog<UserFormData>
        open={editing} // Control dialog visibility
        onOpenChange={setEditing} // Close dialog on cancel or completion
        formSchema={userFormSchema}
        FormComponent={UserForm}
        action={handleEditAction}
        defaultValues={{
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
        }}
        editDialogTitle="Edit User"
        dialogDescription="Make changes to the user details below."
        submitButtonLabel="Save Changes"
      />
    </Card>
  );
}
