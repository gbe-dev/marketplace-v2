import useSWR from 'swr'

export default (address?: string, tokenId?: string, chainId: number = 1) => {
  const response = useSWR(
    `https://api.opensea.io/api/v1/asset/${address}/${tokenId}/?include_orders=false`,
    (url: string) => {
      return fetch(url).then((response) => response.json())
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  )
  return {
    ...response,
    hrFile: response.data?.image_original_url,
    token_metadata: response.data?.token_metadata,
  }
}
