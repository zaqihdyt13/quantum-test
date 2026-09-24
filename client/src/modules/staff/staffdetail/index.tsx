import { NextPage } from 'next'
import React from 'react'

import Navbar from '@/components/Navbar'

import StaffDetail from './StaffDetail'

const Page: NextPage = () => {
  return (
    <>
      <Navbar />
      <StaffDetail />
    </>
  )
}

export default Page
