// queries/landing.page.ts  (adjust path if yours differs)
import { gql } from "graphql-tag";

export const GetLandingPage = gql(/* GraphQL */ `
  query GetLandingPage {
    page(id: "/", idType: URI) {
      title
      home {
        skinbestieBenefits {
          ... on HomeSkinbestieBenefitsContentLayout {
            backgroundImage {
              node {
                altText
                sourceUrl
              }
            }
            list {
              title
              description
            }
          }
        }
        skinbestieJourney {
          ... on HomeSkinbestieJourneyContentLayout {
            mainHeadline
            subHeadline
            list {
              icon {
                node {
                  altText
                  sourceUrl
                }
              }
              title
              description
            }
          }
        }
        skinbestieTestimonials {
          ... on HomeSkinbestieTestimonialsContentLayout {
            mainHeadline
            subHeadline
            image {
              node {
                altText
                sourceUrl
              }
            }
            carousel {
              cardContent {
                concern
                goal
                testimonial
                customerName
              }
            }
          }
        }
      }
    }
  }
`);
