import { deleteCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Language from '@/components/Language'

export default function Navbar() {
  const router = useRouter()
  const { t } = useTranslation(['common', 'home'])
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/', label: t('common:titles.home', 'Home') },
    { href: '/staff', label: t('common:staffs-link', 'Staff') },
  ]

  const handleLogout = () => {
    deleteCookie('hris-uat', { path: '/' })
    window.location.href = '/login'
  }

  return (
    <nav className='sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex items-center'>
            <Link
              href={{ pathname: '/', query: { lang: router.query.lang } }}
              locale={router.locale}
            >
              <span className='cursor-pointer text-xl font-bold text-green-600 transition-colors hover:text-gray-800'>
                Quantum Test
              </span>
            </Link>
          </div>

          <div className='hidden items-center space-x-6 md:flex'>
            {navLinks.map((link) => {
              const isActive =
                router.pathname === link.href || (link.href !== '/' && router.pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={{ pathname: link.href, query: { lang: router.query.lang } }}
                  locale={router.locale}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'font-semibold text-green-600' : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <span
                    className={`cursor-pointer text-sm font-medium transition-colors ${
                      isActive ? 'font-semibold text-green-600' : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              )
            })}

            <div className='border-l border-gray-200 pl-4'>
              <Language />
            </div>
            <button
              onClick={handleLogout}
              className='rounded-md border border-red-600 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50'
            >
              {t('home:logout')}
            </button>
          </div>

          <div className='flex items-center space-x-3 md:hidden'>
            <Language />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none'
              aria-label='Toggle Menu'
            >
              <svg
                className='size-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                {isOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className='space-y-2 border-b border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden'>
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href
            return (
              <Link
                key={link.href}
                href={{ pathname: link.href, query: { lang: router.query.lang } }}
                locale={router.locale}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
