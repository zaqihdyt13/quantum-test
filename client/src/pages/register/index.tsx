import dynamic from 'next/dynamic'

const Page = dynamic(() => import('@/modules/register'), { ssr: false })

export default Page
