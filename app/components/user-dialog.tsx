'use client';

import React, { useState } from 'react';
import MutableDialog from '@/components/mutable-dialog';
import { userFormSchema, UserFormData } from '@/app/actions/schemas';
import { UserForm } from './user-form';

export function UserDialog() {
  const [editData, setEditData] = useState<UserFormData | undefined>(undefined);

  const handleEditClick = (user: UserFormData) => {
    setEditData(user); // Set defaultValues for editing
  };

  return (
    <div>
      <button onClick={() => handleEditClick({ name: 'John Doe', email: 'john@example.com' })}>
        Edit User
      </button>
      <MutableDialog<UserFormData>
        formSchema={userFormSchema}
        FormComponent={UserForm}
        action={async (data) => {
          // Perform add/edit action
          console.log(data);
          return { success: true, message: 'User updated' };
        }}
        triggerButtonLabel="Add User"
        addDialogTitle="Add New User"
        editDialogTitle="Edit User"
        dialogDescription="Fill out the form below."
        submitButtonLabel="Save Changes"
        defaultValues={editData}
      />
    </div>
  );
}
