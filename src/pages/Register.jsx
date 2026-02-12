import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role: 'user',
        status: 'pending',
        createdAt: serverTimestamp()
      })

      // IMPORTANT: logout immediately
      await auth.signOut()

      setSuccess('Account created. Wait for admin approval.')

      // Defensive: prevent any accidental redirect to GitHub
      if (window.location.href.includes('github.com')) {
        window.location.replace('/login');
        return;
      }
      navigate('/login', { replace: true })

    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    // keep your existing UI
    <form onSubmit={handleRegister}>
      {/* your existing JSX */}
    </form>
  )
}
