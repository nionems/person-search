import MutableDialog from '@/app/components/mutable-dialog';
import { UserForm } from './user-form';
import { useForm, UseFormReturn } from 'react-hook-form';
import { UserFormData } from '@/app/actions/schemas';



interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: UserFormData;
  onSave: (updatedUser: UserFormData) => void;
}

export function EditUserDialog({
  isOpen,
  onClose,
  defaultValues,
  onSave,
}: EditUserDialogProps) {
  const form = useForm<UserFormData>({
    defaultValues,
  });

  

  const handleFormSubmit = (data: UserFormData) => {
    console.log('Form submitted with:', data); // Debug form data
    onSave(data);
    onClose();
  };

  return (
    <MutableDialog open={isOpen} onOpenChange={onClose}>
      <div>
        <h2>Edit User</h2>
        <UserForm form={form} onSubmit={form.handleSubmit(handleFormSubmit)} />
      </div>
    </MutableDialog>
  );
}
