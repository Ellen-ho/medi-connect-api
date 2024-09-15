export function getAvatarUrl(avatar: string | null): string | null {
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN
  if (cloudfrontDomain === undefined) {
    return null
  }

  return avatar !== null ? `https://${cloudfrontDomain}/${avatar}` : null
}
