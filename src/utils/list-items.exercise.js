import * as R from 'ramda'
import {useAuth} from 'context/auth-context'
import {setQueryDataForBook} from './books'
import {useQuery, useQueryClient, useMutation} from 'react-query'
import {client} from 'utils/api-client.exercise'

function useListItems() {
  const {user} = useAuth()
  // get the user's list items from the list-items endpoint
  // queryKey should be 'list-items'
  // queryFn should call the 'list-items' endpoint with the user's token
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
    onSuccess: listItems => {
      for (let listItem of listItems) {
        //Once getting the listitems results, insert all results into the book info query
        setQueryDataForBook(listItem.book)
      }
    },
  })
  return listItems ?? []
}

function useListItem(bookId) {
  const listItems = useListItems()
  // search through the listItems  and find the one with the matched bookId.
  return listItems.find(el => el.bookId === bookId) ?? null
  // 🦉 NOTE: the backend doesn't support getting a single list-item by it's ID
  // and instead expects us to cache all the list items and look them up in our
  // cache. This works out because we're using react-query for caching!
}

function useDefaultMutationOptions() {
  const queryClient = useQueryClient()
  //queries(user's data) get invalidated and refetched after success or fail
  return {
    onSettled: () => queryClient.invalidateQueries('list-items'),
    //The recover argument will be the thing that we return from onMutate function
    onError: (err, variables, recover) => {
      // If has an error, then restore to previous state
      //() => queryClient.setQueryData('list-items', prevItems)
      if (typeof recover === 'function') recover()
    },
  }
}

function useCreateListItem(customOptions) {
  const {user} = useAuth()
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

function useUpdateListItem(customOptions) {
  const {user} = useAuth()
  const queryClient = useQueryClient()
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
      //This will fire before mutate function, and receiving same arguments mutate function received.
      // Receiving the updated item
      onMutate: newItem => {
        // Get the previous listItems
        const prevItems = queryClient.getQueryData('list-items')
        queryClient.setQueryData('list-items', oldData => {
          return oldData.map(el => {
            // If the old item is the one we want to update,
            // then return the item with new property
            // we just assume the server will do, and do the same thing before server finished
            return el.id === newItem.id ? {...el, ...newItem} : el
          })
        })
        // The value return from onMutate will be the third argument that onError receives
        return () => queryClient.setQueryData('list-items', prevItems)
      },
    },
  )
  return {...mutation, update: mutation.mutateAsync}
}

function useRemoveListItem(customOptions) {
  const {user} = useAuth()
  const queryClient = useQueryClient()
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
      onMutate: ({id}) => {
        // Get the previous listItems
        const prevItems = queryClient.getQueryData('list-items')
        queryClient.setQueryData('list-items', oldData => {
          return R.reject(el => el.id === id, oldData)
        })
        // The value return from onMutate will be the third argument that onError receives
        return () => queryClient.setQueryData('list-items', prevItems)
      },
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
