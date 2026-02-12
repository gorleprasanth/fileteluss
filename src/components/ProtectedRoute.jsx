import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ProtectedRoute({ session, children, requireAdmin = false }) {
  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && session.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
