export default (num: number, maxDigits: number, fillCharacter: string): string => {
   const numAsString = num.toString();
   const numAsStringLength = numAsString.length;

   if (numAsStringLength >= maxDigits) {
      return numAsString;
   }

   const spacesNeeded = maxDigits - numAsStringLength;
   const paddedNumber = fillCharacter.repeat(spacesNeeded) + numAsString;
   return paddedNumber;
};
