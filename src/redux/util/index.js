export const findMessages = (messages = [], searchQuery = '') => {
  if (!searchQuery) {
    return []
  }

  const res = messages
    .map((message, index) => ([index, message]))
    .filter(([index, message]) => message.value && message.value.toLowerCase().indexOf(searchQuery.toLowerCase()) != -1)
    .map(([index]) => index)
  return res
}
