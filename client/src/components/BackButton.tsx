import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

interface BackButtonProps {
  href: string
  label: string
}

export const BackButton: FC<BackButtonProps> = ({ href, label }) => {
  const router = useRouter()

  return (
    <div className='flex flex-row justify-start px-4 sm:px-0'>
      <Link
        href={{ pathname: href, query: { lang: router.query.lang } }}
        locale={router.locale}
      >
        <a className='mt-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline'>
          <svg
            className='mr-2 size-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          {label}
        </a>
      </Link>
    </div>
  )
}
