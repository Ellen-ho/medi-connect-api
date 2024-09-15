import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { IUuidService } from '../../domain/utils/IUuidService'
import path from 'path'
import { getAvatarUrl } from 'infrastructure/helpers/AvatarHelper'

interface EditUserAvatarRequest {
  file: Express.Multer.File
}

interface EditUserAvatarResponse {
  imageUrl: string | null
}

export class EditUserAvatarUseCase {
  constructor(
    private readonly s3Client: S3Client,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: EditUserAvatarRequest
  ): Promise<EditUserAvatarResponse> {
    const { file } = request

    const uniqueFilename = `${this.uuidService.generateUuid()}${path.extname(
      file.originalname
    )}`
    const bucketName = process.env.BUCKET_NAME as string
    const objectKey = `${
      process.env.OBJECT_NAME_PREFIX as string
    }/${uniqueFilename}`

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    await this.s3Client.send(uploadCommand)

    return { imageUrl: getAvatarUrl(objectKey) }
  }
}
