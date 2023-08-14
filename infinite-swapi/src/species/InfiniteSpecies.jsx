import InfiniteScroll from 'react-infinite-scroller';
import { Species } from './Species';
import { useInfiniteQuery } from '@tanstack/react-query';

const initialUrl = 'https://swapi.dev/api/species/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['sw-species'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next || undefined,
  });

  console.log({ data });
  if (isLoading) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
      {data.pages.map(({ results }) =>
        results.map((specie) => (
          <Species
            name={specie.name}
            language={specie.language}
            averageLifespan={specie.average_lifespan}
          />
        ))
      )}
    </InfiniteScroll>
  );
}
