import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AccessGate({ session, feature, children }) {
  if (!session) {
    return <Navigate to="/login" replace />
  }
  // Check if access expired (session.accessExpiry provided by Firestore)
  if (session.accessExpiry) {
    const expiryDate = new Date(session.accessExpiry)
    if (new Date() > expiryDate) {
      return (
        <div className="min-h-screen bg-primary-dark pt-24 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center max-w-md"
          >
            <h2 className="text-2xl font-bold text-white mb-4">⏰ Access Expired</h2>
            <p className="text-gray-300 mb-6">
              Your access has expired. Please contact your administrator to renew your access.
            </p>
            <p className="text-gray-400 text-sm">Expires: {expiryDate.toLocaleString()}</p>
          </motion.div>
        </div>
      )
    }
  }

  // Check if admin
  if (session.role === 'admin') return children

  // Check if feature is available (features are loaded into session from Firestore)
  const accessibleFeatures = session.role === 'admin' ? ['home', 'videos', 'portfolio', 'files', 'notes'] : (session.features || [])
  if (!accessibleFeatures.includes(feature)) {
    return (
      <div className="min-h-screen bg-primary-dark pt-24 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-md"
        >
          <h2 className="text-2xl font-bold text-white mb-4">🔒 Access Denied</h2>
          <p className="text-gray-300 mb-6">
            You don't have access to this feature. Contact your administrator to request access.
          </p>
          <p className="text-gray-400 text-sm font-semibold">Feature: {feature}</p>
        </motion.div>
      </div>
    )
  }

  return children
}
