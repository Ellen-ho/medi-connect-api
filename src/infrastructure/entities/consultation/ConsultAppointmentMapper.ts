import { ConsultAppointment } from '../../../domain/consultation/ConsultAppointment'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { PatientMapper } from '../patient/PatientMapper'
import { ConsultAppointmentEntity } from './ConsultAppointmentEntity'
import { DoctorTimeSlotMapper } from './DoctorTimeSlotMapper'

export class ConsultAppointmentMapper
  implements IEntityMapper<ConsultAppointmentEntity, ConsultAppointment>
{
  public toDomainModel(entity: ConsultAppointmentEntity): ConsultAppointment {
    const consultAppointment = new ConsultAppointment({
      id: entity.id,
      doctorStatus: entity.doctorStatus,
      patientStatus: entity.patientStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patient: new PatientMapper().toDomainModel(entity.patient),
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
    consultAppointmentEntity.doctorStatus = domainModel.doctorStatus
    consultAppointmentEntity.patientStatus = domainModel.patientStatus
    consultAppointmentEntity.createdAt = domainModel.createdAt
    consultAppointmentEntity.updatedAt = domainModel.updatedAt
    consultAppointmentEntity.patient = new PatientMapper().toPersistence(
      domainModel.patient
    )
    consultAppointmentEntity.doctorTimeSlot =
      new DoctorTimeSlotMapper().toPersistence(domainModel.doctorTimeSlot)
    return consultAppointmentEntity
  }
}
