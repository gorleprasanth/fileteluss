import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentUser } from '../utils/auth'
import { saveVideoFile, getVideoFile, deleteVideoFile } from '../utils/videoStorage'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [newVideo, setNewVideo] = useState({
    url: '',
    title: '',
    description: '',
    type: 'youtube', // 'youtube' or 'local'
    file: null,
    fileObject: null, // Store the actual File object
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [videoURLs, setVideoURLs] = useState({}) // Store blob URLs for local videos

  useEffect(() => {
    // Load videos from localStorage
    const savedVideos = localStorage.getItem('videos')
    if (savedVideos) {
      const parsedVideos = JSON.parse(savedVideos)
      setVideos(parsedVideos)
      
      // Load local video files from IndexedDB and create blob URLs
      loadLocalVideos(parsedVideos)
    } else {
      // Default videos
      const defaultVideos = [
        {
          id: 'dQw4w9WgXcQ',
          title: 'Premium Video Content',
          description: 'High quality tutorial video',
        },
        {
          id: 'jNQXAC9IVRw',
          title: 'Getting Started Guide',
          description: 'Learn the basics quickly',
        },
        {
          id: '9bZkp7q19f0',
          title: 'Advanced Features',
          description: 'Master advanced techniques',
        },
      ]
      setVideos(defaultVideos)
      localStorage.setItem('videos', JSON.stringify(defaultVideos))
    }

    // Check if user is admin
    const user = getCurrentUser()
    setIsAdmin(user?.role === 'admin')
  }, [])

  // Load local video files from IndexedDB
  const loadLocalVideos = async (videoList) => {
    const urls = {}
    for (const video of videoList) {
      if (video.type === 'local') {
        const file = await getVideoFile(video.id)
        if (file) {
          urls[video.id] = URL.createObjectURL(file)
        }
      }
    }
    setVideoURLs(urls)
  }

  const extractVideoId = (url) => {
    // Extract YouTube video ID from various URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file')
        return
      }
      
      // Check file size (maximum 6GB)
      const maxSize = 6 * 1024 * 1024 * 1024 // 6GB
      if (file.size > maxSize) {
        alert('File size too large. Please select a video smaller than 6GB.')
        return
      }
      
      // Store the file object directly (will be saved to IndexedDB on upload)
      setNewVideo({ ...newVideo, file: file, fileObject: file, type: 'local' })
    }
  }

  const handleUploadVideo = async () => {
    if (!newVideo.title) {
      alert('Please provide a video title')
      return
    }

    let videoToAdd

    if (newVideo.type === 'local') {
      if (!newVideo.fileObject) {
        alert('Please select a video file')
        return
      }

      const videoId = `local-${Date.now()}`
      
      // Save file to IndexedDB
      const saved = await saveVideoFile(videoId, newVideo.fileObject)
      if (!saved) {
        alert('Error saving video file. Please try again.')
        return
      }

      // Create blob URL for immediate display
      const blobURL = URL.createObjectURL(newVideo.fileObject)
      setVideoURLs(prev => ({ ...prev, [videoId]: blobURL }))

      videoToAdd = {
        id: videoId,
        title: newVideo.title,
        description: newVideo.description || 'No description provided',
        type: 'local',
      }
    } else {
      // YouTube video
      if (!newVideo.url) {
        alert('Please provide a YouTube URL')
        return
      }

      const videoId = extractVideoId(newVideo.url)
      if (!videoId) {
        alert('Invalid YouTube URL. Please provide a valid YouTube video URL or ID')
        return
      }

      videoToAdd = {
        id: videoId,
        title: newVideo.title,
        description: newVideo.description || 'No description provided',
        type: 'youtube',
      }
    }

    const updatedVideos = [...videos, videoToAdd]
    setVideos(updatedVideos)
    localStorage.setItem('videos', JSON.stringify(updatedVideos))

    // Reset form
    setNewVideo({ url: '', title: '', description: '', type: 'youtube', file: null, fileObject: null })
    setShowUploadForm(false)
  }

  const handleDeleteVideo = async (videoId) => {
    if (confirm('Are you sure you want to delete this video?')) {
      const video = videos.find(v => v.id === videoId)
      
      // Delete from IndexedDB if it's a local video
      if (video?.type === 'local') {
        await deleteVideoFile(videoId)
        
        // Revoke blob URL
        if (videoURLs[videoId]) {
          URL.revokeObjectURL(videoURLs[videoId])
          setVideoURLs(prev => {
            const newURLs = { ...prev }
            delete newURLs[videoId]
            return newURLs
          })
        }
      }
      
      const updatedVideos = videos.filter(v => v.id !== videoId)
      setVideos(updatedVideos)
      localStorage.setItem('videos', JSON.stringify(updatedVideos))
    }
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

  const videoVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
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
      y: -8,
      transition: { duration: 0.3 },
    },
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
        <motion.div variants={itemVariants} className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-white">
              <span className="bg-gradient-to-r from-neon-blue to-blue-400 bg-clip-text text-transparent">
                Video Library
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Explore our premium collection of curated videos
            </p>
          </div>
          
          {/* Upload Button - Only for Admin */}
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="neon-glow-button flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Video
            </motion.button>
          )}
        </motion.div>

        {/* Upload Form - Only for Admin */}
        <AnimatePresence>
          {isAdmin && showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-8 rounded-3xl overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Upload New Video</h2>
              
              <div className="space-y-4">
                {/* Video Type Selection */}
                <div>
                  <label className="block text-gray-300 mb-3 font-semibold">
                    Video Source <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="videoType"
                        value="youtube"
                        checked={newVideo.type === 'youtube'}
                        onChange={(e) => setNewVideo({ ...newVideo, type: e.target.value, file: null })}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-white">YouTube Video</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="videoType"
                        value="local"
                        checked={newVideo.type === 'local'}
                        onChange={(e) => setNewVideo({ ...newVideo, type: e.target.value, url: '' })}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-white">Local File</span>
                    </label>
                  </div>
                </div>

                {/* YouTube URL Input */}
                {newVideo.type === 'youtube' && (
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold">
                      YouTube Video URL or ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newVideo.url}
                      onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=... or video ID"
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.2] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      Supports: youtube.com/watch?v=..., youtu.be/..., or just the video ID
                    </p>
                  </div>
                )}

                {/* Local File Input */}
                {newVideo.type === 'local' && (
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold">
                      Select Video File <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.2] rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neon-blue file:text-white hover:file:bg-blue-400 file:cursor-pointer focus:outline-none focus:border-neon-blue transition-colors"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      Supported formats: MP4, WebM, OGG, MOV, AVI, etc.
                    </p>
                    {newVideo.file && (
                      <p className="text-green-400 text-sm mt-2">✓ Video file selected</p>
                    )}
                  </div>
                )}

                {/* Title Input */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">
                    Video Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    placeholder="Enter video title"
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.2] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">
                    Description
                  </label>
                  <textarea
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    placeholder="Enter video description (optional)"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.2] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUploadVideo}
                    className="neon-glow-button flex-1"
                  >
                    Add Video
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowUploadForm(false)
                      setNewVideo({ url: '', title: '', description: '', type: 'youtube', file: null, fileObject: null })
                    }}
                    className="px-6 py-3 bg-white/[0.05] border border-white/[0.2] rounded-xl text-white hover:bg-white/[0.1] transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((video, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={videoVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="glass-card overflow-hidden rounded-3xl group"
            >
              {/* Video Container */}
              <div className="relative w-full h-64 bg-gradient-to-br from-neon-blue/10 to-blue-500/10">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-3xl border border-neon-blue/50" style={{
                    boxShadow: 'inset 0 0 30px rgba(0, 217, 255, 0.2)',
                  }}></div>
                </div>

                {/* Delete Button - Admin Only */}
                {isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteVideo(video.id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                    title="Delete video"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                )}

                {/* Video Player - YouTube or Local */}
                {video.type === 'local' ? (
                  videoURLs[video.id] ? (
                    <video
                      className="w-full h-full rounded-2xl object-cover"
                      controls
                      controlsList="nodownload"
                      title={video.title}
                      src={videoURLs[video.id]}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full rounded-2xl flex items-center justify-center bg-white/[0.05]">
                      <p className="text-gray-400">Loading video...</p>
                    </div>
                  )
                ) : (
                  <iframe
                    className="w-full h-full rounded-2xl"
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?controls=1&modestbranding=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>

              {/* Content */}
              <div className="relative p-6 bg-gradient-to-b from-transparent to-primary-dark/50">
                <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                <p className="text-gray-400 text-sm">{video.description}</p>

                {/* Action */}
                <motion.div
                  className="mt-4 flex items-center gap-2 text-neon-blue font-semibold text-sm"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <span>Watch Now</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div variants={itemVariants} className="mt-16 glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4">About Our Video Library</h2>
          <p className="text-gray-300 mb-4">
            Access premium video content curated for your learning journey. Each video is optimized for streaming and comes with detailed transcripts.
          </p>
          <ul className="space-y-2 text-gray-400">
            <li>✓ High-definition streaming</li>
            <li>✓ Downloadable transcripts</li>
            <li>✓ Updated regularly with new content</li>
            <li>✓ Accessible from any device</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
