import React from 'react';

export function Alert({message}) {
  return (
    <div className='border p-2 m-2 w-50 border-danger bg-danger text-white d-flex flex-wrap'>
      <span>{message}</span>
    </div>
  )
}