import {useContext, createContext} from 'react'

const AuthContext = createContext()

function useAuth() {
	const context = useContext(AuthContext)
	if (!context) throw new Error('useAuth must have to use a AuthProvider')
	return context
}

export {AuthContext, useAuth}
