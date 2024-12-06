'use client';

import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { searchUsers } from '@/app/actions/actions';
import { UserCard } from './user-card';
import { User } from '@/app/actions/schemas';

// Option type for react-select
interface Option {
  value: string;
  label: string;
  user: User;
}

export default function UserSearch() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    if (!inputValue.trim()) return []; // Return empty array for empty input
    try {
      const users = await searchUsers(inputValue);
      return users.map((user) => ({ value: user.id, label: user.name, user }));
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  };

  const handleChange = (option: Option | null) => {
    setSelectedUser(option ? option.user : null);
  };

  return (
    <div className="space-y-6">
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        placeholder="Search for a user..."
        styles={{
          control: (base) => ({
            ...base,
            borderColor: '#ccc',
            boxShadow: 'none',
            '&:hover': { borderColor: '#888' },
          }),
        }}
        className="w-full max-w-md mx-auto"
      />
      {selectedUser ? (
        <UserCard user={selectedUser} onUpdate={(updatedUser) => setSelectedUser(updatedUser)} />
      ) : (
        <div className="text-center text-gray-500">No user selected.</div>
      )}
    </div>
  );
}
