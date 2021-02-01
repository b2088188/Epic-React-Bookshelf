import {useQuery, useQueryClient, useMutation} from 'react-query'
import {client} from 'utils/api-client.exercise'

function useListItems(user) {
  // get the user's list items from the list-items endpoint
  // queryKey should be 'list-items'
  // queryFn should call the 'list-items' endpoint with the user's token
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
  })
  return listItems ?? []
}

function useListItem(user, bookId) {
  const listItems = useListItems(user)
  // search through the listItems  and find the one with the matched bookId.
  return listItems.find(el => el.bookId === bookId) ?? null
  // 🦉 NOTE: the backend doesn't support getting a single list-item by it's ID
  // and instead expects us to cache all the list items and look them up in our
  // cache. This works out because we're using react-query for caching!
}

function useDefaultMutationOptions() {
  const queryClient = useQueryClient()
  //queries(user's data) get invalidated and refetched after success or fail
  return {onSettled: () => queryClient.invalidateQueries('list-items')}
}

function useCreateListItem(user, customOptions) {
  const defaultOptions = useDefaultMutationOptions()
  // 🐨 call useMutation here and assign the mutate function to "create"
  // the mutate function should call the list-items endpoint with a POST
  // and the bookId the listItem is being created for.
  const mutation = useMutation(
    ({bookId}) =>
      client(`list-items`, {
        method: 'POST',
        data: {bookId},
        token: user.token,
      }),
    {
      ...defaultOptions,
      ...customOptions,
    },
  )
  return {...mutation, create: mutation.mutateAsync}
}

function useUpdateListItem(user, customOptions) {
  const defaultOptions = useDefaultMutationOptions()

  // the mutate function should call the list-items/:listItemId endpoint with a PUT
  //   and the updates as data.
  const mutation = useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {
      ...defaultOptions,
      ...customOptions,
    },
  )
  return {...mutation, update: mutation.mutateAsync}
}

function useRemoveListItem(user, customOptions) {
  const defaultOptions = useDefaultMutationOptions()
  // 🐨 call useMutation here and assign the mutate function to "remove"
  // the mutate function should call the list-items/:listItemId endpoint with a DELETE
  const mutation = useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        method: 'DELETE',
        token: user.token,
      }),
    {
      ...defaultOptions,
      ...customOptions,
    },
  )
  return {...mutation, remove: mutation.mutateAsync}
}

export {
  useListItems,
  useListItem,
  useCreateListItem,
  useUpdateListItem,
  useRemoveListItem,
}
