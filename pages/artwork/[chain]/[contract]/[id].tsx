import {
  faArrowLeft,
  faCircleExclamation,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { paths } from '@reservoir0x/reservoir-sdk'
import {
  TokenMedia,
  useCollections,
  useTokenOpenseaBanned,
  useTokens,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import Layout from 'components/Layout'
import {
  Flex,
  Text,
  Button,
  Tooltip,
  Anchor,
  Grid,
  Box,
} from 'components/primitives'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import AttributeCard from 'components/token/AttributeCard'
import { PriceData } from 'components/token/PriceData'
import RarityRank from 'components/token/RarityRank'
import { TokenActions } from 'components/token/TokenActions'
import {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Link from 'next/link'
import { jsNumberForAddress } from 'react-jazzicon'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import fetcher from 'utils/fetcher'
import { useAccount } from 'wagmi'
import { TokenInfo } from 'components/token/TokenInfo'
import { useMediaQuery } from 'react-responsive'
import FullscreenMedia from 'components/token/FullscreenMedia'
import { useContext, useEffect, useState } from 'react'
import { ToastContext } from 'context/ToastContextProvider'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import { useENSResolver, useMarketplaceChain, useMounted } from 'hooks'
import { useRouter } from 'next/router'
import supportedChains, { DefaultChain } from 'utils/chains'
import { spin } from 'components/common/LoadingSpinner'
import Head from 'next/head'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const IndexPage: NextPage<Props> = ({ id, collectionId, ssr }) => {
  const router = useRouter()
  const { addToast } = useContext(ToastContext)
  const account = useAccount()
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 }) && isMounted
  const [tabValue, setTabValue] = useState('info')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { proxyApi } = useMarketplaceChain()
  const { data: collections } = useCollections(
    {
      id: collectionId,
    },
    {
      fallbackData: [ssr.collection],
    }
  )
  const collection = collections && collections[0] ? collections[0] : null

let collectionUrls = new Map()
collectionUrls.set("0x398034c799fad7fdc4695c8eb8bec713ebed9da4", "https://v2.fellowship.xyz/collections/alessandra-sanguinetti-the-adventures-of-guille-and-belinda/")
collectionUrls.set("0x7037843d739d846cdce3a6839a80f7d70b60b99a", "https://v2.fellowship.xyz/collections/the-sander-family-archives/")
collectionUrls.set("0x4F248709CFeE7f6Eb125482509de5BeBD40466D3", "https://v2.fellowship.xyz/collections/carlo-van-de-roer-rescued/")
collectionUrls.set("0xe76e41c710a3108a292bba0e157e7191ec194e9b", "https://v2.fellowship.xyz/collections/christopher-anderson-approximate-joy/")
collectionUrls.set("0x7f6f65ee55875efd4cdfbf1ffe85b66039f63878", "https://v2.fellowship.xyz/collections/christopher-anderson-pia/")
collectionUrls.set("0x6ec8055528a6e7f2ae87b87ad31f4af00a57c373", "https://v2.fellowship.xyz/collections/christopher-anderson-son/")
collectionUrls.set("0xc44Bb15B8b0839beB322AE24283F57f3421d120A", "https://v2.fellowship.xyz/collections/cristina-de-middel-midnight-at-the-crossroad/")
collectionUrls.set("0x9fea390481B6be2339fe143b0202a5457E0605fa", "https://v2.fellowship.xyz/collections/cristina-de-middel-polyspam/")
collectionUrls.set("0xdcD918C7D0057c02A4d1eB135eDE91252E75892b", "https://v2.fellowship.xyz/collections/cristina-de-middel-this-is-what-hatred-did/")
collectionUrls.set("0xfd3f2caf95e81c69bf1c531a5e85836bc2b28419", "https://v2.fellowship.xyz/collections/david-brandon-geeting-amusement-park/")
collectionUrls.set("0x082dcab372505ae56eafde58204ba5b12ff3f3f5", "https://v2.fellowship.xyz/collections/dmitri-cherniak-light-years/")
collectionUrls.set("0xc1c7fb277d9c75df7cd03327a1b39aadbfb545a3", "https://v2.fellowship.xyz/collections/gregory-crewdson-an-eclipse-of-moths/")
collectionUrls.set("0x69e734d3a64a430cafde0a380711510bb73df008", "https://v2.fellowship.xyz/collections/gregory-crewdson-beneath-the-roses/")
collectionUrls.set("0xbf45d42c7ff2c5c148863ce65e492657e7c6d926", "https://v2.fellowship.xyz/collections/gregory-crewdson-cathedral-of-the-pines/")
collectionUrls.set("0x4866f5e34ae43987b93a929152eb3b95902bb0ca", "https://v2.fellowship.xyz/collections/gregory-crewdson-dream-house/")
collectionUrls.set("0x11665f3fdefff375d32ee7fefe96af56ca0cc502", "https://v2.fellowship.xyz/collections/gregory-halpern-zzyzx/")
collectionUrls.set("0xd0b67acc0e5918192b158c1647dad5782e6f4fb5", "https://v2.fellowship.xyz/collections/guy-bourdin-portfolio-1-2022/")
collectionUrls.set("0xd0b67acc0e5918192b158c1647dad5782e6f4fb5", "https://v2.fellowship.xyz/collections/guy-bourdin-estate-portfolio-2-2023/")
collectionUrls.set("0x39c7f19b6014Ed56b8937a19D92A09875C279CB8", "https://v2.fellowship.xyz/collections/hank-willis-thomas-wayfarer/")
collectionUrls.set("0xfe19a176aecca6fe31b6acc5cacbbd0a3315f422", "https://v2.fellowship.xyz/collections/jeffrey-milstein-aircraft/")
collectionUrls.set("0x76a9ae4e5a2228456a4e9595281ad2731423f162", "https://v2.fellowship.xyz/collections/jim-goldberg-raised-by-wolves/")
collectionUrls.set("0xc719f2a34a3368aa7c1155e4a99ed5b7707d5d9b", "https://v2.fellowship.xyz/collections/joel-meyerowitz-between-the-dog-and-the-wolf/")
collectionUrls.set("0x4635b5a4da92a75a2b456f41ce67ec7b984b88ce", "https://v2.fellowship.xyz/collections/joel-meyerowitz-cape-light/")
collectionUrls.set("0x4765dfb514d05fae20a5a44ec4dd4b8e4209793b", "https://v2.fellowship.xyz/collections/joel-sternfeld-american-prospects-the-new-pictures/")
collectionUrls.set("0x74c47b4e0cf7f181631ecb738ac8bd40577db256", "https://v2.fellowship.xyz/collections/john-divola-isolated-houses/")
collectionUrls.set("0x5b23b7686f84191000329643a91ce33759005ead", "https://v2.fellowship.xyz/collections/jonas-bendiksen-the-book-of-veles/")
collectionUrls.set("0xe58cd4b63a0cb3db983b1aa46dd62c2e47ed9a63", "https://v2.fellowship.xyz/collections/katy-grannan-boulevard/")
collectionUrls.set("0xf656B98d6fDb1C403fA9C7F7628F57005447f946", "https://v2.fellowship.xyz/collections/kevin-cooley-exploded-views/")
collectionUrls.set("0xfbd960e3f689962c3440fd0d553f4d7eeeb22608", "https://v2.fellowship.xyz/collections/laszlo-moholy-nagy-estate-portfolio-1-2022/")
collectionUrls.set("0x4635B5a4dA92A75A2b456F41ce67EC7B984B88CE", "https://v2.fellowship.xyz/collections/laurie-simmons-talking-objects/")
collectionUrls.set("0x49e6b0cfb1880fd7afb69c062613238049a4b56b", "https://v2.fellowship.xyz/collections/marcel-de-baer-archive-the-negatives/")
collectionUrls.set("0xA280Da59CaE87b4e2fE17B276210745748496C84", "https://v2.fellowship.xyz/collections/mauricio-alejo-the-elusive-years/")
collectionUrls.set("0x47Fa0F531b3CDA5D092cA4f90B20D56eAa3f1744", "https://v2.fellowship.xyz/collections/maurizio-anzeri-portfolio-2023/")
collectionUrls.set("0xe0d742e4a5fe8b1519c73a32c7d6612f9bd5853d", "https://v2.fellowship.xyz/collections/max-pinckers-margins-of-excess/")
collectionUrls.set("0xa03ff7e26135de18bb69a7cf812348d5bba6b8b3", "https://v2.fellowship.xyz/collections/mitch-epstein-american-power/")
collectionUrls.set("0x6c0f41bf543d4db04550bffc8fea285b129f868c", "https://v2.fellowship.xyz/collections/mitch-epstein-recreation/")
collectionUrls.set("0x99b00c95ea9039229e5f2aab384eeadeb0d48a40", "https://v2.fellowship.xyz/collections/pablo-lopez-luz-frontera/")
collectionUrls.set("0x0162d2752020355d9880515544467d04a014811f", "https://v2.fellowship.xyz/collections/pablo-lopez-terrazo/")
collectionUrls.set("0x0835412b2aC0c74644ee6467f43aca5a848e0bfc", "https://v2.fellowship.xyz/collections/paul-graham-end-of-an-age/")
collectionUrls.set("0x317bcf59a0c3a3ad43c6df64ade8e2fb0b14f517", "https://v2.fellowship.xyz/collections/paul-graham-television-portraits/")
collectionUrls.set("0x0cdb0dd8ad3aa79cea6841b36cb16c89707dc96f", "https://v2.fellowship.xyz/collections/pelle-cass-crowded-fields-ii/")
collectionUrls.set("0x5198DFDc6EfD06Db7D3ee7C65E794Caadca4296A", "https://v2.fellowship.xyz/collections/pelle-cass-crowded-fields/")
collectionUrls.set("0xb20e266511eec5462baff2570f4fbb272509c207", "https://v2.fellowship.xyz/collections/pelle-cass-fashion/")
collectionUrls.set("0x52095e8a6F684fF8Aa53d396d514A09B20c1926E", "https://v2.fellowship.xyz/collections/pelle-cass-self-portraits-with-mistakes/")
collectionUrls.set("0x987f91abce9158fd86818808505c67842b9ed3eb", "https://v2.fellowship.xyz/collections/pelle-cass-uncrowded-fields/")
collectionUrls.set("0x0e1932269fdf59fcc448eb91caac307b79223158", "https://v2.fellowship.xyz/collections/pieter-hugo-permanent-error/")
collectionUrls.set("0xf38b61deb728f25358066370b07a7e9629e5804c", "https://v2.fellowship.xyz/collections/pieter-hugo-the-hyena-and-other-men/")
collectionUrls.set("0xd07f39b232E935154748BaB2Aa3b6c18c926957e", "https://v2.fellowship.xyz/collections/prisca-munkeni-monnier-la-vie-est-belle")
collectionUrls.set("0xBdD090BB91638ec0972f5f34480C300a6825A15d", "https://v2.fellowship.xyz/collections/prisca-munkeni-monnier-genesis-collection/")
collectionUrls.set("0x28398a2c1459119efa3e6699e928612ea4909a13", "https://v2.fellowship.xyz/collections/tania-franco-klein-our-life-in-the-shadows/")
collectionUrls.set("0x23e3f2ea133f2c80558e181c4f78f4da3bc7c477", "https://v2.fellowship.xyz/collections/todd-hido-house-hunting/")
collectionUrls.set("0xb8c55c77b3617ef22a4f552f9a47503e021c6623", "https://v2.fellowship.xyz/collections/todd-hido-roaming/")
console.log("0x398034c799fad7fdc4695c8eb8bec713ebed9da4: "+collectionUrls.get("0x398034c799fad7fdc4695c8eb8bec713ebed9da4"))
console.log("0x7037843d739d846cdce3a6839a80f7d70b60b99a: "+collectionUrls.get("0x7037843d739d846cdce3a6839a80f7d70b60b99a"))
  const contract = collectionId ? collectionId?.split(':')[0] : undefined
  const { data: tokens, mutate } = useTokens(
    {
      tokens: [`${contract}:${id}`],
      includeAttributes: true,
      includeTopBid: true,
    },
    {
      fallbackData: [ssr.tokens],
    }
  )
  const flagged = useTokenOpenseaBanned(collectionId, id)
  const token = tokens && tokens[0] ? tokens[0] : undefined
  const checkUserOwnership = token?.token?.kind === 'erc1155'

  const { data: userTokens } = useUserTokens(
    checkUserOwnership ? account.address : undefined,
    {
      tokens: [`${contract}:${id}`],
    }
  )

  const isOwner =
    userTokens &&
    userTokens[0] &&
    userTokens[0].ownership?.tokenCount &&
    +userTokens[0].ownership.tokenCount > 0
      ? true
      : token?.token?.owner?.toLowerCase() === account?.address?.toLowerCase()
  const owner = isOwner ? account?.address : token?.token?.owner
  const { displayName: ownerFormatted } = useENSResolver(token?.token?.owner)

  const tokenName = `${token?.token?.name || `#${token?.token?.tokenId}`}`

  const hasAttributes =
    token?.token?.attributes && token?.token?.attributes.length > 0

  useEffect(() => {
    isMounted && isSmallDevice && hasAttributes
      ? setTabValue('attributes')
      : setTabValue('info')
  }, [isSmallDevice])

  const pageTitle = token?.token?.name
    ? token.token.name
    : `${token?.token?.tokenId} - ${token?.token?.collection?.name}`

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={collection?.description as string} />
        <meta name="twitter:title" content={pageTitle} />
        <meta
          name="twitter:image"
          content={token?.token?.image || collection?.banner}
        />
        <meta name="og:title" content={pageTitle} />
        <meta
          property="og:image"
          content={token?.token?.image || collection?.banner}
        />
      </Head>
      <Flex
        justify="center"
        css={{
          maxWidth: 1175,
          mt: 10,
          pb: 100,
          marginLeft: 'auto',
          marginRight: 'auto',
          px: '$1',
          gap: 20,
          flexDirection: 'column',
          alignItems: 'center',
          '@md': {
            mt: 48,
            px: '$3',
            flexDirection: 'row',
            gap: 40,
            alignItems: 'flex-start',
          },
          '@lg': {
            gap: 80,
          },
        }}
      >
        <Flex
          direction="column"
          css={{
            maxWidth: '100%',
            flex: 1,
            '@md': { maxWidth: 445, width: '100%' },
            position: 'relative',
            '@sm': {
              '>button': {
                height: 0,
                opacity: 0,
                transition: 'opacity .3s',
              },
            },
            ':hover >button': {
              opacity: 1,
              transition: 'opacity .3s',
            },
          }}
        >
          <Box
            css={{
              backgroundColor: '$gray3',
              borderRadius: 8,
              '@sm': {
                button: {
                  height: 0,
                  opacity: 0,
                  transition: 'opacity .3s',
                },
              },
              ':hover button': {
                opacity: 1,
                transition: 'opacity .3s',
              },
            }}
          >
            <TokenMedia
              token={token?.token}
              videoOptions={{ autoPlay: true, muted: true }}
              style={{
                width: '100%',
                height: 'auto',
                minHeight: isMounted && isSmallDevice ? 300 : 445,
                borderRadius: 8,
                overflow: 'hidden',
              }}
              onRefreshToken={() => {
                mutate?.()
                addToast?.({
                  title: 'Refresh token',
                  description: 'Request to refresh this token was accepted.',
                })
              }}
            />
            <FullscreenMedia token={token} />
          </Box>

          {token?.token?.attributes && !isSmallDevice && (
            <Grid
              css={{
                maxWidth: '100%',
                width: '100%',
                gridTemplateColumns: '1fr 1fr',
                gap: '$3',
                mt: 24,
              }}
            >
              {token?.token?.attributes?.map((attribute) => (
                <AttributeCard
                  key={`${attribute.key}-${attribute.value}`}
                  attribute={attribute}
                  collectionTokenCount={collection?.tokenCount || 0}
                  collectionId={collection?.id}
                />
              ))}
            </Grid>
          )}
        </Flex>
        <Flex
          direction="column"
          css={{
            flex: 1,
            px: '$4',
            width: '100%',
            '@md': {
              px: 0,
              maxWidth: '60%',
              overflow: 'hidden',
            },
          }}
        >
          <Flex justify="between" align="center" css={{ mb: 20 }}>
            <Flex align="center" css={{ mr: '$2', gap: '$2' }}>
              <Link
                href={`/collection/${router.query.chain}/${collectionId}`}
                legacyBehavior={true}
              >
                <Anchor
                  color="primary"
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '$2',
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} height={16} />
                  <Text css={{ color: 'inherit' }} style="subtitle1" ellipsify>
                    {collection?.name}
                  </Text>
                </Anchor>
              </Link>
              <OpenSeaVerified
                openseaVerificationStatus={
                  collection?.openseaVerificationStatus
                }
              />
            </Flex>
            <Button
              onClick={(e) => {
                if (isRefreshing) {
                  e.preventDefault()
                  return
                }
                setIsRefreshing(true)
                fetcher(
                  `${window.location.origin}/${proxyApi}/tokens/refresh/v1`,
                  undefined,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: `${contract}:${id}` }),
                  }
                )
                  .then(({ response }) => {
                    if (response.status === 200) {
                      addToast?.({
                        title: 'Refresh token',
                        description:
                          'Request to refresh this token was accepted.',
                      })
                    } else {
                      throw 'Request Failed'
                    }
                    setIsRefreshing(false)
                  })
                  .catch((e) => {
                    addToast?.({
                      title: 'Refresh token failed',
                      description:
                        'We have queued this item for an update, check back in a few.',
                    })
                    setIsRefreshing(false)
                    throw e
                  })
              }}
              disabled={isRefreshing}
              color="gray3"
              size="xs"
              css={{ cursor: isRefreshing ? 'not-allowed' : 'pointer' }}
            >
              <Box
                css={{
                  animation: isRefreshing
                    ? `${spin} 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite`
                    : 'none',
                }}
              >
                <FontAwesomeIcon icon={faRefresh} width={16} height={16} />
              </Box>
            </Button>
          </Flex>
          <Flex align="center" css={{ gap: '$2' }}>
            <Text style="h4" css={{ wordBreak: 'break-all' }}>
              {tokenName}
            </Text>
            {flagged && (
              <Tooltip
                content={
                  <Text style="body2" as="p">
                    Not tradeable on OpenSea
                  </Text>
                }
              >
                <Text css={{ color: '$red10' }}>
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    width={16}
                    height={16}
                  />
                </Text>
              </Tooltip>
            )}
          </Flex>
          {token && (
            <>
              <Flex align="center" css={{ mt: '$2' }}>
                <Text style="subtitle3" color="subtle" css={{ mr: '$2' }}>
                  Owner
                </Text>
                <Jazzicon
                  diameter={16}
                  seed={jsNumberForAddress(owner || '')}
                />
                <Link href={`/profile/${owner}`} legacyBehavior={true}>
                  <Anchor color="primary" weight="normal" css={{ ml: '$1' }}>
                    {isMounted ? ownerFormatted : ''}
                  </Anchor>
                </Link>
              </Flex>
              <RarityRank
                token={token}
                collection={collection}
                collectionAttributes={ssr.attributes?.attributes}
              />
              <PriceData token={token} />
              {isMounted && (
                <TokenActions
                  token={token}
                  isOwner={isOwner}
                  mutate={mutate}
                  account={account}
                />
              )}
              <Tabs.Root
                value={tabValue}
                onValueChange={(value) => setTabValue(value)}
              >
                <TabsList>
                  {isMounted && isSmallDevice && hasAttributes && (
                    <TabsTrigger value="attributes">Attributes</TabsTrigger>
                  )}
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="attributes">
                  {token?.token?.attributes && (
                    <Grid
                      css={{
                        gap: '$3',
                        mt: 24,
                        gridTemplateColumns: '1fr',
                        '@sm': {
                          gridTemplateColumns: '1fr 1fr',
                        },
                      }}
                    >
                      {token?.token?.attributes?.map((attribute) => (
                        <AttributeCard
                          key={`${attribute.key}-${attribute.value}`}
                          attribute={attribute}
                          collectionTokenCount={collection?.tokenCount || 0}
                          collectionId={collection?.id}
                        />
                      ))}
                    </Grid>
                  )}
                </TabsContent>
                <TabsContent value="info">
                  {collection && (
                    <TokenInfo token={token} collection={collection} />
                  )}
                </TabsContent>
              </Tabs.Root>
            </>
          )}
        </Flex>
      </Flex>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{
  id?: string
  collectionId?: string
  ssr: {
    collection: paths['/collections/v5']['get']['responses']['200']['schema']
    tokens: paths['/tokens/v5']['get']['responses']['200']['schema']
    attributes?: paths['/collections/{collection}/attributes/all/v2']['get']['responses']['200']['schema']
  }
}> = async ({ params }) => {
  let collectionId = params?.contract?.toString()
  const id = params?.id?.toString()
  const { reservoirBaseUrl, apiKey } =
    supportedChains.find((chain) => params?.chain === chain.routePrefix) ||
    DefaultChain

  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      id: collectionId,
      includeTopBid: true,
      normalizeRoyalties: NORMALIZE_ROYALTIES,
    }

  const headers = {
    headers: {
      'x-api-key': apiKey || '',
    },
  }

  const collectionsResponse = await fetcher(
    `${reservoirBaseUrl}/collections/v5`,
    collectionQuery,
    headers
  )
  const collection: Props['ssr']['collection'] = collectionsResponse['data']
  const contract = collectionId ? collectionId?.split(':')[0] : undefined

  let tokensQuery: paths['/tokens/v5']['get']['parameters']['query'] = {
    tokens: [`${contract}:${id}`],
    includeAttributes: true,
    includeTopBid: true,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
  }

  const tokensResponse = await fetcher(
    `${reservoirBaseUrl}/tokens/v5`,
    tokensQuery,
    headers
  )

  const tokens: Props['ssr']['tokens'] = tokensResponse['data']

  let attributes: Props['ssr']['attributes'] | undefined
  try {
    const attributesResponse = await fetcher(
      `${reservoirBaseUrl}/collections/${collectionId}/attributes/all/v2`,
      {},
      headers
    )
    attributes = attributesResponse['data']
  } catch (e) {
    console.log('Failed to load attributes')
  }

  return {
    props: { collectionId, id, ssr: { collection, tokens, attributes } },
    revalidate: 20,
  }
}

export default IndexPage
