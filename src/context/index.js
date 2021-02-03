import {BrowserRouter as Router} from 'react-router-dom'
import React from 'react'
import {QueryClient, QueryClientProvider} from 'react-query'
import {AuthProvider} from './auth-context'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			//if has an error, react query will throw error to let error boundary to handle
			useErrorBoundary: true,
			// when user re-focus the app window, refetch data
			refetchOnWindowFocus: false,
			retry(failureCount, error) {
				if (error.status === 404) return false
				if (failureCount < 2) return true
				return false
			},
		},
	},
})

const AppProviders = ({children}) => {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<AuthProvider>{children}</AuthProvider>
			</Router>
		</QueryClientProvider>
	)
}

export {AppProviders}
