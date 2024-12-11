import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  onUserDelete: (userId: string) => void;   // Callback to delete the user
}

export function UserCard({ user, onUserUpdate, onUserDelete }: UserCardProps) {
  const [editing, setEditing] = useState(false);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleDeleteClick = (userId: string) => {
    if (confirm(`Are you sure you want to delete user with ID ${userId}?`)) {
      // Trigger deletion logic via a central mechanism
      deleteUserById(userId);
    }
  };
  

  const handleEditAction = async (data: UserFormData) => {
    try {
      const updatedUser = { ...user, ...data };
      onUserUpdate(updatedUser);
      return {
        success: true,
        message: `User ${data.name} updated successfully`,
      };
    } catch (error) {
      console.error('Failed to update user:', error);
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
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-gray-500 hover:text-gray-800"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </CardTitle>
          <Badge variant="secondary" className="w-fit mt-1">
            ID: {user.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center">
          <span>Phone:</span>
          <span className="ml-2">{user.phoneNumber}</span>
        </div>
        {user.email && (
          <div className="flex items-center">
            <span>Email:</span>
            <span className="ml-2">{user.email}</span>
          </div>
        )}
        {user.location && (
          <div className="flex items-center">
            <span>Location:</span>
            <span className="ml-2">{user.location}</span>
          </div>
        )}
      </CardContent>

      {/* Footer with Delete Button */}
      <CardFooter className="flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          className="mt-4"
          onClick={handleDeleteClick}
        >
          Delete
        </Button>
      </CardFooter>

      {/* Edit Dialog */}
      <MutableDialog<UserFormData>
        open={editing}
        onOpenChange={setEditing}
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
