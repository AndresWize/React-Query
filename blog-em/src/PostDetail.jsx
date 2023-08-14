import { useQuery, useMutation } from '@tanstack/react-query';

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'PATCH', data: { title: 'REACT QUERY FOREVER!!!!' } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isLoading } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id),
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });

  const updateMutation = useMutation({
    mutationFn: () => updatePost(post.id),
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.error && (
        <p style={{ color: 'red' }}>Error deleting the post</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: 'blue' }}>Deleting post...</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: 'green' }}>Post DELETED!</p>
      )}
      {updateMutation.error && (
        <p style={{ color: 'red' }}>Error updated the post</p>
      )}
      {updateMutation.isLoading && (
        <p style={{ color: 'blue' }}>Updating post...</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: 'green' }}>Post UPDATED!</p>
      )}
      <button onClick={updateMutation.mutate}>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
