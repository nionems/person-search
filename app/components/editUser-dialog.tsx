import MutableDialog from '@/app/components/mutable-dialog';
import { UserForm } from './user-form';
import { User } from '@/app/actions/schemas';

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: User;
  onSave: (updatedUser: User) => void;
}

export function EditUserDialog({
  isOpen,
  onClose,
  defaultValues,
  onSave,
}: EditUserDialogProps) {
  const handleFormSubmit = (updatedUser: User) => {
    onSave(updatedUser);
    onClose();
  };

  return (
    <MutableDialog
      open={isOpen}
      onOpenChange={onClose}
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={async (data) => {
        handleFormSubmit(data);
        return { success: true, message: 'User updated successfully', data };
      }}
      editDialogTitle="Edit User"
      submitButtonLabel="Save Changes"
      defaultValues={defaultValues}
    />
  );
}
