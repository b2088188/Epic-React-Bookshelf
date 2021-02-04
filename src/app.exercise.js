import React, {lazy, Suspense} from 'react'
import {useAuth} from './context/auth-context'
import {BrowserRouter as Router} from 'react-router-dom'
import {FullPageSpinner} from './components/lib'
const AuthenticatedApp = lazy(() =>
  import(/* webpackPrefetch: true */ './authenticated-app'),
)
const UnauthenticatedApp = lazy(() => import('./unauthenticated-app'))

function App() {
  const {user} = useAuth()

  return (
    <Suspense fallback={FullPageSpinner}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </Suspense>
  )
}

export {App}
