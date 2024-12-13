'use client';

import { useState } from 'react';
import { UserFormData, userFormSchema } from '@/app/actions/schemas';
import { UserForm } from './user-form';
import { editUser } from '@/app/actions/actions';
import MutableDialog from '@/app/components/mutable-dialog';

interface UserCardProps {
  user: UserFormData & { id: string };
  onSave: (updatedUser: UserFormData & { id: string }) => void;
}

export function UserCard({ user, onSave }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedUser: UserFormData) => {
    const updatedUserData = await editUser(user.id, updatedUser); // Call server function directly
    if (updatedUserData) {
      onSave(updatedUserData);
    } else {
      console.error('Failed to update user');
    }
    setIsEditing(false);
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber}</p>
      <button onClick={handleEditClick}>Edit</button>

      {isEditing && (
        <MutableDialog<UserFormData>
          formSchema={userFormSchema}
          FormComponent={UserForm}
          action={async (data) => {
            await handleSave(data);
            return { success: true, message: 'User updated successfully' };
          }}
          defaultValues={user}
          triggerButtonLabel="Edit User"
          addDialogTitle="Edit User"
          dialogDescription="Update the user details below."
          submitButtonLabel="Save"
          onOpenChange={(open) => setIsEditing(open)}
        />
      )}
    </div>
  );
}
