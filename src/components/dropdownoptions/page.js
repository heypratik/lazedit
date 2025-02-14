import Image from 'next/image'
import React from 'react'

const Dropdown = ({onSelect, selectedOption}) => {
  const toggleDropdown = () => {
    document.querySelector('.dropdown-menu').classList.toggle('show')
  }
  return (
    <>
      <input
        type="text"
        className="form-control border-dark w-100"
        placeholder="Select an option"
        style={{cursor: 'pointer'}}
        value={selectedOption}
        readOnly
        onClick={toggleDropdown}
      />
      <Image
        src="/Drop Down.svg"
        alt="Dropdown Arrow"
        style={{cursor: 'pointer'}}
        className="dropdown-arrow position-absolute end-0 me-3 mt-1"
        width={30}
        height={30}
        onClick={toggleDropdown}
      />
      <div className="dropdown-menu position-absolute mt-5 w-100">
        <ul className='list-unstyled text-center m-0'>
          <li style={{cursor: 'pointer', fontWeight: '500'}} onClick={() => onSelect('Template')}>Template</li>
          <li style={{cursor: 'pointer', fontWeight: '500'}} onClick={() => onSelect('AI background')}>AI background</li>
          <li style={{cursor: 'pointer', fontWeight: '500'}} onClick={() => onSelect('Features')}>Features</li>
          <li style={{cursor: 'pointer', fontWeight: '500'}} onClick={() => onSelect('Image Upload')}>Image Upload</li>
        </ul>
      </div>
    </>
  )
}

export default Dropdown