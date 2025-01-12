


import React from 'react'
import Button from '../Button'
import { ToggleContext } from './Toggle'

const ToggleButton = ({ children , className }) => {
  const { toggle } = React.useContext(ToggleContext)
  
  return (
    <Button className={className} onClick={toggle}>
        {children}
    </Button>
  )
}

export default ToggleButton