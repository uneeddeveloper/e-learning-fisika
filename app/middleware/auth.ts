export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  }
})

