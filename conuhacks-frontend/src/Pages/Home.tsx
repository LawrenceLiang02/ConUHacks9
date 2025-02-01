import React from 'react'
import CardComponent from '../Components/CardCompoenent'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className='px-[7%] pt-4'>
        <div>
            <p className='text-4xl font-semibold'>Welcome Chef!</p>
        </div>

        <Link to="/" className='w-full h-auto flex flex-row justify-end py-2'>
            <p className=' text-blue-400 hover:scale-[105%] hover:underline'>
                More recipes
            </p>
        </Link>

        <div className='w-full h-96 flex flex-row items-center justify-between space-x-6'>
            <CardComponent></CardComponent>
            <CardComponent></CardComponent>
            <CardComponent></CardComponent>
            <CardComponent></CardComponent>
            <CardComponent></CardComponent>
        </div>
        
    </div>
  )
}
