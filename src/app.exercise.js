/** @jsx jsx */
import {jsx} from '@emotion/core'

import React, {useState, useEffect} from 'react'
import * as auth from 'auth-provider'
import {client} from './utils/api-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {useAsync} from './utils/hooks'

async function getUser() {
  let user = null
  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}
function App() {
  //const {data: user, error, isIdle, isLoading, isSuccess, isError, run, setData} = useAsync()
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser().then(user => setUser(user))
  }, [])

  async function login(form) {
    try {
      const user = await auth.login(form)
      setUser(user)
    } catch (err) {}
  }
  async function register(form) {
    try {
      const user = await auth.register(form)
      setUser(user)
    } catch (err) {}
  }

  async function logout() {
    await auth.logout()
    setUser(null)
  }

  if (user) return <AuthenticatedApp user={user} logout={logout} />
  return <UnauthenticatedApp login={login} register={register} />
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
