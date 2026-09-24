import React, { useState } from 'react'

import { useGetDetailStaffQuery,useGetListStaffsQuery } from '@/services/staffs'

interface StaffDetailDialogProps {
  staffId: string
  onClose: () => void
}

const StaffDetailDialog: React.FC<StaffDetailDialogProps> = ({ staffId, onClose }) => {
  const { data: staffData, isLoading } = useGetDetailStaffQuery(staffId)
  const staff = staffData?.data?.[0]?.attributes

  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center bg-black/50'
      onClick={onClose}
    >
      <div
        className='mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-gray-100 px-6 py-4'>
          <h3 className='text-lg font-bold text-gray-900'>Staff Detail</h3>
          <button
            onClick={onClose}
            className='flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
          >
            <svg
              className='size-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='px-6 py-5'>
          {isLoading ? (
            <div className='space-y-4'>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='animate-pulse'
                >
                  <div className='mb-1 h-3 w-20 rounded bg-gray-200' />
                  <div className='h-5 w-full rounded bg-gray-100' />
                </div>
              ))}
            </div>
          ) : staff ? (
            <div className='space-y-4'>
              <div className='flex items-center gap-4 pb-4'>
                <div className='flex size-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white'>
                  {(staff.firstName?.[0] ?? '').toUpperCase()}
                  {(staff.lastName?.[0] ?? '').toUpperCase()}
                </div>
                <div>
                  <p className='text-lg font-bold text-gray-900'>
                    {staff.firstName} {staff.lastName}
                  </p>
                  <p className='text-sm text-gray-500'>Staff ID: {staff.staffId}</p>
                </div>
              </div>

              <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
                <div className='grid gap-3'>
                  <div>
                    <p className='text-xs font-medium uppercase text-gray-500'>Email</p>
                    <p className='text-sm font-semibold text-gray-800'>{staff.email || '-'}</p>
                  </div>
                  <div>
                    <p className='text-xs font-medium uppercase text-gray-500'>First Name</p>
                    <p className='text-sm font-semibold text-gray-800'>{staff.firstName || '-'}</p>
                  </div>
                  <div>
                    <p className='text-xs font-medium uppercase text-gray-500'>Last Name</p>
                    <p className='text-sm font-semibold text-gray-800'>{staff.lastName || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className='text-sm text-gray-500'>Staff data not found.</p>
          )}
        </div>

        <div className='border-t border-gray-100 px-6 py-4'>
          <button
            onClick={onClose}
            className='w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

interface StaffListDialogProps {
  onClose: () => void
}

const StaffListDialog: React.FC<StaffListDialogProps> = ({ onClose }) => {
  const { data: staffData, isLoading } = useGetListStaffsQuery({ page: 0, pageSize: 20 })
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)

  return (
    <>
      <div
        className='fixed inset-0 z-[60] flex items-center justify-center bg-black/50'
        onClick={onClose}
      >
        <div
          className='mx-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex items-center justify-between border-b border-gray-100 px-6 py-4'>
            <h3 className='text-lg font-bold text-gray-900'>Staff Members</h3>
            <button
              onClick={onClose}
              className='flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
            >
              <svg
                className='size-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          <div className='max-h-[60vh] overflow-y-auto px-6 py-4'>
            {isLoading ? (
              <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='animate-pulse rounded-xl border border-gray-100 bg-gray-50 p-4'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='size-10 rounded-full bg-gray-200' />
                      <div className='flex-1 space-y-1.5'>
                        <div className='h-4 w-32 rounded bg-gray-200' />
                        <div className='h-3 w-24 rounded bg-gray-100' />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : staffData?.data && staffData.data.length > 0 ? (
              <div className='space-y-2'>
                {staffData.data.map((staff) => (
                  <div
                    key={staff?.attributes?.staffId}
                    className='flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex size-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700'>
                        {(staff.attributes?.firstName?.[0] ?? '').toUpperCase()}
                        {(staff.attributes?.lastName?.[0] ?? '').toUpperCase()}
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-gray-800'>
                          {staff.attributes?.firstName} {staff.attributes?.lastName}
                        </p>
                        <p className='text-xs text-gray-500'>{staff.attributes?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStaffId(staff.attributes?.id)}
                      className='rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700'
                    >
                      Detail
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-8 text-center'>
                <p className='text-sm text-gray-500'>No staff members found.</p>
              </div>
            )}
          </div>

          <div className='border-t border-gray-100 px-6 py-4'>
            <button
              onClick={onClose}
              className='w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50'
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {selectedStaffId && (
        <StaffDetailDialog
          staffId={selectedStaffId}
          onClose={() => setSelectedStaffId(null)}
        />
      )}
    </>
  )
}

export default StaffListDialog
