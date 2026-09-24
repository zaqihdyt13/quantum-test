import React, { FC } from 'react'

type StaffAttributes = {
  firstName?: string
  lastName?: string
  fullName?: string
  username?: string
}

type ProfileHeaderProps = {
  staffAttributes: StaffAttributes
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ staffAttributes }) => {
  return (
    <div className='mx-3 mt-6 grid w-full place-items-center'>
      <div className='group relative'>
        <div className='mx-auto size-40 overflow-hidden rounded-full bg-gray-200'>
          <img
            src={`https://ui-avatars.com/api/?name=${staffAttributes?.firstName || 'User'}+${
              staffAttributes?.lastName || ''
            }&background=0D8ABC&color=fff`}
            alt={staffAttributes?.firstName}
            className='size-full object-cover object-center'
            loading='lazy'
          />
        </div>

        <div className='mt-4 text-center'>
          <h3 className='text-lg font-bold text-gray-800'>
            {staffAttributes?.fullName || `${staffAttributes?.firstName || ''} ${staffAttributes?.lastName || ''}`}
          </h3>
        </div>
      </div>
    </div>
  )
}
