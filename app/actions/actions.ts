'use server'

import { User, userSchema } from './schemas';

const users: User[] = [
    { id: '1', name: 'John Doe', phoneNumber: '0420224360', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', phoneNumber: '0420224362', email: 'jane@example.com' },
    { id: '3', name: 'Alice Johnson', phoneNumber: '0420224345', email: 'alice@example.com' },
    { id: '4', name: 'Bob Williams', phoneNumber: '0420224344', email: 'bob@example.com' },
    { id: '5', name: 'Charlie Brown', phoneNumber: '0420224760', email: 'charlie@example.com' },
];

// Search for users by query
export async function searchUsers(query: string): Promise<User[]> {
    console.log('Searching users with query:', query);
    return users.filter(user => user.name.toLowerCase().startsWith(query.toLowerCase()));
}

// Add a new user
export async function addUser(data: Omit<User, 'id'>): Promise<User> {
    const newId = (users.length + 1).toString();
    const newUser = { ...data, id: newId };
    const validatedUser = userSchema.parse(newUser); // Validate with schema
    users.push(validatedUser);
    console.log('User added:', validatedUser);
    return validatedUser;
}

// Update an existing user
export async function updateUser(data: User): Promise<User> {
    const userIndex = users.findIndex(user => user.id === data.id);
    if (userIndex === -1) {
        throw new Error(`User with ID ${data.id} not found.`);
    }
    
    const updatedUser = { ...users[userIndex], ...data };
    const validatedUser = userSchema.parse(updatedUser); // Validate with schema
    users[userIndex] = validatedUser;
    console.log('User updated:', validatedUser);
    return validatedUser;
}

// Optional: Get a user by ID
export async function getUserById(id: string): Promise<User | null> {
    const user = users.find(user => user.id === id);
    return user || null;
}
