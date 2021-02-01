import {queryClient} from '../index.exercise'
import {useQuery} from 'react-query'
import {client} from 'utils/api-client.exercise'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

function getBookSearchConfig(query, user) {
  return {
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books),
  }
}

function useBookSearch(query, user) {
  const result = useQuery(getBookSearchConfig(query, user))
  return {...result, books: result?.data || loadingBooks}
}

function refetchBookSearchQuery(user) {
  //remove old book search query
  queryClient.removeQueries('bookSearch')
  //refetch a new query with empty string
  queryClient.prefetchQuery(getBookSearchConfig('', user))
}

function useBook(bookId, user) {
  // queryKey should be ['book', {bookId}]
  const result = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  })
  return {...result, book: result?.data || loadingBook}
}

export {useBookSearch, useBook, refetchBookSearchQuery}
