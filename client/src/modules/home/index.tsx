import { NextPage } from 'next'
import React from 'react'

import Navbar from '@/components/Navbar'

import Home from './Home'

const Page: NextPage = () => {
  return (
    <>
      <Navbar />
      <Home />
    </>
  )
}

export default Page
