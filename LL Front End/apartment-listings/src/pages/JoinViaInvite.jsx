// src/pages/JoinViaInvite.jsx
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'

const API_BASE = import.meta.env.DEV
  ? 'http://localhost:3001'
  : ''  // in production point this to your real backend

export default function JoinViaInvite() {
  const { user, loading: authLoading } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const code = searchParams.get('code')
  const [status, setStatus] = useState('pending')  // 'pending' | 'success' | 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!code) {
      setStatus('error')
      setMessage('No invite code provided in the URL.')
      return
    }
    if (authLoading) return
    if (!user) return  // show sign-in form until user exists

    async function acceptInvite() {
      setStatus('pending')
      try {
        const url = `${API_BASE}/api/invites/${code}/accept`
        console.log('Calling accept endpoint:', url, 'with userId', user.id)

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        })
        const body = await res.json()

        if (!res.ok) {
          throw new Error(body.error || 'Failed to accept invite')
        }

        setStatus('success')
        setMessage(body.message || 'You’ve joined the group!')

        // Redirect into this user’s dashboard
        setTimeout(() => {
          navigate(`/home/${user.id}`)
        }, 1500)

      } catch (err) {
        console.error('Invite accept error:', err)
        setStatus('error')
        setMessage(err.message)
      }
    }

    acceptInvite()
  }, [authLoading, user, code, navigate])

  if (status === 'pending') {
    return <p className="p-6">Joining your group…</p>
  }
  if (status === 'success') {
    return <p className="p-6 text-green-600">🎉 {message} Redirecting…</p>
  }
  return <p className="p-6 text-red-600">Error: {message}</p>
}