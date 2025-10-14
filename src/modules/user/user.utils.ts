// Utility functions for user module

export const sanitizeUserEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

export const hashPassword = async (password: string): Promise<string> => {
    // Implement password hashing logic here
    // For example, using bcrypt
    // const bcrypt = require('bcrypt');
    // return await bcrypt.hash(password, 10);
    return password; // Placeholder
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    // Implement password comparison logic here
    // const bcrypt = require('bcrypt');
    // return await bcrypt.compare(password, hash);
    return password === hash; // Placeholder
};

export const excludePassword = <T extends { password?: string }>(user: T): Omit<T, 'password'> => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
