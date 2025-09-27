// queries/general/GetLandingPage.ts
export const GetLandingPage = /* GraphQL */ `
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
      }
    }
  }
`;
