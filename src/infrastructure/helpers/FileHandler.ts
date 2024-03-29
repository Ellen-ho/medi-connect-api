import { ImgurClient } from 'imgur'
import * as fs from 'fs'

export const imgurFileHandler = async (avatar: {
  path: string
}): Promise<string> => {
  const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })

  const response = await client.upload({
    // @ts-ignore
    image: fs.createReadStream(avatar.path),
  })

  if (!response.success) {
    throw new Error('Imgur error when uploading')
  }

  return response.data.link
}
