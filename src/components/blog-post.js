import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import {
  Box,
  Alert,
  Code,
  Heading,
  Text,
  Image,
  List,
  Link as ChakraUILink,
  Divider,
  ListItem,
} from "@chakra-ui/react"
import SEO from "./seo"
import SingleSection from "./single-section"
import CodeBlock from "./code-block"

const components = {
  h1: props => (
    <Heading
      {...props}
      as="h1"
      fontSize={["3xl", "4xl", "5xl"]}
      textAlign="center"
      mb={12}
      color="gray.900"
      fontWeight={900}
    >
      {props.children}
    </Heading>
  ),
  h2: props => (
    <Heading
      as="h2"
      fontSize="3xl"
      fontWeight="900"
      mt={5}
      {...props}
    ></Heading>
  ),
  h3: props => (
    <Heading as="h3" fontSize="2xl" fontWeight="800" mt={6} {...props} />
  ),
  h4: props => (
    <Heading as="h4" mt={5} fontSize="lg" fontWeight="700" {...props} />
  ),
  h5: props => <Heading as="h5" fontSize="md" fontWeight="600" {...props} />,
  h6: props => <Heading as="h6" fontSize="sm" fontWeight="500" {...props} />,
  p: props => (
    <Text as="p" mt={4} {...props}>
      {props.children}
    </Text>
  ),
  blockquote: props => (
    <Alert
      my={6}
      rounded="sm"
      status="info"
      variant="left-accent"
      color="blue.900"
      fontWeight="600"
      css={{ "> *:first-of-type": { marginTop: 0 } }}
      {...props}
    >
      {props.children}
    </Alert>
  ),
  inlineCode: props => <Code color="#009090	" fontSize="inherit" {...props} />,
  hr: props => <Divider borderColor="gray.100" my={6} {...props} />,
  a: props => <ChakraUILink color="blue.500" {...props} />,
  img: props => <Image {...props} rounded="sm" />,
  pre: props => <Box my="2em" fontSize="inherit" rounded="sm" {...props} />,
  code: CodeBlock,
  ul: props => (
    <List styleType="disc" ml={8} my={4} spacing={2} {...props}>
      {props.children}
    </List>
  ),
  ol: props => (
    <List as="ol" styleType="decimal" my={4} ml={8} spacing={2} {...props}>
      {props.children}
    </List>
  ),
  li: props => <ListItem {...props}>{props.children}</ListItem>,
  table: props => (
    <Box as="table" textAlign="left" mt={6} width="full" {...props} />
  ),
  // tr:,
  td: props => (
    <Box
      as="td"
      p={2}
      borderTopWidth="1px"
      borderColor="inherit"
      fontSize="sm"
      whiteSpace="normal"
      {...props}
    />
  ),
  th: props => (
    <Box as="th" p={2} fontWeight="semibold" fontSize="sm" {...props} />
  ),
  thematicBreak: props => <Box height={6} {...props} />,
  // Video,
}

// const components = { Link } // Provide common components here

export default function PageTemplate({ data: { mdx } }) {
  return (
    <>
      <SEO pageTitle={mdx.frontmatter.title} />
      <SingleSection
        heading={mdx.frontmatter.title}
        subheading={mdx.frontmatter.date}
      >
        <Box maxWidth="900px" mx="auto" textAlign="justify">
          <MDXProvider components={components}>
            <MDXRenderer>{mdx.body}</MDXRenderer>
          </MDXProvider>
        </Box>
      </SingleSection>
    </>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        date(formatString: "MMMM Do, YYYY")
      }
    }
  }
`
