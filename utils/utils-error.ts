export const getErrorListByField = (errors: { message: string; field: string }[], f: string) =>
  errors.filter((item) => item.field === f).map(({ message }) => `•  ${message}`);

export const mappedErrorToFormError = (errors: { message: string; field: string }[]) =>
  errors.map(({ field }) => ({
    name: field,
    errors: getErrorListByField(errors, field),
  }));
