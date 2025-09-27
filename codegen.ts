// import type { CodegenConfig } from "@graphql-codegen/cli";
// import { loadEnvConfig } from "@next/env";

// const projectDir = process.cwd();
// loadEnvConfig(projectDir);

// const config: CodegenConfig = {
//   overwrite: true,
//   schema: {
//     [`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`]: {
//       headers: {
//         "User-Agent": "Codegen",
//       },
//     },
//   },
//   generates: {
//     "src/gql/": {
//       preset: "client",
//     },
//     "src/gql/schema.gql": {
//       plugins: ["schema-ast"],
//     },
//   },
// };

// export default config;
// codegen.ts
import type { CodegenConfig } from "@graphql-codegen/cli";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`]: {
      headers: { "User-Agent": "Codegen" },
    },
  },
  // 👇 THIS is the missing piece: tell Codegen where your queries live
  documents: [
    "queries/**/*.{ts,tsx,graphql,gql}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  generates: {
    // write to project-root /gql to match your repo
    "gql/": {
      preset: "client",
      presetConfig: { gqlTagName: "gql" },
    },
    "gql/schema.gql": { plugins: ["schema-ast"] },
  },
  // make sure it knows where to “pluck” gql from
  pluckConfig: {
    modules: [
      { name: "graphql-tag", identifier: "gql" }, // you’re using this right now
      { name: "@/gql", identifier: "gql" }, // if you later switch to generated gql
    ],
  },
  ignoreNoDocuments: false, // <— if it can’t find ops, it will say so instead of silently succeeding
};

export default config;
