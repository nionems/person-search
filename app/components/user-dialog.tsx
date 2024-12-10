'use client';

import { addUser, updateUser } from '@/app/actions/actions';
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas';
import { UserForm } from './user-form';
import MutableDialog, { ActionState } from '@/components/mutable-dialog';

interface UserDialogProps {
  user?: User; // Optional user for edit mode
  onUserUpdate?: (updatedUser: User) => void; // Callback for updating UI
}

export function UserDialog({ user, onUserUpdate }: UserDialogProps) {
  const handleAction = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      if (user) {
        // Edit Mode
        const updatedUser = await updateUser(user.id, data);
        if (!updatedUser) throw new Error('User update failed');
        onUserUpdate?.(updatedUser);
        return {
          success: true,
          message: `User ${updatedUser.name} updated successfully`,
          data: updatedUser,
        };
      } else {
        // Add Mode
        const newUser = await addUser(data);
        return {
          success: true,
          message: `User ${newUser.name} added successfully`,
          data: newUser,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to process action',
      };
    }
  };

  return (
    <MutableDialog<UserFormData>
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={handleAction}
      addDialogTitle="Add New User"
      editDialogTitle="Edit User"
      dialogDescription="Update the user details below."
      submitButtonLabel="Save Changes"
      defaultValues={user || undefined} // Pre-fill form in edit mode
      triggerButtonLabel={undefined} // Prevent Add button from appearing
    />
  );
}
