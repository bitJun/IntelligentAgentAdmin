import { defineStore } from 'pinia'
let name = localStorage.getItem('name') || '';
let perms = localStorage.getItem('perms') || []
let roles = localStorage.getItem('roles') || []
export const useStore = defineStore('storeId', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      name: name,
      perms: perms,
      roles: roles,
    }
  },
  actions: {
    setName(name) {
        localStorage.setItem('name', name)
        this.name = name
    },
    setPerms(perms) {
        localStorage.setItem('perms', JSON.stringify(perms))
        this.perms = perms
    },
    setRoles(roles) {
        localStorage.setItem('roles', JSON.stringify(roles))
        this.roles = roles
    }
  },
})