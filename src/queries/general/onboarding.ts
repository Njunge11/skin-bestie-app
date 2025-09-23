// src/queries/general/onboarding.ts
import gql from "graphql-tag";

export const GET_ONBOARDING_PAGE = gql`
  query GetOnboardingPage {
    page(id: "onboarding", idType: URI) {
      title
      onboarding {
        steps {
          __typename # 👈 REQUIRED for your mapper
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
          ... on OnboardingStepsSkinTypeLayout {
            mainHeadline
            subHeadline
            formTitle
            formInstruction
            backgroundImage {
              node {
                altText
                sourceUrl
              }
            }
          }
          ... on OnboardingStepsSkinConcernsLayout {
            mainHeadline
            subHeadline
            formTitle
            formInstruction
            formDescription
            backgroundImage {
              node {
                altText
                sourceUrl
              }
            }
          }
          ... on OnboardingStepsAllergiesLayout {
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
          # add other layouts here when you implement them
        }
      }
    }
  }
`;
