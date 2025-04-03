import { ApolloClient, ApolloProvider, gql, InMemoryCache, useMutation, useQuery } from '@apollo/client'
import { createFileRoute } from '@tanstack/react-router'
import AddBlog from '../components/AddBlog';

// const client = new ApolloClient({
//   uri: "http://127.0.0.1:3001/graphiql",
//   cache: new InMemoryCache()
// });

interface IBlog {
  id: number,
  title: String,
  description: string,
  userName: String
}

const BLOGS_QUERY = gql`
  {
    blogs {
      id
      title
      description
      userName
    }
  }
`;

export const Route = createFileRoute('/blogs')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, loading, error } = useQuery(BLOGS_QUERY, {context: {clientName: 'railsendpoint'}});

  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>

  return (
    // <ApolloProvider client={client}>
      <div className="p-2">
          <AddBlog />
          <h1>BLOGS</h1>
          <ul className="px-5">
            {
              data.blogs.map((blog: IBlog) => (
                <li key={blog.id}>
                  <label><b>Title: </b><span>{blog.title}</span></label><br />
                  <label><b>Description: </b><span>{(blog.description)}</span></label><br />
                  <label><b>Description: </b><span>{JSON.parse(blog.description)}</span></label><br />
                  <label><b>Posted by: </b><span>{blog.userName}</span></label>
                  <hr />
                </li>
              ))
            }
            {/* <hr /> */}
          </ul>
        </div>
    // </ApolloProvider>
  ); 
}
