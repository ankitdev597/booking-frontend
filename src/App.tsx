import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BookingPage } from './pages/BookingPage'
import { AuthPage } from './pages/AuthPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

function AppRoutes() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <BookingPage /> : <AuthPage />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  )
}
