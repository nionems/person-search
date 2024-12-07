'use server';

import { PrismaClient } from '@prisma/client';
import { userSchema } from './schemas'; // Import Zod schema for validation

const prisma = new PrismaClient(); // Initialize Prisma Client for database operations

// Search for users by query
export async function searchUsers(query: string): Promise<User[]> {
    console.log('Searching users with query:', query);

    // Find users whose names start with the query, case-insensitively
    const users = await prisma.user.findMany({
        where: {
            name: {
                startsWith: query, // Matches names that start with the query
                mode: 'insensitive', // Makes the search case-insensitive
            },
        },
    });

    console.log('Found users:', users);
    return users;
}

// Add a new user
export async function addUser(data: Omit<User, 'id'>): Promise<User> {
    // Validate the input data using Zod (excluding 'id' since it will be auto-generated)
    const validatedUser = userSchema.omit({ id: true }).parse(data);

    // Create a new user in the database
    const newUser = await prisma.user.create({
        data: validatedUser,
    });

    console.log('User added:', newUser);
    return newUser; // Return the newly created user
}

// Update an existing user
export async function updateUser(data: User): Promise<User> {
    // Validate the input data using Zod
    const validatedUser = userSchema.parse(data);

    // Update the user in the database using their 'id'
    const updatedUser = await prisma.user.update({
        where: {
            id: validatedUser.id, // Match user by 'id'
        },
        data: validatedUser, // Update with the new data
    });

    console.log('User updated:', updatedUser);
    return updatedUser; // Return the updated user
}

// Delete a user by ID
export async function deleteUser(id: string): Promise<boolean> {
    try {
        // Delete the user in the database using their 'id'
        await prisma.user.delete({
            where: {
                id, // Match user by 'id'
            },
        });

        console.log(`User with ID ${id} deleted.`);
        return true; // Return true if deletion is successful
    } catch (error) {
        console.error(`Failed to delete user with ID ${id}:`, error);
        return false; // Return false if deletion fails
    }
}

// Get a user by ID
export async function getUserById(id: string): Promise<User | null> {
    // Find a user by their 'id' in the database
    const user = await prisma.user.findUnique({
        where: {
            id, // Match user by 'id'
        },
    });

    console.log('Fetched user:', user);
    return user || null; // Return the user if found, otherwise null
}
