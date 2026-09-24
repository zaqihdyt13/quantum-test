import { NextPage } from 'next'
import React from 'react'

import Navbar from '@/components/Navbar'

import StaffList from './StaffList'

const Page: NextPage = () => {
  return (
    <>
      <Navbar />
      <StaffList />
    </>
  )
}

export default Page
