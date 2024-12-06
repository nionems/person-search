import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserForm } from './user-form';
import { useForm } from 'react-hook-form';
import { User, UserFormData } from '@/app/actions/schemas';

interface UserCardProps {
  user: User;
  onUpdate: (updatedUser: User) => void; // Callback to update user details
}

export function UserCard({ user, onUpdate }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UserFormData>({
    defaultValues: {
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
    },
  });

  const handleSave = (data: UserFormData) => {
    setIsEditing(false);
    const updatedUser: User = { ...user, ...data };
    onUpdate(updatedUser);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset({
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
   });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      {isEditing ? (
        <div className="p-4 space-y-4">
          <UserForm form={form} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(handleSave)}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <Badge variant="secondary" className="w-fit mt-1">ID: {user.id}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <span>Phone:</span>
              <span>{user.phoneNumber}</span>
            </div>
            {user.email && (
              <div className="flex items-center gap-2">
                <span>Email:</span>
                <span>{user.email}</span>
              </div>
            )}
          </CardContent>
          <div className="p-4">
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
