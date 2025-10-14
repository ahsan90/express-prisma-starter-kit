import Joi from 'joi';

export const createUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    name: Joi.string().min(2).max(100).optional(),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required',
    }),
    isActive: Joi.boolean().optional().default(true),
});

export const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    name: Joi.string().min(2).max(100).optional(),
    password: Joi.string().min(8).optional(),
    isActive: Joi.boolean().optional(),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});

export const getUserByIdSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
});
