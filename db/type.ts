type DataCreationSuccess<T> = {
  success: true;
  data: T;
};

type DataCreationFailure<T> = {
  success: false;
  error: T;
};

export type DataOrError<Data, Error> =
  | DataCreationSuccess<Data>
  | DataCreationFailure<Error>;
