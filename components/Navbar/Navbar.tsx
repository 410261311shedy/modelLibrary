import React from 'react'

interface NavbarProps{
    className?:string;
}
const Navbar:React.FC<NavbarProps> = ({className,}) => {
  return (
    <div>navbar</div>
  )
}

export default Navbar