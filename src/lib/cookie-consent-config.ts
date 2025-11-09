import type { CookieConsentConfig } from "vanilla-cookieconsent";

export const cookieConsentConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: "bar inline",
      position: "bottom",
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      position: "right",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  cookie: {
    name: "cc_cookie",
    path: "/",
    sameSite: "Lax",
    expiresAfterDays: 182,
  },

  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    functional: {
      enabled: false,
      readOnly: false,
    },
    analytics: {
      enabled: false,
      readOnly: false,
      autoClear: {
        cookies: [
          {
            name: /^_ga/,
          },
          {
            name: /^_gid/,
          },
        ],
      },
    },
    marketing: {
      enabled: false,
      readOnly: false,
      autoClear: {
        cookies: [
          {
            name: /^_fbp$/,
          },
          {
            name: /^fr$/,
          },
        ],
      },
    },
  },

  language: {
    default: "en",
    translations: {
      en: {
        consentModal: {
          title: "Your cookie preferences",
          description:
            "When you visit our website, we may collect and store browser data – like pages viewed or items clicked – using cookies. Cookies help us keep the site working, improve performance, and show you personalised content. It's your choice what we collect. You can find details and choose which types of cookies to allow by clicking on 'Cookie Settings' and update your preferences anytime. Not accepting some cookies may limit certain website features. For more details, see our <a href='/privacy-policy'>Privacy Policy</a>.",
          acceptAllBtn: "Accept All",
          acceptNecessaryBtn: "Reject All",
          showPreferencesBtn: "Cookie Settings",
        },
        preferencesModal: {
          title: "Cookie Settings",
          acceptAllBtn: "Accept All",
          acceptNecessaryBtn: "Reject All",
          savePreferencesBtn: "Save Preferences",
          closeIconLabel: "Close",
          serviceCounterLabel: "Service|Services",
          sections: [
            {
              title: "About Cookies",
              description:
                "This website and this policy is owned and operated by Gentle Human Ltd, under the trading name SkinBestie (SkinBestie or 'We').<br><br><strong>What are cookies?</strong><br><br>A cookie is a small file that a website transfers to the cookie file of the browser on your device so that the website can remember who you are. We use cookies to help you navigate our website efficiently and to perform certain functions, including site traffic analysis. Cookies may also recognise you on your next login and offer you content tailored to your preferences and interests. Cookies do not compromise the security of a website. Some cookies can collect personal information, including information you disclose like your username, or where cookies track you to deliver more relevant advertising content. For further details on how we use your personal information, please see our <a href='/privacy-policy'>Privacy Policy</a>.<br><br>There are two types of cookies on our sites – 'session' cookies that are temporary cookies that remain on your browser only while you're on our site, and 'persistent' cookies, that remain on your browser for much longer.<br><br><strong>Do I want to stop them?</strong><br><br>Many cookies are used to enhance the usability or functionality of a website; therefore, disabling cookies may prevent you from using certain parts of this website. We explain the cookies we use in the section below. If you wish to restrict or block all the cookies which are set by our website (which as we say may prevent you from using certain parts of the site), or indeed any other website, you can do this through your browser settings. The Help function within your browser should tell you how. For more information go to <a href='https://allaboutcookies.org/' target='_blank' rel='noopener'>https://allaboutcookies.org/</a>.<br><br><strong>Which cookies are being used on this site?</strong><br><br>Toggle the switches below to enable or disable specific cookie categories, then click 'Save Preferences' to apply your choices.",
            },
            {
              title: "Necessary Cookies - Always Active",
              description:
                "These cookies are essential for our website to operate. Without these cookies, services you have requested, such as secure login and payment processing, cannot be provided.",
              linkedCategory: "necessary",
              cookieTable: {
                headers: {
                  name: "Cookie",
                  domain: "Domain",
                  description: "Description",
                  expiration: "Expiration",
                },
                body: [
                  {
                    name: "authjs.session-token",
                    domain: "skinbestie.com",
                    description:
                      "Authentication session cookie for secure login using Auth.js",
                    expiration: "30 days",
                  },
                  {
                    name: "cc_cookie",
                    domain: "skinbestie.com",
                    description: "Stores your cookie consent preferences",
                    expiration: "6 months",
                  },
                  {
                    name: "__stripe_*",
                    domain: "stripe.com",
                    description:
                      "Stripe payment processing cookies for secure transactions",
                    expiration: "Session",
                  },
                ],
              },
            },
            {
              title: "Functional Cookies",
              description:
                "These cookies recognise you when you return to our website. They remember information enabling us to remember your preferences and display relevant content when you return. We do not currently use any functional cookies.",
              linkedCategory: "functional",
            },
            {
              title: "Analytical Cookies",
              description:
                "These cookies collect information about how visitors use and engage with our website (such as the most visited pages), helping us to make improvements to our website. We do not currently use any analytical cookies.",
              linkedCategory: "analytics",
            },
            {
              title: "Targeting Cookies",
              description:
                "These cookies collect information about your browsing habits (such as services you have subscribed to or content you have engaged with) as well as information about your browser, device and IP address. We use this information to display more relevant content and advertisements to you, as well as to limit the number of times you see an advertisement and measure the effectiveness of a campaign. Occasionally we share this information with partners, including other advertising organisations. Targeting Cookies help us to connect with you on our website and on other websites. If you disable these cookies, you may still see the same number of advertisements although they may be less relevant to you. We do not currently use any targeting cookies.",
              linkedCategory: "marketing",
            },
          ],
        },
      },
    },
  },
};
