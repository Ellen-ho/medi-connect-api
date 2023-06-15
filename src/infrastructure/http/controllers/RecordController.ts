import { Request, Response } from 'express'

import { EditWeightRecordUseCase } from '../../../application/record/EditWeightRecordUseCase'
import { CreateWeightRecordUseCase } from '../../../application/record/CreateWeightRecordUseCase'
import { EditBloodPressureRecordUseCase } from '../../../application/record/EditBloodPressureRecordUseCase'
import { CreateBloodPressureRecordUseCase } from '../../../application/record/CreateBloodPressureRecordUseCase'
import { EditBloodSugarRecordUseCase } from '../../../application/record/EditBloodSugarRecordUseCase'
import { CreateBloodSugarRecordUseCase } from '../../../application/record/CreateBloodSugarRecordUseCase'
import { CreateExerciseRecordUseCase } from '../../../application/record/CreateExerciseRecordUseCase'
import { EditExerciseRecordUseCase } from '../../../application/record/EditExerciseRecordUseCase'
import { CreateFoodRecordUseCase } from '../../../application/record/CreateFoodRecordUseCase'
import { EditFoodRecordUseCase } from '../../../application/record/EditFoodRecordUseCase'
import { CreateGlycatedHemoglobinRecordUseCase } from '../../../application/record/CreateGlycatedHemoglobinRecordUseCase'
import { EditGlycatedHemoglobinRecordUseCase } from '../../../application/record/EditGlycatedHemoglobinRecordUseCase'
import { CreateSleepRecordUseCase } from '../../../application/record/CreateSleepRecordUseCase'
import { EditSleepRecordUseCase } from '../../../application/record/EditSleepRecordUseCase'
import { User } from '../../../domain/user/User'
import { GetSingleExerciseRecordUseCase } from '../../../application/record/GetSingleExerciseRecordUseCase'
import { GetSingleBloodPressureRecordUseCase } from '../../../application/record/GetSingleBloodPressureRecordUsecase'
import { GetSingleBloodSugarRecordUseCase } from '../../../application/record/GetSingleBloodSugarRecordUseCase'
import { GetSingleFoodRecordUseCase } from '../../../application/record/GetSingleFoodRecordUseCase'
import { GetSingleGlycatedHemoglobinRecordUseCase } from '../../../application/record/GetSingleGlycatedHemoglobinRecordUseCase'
import { GetSingleSleepRecordUseCase } from '../../../application/record/GetSingleSleepRecordUseCase'
import { GetSingleWeightRecordUseCase } from '../../../application/record/GetSingleWeightRecordUseCase'
import { GetExerciseRecordsUseCase } from '../../../application/record/GetExerciseRecordsUseCase'
import { GetBloodPressureRecordsUseCase } from '../../../application/record/GetBloodPressureRecordsUseCase'
import { GetBloodSugarRecordsUseCase } from '../../../application/record/GetBloodSugarRecords'
import { GetFoodRecordsUseCase } from '../../../application/record/GetFoodRecordsUseCase'
import { GetGlycatedHemoglobinRecordsUseCase } from '../../../application/record/GetGlycatedHemoglobinRecordsUseCase'
import { GetSleepRecordsUseCase } from '../../../application/record/GetSleepRecordsUseCase'
import { GetWeightRecordsUseCase } from '../../../application/record/GetWeightRecordsUseCase'
export interface IRecordController {
  createWeightRecord: (req: Request, res: Response) => Promise<Response>
  editWeightRecord: (req: Request, res: Response) => Promise<Response>
  createBloodPressureRecord: (req: Request, res: Response) => Promise<Response>
  editBloodPressureRecord: (req: Request, res: Response) => Promise<Response>
  createBloodSugarRecord: (req: Request, res: Response) => Promise<Response>
  editBloodSugarRecord: (req: Request, res: Response) => Promise<Response>
  createExerciseRecord: (req: Request, res: Response) => Promise<Response>
  editExerciseRecord: (req: Request, res: Response) => Promise<Response>
  createFoodRecord: (req: Request, res: Response) => Promise<Response>
  editFoodRecord: (req: Request, res: Response) => Promise<Response>
  createGlycatedHemoglobinRecord: (
    req: Request,
    res: Response
  ) => Promise<Response>
  editGlycatedHemoglobinRecord: (
    req: Request,
    res: Response
  ) => Promise<Response>
  createSleepRecord: (req: Request, res: Response) => Promise<Response>
  editSleepRecord: (req: Request, res: Response) => Promise<Response>
  getSingleExerciseRecord: (req: Request, res: Response) => Promise<Response>
  getSingleBloodPressureRecord: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getSingleBloodSugarRecord: (req: Request, res: Response) => Promise<Response>
  getSingleFoodRecord: (req: Request, res: Response) => Promise<Response>
  getSingleGlycatedHemoglobinRecord: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getSingleSleepRecord: (req: Request, res: Response) => Promise<Response>
  getSingleWeightRecord: (req: Request, res: Response) => Promise<Response>
  getExerciseRecords: (req: Request, res: Response) => Promise<Response>
  getBloodPressureRecords: (req: Request, res: Response) => Promise<Response>
  getBloodSugarRecords: (req: Request, res: Response) => Promise<Response>
  getFoodRecords: (req: Request, res: Response) => Promise<Response>
  getGlycatedHemoglobinRecords: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getSleepRecords: (req: Request, res: Response) => Promise<Response>
  getWeightRecords: (req: Request, res: Response) => Promise<Response>
}

export class RecordController implements IRecordController {
  constructor(
    private readonly createWeightRecordUseCase: CreateWeightRecordUseCase,
    private readonly editWeightRecordUseCase: EditWeightRecordUseCase,
    private readonly createBloodPressureRecordUseCase: CreateBloodPressureRecordUseCase,
    private readonly editBloodPressureRecordUseCase: EditBloodPressureRecordUseCase,
    private readonly createBloodSugarRecordUseCase: CreateBloodSugarRecordUseCase,
    private readonly editBloodSugarRecordUseCase: EditBloodSugarRecordUseCase,
    private readonly createExerciseRecordUseCase: CreateExerciseRecordUseCase,
    private readonly editExerciseRecordUseCase: EditExerciseRecordUseCase,
    private readonly createFoodRecordUseCase: CreateFoodRecordUseCase,
    private readonly editFoodRecordUseCase: EditFoodRecordUseCase,
    private readonly createGlycatedHemoglobinRecordUseCase: CreateGlycatedHemoglobinRecordUseCase,
    private readonly editGlycatedHemoglobinRecordUseCase: EditGlycatedHemoglobinRecordUseCase,
    private readonly createSleepRecordUseCase: CreateSleepRecordUseCase,
    private readonly editSleepRecordUseCase: EditSleepRecordUseCase,
    private readonly getSingleExerciseRecordUseCase: GetSingleExerciseRecordUseCase,
    private readonly getSingleBloodPressureRecordUseCase: GetSingleBloodPressureRecordUseCase,
    private readonly getSingleBloodSugarRecordUseCase: GetSingleBloodSugarRecordUseCase,
    private readonly getSingleFoodRecordUseCase: GetSingleFoodRecordUseCase,
    private readonly getSingleGlycatedHemoglobinRecordUseCase: GetSingleGlycatedHemoglobinRecordUseCase,
    private readonly getSingleSleepRecordUseCase: GetSingleSleepRecordUseCase,
    private readonly getSingleWeightRecordUseCase: GetSingleWeightRecordUseCase,
    private readonly getExerciseRecordsUseCase: GetExerciseRecordsUseCase,
    private readonly getBloodPressureRecordsUseCase: GetBloodPressureRecordsUseCase,
    private readonly getBloodSugarRecordsUseCase: GetBloodSugarRecordsUseCase,
    private readonly getFoodRecordsUseCase: GetFoodRecordsUseCase,
    private readonly getGlycatedHemoglobinRecordsUseCase: GetGlycatedHemoglobinRecordsUseCase,
    private readonly getSleepRecordsUseCase: GetSleepRecordsUseCase,
    private readonly getWeightRecordsUseCase: GetWeightRecordsUseCase
  ) {}

  public createWeightRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const record = await this.createWeightRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editWeightRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        weightRecordId: req.params.id,
      }
      const record = await this.editWeightRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public createBloodPressureRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const record = await this.createBloodPressureRecordUseCase.execute(
        request
      )

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editBloodPressureRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        bloodPressureRecordId: req.params.id,
      }
      const record = await this.editBloodPressureRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public createBloodSugarRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const record = await this.createBloodSugarRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editBloodSugarRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        bloodSugarRecordId: req.params.id,
      }
      const record = await this.editBloodSugarRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public createExerciseRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const record = await this.createExerciseRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editExerciseRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        exerciseRecordId: req.params.id,
      }
      const record = await this.editExerciseRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public createFoodRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const record = await this.createFoodRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editFoodRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        foodRecordId: req.params.id,
      }

      const record = await this.editFoodRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public createGlycatedHemoglobinRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const record = await this.createGlycatedHemoglobinRecordUseCase.execute(
        request
      )
      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editGlycatedHemoglobinRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        glycatedHemoglobinRecordId: req.params.id,
      }
      const record = await this.editGlycatedHemoglobinRecordUseCase.execute(
        request
      )

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public createSleepRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const record = await this.createSleepRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editSleepRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        sleepRecordId: req.params.id,
      }
      const record = await this.editSleepRecordUseCase.execute(request)

      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getSingleExerciseRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        exerciseRecordId: req.params.id,
      }
      const record = await this.getSingleExerciseRecordUseCase.execute(request)
      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getSingleBloodPressureRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        bloodPressureRecordId: req.params.id,
      }
      const record = await this.getSingleBloodPressureRecordUseCase.execute(
        request
      )
      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getSingleBloodSugarRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        bloodSugarRecordId: req.params.id,
      }
      const record = await this.getSingleBloodSugarRecordUseCase.execute(
        request
      )
      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getSingleFoodRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        foodRecordId: req.params.id,
      }
      const record = await this.getSingleFoodRecordUseCase.execute(request)
      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getSingleGlycatedHemoglobinRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        glycatedHemoglobinRecordId: req.params.id,
      }
      const record =
        await this.getSingleGlycatedHemoglobinRecordUseCase.execute(request)
      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getSingleSleepRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        sleepRecordId: req.params.id,
      }
      const record = await this.getSingleSleepRecordUseCase.execute(request)
      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getSingleWeightRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        weightRecordId: req.params.id,
      }
      const record = await this.getSingleWeightRecordUseCase.execute(request)
      return res.status(200).json(record)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getExerciseRecords = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        targetPatientId: req.query.targetPatientId as string,
        limit: Number(req.query.limit),
        page: Number(req.query.page),
      }
      const result = await this.getExerciseRecordsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getBloodPressureRecords = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        targetPatientId: req.query.targetPatientId as string,
        limit: Number(req.query.limit),
        page: Number(req.query.page),
      }
      const result = await this.getBloodPressureRecordsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getBloodSugarRecords = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        targetPatientId: req.query.targetPatientId as string,
        limit: Number(req.query.limit),
        page: Number(req.query.page),
      }
      const result = await this.getBloodSugarRecordsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getFoodRecords = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        targetPatientId: req.query.targetPatientId as string,
        limit: Number(req.query.limit),
        page: Number(req.query.page),
      }
      const result = await this.getFoodRecordsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getGlycatedHemoglobinRecords = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        limit: Number(req.query.limit),
        page: Number(req.query.page),
      }
      const result = await this.getGlycatedHemoglobinRecordsUseCase.execute(
        request
      )

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getSleepRecords = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        limit: Number(req.query.limit),
        page: Number(req.query.page),
      }
      const result = await this.getSleepRecordsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getWeightRecords = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        limit: Number(req.query.limit),
        page: Number(req.query.page),
      }
      const result = await this.getWeightRecordsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }
}
