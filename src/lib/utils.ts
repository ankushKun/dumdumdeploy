import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { gql, GraphQLClient } from "graphql-request"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BUILDER_BACKEND = "http://localhost:3001"
export const DEPLOYMENT_WALLET = "CUO_Jtx-J9Ph4NVKY_Bgii4HSUwK3NbdaIlPDSiy8Cs"

export async function getManagerProcessFromAddress(address: string) {
  const client = new GraphQLClient("https://arweave.net/graphql")

  const query = gql`
  query {
  transactions(
    owners: ["${address}"]
    tags: [
      { name: "App-Name", values: ["DumDumDeploy"] }
      { name: "Name", values: ["DumDumDeploy-Manager"] }
    ]
  ) {
    edges {
      node {
        id
      }
    }
  }
}`

  type response = {
    transactions: {
      edges: {
        node: {
          id: string
        }
      }[]
    }
  }

  const data: response = await client.request(query)
  return data.transactions.edges.length > 0 ? data.transactions.edges[0].node.id : null
}