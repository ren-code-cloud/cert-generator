

import React from 'react'

const ToggleContext = React.createContext();

const Toggle = ({ children, className }) => {
  const [on, setOn] = React.useState(false)
  
  function toggle() {
     setOn((prev) => !prev)
     console.log(on)
  }

  return (
    <ToggleContext.Provider value={{ toggle , on}}>
        <div className={className}>
            {children}
        </div>
    </ToggleContext.Provider>
  )
}

export default Toggle
export { ToggleContext }