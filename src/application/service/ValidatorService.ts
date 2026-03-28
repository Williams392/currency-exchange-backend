import { Injectable } from "@nestjs/common";
import Joi from "joi";
import { validationMessages } from "../constants/ValidatorMessage";
import { CustomException } from "../exception/Exception";
import { HTTP_STATUS } from "../constants/Constants";

@Injectable()
export class ValidatorService {
  validate(schema: Joi.ObjectSchema, payload: any): void {
    const validation = schema.validate(payload, {
      allowUnknown: true,
      abortEarly: false,
      convert: false,
      messages: {
        ...validationMessages
      }
    });

    if (validation.error) {
      const messagesError: string[] = [];
      validation.error.details.forEach((value) => {
        messagesError.push(value.message);
      });

      throw new CustomException({
        httpStatus: HTTP_STATUS.BAD_REQUEST,
        message: messagesError
      });
    }
  }
}