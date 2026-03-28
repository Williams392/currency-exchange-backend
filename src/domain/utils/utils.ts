import { BadRequestException } from "@nestjs/common";
import { BLACKLIST_OF_KEYWORDS, MAPPER_STRING_TO_BOOLEAN } from "../constants/AppConstants";


// Utilidad para validar y transformar valores string en booleanos y
// manejar las excepciones de tipo BadRequest si el formato no es válido.
const IsNotUndefinedValue = (value: any): boolean => {
  return value !== undefined;
}
const stringToBoolean = (value: string): boolean | undefined => {

  if (!IsNotUndefinedValue(value)) return undefined
  if (typeof value === 'boolean') return value;
  if (!!!value) return false;

  const valueLowerCase = value.toLowerCase()
  if (Object.keys(MAPPER_STRING_TO_BOOLEAN).includes(valueLowerCase)) {
    return MAPPER_STRING_TO_BOOLEAN[valueLowerCase];
  }

  throw new BadRequestException(`Is not a boolean string valid value`);
}


//  Limpia y valida el nombre del usuario.
const standardizeUserIdentity = (args: { userIdentity: string }): string => {
  let { userIdentity } = args;
  userIdentity = userIdentity.trim().replace(/\s+/g, ' ');  
  userIdentity = userIdentity.replace(/<[^>]*>/g, '');
  const safetyRegex = /^[\p{L}\p{M}\s.'-]{2,50}$/u;
    
  if (!safetyRegex.test(userIdentity)) {
      throw new Error("Nombre inválido. Solo se permiten letras, espacios, puntos, apóstrofes y guiones");
  }
      
  const lowerNombre = userIdentity.toLowerCase();
  for (const palabra of BLACKLIST_OF_KEYWORDS) {
      if (lowerNombre.includes(palabra)) {
          throw new Error("Nombre contiene palabras no permitidas");
      }
  }

  return userIdentity;
}


const roundDivisionOperation = (
  firstNumber: number,
  secondNumber: number,
): number => Math.ceil(firstNumber / secondNumber);


export {
  stringToBoolean,
  standardizeUserIdentity,
  roundDivisionOperation
}