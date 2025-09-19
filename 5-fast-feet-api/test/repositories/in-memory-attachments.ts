import { AttachmentsRepository } from "@/domain/core/application/repositories/attachments-repository";
import { Attachment } from "@/domain/core/enterprise/entities/attachment";

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }

}