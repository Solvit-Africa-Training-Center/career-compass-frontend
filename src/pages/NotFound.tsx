import { Button } from '@/components/ui/Button'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
    <div className='flex justify-center mt-[10rem]  flex-col items-center'>
        <h1 className=' text-center mt-8 text-red-500 font-bold text-7xl mb-3'>404</h1>
        <h2 className='text-center text-3xl mt-3 font-medium text-gray-700'>Page you are Trying to Access does not exist!</h2>
        <div>
            <Button
            className="w-full h-12 mt-8 bg-primarycolor-500 hover:bg-primarycolor-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base rounded-md transition-colors duration-300"
            >
                <Link to="/login" className='text-white  font-bold text-xl' > Go back to login</Link>
            </Button>
        </div>
    </div>
</>
  )
}

export default NotFound