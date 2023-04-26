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
    private readonly editSleepRecordUseCase: EditSleepRecordUseCase
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
      return res.status(400).json({ message: 'edit weight record error' })
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
      return res
        .status(400)
        .json({ message: 'edit blood pressure record error' })
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
      return res.status(400).json({ message: 'edit blood sugar record error' })
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
      return res.status(400).json({ message: 'edit exercise record error' })
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
      return res.status(400).json({ message: 'edit food record error' })
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
      return res
        .status(400)
        .json({ message: 'edit glycated hemoglobin record error' })
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
      return res.status(400).json({ message: 'edit sleep record error' })
    }
  }
}