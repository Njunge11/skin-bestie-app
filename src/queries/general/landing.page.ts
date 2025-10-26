// queries/landing.page.ts  (adjust path if yours differs)
import { gql } from "graphql-tag";

export const GetLandingPage = gql(/* GraphQL */ `
  query GetLandingPage {
    page(id: "/", idType: URI) {
      title
      home {
        skinbestieBenefits {
          ... on HomeSkinbestieBenefitsContentLayout {
            mainHeadline
            backgroundImage {
              node {
                altText
                sourceUrl
              }
            }
            list {
              icon {
                node {
                  altText
                  sourceUrl
                }
              }
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
                timeline
                testimonial
                customerName
              }
            }
          }
        }
        skinbestieValues {
          ... on HomeSkinbestieValuesContentLayout {
            mainHeadline
            image {
              node {
                altText
                sourceUrl
              }
            }
            values {
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
        skinbestieStory {
          ... on HomeSkinbestieStoryContentLayout {
            mainHeadline
            values {
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
        skinbestiePricing {
          ... on HomeSkinbestiePricingContentLayout {
            mainHeadline
            subHeadline
            valueProp {
              ... on HomeSkinbestiePricingValuePropPriceDetailsLayout {
                mainHeadline
                subHeadline
                benefits {
                  benefit
                }
              }
            }
          }
        }
        skinbestieFaqs {
          ... on HomeSkinbestieFaqsContentLayout {
            mainHeadline
            mainHeadline2
            subHeadline
            faqs {
              question
              answerType
              answerList {
                item
              }
              answerText
            }
          }
        }
      }
    }
  }
`);
