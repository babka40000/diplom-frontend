import React from 'react'

// Компонента пункта левого меню 
const LeftBarMenuItem = props => {
  return (
    <div>
      <button className='left-bser-menu-point-main' onClick={props.onClickHandler}>{props.name}</button>
    </div>
  )
}

export default LeftBarMenuItem