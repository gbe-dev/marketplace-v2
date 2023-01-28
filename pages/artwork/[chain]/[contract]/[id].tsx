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
import { collectionUrls } from 'utils/collectionUrls'

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
                href={collectionUrls.get(collectionId)[0]}
                legacyBehavior={false}
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
                    {collectionUrls.get(collectionId)[1]}
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
      <>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "    \n    --six-site-max-width: 3300px;\n    --six-cols: 12;\n    --six-site-margin: 60px;\n    --six-gutter: 48px;\n    --six-panel-width: 85vw;\n    --six-filter-width: 220px;\n    --six-filter-offset: -440px;\n    --six-card-border: 10px;\n    --six-animation-scale-factor: 60px;\n    --six-card-caption: 115px;\n    --scale-amount: 0;\n    --vh: 100vh;\n    --scrollbar-width: 0px;\n    --wp--preset--color--black: #000000;\n    --wp--preset--color--cyan-bluish-gray: #abb8c3;\n    --wp--preset--color--white: #ffffff;\n    --wp--preset--color--pale-pink: #f78da7;\n    --wp--preset--color--vivid-red: #cf2e2e;\n    --wp--preset--color--luminous-vivid-orange: #ff6900;\n    --wp--preset--color--luminous-vivid-amber: #fcb900;\n    --wp--preset--color--light-green-cyan: #7bdcb5;\n    --wp--preset--color--vivid-green-cyan: #00d084;\n    --wp--preset--color--pale-cyan-blue: #8ed1fc;\n    --wp--preset--color--vivid-cyan-blue: #0693e3;\n    --wp--preset--color--vivid-purple: #9b51e0;\n    --wp--preset--color--red: #e27f7f;\n    --wp--preset--color--grey: #959595;\n    --wp--preset--gradient--vivid-cyan-blue-to-vivid-purple: linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%);\n    --wp--preset--gradient--light-green-cyan-to-vivid-green-cyan: linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%);\n    --wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange: linear-gradient(135deg,rgba(252,185,0,1) 0%,rgba(255,105,0,1) 100%);\n    --wp--preset--gradient--luminous-vivid-orange-to-vivid-red: linear-gradient(135deg,rgba(255,105,0,1) 0%,rgb(207,46,46) 100%);\n    --wp--preset--gradient--very-light-gray-to-cyan-bluish-gray: linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%);\n    --wp--preset--gradient--cool-to-warm-spectrum: linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%);\n    --wp--preset--gradient--blush-light-purple: linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%);\n    --wp--preset--gradient--blush-bordeaux: linear-gradient(135deg,rgb(254,205,165) 0%,rgb(254,45,45) 50%,rgb(107,0,62) 100%);\n    --wp--preset--gradient--luminous-dusk: linear-gradient(135deg,rgb(255,203,112) 0%,rgb(199,81,192) 50%,rgb(65,88,208) 100%);\n    --wp--preset--gradient--pale-ocean: linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%);\n    --wp--preset--gradient--electric-grass: linear-gradient(135deg,rgb(202,248,128) 0%,rgb(113,206,126) 100%);\n    --wp--preset--gradient--midnight: linear-gradient(135deg,rgb(2,3,129) 0%,rgb(40,116,252) 100%);\n    --wp--preset--duotone--dark-grayscale: url('#wp-duotone-dark-grayscale');\n    --wp--preset--duotone--grayscale: url('#wp-duotone-grayscale');\n    --wp--preset--duotone--purple-yellow: url('#wp-duotone-purple-yellow');\n    --wp--preset--duotone--blue-red: url('#wp-duotone-blue-red');\n    --wp--preset--duotone--midnight: url('#wp-duotone-midnight');\n    --wp--preset--duotone--magenta-yellow: url('#wp-duotone-magenta-yellow');\n    --wp--preset--duotone--purple-green: url('#wp-duotone-purple-green');\n    --wp--preset--duotone--blue-orange: url('#wp-duotone-blue-orange');\n    --wp--preset--font-size--small: 13px;\n    --wp--preset--font-size--medium: 20px;\n    --wp--preset--font-size--large: 36px;\n    --wp--preset--font-size--x-large: 42px;\n    --wp--preset--spacing--20: 0.44rem;\n    --wp--preset--spacing--30: 0.67rem;\n    --wp--preset--spacing--40: 1rem;\n    --wp--preset--spacing--50: 1.5rem;\n    --wp--preset--spacing--60: 2.25rem;\n    --wp--preset--spacing--70: 3.38rem;\n    --wp--preset--spacing--80: 5.06rem;\n    text-rendering: optimizeSpeed;\n    -webkit-font-smoothing: antialiased;\n    font-style: normal;\n    font-family: ABCMonGrotesk,sans-serif;\n    font-weight: 400;\n    line-height: 1.23077;\n    --line-height: 1.23077;\n    font-size: calc(.552vw + 14.96552px);\n    letter-spacing: 0;\n    color: #191919;\n    box-sizing: border-box;\n    position: relative;\n    width: 100%;\n    min-height: 55vh;\n    padding-left: var(--six-site-margin);\n    padding-right: var(--six-site-margin);\n    display: flex;\n    align-content: space-between;\n    overflow: hidden;\n    background-color: #ef84e3;\n    background-image: linear-gradient(90deg,#ef84e3,#afcdf7);\n\n"
    }}
  />
  <footer className="GlobalFooter " g-component="GlobalFooter" g-options="[]">
    <div
      className="GlobalFooter__inner"
      g-ref="footerInner"
      style={{
        translate: "none",
        rotate: "none",
        scale: "none",
        opacity: 0,
        transform: "translate(0px, -200px)"
      }}
    >
      <div className="GlobalFooter__inner-form">
        <p>
          Join our mailing list for updates on
          <strong> artists, releases and more.</strong>
        </p>
        <div className="form-wrapper">
          {/* Mailchimp for WordPress v4.9.0 - https://wordpress.org/plugins/mailchimp-for-wp/ */}
          <form
            id="mc4wp-form-1"
            className="mc4wp-form mc4wp-form-3558 mc4wp-ajax"
            method="post"
            data-id={3558}
            data-name="Newsletter"
          >
            <div className="mc4wp-form-fields">
              <input
                type="email"
                name="EMAIL"
                placeholder="Email"
                required=""
              />
              <input type="submit" defaultValue="Subscribe" />
            </div>
            <label style={{ display: "none !important" }}>
              Leave this field empty if you're human:{" "}
              <input
                type="text"
                name="_mc4wp_honeypot"
                defaultValue=""
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
            <input
              type="hidden"
              name="_mc4wp_timestamp"
              defaultValue={1674921367}
            />
            <input type="hidden" name="_mc4wp_form_id" defaultValue={3558} />
            <input
              type="hidden"
              name="_mc4wp_form_element_id"
              defaultValue="mc4wp-form-1"
            />
            <div className="mc4wp-response" />
          </form>
          {/* / Mailchimp for WordPress Plugin */}
        </div>
      </div>
      <div className="GlobalFooter__inner-links">
        <div className="link-column">
          <p>©Fellowship 2023</p>
          <p>All Rights Reserved</p>
        </div>
        <div className="link-column">
          <h3>Follow</h3>
          <ul>
            <li>
              <a
                href="https://twitter.com/fellowshiptrust"
                data-no-swup=""
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter,
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg/fellowshiptrust"
                data-no-swup=""
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord,
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/fellowship.xyz/?hl=en"
                data-no-swup=""
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
        <div className="link-column page-links no-links" />
        <div className="link-column">
          <h3>Made By:</h3>
          <a
            data-no-swup=""
            href="https://www.madebysix.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SIX
          </a>
        </div>
      </div>
    </div>
  </footer>
</>

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
