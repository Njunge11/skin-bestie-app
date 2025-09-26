// queries/general/GetLandingPage.ts
export const GetLandingPage = /* GraphQL */ `
  query GetLandingPage {
    page(id: "/", idType: URI) {
      title
      home {
        mainHeadline
        backgroundImage {
          node {
            altText
            sourceUrl
          }
        }
        skinbestieBenefits {
          skinbestieBenefit
          skinbestieBenefitDescription
        }
      }
    }
  }
`;
