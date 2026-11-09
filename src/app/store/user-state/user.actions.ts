import { IChangePasswordRequest, ILoginRequest, IRegisterRequest, IResendCodeRequest, ISendPasswordResetRequest, IVerifyEmailRequest } from "../../features/auth/models/auth.models";

export class FetchUser {
  static readonly type = '[Auth] Fetch User';
}
export class RegisterUser {
  static readonly type = '[Auth] Register';
  constructor(public payload: IRegisterRequest) {}
}

export class LoginUser {
  static readonly type = '[Auth] Login';
  constructor(public payload: ILoginRequest) {}
}

export class VerifyEmail {
  static readonly type = '[Auth] Verify Email';
  constructor(public payload: IVerifyEmailRequest) {}
}

export class ResendVerificationCode {
  static readonly type = '[Auth] Resend Verification Code';
  constructor(public payload: IResendCodeRequest) {}
}

export class ForgetPassword {
  static readonly type = '[Auth] Send Password Reset';
  constructor(public payload: ISendPasswordResetRequest) {}
}

export class ResetPassword {
  static readonly type = '[Auth] Change Password';
  constructor(public payload: IChangePasswordRequest, public token: string) {}
}

export class LogOut {
  static readonly type = '[Auth] Log Out';
}
