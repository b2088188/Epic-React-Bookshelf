import {useCallback} from 'react'
import {useClient} from '../context/auth-context'
import {queryClient} from '../context'
import {useQuery} from 'react-query'
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

function getBookSearchConfig(query, client) {
  return {
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`).then(
        data => data.books,
      ),
    //Once getting the search results, insert all results into the book info query
    onSuccess: books => {
      for (let book of books) {
        setQueryDataForBook(book)
      }
    },
  }
}

function useBookSearch(query) {
  const client = useClient()
  const result = useQuery(getBookSearchConfig(query, client))
  return {...result, books: result?.data || loadingBooks}
}

function useRefetchBookSearchQuery() {
  const client = useClient()
  return useCallback(
    async function refetchBookSearchQuery() {
      //remove old book search query
      queryClient.removeQueries('bookSearch')
      //refetch a new query with empty string
      queryClient.prefetchQuery(getBookSearchConfig('', client))
    },
    [client],
  )
}

function useBook(bookId) {
  const client = useClient()
  const result = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`).then(data => data.book),
  })
  return {...result, book: result?.data || loadingBook}
}

function setQueryDataForBook(book) {
  //Once getting the search results, insert all results into the book info query
  //so that we don't have to fetch data we've already had again
  queryClient.setQueryData(['book', {bookId: book.id}], book)
}

export {useBookSearch, useBook, useRefetchBookSearchQuery, setQueryDataForBook}
