import React from "react"
import { Link, graphql, StaticQuery } from "gatsby"
import { Box, PseudoBox, Stack, Text, useColorMode } from "@chakra-ui/core"
import Img from "gatsby-image"

const PostLink = ({ slug, post, img }) => {
  // const { colorMode } = useColorMode()
  const colorMode = "light"

  return (
    <PseudoBox m={2}>
      <Link to={slug}>
        <PseudoBox
          backgroundColor={colorMode === "dark" ? "gray.600" : "gray.100"}
          _hover={{
            bg: colorMode === "dark" ? "gray.500" : "gray.200",
            /*boxShadow: "outline",*/
            transform: "translate(-3px, -3px)",
          }}
          rounded="lg"
          p={4}
          display={{ md: "flex" }}
        >
          <Box rounded="lg" flexShrink={0} width={{ md: 200 }}>
            <Img fluid={img} />
          </Box>
          <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
            <Text
              fontWeight="bold"
              textTransform="uppercase"
              fontSize="sm"
              letterSpacing="wide"
              color="teal.600"
            >
              {post.frontmatter.title}
            </Text>

            {post.frontmatter.description}
            <Text mt={2} color={colorMode === "dark" ? "gray.200" : "gray.600"}>
              {post.excerpt}
            </Text>
          </Box>
        </PseudoBox>
      </Link>
    </PseudoBox>
  )
}

export default function BlogIndex({ data }) {
  const { edges: posts } = data.allMdx

  return (
    <Stack>
      {posts.map(({ node: post }) => {
        const thumbnail = post.fields.thumbnail || "reindeer"
        return (
          <PostLink
            key={post.fields.slug}
            slug={post.fields.slug}
            post={post}
            img={data[thumbnail].childImageSharp.fluid}
          />
        )
      })}
    </Stack>
  )
}
