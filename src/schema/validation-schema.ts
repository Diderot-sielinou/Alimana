import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Your name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(15, 'Password can not be more than 15 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password')
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
      'Password must contain at least 1 uppercase letter, 1 number, and 1 special character'
    ),
  phone: Yup.string()
    .matches(
      /^(\+?[1-9]\d{1,14}|0\d{9})$/,
      'Phone number must be valid international or local format'
    )
    .optional(),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const createStoreValidationSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, 'Name can not exceed 100 characters')
    .required('Name of the store is required'),
  description: Yup.string().max(250, 'Description cannot exceed 250 characters').optional(),
  address: Yup.string().optional(),
  city: Yup.string().optional(),
  state: Yup.string().optional(),
  zipCode: Yup.number().optional(),
  phone: Yup.string().matches(
    /^(\+?[1-9]\d{1,14}|0\d{9})$/,
    'Phone number must be valid international or local format'
  ),
  email: Yup.string().email('Invalid email').optional(),
  websiteUrl: Yup.string().url().optional(),
  profileImageUrl: Yup.string().url().optional(),
});
