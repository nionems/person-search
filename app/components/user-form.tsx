'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserFormData } from '@/app/actions/schemas';

interface FormComponentProps {
  form: UseFormReturn<UserFormData>;
}

export function UserForm({ form }: FormComponentProps) {
  return (
    <Form {...form}>
      {/* Name Field */}
      <FormField
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormDescription>Enter the full name.</FormDescription>
            {fieldState.error?.message && (
              <p className="text-red-600 text-sm mt-1">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />

      {/* Email Field */}
      <FormField
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" {...field} />
            </FormControl>
            <FormDescription>Enter a valid email address.</FormDescription>
            {fieldState.error?.message && (
              <p className="text-red-600 text-sm mt-1">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />

      {/* Phone Number Field */}
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="0420123456" {...field} />
            </FormControl>
            <FormDescription>
              Enter phone number in Australian format (e.g., 0420123456).
            </FormDescription>
            {fieldState.error?.message && (
              <p className="text-red-600 text-sm mt-1">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />
    </Form>
  );
}
