'use client';

import React from 'react';
import { addUser, updateUser, deleteUser } from '@/app/actions/actions'; // Include deleteUser
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas';
import { UserForm } from './user-form';
import MutableDialog, { ActionState } from '@/components/mutable-dialog';

interface UserDialogProps {
  existingUser?: User; // If provided, dialog is in edit mode
  openDirectly?: boolean; // Open dialog directly without a trigger button
  onClose?: () => void; // Callback when dialog is closed
  onDelete?: (userId: string) => void; // Callback for successful deletion
}

export function UserDialog({ existingUser, openDirectly = false, onClose, onDelete }: UserDialogProps) {
  const isEdit = !!existingUser;

  const handleAddUser = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      const newUser = await addUser(data);
      return {
        success: true,
        message: `User ${newUser.name} added successfully`,
        data: newUser,
      };
    } catch (error) {
      console.error('Add User Error:', error);
      return {
        success: false,
        message: 'Failed to add user. Please try again.',
      };
    }
  };

  const handleEditUser = async (data: UserFormData): Promise<ActionState<User>> => {
    if (!existingUser) {
      return {
        success: false,
        message: 'No user selected for editing',
      };
    }

    try {
      const updatedUser = await updateUser({ ...data, id: existingUser.id });
      return {
        success: true,
        message: `User ${updatedUser.name} updated successfully`,
        data: updatedUser,
      };
    } catch (error) {
      console.error('Edit User Error:', error);
      return {
        success: false,
        message: 'Failed to update user. Please try again.',
      };
    }
  };

  const handleDeleteUser = async (): Promise<ActionState<null>> => {
    if (!existingUser) {
      return {
        success: false,
        message: 'No user selected for deletion',
      };
    }

    if (!confirm(`Are you sure you want to delete ${existingUser.name}?`)) {
      return { success: false, message: 'Deletion cancelled' };
    }

    try {
      await deleteUser(existingUser.id); // Call the deleteUser action
      if (onDelete) {
        onDelete(existingUser.id); // Notify parent of successful deletion
      }
      return {
        success: true,
        message: `User ${existingUser.name} deleted successfully`,
        data: null,
      };
    } catch (error) {
      console.error('Delete User Error:', error);
      return {
        success: false,
        message: 'Failed to delete user. Please try again.',
      };
    }
  };

  return (
    <MutableDialog<UserFormData>
      key={existingUser?.id || 'add-user'} // Refresh dialog when editing a different user
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={isEdit ? handleEditUser : handleAddUser}
      deleteAction={isEdit ? handleDeleteUser : undefined} // Include deleteAction for editing
      defaultValues={existingUser} // Prefill form if editing
      triggerButtonLabel={openDirectly ? undefined : isEdit ? 'Edit User' : 'Add User'}
      addDialogTitle="Add New User"
      editDialogTitle={`Edit User: ${existingUser?.name}`}
      dialogDescription={
        isEdit
          ? 'Make changes to the user details below and click save or delete.'
          : 'Fill out the form below to add a new user.'
      }
      submitButtonLabel={isEdit ? 'Save Changes' : 'Add User'}
      deleteButtonLabel="Delete User" // Label for delete button
      openDirectly={openDirectly} // Open dialog directly if needed
      onClose={onClose} // Callback for dialog close
    />
  );
}
