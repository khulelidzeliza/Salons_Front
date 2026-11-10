export interface ITokenResponse {
  accessToken: string;
}


export enum Roles {
  User = 0,
  Organizator = 1,
}

export interface IRegisterRequest {
  age?: number;
  email: string;
  userName: string;
  password: string;
  phoneNumber?: string;
  role: Roles;
}
export interface ILoginRequest {
  email: string;
  password: string;
}
export interface IResetPassword {
  password: string;
  confirmPassword: string;
}

export interface IVerifyEmailRequest {
  email: string;
  code: string;
}
export interface IVerifyEmailResponse {
  accessToken: string;
}

export interface IResendCodeRequest {
  email: string;
}
export interface ISendPasswordResetRequest {
  email: string;
}
/** Body for POST /Auth/change-password */
export interface IChangePasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}


export interface IUpdateRequest {
 age?: number;
  userName: string;
  phoneNumber?: string;
  city?: string;
}


export interface IDeleteRequest {
  userid: string;
}
