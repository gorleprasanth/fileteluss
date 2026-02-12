import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getNonAdminUsers, updateUserStatus, updateUserFeatures, updateUserRole, updateUserAccessExpiry } from '../utils/auth'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandedUser, setExpandedUser] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const nonAdminUsers = await getNonAdminUsers()
    setUsers(nonAdminUsers)
    setLoading(false)
  }

  const handleApprove = async (email) => {
    setLoading(true)
    await updateUserStatus(email, 'approved')
    await loadUsers()
    setLoading(false)
  }

  const handleReject = async (email) => {
    setLoading(true)
    await updateUserStatus(email, 'rejected')
    await loadUsers()
    setLoading(false)
  }

  const handleFeatureToggle = async (email, feature, isChecked) => {
    const user = users.find(u => u.email === email)
    const updatedFeatures = isChecked
      ? [...(user.features || []), feature]
      : (user.features || []).filter(f => f !== feature)
    
    setLoading(true)
    await updateUserFeatures(email, updatedFeatures)
    await loadUsers()
    setLoading(false)
  }

  const handleRoleChange = async (email, newRole) => {
    setLoading(true)
    await updateUserRole(email, newRole)
    await loadUsers()
    setLoading(false)
  }

  const handleExpiryChange = async (email, expiryDate) => {
    setLoading(true)
    await updateUserAccessExpiry(email, expiryDate)
    await loadUsers()
    setLoading(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const StatusBadge = ({ status }) => {
    if (status === 'pending') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="status-badge status-pending"
        >
          Awaiting Approval
        </motion.div>
      )
    }
    if (status === 'approved') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="status-badge status-approved"
        >
          Active
        </motion.div>
      )
    }
    if (status === 'rejected') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="status-badge status-rejected"
        >
          Rejected
        </motion.div>
      )
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-primary-dark pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-neon-blue to-blue-400 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Manage user registrations, roles, features, and access
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Users', value: users.length, color: 'neon-blue' },
            {
              label: 'Pending Approval',
              value: users.filter(u => u.status === 'pending').length,
              color: 'yellow-400',
            },
            {
              label: 'Approved',
              value: users.filter(u => u.status === 'approved').length,
              color: 'green-400',
            },
            {
              label: 'Premium Users',
              value: users.filter(u => u.role === 'premium').length,
              color: 'purple-400',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card p-6"
            >
              <p className={`text-3xl font-bold text-${stat.color} mb-2`}>{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Users List - Expandable */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {users.length > 0 ? (
              users.map((user, i) => (
                <motion.div
                  key={user.email}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="glass-card rounded-3xl overflow-hidden"
                >
                  {/* Main Row */}
                  <motion.div
                    onClick={() => setExpandedUser(expandedUser === user.email ? null : user.email)}
                    className="p-6 cursor-pointer hover:bg-white/[0.05] transition-colors"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      {/* Name & Email */}
                      <div className="md:col-span-2">
                        <p className="text-white font-bold">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>

                      {/* Status */}
                      <div>
                        <StatusBadge status={user.status} />
                      </div>

                      {/* Role */}
                      <div>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.email, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          disabled={loading}
                          className="px-3 py-1 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
                        >
                          <option value="user">User</option>
                          <option value="editor">Editor</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>

                      {/* Expiry */}
                      <div>
                        <p className="text-gray-300 text-sm">{formatDate(user.accessExpiry)}</p>
                      </div>

                      {/* Toggle Expand */}
                      <div className="flex justify-end">
                        <motion.svg
                          animate={{ rotate: expandedUser === user.email ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-5 h-5 text-neon-blue"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </motion.svg>
                      </div>
                    </div>
                  </motion.div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedUser === user.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/[0.1] p-6 bg-white/[0.02]"
                      >
                        <div className="space-y-6">
                          {/* Registered Date */}
                          <div>
                            <p className="text-gray-400 text-sm mb-2">Registered Date</p>
                            <p className="text-white">
                              {new Date(user.registeredAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>

                          {/* Feature Access */}
                          <div>
                            <p className="text-gray-400 text-sm mb-3 font-semibold">Feature Access</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {['home', 'videos', 'portfolio', 'files', 'notes'].map(feature => (
                                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={user.features && user.features.includes(feature)}
                                    onChange={(e) => handleFeatureToggle(user.email, feature, e.target.checked)}
                                    disabled={loading}
                                    className="w-4 h-4 rounded cursor-pointer"
                                  />
                                  <span className="text-white capitalize text-sm">{feature}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Access Expiry */}
                          <div>
                            <p className="text-gray-400 text-sm mb-2 font-semibold">Access Expiry Date</p>
                            <input
                              type="date"
                              value={user.accessExpiry ? user.accessExpiry.split('T')[0] : ''}
                              onChange={(e) => handleExpiryChange(user.email, e.target.value ? new Date(e.target.value).toISOString() : null)}
                              disabled={loading}
                              className="px-3 py-2 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white focus:outline-none focus:border-neon-blue"
                            />
                            {user.accessExpiry && new Date(user.accessExpiry) < new Date() && (
                              <p className="text-red-400 text-xs mt-2">⚠️ Access expired</p>
                            )}
                          </div>

                          {/* Approval Buttons */}
                          {user.status === 'pending' && (
                            <div className="flex gap-2 pt-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleApprove(user.email)}
                                disabled={loading}
                                className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 text-sm font-semibold"
                              >
                                Approve
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleReject(user.email)}
                                disabled={loading}
                                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 text-sm font-semibold"
                              >
                                Reject
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); window.open('https://github.com/gorleprasanth/telus/edit/main/users.json', '_blank') }}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 text-sm font-semibold"
                              >
                                Edit on GitHub
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center"
              >
                <p className="text-gray-400">No users to display</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Section */}
        <motion.div variants={itemVariants} className="mt-12 glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Access Control System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Roles */}
            <div>
              <h3 className="text-lg font-semibold text-neon-blue mb-3">📋 User Roles</h3>
              <ul className="space-y-2 text-gray-300">
                <li><strong>User:</strong> Basic access to assigned features</li>
                <li><strong>Editor:</strong> Can edit content & features</li>
                <li><strong>Premium:</strong> Full access to all premium features</li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-neon-blue mb-3">🎯 Available Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Home - Dashboard access</li>
                <li>✓ Videos - Video library</li>
                <li>✓ Portfolio - Portfolio page</li>
                <li>✓ Files - File management</li>
                <li>✓ Notes - Notes section</li>
              </ul>
            </div>

            {/* Access Expiry */}
            <div>
              <h3 className="text-lg font-semibold text-neon-blue mb-3">⏰ Access Expiry</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Set expiry date to auto-revoke access</li>
                <li>User cannot access after expiry</li>
                <li>Set to "Never" for unlimited access</li>
                <li>Expired access shows warning</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
