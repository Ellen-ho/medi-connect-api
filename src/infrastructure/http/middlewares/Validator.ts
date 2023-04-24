import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

type ValidationTarget = 'body' | 'params' | 'query'

type IValidatorSchema = Record<string, Joi.ObjectSchema>

export const validator =
  (schemas: IValidatorSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    // loop through the schemas and validate each one
    for (const [target, schema] of Object.entries(schemas)) {
      const { error } = schema.validate(req[target as ValidationTarget])
      if (error != null) {
        return res.status(400).send(error.details[0].message)
      }
    }

    next()
  }
