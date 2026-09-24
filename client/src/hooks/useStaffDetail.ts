import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { useGetSelfUserQuery } from '@/services/auth'
import { useGetDetailStaffQuery, usePutStaffMutation } from '@/services/staffs'

export function useStaffDetail() {
  const router = useRouter()
  const staffIdFromRoute = router.query.id ? String(router.query.id) : ''

  const { data: selfUserData } = useGetSelfUserQuery()
  const userDataAny = selfUserData?.data as any
  const loggedInStaffId = userDataAny?.id || (selfUserData?.data as any)?.[0]?.id || ''

  const { data: staffDetailData } = useGetDetailStaffQuery(staffIdFromRoute, {
    skip: !staffIdFromRoute,
  })

  const staffItem = staffDetailData?.data?.[0] || staffDetailData?.data
  const staffDataAny = staffItem as any
  const staffAttributes = Array.isArray(staffDataAny) ? staffDataAny[0]?.attributes : staffDataAny?.attributes

  const [putStaff, { isLoading: isUpdating }] = usePutStaffMutation()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (staffAttributes) {
      setFirstName(staffAttributes.firstName || '')
      setLastName(staffAttributes.lastName || '')
      setUsername(staffAttributes.username || '')
    }
  }, [staffAttributes])

  const isOwner = String(loggedInStaffId) === String(staffIdFromRoute)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isOwner) {
      setMessage('staffdetail:validate-message')
      return
    }

    try {
      setMessage('')
      await putStaff({
        id: staffIdFromRoute,
        data: {
          type: 'staffs',
          attributes: { firstName, lastName, username },
        },
      }).unwrap()
      setMessage('staffdetail:update-smessage')
    } catch (error: any) {
      setMessage(error?.data?.message || 'staffdetail:update-emessage')
    }
  }

  return {
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
  }
}
