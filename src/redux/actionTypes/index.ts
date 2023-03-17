export type FetchBookingsByUserAction = (arg: { payload: null; type: string }) => void;
export type GetBookingByUserAction = (arg: { payload: null; type: string }) => void;
export type updateBookingAction = (arg: {
    (dispatch: FetchBookingsByUserAction): Promise<void>;
    payload?: any;
    type?: "errorMessage/setErrorMessage";
  }) => void;