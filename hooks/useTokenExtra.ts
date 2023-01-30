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
  let hrFile, token_metadata, osName = ""

  if (response.data && response.data .sucess == "true")
  {
    hrFile= response.data?.image_original_url ? response.data?.image_original_url : ''
    token_metadata= response.data?.token_metadata ? response.data?.token_metadata : ''
    osName= response.data?.owner?.user?.username ? response.data?.owner?.user?.username : ''
  }
  return {
    ...response,
    hrFile: hrFile,
    token_metadata: token_metadata,
    osName: osName,
  }
}
