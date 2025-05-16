export function getFullName(user: {
  lastName?: string
  firstName?: string
  middleName?: string
}) {
  return [user.lastName, user.firstName, user.middleName].filter(Boolean).join(" ")
}

export function getLastFisrtNames(user: {
  lastName?: string
  firstName?: string
}) {
  return [user.lastName, user.firstName].filter(Boolean).join(" ")
}
