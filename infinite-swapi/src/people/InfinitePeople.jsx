import InfiniteScroll from 'react-infinite-scroller';
import { Person } from './Person';
import { useInfiniteQuery } from '@tanstack/react-query';

const initialUrl = 'https://swapi.dev/api/people/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query
  const { data, fetchNextPage, hasNextPage, isLoading, isError, isFetching } =
    useInfiniteQuery({
      queryKey: ['sw-people'],
      queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      // hasNextPage is determined whether this function returns undefined or not
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    });

  if (isLoading) {
    return <div className='loading'>Loading...</div>;
  }

  if (isError) return <div>Error</div>;

  return (
    <>
      {isFetching && <div className='loading'>Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map(({ results }) =>
          results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hair_color}
              eyeColor={person.eye_color}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
