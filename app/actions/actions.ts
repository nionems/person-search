'use server';

import { revalidatePath } from 'next/cache';
import { User, userSchema } from './schemas';

const users: User[] = [
  { id: '1', name: 'John Doe', phoneNumber: '0420224360', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', phoneNumber: '0420224360', email: 'jane@example.com' },
  { id: '3', name: 'Alice Johnson', phoneNumber: '0420224360', email: 'alice@example.com' },
  { id: '4', name: 'Bob Williams', phoneNumber: '0420224360', email: 'bob@example.com' },
  { id: '5', name: 'Charlie Brown', phoneNumber: '0420224360', email: 'charlie@example.com' },
];

export async function searchUsers(query: string): Promise<User[]> {
  console.log('Searching users with query:', query);
  return users.filter((user) =>
    user.name.toLowerCase().startsWith(query.toLowerCase())
  );
}

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
  const newId = (users.length + 1).toString();
  const newUser = { ...data, id: newId };
  const validatedUser = userSchema.parse(newUser);
  users.push(validatedUser);

  // Revalidate the path displaying the user list
  revalidatePath('/users'); // Replace '/users' with the actual user list path
  return validatedUser;
}

export async function updateUser(
  id: string,
  updatedData: Partial<Omit<User, 'id'>>
): Promise<User | null> {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    console.error(`User with id ${id} not found`);
    return null;
  }

  const updatedUser = { ...users[userIndex], ...updatedData };
  const validatedUser = userSchema.parse(updatedUser);
  users[userIndex] = validatedUser;

  // Revalidate the path displaying the user list
  revalidatePath('/users'); // Replace '/users' with the actual user list path
  return validatedUser;
}

export async function deleteUser(id: string): Promise<boolean> {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    console.error(`User with id ${id} not found`);
    return false;
  }
  const deleteUserById = (id: string) => {
    // Example logic for deleting a user by ID
    const updatedUsers = users.filter((user) => user.id !== id);
  
    // Update the state (or trigger a revalidation in server-side apps)
    setUsers(updatedUsers); // For client-side state
    console.log(`User with ID ${id} deleted successfully`);
  };
  

  users.splice(userIndex, 1); // Remove the user from the array

  // Revalidate the path displaying the user list
  revalidatePath('/users'); // Replace '/users' with the actual user list path

  console.log(`User with id ${id} deleted successfully`);
  return true;
}
