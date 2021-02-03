import React from 'react'
import {useAuth} from './context/auth-context'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

function App() {
  const {user} = useAuth()

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

export {App}
