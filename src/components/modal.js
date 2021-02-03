/** @jsx jsx */
import {jsx} from '@emotion/core'

import React, {useState, createContext, useContext, cloneElement} from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog, CircleButton} from './lib'

const ModalContext = createContext()

const Modal = ({children}) => {
  const [isOpen, setIsOpen] = useState(false)

  // Share open state to ModalDismissButton, ModalOpenButton, ModalContents
  const value = {
    isOpen,
    setIsOpen,
  }
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

const ModalDismissButton = ({children: child}) => {
  // Consume Modal context to get the function
  const {setIsOpen} = useContext(ModalContext)

  // Giving the close Modal functionality to child (Close Button)
  // And also allow close button to add addtional onClick functionality
  return cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

const ModalOpenButton = ({children: child}) => {
  // Consume Modal context to get the function
  const {setIsOpen} = useContext(ModalContext)

  // Giving the open Modal functionality to child (Open Button)
  // And also allow open button to add addtional onClick functionality
  return cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

// Custom Modal with close button and title
const ModalContents = ({title, children, ...props}) => {
  return (
    <ModalContentsBase {...props}>
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

// Base Modal
const ModalContentsBase = props => {
  const {isOpen, setIsOpen} = useContext(ModalContext)

  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

function callAll(...fns) {
  return function (...args) {
    fns.forEach(fn => {
      fn && fn(...args)
    })
  }
}

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents}
