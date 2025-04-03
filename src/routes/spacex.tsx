import { createFileRoute } from '@tanstack/react-router'
import { useQuery, gql, ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";


const apolloClient = new ApolloClient({
  uri: "https://spacex-production.up.railway.app/",
  cache: new InMemoryCache()
});

const FILMS_QUERY = gql`
  {
    company {
        ceo
        coo
        cto
        employees
        founded
        founder
        name
        summary
    }
    rockets(limit: 5) {
        id
        company
        country
        description
        active
    }
  }
`;

export const Route = createFileRoute('/spacex')({
  component: RouteComponent,
})

function RouteComponent() {
    const { data, loading, error } = useQuery(FILMS_QUERY, {context: {clientName: 'spacexendpoint'}});

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>
  
    return (
      // <ApolloProvider client={apolloClient}>
        <div className='p-2'>
          <h1>{data.company.name}</h1>
          <div className="px-5">
              <p>{data.company.summary}</p>
              <b>Founded: {data.company.founded}</b> <br />
              <b>Founder: {data.company.founder}</b> <br />
              <b>CEO: {data.company.ceo}</b> <br />
              <b>COO: {data.company.coo}</b> <br />
              <b>CTO: {data.company.cto}</b> <br />
          </div>
          <br />
          <h1>SpaceX Launches</h1>
          <ol className='px-5'>
            {data.rockets.map((rocket: any) => (
              <li key={rocket.id}>
                  <p>{rocket.company}</p>
                  <p>{rocket.description}</p>
                  <p>{rocket.country}</p>
              </li>
            ))}
          </ol>
        </div>
      // </ApolloProvider>
    );
}
