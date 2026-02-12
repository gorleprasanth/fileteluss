import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      // Create Firestore user document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        status: 'pending',
        role: 'user',
        createdAt: serverTimestamp()
      })

      setSuccess('Account created. Wait for admin approval.')

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)

    } catch (err) {
      setError(err.message)
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
    <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-neon-blue to-blue-400 bg-clip-text text-transparent">
              Create Account
            </span>
          </h1>
          <p className="text-gray-400">Join FileTelus today</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-effect p-8 mb-6">
          <form onSubmit={handleRegister} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input-luxury"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input-luxury"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input-luxury"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input-luxury"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full neon-glow-button mt-6 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-blue font-semibold">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
