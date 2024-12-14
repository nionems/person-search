'use server';

import prisma from '@/lib/prisma'; // Adjust the path based on your project structure
import { userSchema, UserFormData } from './schemas';

// Search for users in the database
export async function searchUsers(query: string) {
  console.log('Searching users with query:', query);

  // Search for users in the database, case-insensitive
  return prisma.user.findMany({
    where: {
      name: {
        startsWith: query.trim(),
        mode: 'insensitive', // Ensures the search is case-insensitive
      },
    },
  });
}

// Add a new user to the database
export async function addUser(data: UserFormData) {
  console.log('Adding new user:', data);

  // Validate user data
  const validatedData = userSchema.omit({ id: true }).parse(data);

  // Insert the new user into the database
  return prisma.user.create({
    data: validatedData,
  });
}

// Edit an existing user's information in the database
export async function editUser(
  id: string,
  updatedData: Partial<UserFormData>
): Promise<User | null> {
  console.log(`Editing user with ID ${id}:`, updatedData);

  // Validate updated data
  const validatedData = userSchema.omit({ id: true }).partial().parse(updatedData);

  // Update the user in the database
  try {
    return await prisma.user.update({
      where: { id },
      data: validatedData,
    });
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    return null;
  }
}

// Delete a user from the database (optional)
export async function deleteUser(id: string): Promise<void> {
  console.log(`Deleting user with ID ${id}`);

  try {
    await prisma.user.delete({
      where: { id },
    });
    console.log(`User with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
  }
}
