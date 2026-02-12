import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

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

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const firebaseUser = userCredential.user

      const snap = await getDoc(doc(db, 'users', firebaseUser.uid))

      if (!snap.exists()) {
        setError('User record not found')
        await auth.signOut()
        setLoading(false)
        return
      }

      const userData = snap.data()

      if (userData.status !== 'approved') {
        setError('Your account is pending admin approval.')
        await auth.signOut()
        setLoading(false)
        return
      }

      setSession(userData)
      navigate('/', { replace: true })

    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    // keep your existing UI
    <form onSubmit={handleLogin}>
      {/* your existing JSX */}
    </form>
  )
}
