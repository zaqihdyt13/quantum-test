import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { BackButton } from '@/components/BackButton'
import { EditProfileForm } from '@/components/staff/EditProfileForm'
import { ProfileHeader } from '@/components/staff/ProfileHeader'
import { useStaffDetail } from '@/hooks/useStaffDetail'
import Blank from '@/layouts/Blank'

const StaffDetail: FC = () => {
  const { t } = useTranslation(['common', 'stafflist', 'staffdetail'])

  const {
    staffAttributes,
    isOwner,
    isUpdating,
    message,
    firstName,
    lastName,
    username,
    setFirstName,
    setLastName,
    setUsername,
    handleUpdate,
  } = useStaffDetail()

  return (
    <Blank title={staffAttributes?.firstName || 'Loading...'}>
      <main className='min-h-screen bg-gray-100'>
        <section className='mx-auto min-h-screen max-w-screen-sm bg-white px-4 py-10'>
          <BackButton
            href='/staff'
            label={t('common:backTo', { page: t('stafflist:title') })}
          />

          <ProfileHeader staffAttributes={staffAttributes} />

          <div className='mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm'>
            {isOwner ? (
              <EditProfileForm
                isUpdating={isUpdating}
                message={t(message)}
                firstName={firstName}
                lastName={lastName}
                username={username}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setUsername={setUsername}
                handleUpdate={handleUpdate}
              />
            ) : (
              <div className='rounded-md border border-yellow-200 bg-yellow-50 p-4 text-center'>
                <p className='text-sm font-medium text-yellow-800'>{t('staffdetail:warn')}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </Blank>
  )
}

export default StaffDetail
