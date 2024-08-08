// src/services/model-api.d.ts
export function fetchImages(
    promptCall: string,
    seedValue: number,
    dropDownValue: string,
    radioValue: string
  ): Promise<Blob>; // Updated return type to Blob
  