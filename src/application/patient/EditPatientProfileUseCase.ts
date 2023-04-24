import { GenderType, HeightUnitType, IAllergy, IFamilyHistoryItem, IMedicalHistoryItem, IMedicinceUsageItem, Patient } from "../../domain/patient/Patient"
import { IPatientRepository } from "../../domain/patient/interfaces/repositories/IPatientRepository"
import { IUuidService } from "../../domain/utils/IUuidService"

interface EditPatientProfileRequest {
  userId: string
  avatar: string | null
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
  medicalHistory: IMedicalHistoryItem[] | null
  allergy: IAllergy
  familyHistory: IFamilyHistoryItem[] | null
  height: number
  heightUnit: HeightUnitType
  medicinceUsage: IMedicinceUsageItem[] | null
}

interface EditPatientProfileResponse {
  id: string
  avatar: string | null
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
  medicalHistory: IMedicalHistoryItem[] | null
  allergy: IAllergy
  familyHistory: IFamilyHistoryItem[] | null
  height: number
  heightUnit: HeightUnitType
  medicinceUsage: IMedicinceUsageItem[] | null
}

export class EditPatientProfileUseCase {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: EditPatientProfileRequest
  ): Promise<EditPatientProfileResponse> {
    const {
      userId,
      avatar,
      firstName,
      lastName,
      birthDate,
      gender,
      medicalHistory,
      allergy,
      familyHistory,
      height,
      heightUnit,
      medicinceUsage,
    } = request

    if (userId != this.patient.id){
      const error = new Error('Can only edit one\'s own profilel.')
      error.status = 403
      throw error
    }

    const patientProfileExists = await this.patientRepository.findById(userId)

    if (!patientProfileExists) {
      throw new Error('Patient already exists.')
    }

    const avatarFilePath = avatar ? await imgurFileHandler(avatar[0]) : patient.avatar
    const updatedPatient = new Patient({
      id: this.uuidService.generateUuid(),
      avatar,
      firstName,
      lastName,
      birthDate,
      gender,
      medicalHistory,
      allergy,
      familyHistory,
      height,
      heightUnit,
      medicinceUsage,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.patientRepository.save(updatedPatient)

    return {
      id: updatedPatient.id,
      avatar: updatedPatient.avatar,
      firstName: updatedPatient.firstName,
      lastName: updatedPatient.lastName,
      birthDate: updatedPatient.birthDate,
      gender: updatedPatient.gender,
      medicalHistory: updatedPatient.medicalHistory,
      allergy: updatedPatient.allergy,
      familyHistory: updatedPatient.familyHistory,
      height: updatedPatient.height,
      heightUnit: updatedPatient.heightUnit,
      medicinceUsage: updatedPatient.medicinceUsage,
      createdAt: new Date(),
      updatedAt: new Date(),
     }
   }
}



















putUser: (req, res, next) => {
    if (Number(req.params.id) !== Number(getUser(req).dataValues.id)) {
      const error = new Error('只能修改自己的資料!')
      error.status = 403
      throw error
    }
    const { name, introduction } = req.body
    if (!name.trim()) {
      const error = new Error('輸入資料不可為空值!')
      error.status = 400
      throw error
    }
    if (introduction.length > 160) {
      const error = new Error('自我介紹數字上限 160 字!')
      error.status = 400
      throw error
    }
    if (name.length > 50) {
      const error = new Error('暱稱上限 50 字！')
      error.status = 400
      throw error
    }

    const avatar = req.files ? req.files.avatar : undefined
    const coverPage = req.files ? req.files.coverPage : undefined

    User.findByPk(req.params.id).then(user => {
      if (!user) {
        const error = new Error('此使用者不存在!')
        error.status = 404
        throw error
      }
      return user
    })
      .then(async user => {
        const avatarFilePath = avatar ? await imgurFileHandler(avatar[0]) : user.avatar
        const coverPageFilePath = coverPage ? await imgurFileHandler(coverPage[0]) : user.coverPage
        return user.update({
          name,
          introduction,
          avatar: avatarFilePath,
          coverPage: coverPageFilePath
        })
      })
      .then(updatedUser => {
        const { id, name, introduction, avatar, coverPage } = updatedUser.toJSON()
        res.status(200).json({
          id, name, introduction, avatar, coverPage
        })
      })
      .catch(err => next(err))
  },