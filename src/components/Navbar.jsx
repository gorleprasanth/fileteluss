import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { logoutUser } from '../utils/auth'

export default function Navbar({ session, setSession }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  // Get accessible features from session (features loaded from Firestore)
  const accessibleFeatures = session.role === 'admin' ? ['home', 'videos', 'portfolio', 'files', 'notes'] : (session.features || [])

  const handleLogout = async () => {
    await logoutUser()
    setSession(null)
    navigate('/login', { replace: true })
  }

  // Show feature in navbar if it's in accessible features or if admin
  const hasFeature = (feature) => {
    return session.role === 'admin' || accessibleFeatures.includes(feature)
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[9999] backdrop-blur-xl border-b border-cyan-500/[0.2]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        position: 'fixed', 
        zIndex: 9999,
        background: 'linear-gradient(to bottom, rgba(13, 27, 42, 0.95), rgba(13, 27, 42, 0.8))'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent"
            >
              FileTelus
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-300 hover:text-cyan-400-300 font-medium transition-colors duration"
              >
                Home
              </motion.button>
            </Link>

            {/* Telus Dropdown - Videos and Portfolio */}
            {(session.role === 'admin' || accessibleFeatures.includes('videos') || accessibleFeatures.includes('portfolio')) && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-4 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 font-medium"
                >
                  Telus
                  <motion.svg
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </motion.svg>
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 w-48 backdrop-blur-xl border border-cyan-500/[0.3] rounded-xl shadow-2xl overflow-hidden"
                      style={{
                        zIndex: 10000,
                        background: 'rgba(13, 27, 42, 0.95)'
                      }}
                    >
                      {(session.role === 'admin' || accessibleFeatures.includes('videos')) && (
                        <Link to="/videos">
                          <motion.div
                            whileHover={{ x: 4, backgroundColor: 'rgba(0, 217, 255, 0.1)' }}
                            className="px-4 py-3 text-gray-300 hover:text-cyan-400 cursor-pointer transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Videos
                          </motion.div>
                        </Link>
                      )}
                      {(session.role === 'admin' || accessibleFeatures.includes('portfolio')) && (
                        <Link to="/portfolio">
                          <motion.div
                            whileHover={{ x: 4, backgroundColor: 'rgba(0, 217, 255, 0.1)' }}
                            className="px-4 py-3 text-gray-300 hover:text-cyan-400 cursor-pointer transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Portfolio
                          </motion.div>
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Admin Link */}
            {session.role === 'admin' && (
              <Link to="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors duration-300"
                >
                  Admin
                </motion.button>
              </Link>
            )}
          </div>

          {/* Right Side - User & Logout */}
          <div className="flex items-center gap-4">
            <motion.div 
              className="hidden sm:flex items-center gap-3 px-4 py-2 backdrop-blur-xl rounded-xl border border-cyan-500/[0.2]"
              whileHover={{ scale: 1.02, borderColor: 'rgba(0, 217, 255, 0.4)' }}
              transition={{ duration: 0.2 }}
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {session.name.charAt(0).toUpperCase()}
                </motion.div>
                <div>
                  <p className="text-white text-sm font-semibold">{session.name}</p>
                  {session.role !== 'user' && (
                    <p className="text-cyan-400 text-xs font-semibold uppercase">{session.role}</p>
                  )}
                </div>
              </div>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
              style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
