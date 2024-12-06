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
import { UserFormData } from '../actions/schemas';

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
              <Input
                placeholder="Enter full name"
                {...field}
                aria-describedby="name-helper-text"
              />
            </FormControl>
            <FormDescription id="name-helper-text">
              Provide the user's full name.
            </FormDescription>
            {fieldState.error && (
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
              <Input
                type="email"
                placeholder="Enter email address"
                {...field}
                aria-describedby="email-helper-text"
              />
            </FormControl>
            <FormDescription id="email-helper-text">
              Provide a valid email address.
            </FormDescription>
            {fieldState.error && (
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
              <Input
                placeholder="Enter phone number (e.g., 0412345678)"
                {...field}
                aria-describedby="phone-helper-text"
              />
            </FormControl>
            <FormDescription id="phone-helper-text">
              Enter a valid Australian phone number.
            </FormDescription>
            {fieldState.error && (
              <p className="text-red-600 text-sm mt-1">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />
    </Form>
  );
}
