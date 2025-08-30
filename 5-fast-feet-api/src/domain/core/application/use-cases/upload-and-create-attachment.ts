import { Either, left, right } from "@/core/either";
import { InvalidAttachmentTypeError } from "./erros/invalid-attachment-type-error";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { Uploader } from "../storage/uploader";
import { Attachment } from "../../enterprise/entities/attachment";

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}
type UploadAndCreateAttachmentUseCaseResponse = Either<InvalidAttachmentTypeError, {
  attachment: Attachment
}>

export class UploadAndCreateAttachmentUseCase {
  constructor(private attachmentsRepository: AttachmentsRepository, private uploader: Uploader) {}
  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if( !/^(image\/(jpeg|png))$/.test(fileType) ) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body
    })

    const attachment = Attachment.create({
      title: fileName,
      url
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment
    })
  }
}