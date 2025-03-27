import { createFileRoute } from '@tanstack/react-router'
import { useQuery, gql } from "@apollo/client";

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
    const { data, loading, error } = useQuery(FILMS_QUERY);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>
  
    return (
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
        <ul className='px-5'>
          {data.rockets.map((rocket: any) => (
            <li key={rocket.id}>
                <p>{rocket.company}</p>
                <p>{rocket.description}</p>
                <p>{rocket.country}</p>
            </li>
          ))}
        </ul>
      </div>
    );
}
