import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

type EditProfileFormProps = {
  isUpdating: boolean
  message: string
  firstName: string
  lastName: string
  username: string
  setFirstName: (value: string) => void
  setLastName: (value: string) => void
  setUsername: (value: string) => void
  handleUpdate: (e: React.FormEvent) => void
}

export const EditProfileForm: FC<EditProfileFormProps> = ({
  isUpdating,
  message,
  firstName,
  lastName,
  username,
  setFirstName,
  setLastName,
  setUsername,
  handleUpdate,
}) => {
  const { t } = useTranslation(['staffdetail'])

  const isSuccess = message.includes('successfully') || message.includes('berhasil')

  return (
    <form
      onSubmit={handleUpdate}
      className='space-y-4'
    >
      <h2 className='text-md font-semibold text-gray-700'>{t('staffdetail:title')}</h2>

      {message && (
        <div className={`rounded p-3 text-sm ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div>
        <label className='block text-xs font-medium text-gray-600'>{t('staffdetail:firstname')}</label>
        <input
          type='text'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className='mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none'
          required
        />
      </div>

      <div>
        <label className='block text-xs font-medium text-gray-600'>{t('staffdetail:lastname')}</label>
        <input
          type='text'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className='mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none'
          required
        />
      </div>

      <div>
        <label className='block text-xs font-medium text-gray-600'>{t('staffdetail:username')}</label>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none'
          required
        />
      </div>

      <button
        type='submit'
        disabled={isUpdating}
        className='w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
      >
        {isUpdating ? t('common:processing') : t('staffdetail:save-changes')}
      </button>
    </form>
  )
}
