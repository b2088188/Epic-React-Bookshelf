/** @jsx jsx */
import {jsx} from '@emotion/core'
import React, {useCallback, useMemo} from 'react'
import {useContext, createContext} from 'react'
import {useQueryClient} from 'react-query'
import * as auth from 'auth-provider'
import {FullPageSpinner} from 'components/lib'
import * as colors from 'styles/colors'
import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'

const AuthContext = createContext()
AuthContext.displayName = 'AuthContext'

function useAuth() {
	const context = useContext(AuthContext)
	if (!context) throw new Error('useAuth must have to use a AuthProvider')
	return context
}

function useClient() {
	const {
		user: {token},
	} = useAuth()
	// Exposing an authenticated version of client
	return useCallback(
		function (endpoint, config) {
			return client(endpoint, {...config, token})
		},
		[token],
	)
}

async function getUser() {
	let user = null

	const token = await auth.getToken()
	if (token) {
		const data = await client('me', {token})
		user = data.user
	}

	return user
}

function AuthProvider(props) {
	const queryClient = useQueryClient()
	const {
		data: user,
		error,
		isLoading,
		isIdle,
		isError,
		isSuccess,
		run,
		setData,
	} = useAsync()

	React.useEffect(() => {
		run(getUser())
	}, [run])

	const login = useCallback(
		form => auth.login(form).then(user => setData(user)),
		[setData],
	)
	const register = useCallback(
		form => auth.register(form).then(user => setData(user)),
		[setData],
	)
	const logout = useCallback(() => {
		auth.logout()
		queryClient.clear()
		setData(null)
	}, [setData])

	const value = useMemo(() => ({user, login, register, logout}), [
		user,
		login,
		register,
		logout,
	])

	if (isLoading || isIdle) {
		return <FullPageSpinner />
	}

	if (isError) {
		return (
			<div
				css={{
					color: colors.danger,
					height: '100vh',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<p>Uh oh... There's a problem. Try refreshing the app.</p>
				<pre>{error.message}</pre>
			</div>
		)
	}

	if (isSuccess) return <AuthContext.Provider value={value} {...props} />
}

export {AuthProvider, useAuth, useClient}
