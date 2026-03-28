import { HttpException } from "@nestjs/common";

export class CustomException extends HttpException {
  constructor( args: {
    message: string | string[], httpStatus: number
  }) {
    const { message, httpStatus } = args;
    const status = httpStatus;
    super(message, status);
  }
}
  