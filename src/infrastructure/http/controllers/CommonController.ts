import { GetDoctorsUseCase } from '../../../application/common/GetDoctorsUseCase'
import { Request, Response } from 'express'

export interface ICommonController {
  getDoctors: (req: Request, res: Response) => Promise<Response>
}

export class CommonController implements ICommonController {
  constructor(private readonly getDoctorsUseCase: GetDoctorsUseCase) {}

  public getDoctors = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const result = await this.getDoctorsUseCase.execute()

    return res.status(200).json(result)
  }
}
