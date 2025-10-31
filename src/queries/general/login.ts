import { gql } from "graphql-tag";

export const GetLoginPage = gql(/* GraphQL */ `
  query GetLoginPage {
    page(id: "/login", idType: URI) {
      login {
        backgroundCopy
        backgroundImage {
          node {
            altText
            sourceUrl
          }
        }
        formHeading
        formSubheading
      }
    }
  }
`);
