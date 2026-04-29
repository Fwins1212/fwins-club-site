import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export const useMembership = () => {
  const { user } = useAuth()
  const [membership, setMembership] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchMembership()
    } else {
      setMembership(null)
      setLoading(false)
    }
  }, [user])

  const fetchMembership = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (!error && data) {
      setMembership(data)
    }
    setLoading(false)
  }

  return { membership, loading, refresh: fetchMembership }
}