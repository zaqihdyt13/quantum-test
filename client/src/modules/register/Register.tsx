import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'

import MobileLayout from '@/layouts/MobileLayout'
import { usePostRegisterMutation } from '@/services/auth'
import { RegisterForm } from '@/types/auth'

const Register = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    mode: 'onChange',
  })

  const [doRegister, { isLoading }] = usePostRegisterMutation()

  const onSubmit = async (formData: RegisterForm) => {
    const payload = {
      data: {
        attributes: { ...formData },
      },
    }

    try {
      await doRegister(payload).unwrap()
      alert('Registration successful! Please login.')
      router.push('/login')
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    }
  }

  return (
    <MobileLayout title='Register'>
      <div className='min-w-screen flex min-h-screen grow flex-col items-center justify-center space-y-10 px-10'>
        <h1 className='text-[24px]'>Create Account</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col space-y-5'
        >
          <div className='flex flex-col space-y-2'>
            <label htmlFor='staffId' className='text-sm font-semibold text-black'>
              Staff ID
            </label>
            <input
              {...register('staffId', { required: 'Staff ID is required!' })}
              id='staffId'
              type='text'
              className='placeholder:text-placeholder w-full rounded border border-solid border-[#EAEAEA] px-2.5 py-3 text-sm font-semibold text-black placeholder:font-bold focus:border-[#EAEAEA] focus:ring-transparent'
              placeholder='e.g. STF001'
            />
            {errors.staffId && <p className='text-xs text-red-500'>{errors.staffId.message}</p>}
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col space-y-2'>
              <label htmlFor='firstName' className='text-sm font-semibold text-black'>
                First Name
              </label>
              <input
                {...register('firstName', { required: 'First name is required!' })}
                id='firstName'
                type='text'
                className='placeholder:text-placeholder w-full rounded border border-solid border-[#EAEAEA] px-2.5 py-3 text-sm font-semibold text-black placeholder:font-bold focus:border-[#EAEAEA] focus:ring-transparent'
                placeholder='John'
              />
              {errors.firstName && <p className='text-xs text-red-500'>{errors.firstName.message}</p>}
            </div>

            <div className='flex flex-col space-y-2'>
              <label htmlFor='lastName' className='text-sm font-semibold text-black'>
                Last Name
              </label>
              <input
                {...register('lastName', { required: 'Last name is required!' })}
                id='lastName'
                type='text'
                className='placeholder:text-placeholder w-full rounded border border-solid border-[#EAEAEA] px-2.5 py-3 text-sm font-semibold text-black placeholder:font-bold focus:border-[#EAEAEA] focus:ring-transparent'
                placeholder='Doe'
              />
              {errors.lastName && <p className='text-xs text-red-500'>{errors.lastName.message}</p>}
            </div>
          </div>

          <div className='flex flex-col space-y-2'>
            <label htmlFor='email' className='text-sm font-semibold text-black'>
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email is required!',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
              })}
              id='email'
              type='email'
              className='placeholder:text-placeholder w-full rounded border border-solid border-[#EAEAEA] px-2.5 py-3 text-sm font-semibold text-black placeholder:font-bold focus:border-[#EAEAEA] focus:ring-transparent'
              placeholder='john@example.com'
            />
            {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
          </div>

          <div className='flex flex-col space-y-2'>
            <label htmlFor='username' className='text-sm font-semibold text-black'>
              Username
            </label>
            <input
              {...register('username', { required: 'Username is required!' })}
              id='username'
              type='text'
              className='placeholder:text-placeholder w-full rounded border border-solid border-[#EAEAEA] px-2.5 py-3 text-sm font-semibold text-black placeholder:font-bold focus:border-[#EAEAEA] focus:ring-transparent'
              placeholder='johndoe'
            />
            {errors.username && <p className='text-xs text-red-500'>{errors.username.message}</p>}
          </div>

          <div className='flex flex-col space-y-2'>
            <label htmlFor='password' className='text-sm font-semibold text-black'>
              Password
            </label>
            <input
              {...register('password', {
                required: 'Password is required!',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              id='password'
              type='password'
              className='placeholder:text-placeholder w-full rounded border border-solid border-[#EAEAEA] px-2.5 py-3 text-sm font-semibold text-black placeholder:font-bold focus:border-[#EAEAEA] focus:ring-transparent'
              placeholder='••••••••'
            />
            {errors.password && <p className='text-xs text-red-500'>{errors.password.message}</p>}
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full rounded-md border bg-blue-500 py-2 text-[24px] text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-300'
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>

          <p className='text-center text-sm text-gray-600'>
            Already have an account?{' '}
            <Link href='/login'>
              <span className='cursor-pointer font-semibold text-blue-500 hover:text-blue-400'>
                Login here
              </span>
            </Link>
          </p>
        </form>
      </div>
    </MobileLayout>
  )
}

export default Register
