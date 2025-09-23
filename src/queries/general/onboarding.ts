// src/queries/general/onboarding.ts
import gql from "graphql-tag";

export const GET_ONBOARDING_PAGE = gql`
  query GetOnboardingPage {
    page(id: "onboarding", idType: URI) {
      title
      onboarding {
        steps {
          __typename
          ... on OnboardingStepsPersonalDetailsLayout {
            mainHeadline
            subHeadline
            formTitle
            formDescription
            backgroundImage {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;
