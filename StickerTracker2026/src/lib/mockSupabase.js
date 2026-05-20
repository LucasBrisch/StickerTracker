import { stickers } from '../seeder/stickers'

// Local storage keys
const KEYS = {
  USER: 'mock_user',
  COLLECTIONS: 'mock_collections',
  MEMBERS: 'mock_members',
  STICKERS: 'mock_collection_stickers'
}

// Initial seeder data
const initLocalStorage = () => {
  if (!localStorage.getItem(KEYS.USER)) {
    localStorage.setItem(KEYS.USER, JSON.stringify({ id: 'mock-user-123', email: 'lucasbrisch@gmail.com' }))
  }
  if (!localStorage.getItem(KEYS.COLLECTIONS)) {
    // Start with a default collection
    localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify([
      { id: 'mock-collection-id', name: 'Álbum Copa 2026 Local 🏆', invite_code: 'LOCAL26', created_at: new Date().toISOString() }
    ]))
  }
  if (!localStorage.getItem(KEYS.MEMBERS)) {
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify([
      { collection_id: 'mock-collection-id', user_id: 'mock-user-123' }
    ]))
  }
  if (!localStorage.getItem(KEYS.STICKERS)) {
    localStorage.setItem(KEYS.STICKERS, JSON.stringify([]))
  }
}

initLocalStorage()

const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, val) => localStorage.setItem(key, JSON.stringify(val))

// Realtime listeners
const listeners = []

const triggerRealtime = (payload) => {
  listeners.forEach(l => {
    if (l.table === 'collection_stickers' && l.filter(payload)) {
      l.callback(payload)
    }
  })
}

export const mockSupabase = {
  auth: {
    getUser: async () => {
      const user = getData(KEYS.USER)
      return { data: { user }, error: null }
    },
    getSession: async () => {
      const user = getData(KEYS.USER)
      return { data: { session: user ? { user } : null }, error: null }
    },
    onAuthStateChange: (callback) => {
      const user = getData(KEYS.USER)
      callback('SIGNED_IN', user ? { user } : null)
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    },
    signInWithOAuth: async () => {
      // Mock login
      setData(KEYS.USER, { id: 'mock-user-123', email: 'lucasbrisch@gmail.com' })
      window.location.href = '/dashboard'
      return { data: {}, error: null }
    },
    signOut: async () => {
      setData(KEYS.USER, null)
      window.location.href = '/'
      return { error: null }
    }
  },

  from: (table) => {
    return {
      select: (fields) => {
        let queryData = []
        if (table === 'stickers') {
          queryData = stickers
        } else if (table === 'collection_members') {
          // Join with collections
          const members = getData(KEYS.MEMBERS) || []
          const collections = getData(KEYS.COLLECTIONS) || []
          queryData = members.map(m => {
            const col = collections.find(c => c.id === m.collection_id)
            return {
              ...m,
              collections: col
            }
          })
        } else if (table === 'collections') {
          queryData = getData(KEYS.COLLECTIONS) || []
        } else if (table === 'collection_stickers') {
          queryData = getData(KEYS.STICKERS) || []
        }

        const builder = {
          eq: (field, value) => {
            queryData = queryData.filter(item => {
              if (field === 'user_id' && table === 'collection_members') {
                return item.user_id === value
              }
              if (field === 'collection_id' && table === 'collection_members') {
                return item.collection_id === value
              }
              if (field === 'invite_code' && table === 'collections') {
                return item.invite_code === String(value).toUpperCase()
              }
              if (field === 'collection_id' && table === 'collection_stickers') {
                return item.collection_id === value
              }
              return item[field] === value
            })
            return builder
          },
          single: async () => {
            return { data: queryData[0] || null, error: queryData[0] ? null : { message: 'Not found' } }
          },
          then: (resolve) => {
            resolve({ data: queryData, error: null })
          }
        }
        return builder
      },

      insert: (record) => {
        let createdRecord = null
        if (table === 'collections') {
          const collections = getData(KEYS.COLLECTIONS) || []
          createdRecord = {
            id: 'mock-col-' + Math.random().toString(36).substring(2, 9),
            created_at: new Date().toISOString(),
            ...record
          }
          collections.push(createdRecord)
          setData(KEYS.COLLECTIONS, collections)
        } else if (table === 'collection_members') {
          const members = getData(KEYS.MEMBERS) || []
          createdRecord = { ...record }
          members.push(createdRecord)
          setData(KEYS.MEMBERS, members)
        }

        const builder = {
          select: () => {
            return {
              single: async () => {
                return { data: createdRecord, error: null }
              }
            }
          },
          then: (resolve) => {
            resolve({ data: createdRecord, error: null })
          }
        }
        return builder
      },

      upsert: async (record) => {
        if (table === 'collection_stickers') {
          const stickersData = getData(KEYS.STICKERS) || []
          const existingIndex = stickersData.findIndex(s => s.collection_id === record.collection_id && s.sticker_code === record.sticker_code)
          
          let oldRecord = null
          if (existingIndex >= 0) {
            oldRecord = { ...stickersData[existingIndex] }
            stickersData[existingIndex] = { ...stickersData[existingIndex], ...record }
          } else {
            stickersData.push(record)
          }
          setData(KEYS.STICKERS, stickersData)

          // Trigger realtime simulation
          triggerRealtime({
            eventType: existingIndex >= 0 ? 'UPDATE' : 'INSERT',
            new: record,
            old: oldRecord
          })
        }
        return { data: record, error: null }
      }
    }
  },

  channel: (channelName) => {
    // E.g. public:collection_stickers:collection_id=eq.mock-collection-id
    const parts = channelName.split(':')
    const filterPart = parts[2] || ''
    const collectionId = filterPart.split('collection_id=eq.')[1] || ''

    return {
      on: (event, config, callback) => {
        listeners.push({
          table: config.table,
          filter: (payload) => payload.new.collection_id === collectionId,
          callback
        })
        return {
          subscribe: () => {
            return {
              unsubscribe: () => {
                const idx = listeners.findIndex(l => l.callback === callback)
                if (idx >= 0) listeners.splice(idx, 1)
              }
            }
          }
        }
      }
    }
  },

  removeChannel: (channel) => {
    // Cleared inside unsubscribe
  }
}
