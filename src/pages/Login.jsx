import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { loginUser } from '../utils/auth'

const CuteBaby = () => {
  const [gesture, setGesture] = useState('run')
  const [emotion, setEmotion] = useState('happy')
  const [movement, setMovement] = useState('running')

  useEffect(() => {
    const gestures = ['run', 'walk', 'kiss', 'jump', 'dance']
    const emotions = ['happy', 'giggle', 'laughing', 'excited', 'tongue-out']
    const movements = ['running', 'walking', 'jogging']
    
    const gestureInterval = setInterval(() => {
      setGesture(gestures[Math.floor(Math.random() * gestures.length)])
    }, 6000)
    
    const emotionInterval = setInterval(() => {
      setEmotion(emotions[Math.floor(Math.random() * emotions.length)])
    }, 3500)

    const movementInterval = setInterval(() => {
      setMovement(movements[Math.floor(Math.random() * movements.length)])
    }, 8000)
    
    return () => {
      clearInterval(gestureInterval)
      clearInterval(emotionInterval)
      clearInterval(movementInterval)
    }
  }, [])

  return (
    <motion.div
      className="fixed bottom-1/3 -left-48 pointer-events-none z-30"
      animate={{
        x: typeof window !== 'undefined' ? window.innerWidth + 300 : 0,
      }}
      transition={{
        duration: movement === 'walking' ? 16 : movement === 'jogging' ? 12 : 9,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <div className="relative w-56 h-72">
        {/* Shadow on ground */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-black/25 rounded-full blur-lg"
          animate={{
            scaleX: gesture === 'jump' ? [1, 0.6, 1] : 1,
            opacity: gesture === 'jump' ? [0.25, 0.1, 0.25] : 0.25,
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
        />

        {/* Chubby Head - Large and Round */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-36 rounded-full flex flex-col items-center justify-start relative overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 40% 35%, rgba(255, 215, 185, 1) 0%, rgba(255, 200, 160, 1) 50%, rgba(245, 185, 150, 1) 100%),
              linear-gradient(135deg, rgba(255, 225, 200, 0.8), rgba(240, 180, 150, 0.9))
            `,
            boxShadow: `
              0 16px 50px rgba(255, 180, 140, 0.4),
              inset 0 4px 20px rgba(255, 255, 255, 0.6),
              inset 0 -8px 25px rgba(180, 120, 80, 0.25)
            `,
          }}
          animate={{
            y: gesture === 'jump' ? [0, -80, 0] : gesture === 'kiss' ? [0, -5, 0] : movement === 'walking' ? [0, -8, 0] : movement === 'jogging' ? [0, -12, 0] : [0, -15, 0],
            rotateZ: gesture === 'dance' ? [-8, 8, -8] : gesture === 'kiss' ? [-5, 5, -5] : 0,
          }}
          transition={{
            duration: gesture === 'jump' ? 0.9 : movement === 'walking' ? 0.9 : movement === 'jogging' ? 0.7 : 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Hair - Fluffy blonde curls */}
          <div className="absolute -top-1 w-full h-14 bg-gradient-to-b from-yellow-300 via-yellow-200 to-transparent rounded-t-full"></div>
          
          {/* Chubby Cheeks */}
          <div className="absolute left-2 top-16 w-10 h-8 rounded-full opacity-30 blur-md"
            style={{
              background: 'radial-gradient(circle, rgba(255, 150, 150, 0.5), transparent)',
            }}
          ></div>
          <div className="absolute right-2 top-16 w-10 h-8 rounded-full opacity-30 blur-md"
            style={{
              background: 'radial-gradient(circle, rgba(255, 150, 150, 0.5), transparent)',
            }}
          ></div>

          {/* Eyes Container - Large Expressive Eyes */}
          <div className="absolute top-14 w-20 flex justify-around">
            {/* Left Eye */}
            <motion.div
              className="w-7 h-8 bg-white rounded-2xl relative overflow-hidden shadow-lg border-2 border-yellow-100"
              style={{
                boxShadow: 'inset 0 3px 6px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.15)',
              }}
              animate={{
                scaleY: emotion === 'laughing' ? [1, 0.15, 1] : emotion === 'giggle' ? [1, 0.2, 1] : [1, 0.3, 1],
              }}
              transition={{
                duration: 0.35,
                repeat: Infinity,
                delay: 1.2,
              }}
            >
              <motion.div
                className="absolute w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full top-1 left-1"
                animate={{
                  y: emotion === 'excited' ? [-2, 2, -2] : emotion === 'tongue-out' ? [-1, 1, -1] : 0,
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                }}
              >
                <div className="absolute top-1 left-1.5 w-2.5 h-2.5 bg-white rounded-full"></div>
                <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 bg-black opacity-60 rounded-full"></div>
              </motion.div>
            </motion.div>

            {/* Right Eye */}
            <motion.div
              className="w-7 h-8 bg-white rounded-2xl relative overflow-hidden shadow-lg border-2 border-yellow-100"
              style={{
                boxShadow: 'inset 0 3px 6px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.15)',
              }}
              animate={{
                scaleY: emotion === 'laughing' ? [1, 0.15, 1] : emotion === 'giggle' ? [1, 0.2, 1] : [1, 0.3, 1],
              }}
              transition={{
                duration: 0.35,
                repeat: Infinity,
                delay: 1.2,
              }}
            >
              <motion.div
                className="absolute w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full top-1 left-1"
                animate={{
                  y: emotion === 'excited' ? [-2, 2, -2] : emotion === 'tongue-out' ? [-1, 1, -1] : 0,
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                }}
              >
                <div className="absolute top-1 left-1.5 w-2.5 h-2.5 bg-white rounded-full"></div>
                <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 bg-black opacity-60 rounded-full"></div>
              </motion.div>
            </motion.div>
          </div>

          {/* Expressive Eyebrows */}
          <div className="absolute top-12 w-20 flex justify-around px-1">
            <motion.div
              className="w-5 h-2 bg-yellow-600 rounded-full"
              animate={{
                rotateZ: emotion === 'laughing' ? [-15, 15, -15] : emotion === 'excited' ? [0, 20, 0] : emotion === 'tongue-out' ? [0, -20, 0] : 0,
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                delay: 1.2,
              }}
              style={{ transformOrigin: 'center' }}
            />
            <motion.div
              className="w-5 h-2 bg-yellow-600 rounded-full"
              animate={{
                rotateZ: emotion === 'laughing' ? [15, -15, 15] : emotion === 'excited' ? [0, -20, 0] : emotion === 'tongue-out' ? [0, 20, 0] : 0,
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                delay: 1.2,
              }}
              style={{ transformOrigin: 'center' }}
            />
          </div>

          {/* Cute Nose */}
          <div className="absolute top-20 w-4 h-3 rounded-full border-2 border-yellow-300 flex gap-0.5 items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 220, 160, 1), rgba(255, 200, 140, 1))',
            }}
          >
            <div className="w-1 h-1 bg-yellow-400/60 rounded-full"></div>
            <div className="w-1 h-1 bg-yellow-400/60 rounded-full"></div>
          </div>

          {/* Expressive Mouth */}
          <motion.div
            className="absolute top-28 w-10 rounded-b-3xl overflow-hidden flex flex-col items-center relative"
            style={{
              background: gesture === 'kiss' ? 'radial-gradient(circle at center, rgba(255, 150, 180, 1), rgba(255, 100, 140, 1))' : emotion === 'laughing' ? 'linear-gradient(to bottom, rgba(255, 120, 150, 1), rgba(255, 100, 130, 1))' : 'linear-gradient(to bottom, rgba(255, 140, 170, 1), rgba(255, 120, 150, 1))',
              boxShadow: 'inset 0 2px 5px rgba(255, 200, 200, 0.6), 0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
            animate={{
              scaleY: gesture === 'kiss' ? [1, 1.8, 1.5, 1] : emotion === 'laughing' ? [1, 1.6, 1] : emotion === 'giggle' ? [1, 1.4, 1] : emotion === 'tongue-out' ? [1, 1.3, 1] : [1, 1.2, 1],
              scaleX: gesture === 'kiss' ? [0.8, 1.2, 0.9, 0.8] : emotion === 'laughing' ? [1, 1.3, 1] : emotion === 'tongue-out' ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: gesture === 'kiss' ? 0.8 : 0.5,
              repeat: Infinity,
              delay: 1.2,
            }}
          >
            {/* Teeth */}
            <div className="absolute top-0 w-full h-1.5 bg-white/80"></div>
            
            {/* Tongue - Shows for certain emotions */}
            {emotion === 'tongue-out' && (
              <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-red-400 rounded-b-full"
                animate={{
                  scaleY: [1, 1.4, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: 1.2,
                }}
              />
            )}
          </motion.div>

          {/* Emotion Indicators */}
          {emotion === 'laughing' && (
            <motion.div
              className="absolute left-0 top-12 text-2xl"
              animate={{
                x: [-15, 15, -15],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: 1.2,
              }}
            >
              😂
            </motion.div>
          )}

          {emotion === 'giggle' && (
            <motion.div
              className="absolute right-0 top-14 text-2xl"
              animate={{
                x: [15, -15, 15],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: 1.2,
              }}
            >
              🥰
            </motion.div>
          )}

          {emotion === 'excited' && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute text-2xl"
                  animate={{
                    scale: [0, 1, 0],
                    y: [-30, -60, -90],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 1.2 + i * 0.3,
                  }}
                  style={{
                    left: `${25 + i * 20}%`,
                    top: '0',
                  }}
                >
                  ⭐
                </motion.div>
              ))}
            </>
          )}

          {gesture === 'kiss' && (
            <motion.div
              className="absolute -right-8 top-12 text-3xl"
              animate={{
                x: [0, 20, 40, 60],
                y: [0, -10, -5, 0],
                opacity: [1, 0.7, 0.4, 0],
                scale: [1, 0.9, 0.7, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: 1.2,
              }}
            >
              💋
            </motion.div>
          )}
        </motion.div>

        {/* Chubby Body - Round Onesie */}
        <motion.div
          className="absolute top-32 left-1/2 transform -translate-x-1/2 w-28 h-32 rounded-2xl flex flex-col items-center justify-start pt-3 relative"
          style={{
            background: `
              linear-gradient(135deg, rgba(100, 200, 255, 1) 0%, rgba(80, 180, 240, 0.9) 50%, rgba(70, 160, 220, 1) 100%),
              linear-gradient(225deg, rgba(150, 220, 255, 0.3), transparent)
            `,
            boxShadow: `
              0 12px 40px rgba(100, 180, 255, 0.3),
              inset 0 4px 15px rgba(200, 240, 255, 0.5),
              inset 0 -4px 15px rgba(50, 120, 180, 0.3)
            `,
          }}
          animate={{
            y: gesture === 'jump' ? [0, -80, 0] : gesture === 'kiss' ? [0, -5, 0] : movement === 'walking' ? [0, -8, 0] : movement === 'jogging' ? [0, -12, 0] : [0, -15, 0],
            rotateZ: gesture === 'dance' ? [-6, 6, -6] : 0,
          }}
          transition={{
            duration: gesture === 'jump' ? 0.9 : movement === 'walking' ? 0.9 : movement === 'jogging' ? 0.7 : 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Belly Button */}
          <div className="absolute top-10 w-2.5 h-2.5 bg-blue-600/50 rounded-full border border-blue-400"></div>

          {/* Belly Bulge - Round padding */}
          <div className="absolute top-8 w-24 h-16 rounded-full bg-blue-300/40 blur-md"></div>

          {/* Left Sleeve/Arm */}
          <motion.div
            className="absolute -left-5 top-5 w-5 h-14"
            animate={{
              rotateZ: gesture === 'kiss' ? [-45, -30, -45] : gesture === 'dance' ? [-50, 50, -50] : movement === 'walking' ? [-35, 35, -35] : movement === 'jogging' ? [-50, 50, -50] : [-60, 60, -60],
            }}
            transition={{
              duration: movement === 'walking' ? 0.9 : movement === 'jogging' ? 0.7 : 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              transformOrigin: 'top center',
            }}
          >
            {/* Hand */}
            <div className="absolute bottom-0 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-100 flex items-center justify-center shadow-md border border-yellow-300">
              {/* Fingers */}
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-0.5 w-1.5 h-2.5 bg-yellow-100 rounded-full"></div>
                <div className="absolute top-0 left-2.5 w-1.5 h-2.5 bg-yellow-100 rounded-full"></div>
                <div className="absolute top-0.5 right-0.5 w-1.5 h-2 bg-yellow-100 rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* Right Sleeve/Arm */}
          <motion.div
            className="absolute -right-5 top-5 w-5 h-14"
            animate={{
              rotateZ: gesture === 'kiss' ? [45, 30, 45] : gesture === 'dance' ? [50, -50, 50] : movement === 'walking' ? [35, -35, 35] : movement === 'jogging' ? [50, -50, 50] : [60, -60, 60],
            }}
            transition={{
              duration: movement === 'walking' ? 0.9 : movement === 'jogging' ? 0.7 : 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              transformOrigin: 'top center',
            }}
          >
            {/* Hand */}
            <div className="absolute bottom-0 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-100 flex items-center justify-center shadow-md border border-yellow-300">
              {/* Fingers */}
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-0.5 w-1.5 h-2.5 bg-yellow-100 rounded-full"></div>
                <div className="absolute top-0 left-2.5 w-1.5 h-2.5 bg-yellow-100 rounded-full"></div>
                <div className="absolute top-0.5 right-0.5 w-1.5 h-2 bg-yellow-100 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Left Leg - Chubby and realistic */}
        <motion.div
          className="absolute bottom-6 left-6 w-6 h-20 rounded-full flex flex-col items-center"
          style={{
            background: 'linear-gradient(90deg, rgba(255, 200, 160, 1), rgba(255, 180, 140, 0.95))',
            boxShadow: '0 8px 20px rgba(255, 160, 120, 0.3), inset 0 2px 6px rgba(255, 255, 255, 0.5)',
            transformOrigin: 'top center',
          }}
          animate={{
            rotateZ: gesture === 'jump' ? [0, 0, 0] : gesture === 'kiss' ? [0, 8, 0] : gesture === 'dance' ? [-15, 15, -15] : movement === 'walking' ? [0, 30, 0, -30, 0] : movement === 'jogging' ? [0, 40, 0, -40, 0] : [0, 35, 0, -35, 0],
            y: gesture === 'jump' ? [-80, -80, 0] : 0,
          }}
          transition={{
            duration: gesture === 'jump' ? 0.9 : movement === 'walking' ? 0.9 : movement === 'jogging' ? 0.7 : 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Foot */}
          <motion.div
            className="absolute bottom-0 w-8 h-5 rounded-full bg-gradient-to-b from-pink-400 to-pink-500 shadow-md border border-pink-300"
            animate={{
              scaleX: movement === 'jogging' ? [1, 1.4, 1, 1.4, 1] : movement === 'walking' ? [1, 1.2, 1, 1.2, 1] : [1, 1.3, 1, 1.3, 1],
            }}
            transition={{
              duration: movement === 'walking' ? 0.9 : movement === 'jogging' ? 0.7 : 0.6,
              repeat: Infinity,
            }}
          >
            {/* Toes */}
            <div className="absolute top-0.5 w-full h-1 flex justify-around px-1">
              <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Leg - Chubby and realistic */}
        <motion.div
          className="absolute bottom-6 right-6 w-6 h-20 rounded-full flex flex-col items-center"
          style={{
            background: 'linear-gradient(90deg, rgba(255, 200, 160, 1), rgba(255, 180, 140, 0.95))',
            boxShadow: '0 8px 20px rgba(255, 160, 120, 0.3), inset 0 2px 6px rgba(255, 255, 255, 0.5)',
            transformOrigin: 'top center',
          }}
          animate={{
            rotateZ: gesture === 'jump' ? [0, 0, 0] : gesture === 'kiss' ? [0, -8, 0] : gesture === 'dance' ? [15, -15, 15] : movement === 'walking' ? [0, -30, 0, 30, 0] : movement === 'jogging' ? [0, -40, 0, 40, 0] : [0, -35, 0, 35, 0],
            y: gesture === 'jump' ? [-80, -80, 0] : 0,
          }}
          transition={{
            duration: gesture === 'jump' ? 0.9 : movement === 'walking' ? 0.9 : movement === 'jogging' ? 0.7 : 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Foot */}
          <motion.div
            className="absolute bottom-0 w-8 h-5 rounded-full bg-gradient-to-b from-pink-400 to-pink-500 shadow-md border border-pink-300"
            animate={{
              scaleX: movement === 'jogging' ? [1, 1.4, 1, 1.4, 1] : movement === 'walking' ? [1, 1.2, 1, 1.2, 1] : [1, 1.3, 1, 1.3, 1],
            }}
            transition={{
              duration: movement === 'walking' ? 0.9 : movement === 'jogging' ? 0.7 : 0.6,
              repeat: Infinity,
            }}
          >
            {/* Toes */}
            <div className="absolute top-0.5 w-full h-1 flex justify-around px-1">
              <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Heart/Kiss Particles */}
        {gesture === 'kiss' && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={`kiss-heart-${i}`}
                className="absolute text-3xl"
                animate={{
                  x: [0, Math.random() * 80 - 40, Math.random() * 120 - 60],
                  y: [0, -80, -160],
                  opacity: [1, 0.5, 0],
                  scale: [1, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1.2 + i * 0.25,
                }}
                style={{
                  left: '50%',
                  top: '40%',
                }}
              >
                💋
              </motion.div>
            ))}
          </>
        )}

        {/* Emotion particles - Laughing */}
        {emotion === 'laughing' && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`laugh-heart-${i}`}
                className="absolute text-2xl"
                animate={{
                  y: [0, -70, -140],
                  x: [0, Math.random() * 40 - 20],
                  opacity: [1, 0.5, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: 1.2 + i * 0.3,
                }}
                style={{
                  left: `${35 + i * 20}%`,
                  top: '30%',
                }}
              >
                ❤️
              </motion.div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  )
}

export default function Login({ setSession }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const result = await loginUser(email, password)

    if (result.success) {
      setSession(result.user)
      navigate('/', { replace: true })
    } else {
      setError(result.message)
    }

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

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Cute Baby Walking */}
      <CuteBaby />

      {/* Center framed background */}
      <div className="w-full max-w-6xl h-[640px] mx-auto rounded-3xl shadow-2xl overflow-hidden relative flex items-center justify-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/login-bg.jpg)' }}
        />
        {/* Subtle overlay for better form contrast */}
        <div className="absolute inset-0 bg-black/10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10 px-4"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🔐
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-neon-blue to-blue-400 bg-clip-text text-transparent">
              FileTelus
            </span>
          </h1>
          <p className="text-gray-400">Welcome back! 👋 Sign in to your premium account 🌟</p>
        </motion.div>

        {/* Form Card with Realistic Glass Effect */}
        <motion.div
          variants={itemVariants}
          className="relative mb-6 overflow-hidden rounded-3xl group"
        >
          {/* Realistic frosted glass base layer */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.15) 0%, 
                  rgba(255, 255, 255, 0.08) 50%, 
                  rgba(255, 255, 255, 0.05) 100%
                ),
                linear-gradient(225deg, 
                  rgba(0, 217, 255, 0.1) 0%, 
                  rgba(0, 100, 150, 0.05) 100%
                )
              `,
              backdropFilter: 'blur(20px) brightness(0.9)',
            }}
          />

          {/* Ultra-high blur effect for depth */}
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(10, 31, 68, 0.35)',
              backdropFilter: 'blur(40px)',
            }}
          />

          {/* Glossy shine effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
            }}
          />

          {/* Animated light refraction */}
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(0, 217, 255, 0.3), transparent)',
              filter: 'blur(40px)',
            }}
            animate={{
              x: [40, 60, 40],
              y: [-40, -60, -40],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Premium border with glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none border-2"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
            animate={{
              boxShadow: [
                `
                  inset 0 1px 0 rgba(255, 255, 255, 0.2),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.3),
                  0 8px 32px rgba(0, 217, 255, 0.1),
                  0 0 30px rgba(0, 217, 255, 0.15)
                `,
                `
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.3),
                  0 8px 32px rgba(0, 217, 255, 0.2),
                  0 0 40px rgba(0, 217, 255, 0.25)
                `,
                `
                  inset 0 1px 0 rgba(255, 255, 255, 0.2),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.3),
                  0 8px 32px rgba(0, 217, 255, 0.1),
                  0 0 30px rgba(0, 217, 255, 0.15)
                `,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Content */}
          <motion.div className="relative z-20 p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <span>✉️ Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="📧 you@example.com"
                  className="form-input-luxury shadow-lg backdrop-blur-md"
                  disabled={loading}
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <span>🔑 Password</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="🔒 ••••••••"
                  className="form-input-luxury shadow-lg backdrop-blur-md"
                  disabled={loading}
                />
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2 backdrop-blur-md"
                  >
                    <span>❌</span>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 40px rgba(0, 217, 255, 0.8), inset 0 0 20px rgba(0, 217, 255, 0.2)',
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full neon-glow-button mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>{loading ? '⏳' : '🚀'}</span>
                {loading ? 'Signing In...' : 'Sign In'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Register Link */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-gray-400">
            Don't have an account? 🤔{' '}
            <Link to="/register" className="text-neon-blue font-semibold hover:text-blue-300 transition-colors">
              ✨ Register here
            </Link>
          </p>
        </motion.div>
      </motion.div>
      </div>
    </div>
  )
}
