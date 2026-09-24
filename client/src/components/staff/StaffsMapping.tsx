import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { StaffBrowseResponse } from '@/types/staff'

type StaffsMappingProps = {
  staffs: StaffBrowseResponse | undefined
  loggedInStaffId: string
}

export const StaffsMapping: FC<StaffsMappingProps> = ({ staffs, loggedInStaffId }) => {
  const router = useRouter()
  const { t } = useTranslation(['stafflist'])

  return (
    <>
      {staffs?.data?.map(({ attributes }, index: number) => {
        const isSelf = loggedInStaffId && String(attributes.id) === String(loggedInStaffId)

        return (
          <div
            key={index}
            className='group relative'
          >
            <div className='aspect-h-1 aspect-w-1 min-h-80 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80'>
              <img
                src={`https://ui-avatars.com/api/?name=${attributes.firstName}+${attributes.lastName}&background=0D8ABC&color=fff`}
                alt={attributes.fullName}
                className='size-full object-cover object-center lg:size-full'
                loading='lazy'
              />
            </div>

            <div className='mt-4'>
              <h3 className='text-sm text-gray-700'>
                <Link href={{ pathname: `/staff/${attributes.id}`, query: { lang: router.query.lang } }}>
                  <a>
                    <span
                      aria-hidden='true'
                      className='absolute inset-0'
                    />
                    {attributes.firstName} {attributes.lastName}
                    {isSelf && <span className='ml-1 font-bold text-gray-500'>{t('stafflist:myself')}</span>}
                  </a>
                </Link>
              </h3>
            </div>
          </div>
        )
      })}
    </>
  )
}
