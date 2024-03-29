import { ConsultAppointment } from '../../../domain/consultation/ConsultAppointment'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { ConsultAppointmentEntity } from './ConsultAppointmentEntity'
import { DoctorTimeSlotMapper } from './DoctorTimeSlotMapper'

export class ConsultAppointmentMapper
  implements IEntityMapper<ConsultAppointmentEntity, ConsultAppointment>
{
  public toDomainModel(entity: ConsultAppointmentEntity): ConsultAppointment {
    const consultAppointment = new ConsultAppointment({
      id: entity.id,
      status: entity.status,
      meetingLink: entity.meetingLink,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patientId: entity.patientId,
      doctorTimeSlot: new DoctorTimeSlotMapper().toDomainModel(
        entity.doctorTimeSlot
      ),
    })
    return consultAppointment
  }

  public toPersistence(
    domainModel: ConsultAppointment
  ): ConsultAppointmentEntity {
    const consultAppointmentEntity = new ConsultAppointmentEntity()
    consultAppointmentEntity.id = domainModel.id
    consultAppointmentEntity.status = domainModel.status
    consultAppointmentEntity.meetingLink = domainModel.meetingLink
    consultAppointmentEntity.createdAt = domainModel.createdAt
    consultAppointmentEntity.updatedAt = domainModel.updatedAt
    consultAppointmentEntity.patientId = domainModel.patientId
    consultAppointmentEntity.doctorTimeSlot =
      new DoctorTimeSlotMapper().toPersistence(domainModel.doctorTimeSlot)
    return consultAppointmentEntity
  }
}
