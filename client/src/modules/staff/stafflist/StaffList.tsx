import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BackButton } from '@/components/BackButton'
import Skeleton from '@/components/Skeleton'
import { StaffsMapping } from '@/components/staff/StaffsMapping'
import Blank from '@/layouts/Blank'
import { useGetSelfUserQuery } from '@/services/auth'
import { useGetListStaffsQuery } from '@/services/staffs'
import { StaffBrowseRequest } from '@/types/staff'

const StaffList: FC = () => {
  const { t } = useTranslation(['stafflist', 'common'])

  const [query] = useState<StaffBrowseRequest>({
    page: 0,
    pageSize: 5,
  })

  const { data: staffs, isLoading } = useGetListStaffsQuery(query)

  const { data: selfUserData } = useGetSelfUserQuery()
  const userDataAny = selfUserData?.data as any
  const loggedInStaffId = userDataAny?.id || (selfUserData?.data as any)?.[0]?.id || ''

  return (
    <Blank title={t('stafflist:title')}>
      <main className='min-h-screen bg-gray-100'>
        <section className='mx-auto min-h-screen max-w-screen-sm bg-white py-10'>
          <BackButton
            href='/'
            label={t('common:backTo', { page: t('common:titles.home') })}
          />

          <div className='mx-3 mt-6 grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-1 lg:grid-cols-2'>
            {isLoading &&
              [1, 2, 3, 4].map((_, idx) => (
                <Skeleton
                  className='h-80 rounded-md'
                  key={idx}
                />
              ))}

            <StaffsMapping
              staffs={staffs}
              loggedInStaffId={loggedInStaffId}
            />
          </div>
        </section>
      </main>
    </Blank>
  )
}

export default StaffList
