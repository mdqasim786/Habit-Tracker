import { motion } from 'framer-motion'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { DataProvider } from '@/context/DataContext'
import { Shell, LogoMark } from '@/components/layout/Shell'
import { LoginPage } from '@/pages/Login'
import { SetupPage } from '@/pages/Setup'

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}

function Gate() {
  const { user, loading, configured } = useAuth()

  if (!configured) return <SetupPage />
  if (loading) return <Splash />
  if (!user) return <LoginPage />

  return (
    <DataProvider>
      <Shell />
    </DataProvider>
  )
}

function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
      >
        <LogoMark />
      </motion.div>
    </div>
  )
}