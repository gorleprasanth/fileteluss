import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { saveFile, getFile, deleteFile, getAllFiles } from '../utils/fileStorage'

export default function Home({ session }) {
  const [files, setFiles] = useState([])
  const [showFilesModal, setShowFilesModal] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [typedEmail, setTypedEmail] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  const welcomeText =
  session?.role === 'admin'
    ? 'Welcome back,'
    : 'Welcome to my world,'


  useEffect(() => {
    loadFiles()
  }, [])

  // Typing animation effect for welcome text
  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= welcomeText.length) {
        setTypedText(welcomeText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => {
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
    }
  }, [welcomeText])

  // Typing animation effect for email
  useEffect(() => {
    let currentIndex = 0
    const emailTypingInterval = setInterval(() => {
      if (currentIndex <= session.email.length) {
        setTypedEmail(session.email.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(emailTypingInterval)
      }
    }, 50)

    return () => {
      clearInterval(emailTypingInterval)
    }
  }, [session.email])

  const loadFiles = async () => {
    const storedFiles = await getAllFiles()
    const fileMetadata = storedFiles.map(f => f.metadata)
    setFiles(fileMetadata)
  }

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length === 0) return

    setUploading(true)

    for (const file of selectedFiles) {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const metadata = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }

      const saved = await saveFile(fileId, file, metadata)
      if (saved) {
        setFiles(prev => [...prev, metadata])
      }
    }

    setUploading(false)
    setShowUploadForm(false)
    e.target.value = ''
  }

  const handleOpenFile = async (fileId, fileName) => {
    const fileData = await getFile(fileId)
    if (fileData && fileData.file) {
      const url = URL.createObjectURL(fileData.file)
      window.open(url, '_blank')
    }
  }

  const handleDelete = async (fileId) => {
    if (confirm('Are you sure you want to delete this file?')) {
      const deleted = await deleteFile(fileId)
      if (deleted) {
        setFiles(prev => prev.filter(f => f.id !== fileId))
      }
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('sheet') || type.includes('excel')) return '📊'
    if (type.includes('presentation') || type.includes('powerpoint')) return '📽️'
    if (type.includes('image')) return '🖼️'
    if (type.includes('zip') || type.includes('rar')) return '📦'
    return '📁'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.15,
      },
    }),
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  }

  const cards = [
    {
      icon: '📁',
      title: 'My Files',
      description: 'Access and manage all your files',
      gradient: 'from-neon-blue/20 to-blue-500/10',
      onClick: () => setShowFilesModal(true)
    },
    {
      icon: '🎥',
      title: 'My Videos',
      description: 'Stream and organize your video library',
      gradient: 'from-purple-500/20 to-blue-500/10',
    },
    {
      icon: '📝',
      title: 'Notes',
      description: 'Keep your important notes organized',
      gradient: 'from-cyan-500/20 to-blue-500/10',
    },
  ]

  return (
    <div className="min-h-screen bg-primary-dark pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              {typedText}
              {showCursor && <span className="animate-pulse">|</span>}
            </span>
            <br />
            <span className="text-white">{session.name}</span>
          </h1>
          <p className="text-xl text-cyan-400 max-w-2xl font-mono">
            {typedEmail}
          </p>
        </motion.div>

        {/* Overview Text */}
        <motion.div variants={itemVariants} className="mb-16">
          {session.role === 'admin' ? (
            <p className="text-gray-300 text-lg leading-relaxed">
              Your premium dashboard is ready. Manage your files, videos, and notes all in one place.
            </p>
          ) : (
            <div className="max-w-2xl">
              <motion.p
                className="text-2xl font-semibold bg-gradient-to-r from-neon-blue via-blue-300 to-blue-400 bg-clip-text text-transparent leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                "Patience is not the ability to wait, but how you act while waiting."
              </motion.p>
              <motion.p
                className="text-gray-400 text-base mt-4 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Your journey to success starts with a single step. Stay focused, stay patient, and trust the process.
              </motion.p>
            </div>
          )}
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onClick={card.onClick}
              className={`glass-card p-8 cursor-pointer overflow-hidden relative group`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Animated border glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-3xl border border-neon-blue/50" style={{
                  boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)',
                }}></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-5xl mb-4">{card.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-gray-300">{card.description}</p>

                {/* Action Arrow */}
                <motion.div
                  className="mt-6 flex items-center gap-2 text-neon-blue font-semibold"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <span>Explore</span>
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div variants={itemVariants} className="mt-16 glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-8">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Total Files', value: files.length.toString(), icon: '📊' },
              { label: 'Storage Used', value: formatFileSize(files.reduce((acc, f) => acc + f.size, 0)), icon: '⚡' },
              { label: 'Account Status', value: 'Active', icon: '✓' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-4xl">{stat.icon}</div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-neon-blue">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Files Modal */}
      <AnimatePresence>
        {showFilesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFilesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">My Files</h2>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="neon-glow-button flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload Files
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilesModal(false)}
                    className="px-4 py-2 bg-white/[0.05] border border-white/[0.2] rounded-xl text-white hover:bg-white/[0.1] transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>

              {/* Upload Form */}
              <AnimatePresence>
                {showUploadForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-6 bg-white/[0.05] rounded-xl border border-white/[0.1]"
                  >
                    <label className="block">
                      <div className="border-2 border-dashed border-neon-blue/50 rounded-xl p-8 text-center cursor-pointer hover:border-neon-blue transition-colors">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif"
                        />
                        <div className="text-5xl mb-4">📤</div>
                        <p className="text-white font-semibold mb-2">
                          {uploading ? 'Uploading...' : 'Click to upload files'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          PDF, DOCX, XLSX, PPTX, Images, ZIP and more
                        </p>
                      </div>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Files List */}
              {files.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-white/[0.05] rounded-xl border border-white/[0.1] hover:border-neon-blue/50 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{getFileIcon(file.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">{file.name}</h3>
                          <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOpenFile(file.id, file.name)}
                          className="flex-1 px-3 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors text-sm font-semibold"
                        >
                          Open
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(file.id)}
                          className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📂</div>
                  <p className="text-gray-400">No files uploaded yet</p>
                  <p className="text-gray-500 text-sm mt-2">Click "Upload Files" to get started</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
