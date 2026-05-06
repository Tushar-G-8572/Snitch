import React from 'react'

const Loader = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center'>
     <img className='w-[60px] h-[60px] sm:w-[75px] sm:h-[75px] md:w-[85px] md:h-[85px] lg:w-[100px] lg:h-[100px]' src="/svg.svg" alt="Loading..." />
    </div>
  )
}

export default Loader