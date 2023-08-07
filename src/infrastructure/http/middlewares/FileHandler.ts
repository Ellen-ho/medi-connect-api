import fs from 'fs'

interface CustomMulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

const localFileHandler = async (
  file: CustomMulterFile | null
): Promise<string | null> => {
  if (file == null) return null

  const fileName = `upload/${file.originalname}`

  const data = await fs.promises.readFile(file.path)
  await fs.promises.writeFile(fileName, data)

  return `/${fileName}`
}

export { localFileHandler }
