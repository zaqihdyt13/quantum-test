import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Skeleton from '@/components/Skeleton'
import { useAttendance } from '@/hooks/useAttendance'
import { useLiveClock } from '@/hooks/useLiveClock'
import Blank from '@/layouts/Blank'

export default function Home() {
  const router = useRouter()
  const { t } = useTranslation(['common', 'home'])
  const currentTime = useLiveClock()

  const {
    isClockedIn,
    isClockedOut,
    message,
    workDuration,
    staffId,
    isLoading,
    loadingIn,
    loadingOut,
    handleClockIn,
    handleClockOut,
  } = useAttendance()

  let statusBadge = { text: `Status: ${t('home:pending')}`, color: 'bg-yellow-100 text-yellow-800' }
  if (isClockedIn) {
    statusBadge = { text: `Status: ${t('home:working')}`, color: 'bg-green-100 text-green-800' }
  } else if (isClockedOut) {
    statusBadge = { text: `Status: ${t('home:finished')}`, color: 'bg-blue-100 text-blue-800' }
  }

  return (
    <Blank title={t('home:title')}>
      <main className='min-h-screen bg-gray-100'>
        <section className='mx-auto min-h-screen max-w-screen-sm bg-white py-10'>
          <div className='mt-10 flex flex-row justify-center'>
            <div className='w-full max-w-md space-y-8 rounded-xl bg-white p-8'>
              {isLoading ? (
                <Skeleton className='h-80 rounded-md' />
              ) : (
                <>
                  <div className='rounded-lg border border-blue-200 bg-blue-50 p-6 text-center'>
                    <p className='text-sm font-medium text-blue-600'>{t('home:current-time')}</p>
                    <p className='my-2 text-4xl font-bold text-blue-900'>{currentTime || '00:00:00'}</p>
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.color}`}>
                      {statusBadge.text}
                    </span>
                  </div>

                  {message && (
                    <div className='rounded border bg-gray-100 p-3 text-center text-sm text-gray-700'>{t(message)}</div>
                  )}

                  <div className='flex flex-col gap-4'>
                    {isClockedOut && workDuration && (
                      <div className='rounded-lg border border-green-200 bg-green-50 p-4 text-center'>
                        <p className='text-sm font-medium text-green-600'>{t('home:working-hours')}</p>
                        <p className='mt-1 text-xl font-bold text-green-900'>{workDuration}</p>
                      </div>
                    )}

                    {isClockedOut ? (
                      <div className='w-full rounded-md bg-gray-200 px-4 py-3 text-center font-medium text-gray-500'>
                        {t('home:is-checkout')}
                      </div>
                    ) : !isClockedIn ? (
                      <button
                        onClick={handleClockIn}
                        disabled={loadingIn || !staffId}
                        className='w-full rounded-md bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700 disabled:opacity-50'
                      >
                        {loadingIn ? 'Processing...' : 'Clock In'}
                      </button>
                    ) : (
                      <button
                        onClick={handleClockOut}
                        disabled={loadingOut}
                        className='w-full rounded-md bg-red-600 px-4 py-3 text-white transition-colors hover:bg-red-700 disabled:opacity-50'
                      >
                        {loadingOut ? 'Processing...' : 'Clock Out'}
                      </button>
                    )}
                  </div>
                </>
              )}

              <div className='mt-4 text-center'>
                <Link
                  href={{ pathname: '/staff', query: { lang: router.query.lang } }}
                  locale={router.locale}
                >
                  <span className='cursor-pointer text-sm text-blue-600 hover:underline'>{t('home:staffs-link')}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Blank>
  )
}
