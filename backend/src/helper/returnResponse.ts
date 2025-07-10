export type ReturnResponseType<T> = {
  is_successful?: boolean;
  error_msg?: string;
  success?: string;
  response?: T;
};

export default function ReturnResponse({
  error_msg,
  response,
  is_successful,
  success,
}: ReturnResponseType<any>) {
  return {
    is_successful: error_msg || !is_successful ? false : true,
    response: response,
    error_msg: error_msg ? error_msg : '',
    success: success ? success : '',
  };
}
