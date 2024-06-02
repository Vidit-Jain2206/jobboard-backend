export class ApiResponse {
  statusCode: number;
  message: string = "success";
  data: {} | null;
  success: boolean;
  constructor(
    statusCode: number,
    message: string = "success",
    data: {} | null
  ) {
    (this.statusCode = statusCode),
      (this.message = message),
      (this.data = data),
      (this.success = statusCode < 400);
  }
}
