import Dexie from 'dexie'
import { User } from '@/store/user'

const dbName = 'UniPassWalletIndexDB'
const db = new Dexie(dbName)
db.version(1).stores({ users: 'email' })

interface DB {
  getUsers: () => Promise<User[]>
  getUser: (email?: string) => Promise<User | undefined>
  setUser: (user: User) => any
  delUser: (email: string) => any
}

export default {
  async getUsers(): Promise<User[]> {
    try {
      const res = await db.table('users').toArray()
      return res
    } catch (err) {
      return []
    }
  },
  async getUser(email?: string) {
    email = email || window.localStorage.getItem('email') || ''
    try {
      const res = await db.table('users').get(email)
      return res
    } catch (err) {
      return undefined
    }
  },
  async setUser(user: User) {
    try {
      const res = await db.table('users').put(user)
      return res
    } catch (err) {
      console.error(err)
      return undefined
    }
  },
  async delUser(email: string) {
    try {
      const res = await db.table('users').delete(email)
      return res
    } catch (err) {
      return undefined
    }
  },
} as DB
