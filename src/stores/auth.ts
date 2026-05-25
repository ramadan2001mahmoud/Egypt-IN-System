import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Profile, UserRole } from '@/types'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      set({ user: session.user, session, profile, initialized: true })
    } else {
      set({ initialized: true })
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        ;(async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
          set({ user: session.user, session, profile, loading: false })
        })()
      } else {
        set({ user: null, session: null, profile: null, loading: false })
      }
    })
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ loading: false })
      throw error
    }
  },

  signUp: async (email: string, password: string, fullName: string, role: UserRole) => {
    set({ loading: true })
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    })
    if (error) {
      set({ loading: false })
      throw error
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, profile: null })
  },
}))
