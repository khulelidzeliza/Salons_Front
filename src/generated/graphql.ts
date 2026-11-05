/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `DateTime` scalar represents an exact point in time. This point in time is specified by having an offset to UTC and does not use a time zone. */
  DateTime: { input: string; output: string; }
};

/** Defines when a policy shall be executed. */
export type ApplyPolicy =
  /** After the resolver was executed. */
  | 'AFTER_RESOLVER'
  /** Before the resolver was executed. */
  | 'BEFORE_RESOLVER'
  /** The policy is applied in the validation step before the execution. */
  | 'VALIDATION';



export type EmailSortInput = {
  value?: InputMaybe<SortEnumType>;
};

export type EmailVerificationSortInput = {
  attempts?: InputMaybe<SortEnumType>;
  code?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  expiredAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type Favorite = {
  __typename?: 'Favorite';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  salon: Salon;
  salonId: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};



export type PasswordVerificationSortInput = {
  attempts?: InputMaybe<SortEnumType>;
  code?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  expiredAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type Procedure = {
  __typename?: 'Procedure';
  createdAt: Scalars['DateTime']['output'];
  finishedWorks: Array<Scalars['String']['output']>;
  gender: Genders;
  id: Scalars['Int']['output'];
  masters: Array<Scalars['String']['output']>;
  procedureType: ProcedureType;
  salon: Salon;
  salonId: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};



export type Query = {
  __typename?: 'Query';
  getMySalons: Array<Salon>;
  getSalonById: Array<Salon>;
  getSalons: Array<Salon>;
  me: Array<User>;
};


export type QueryGetSalonByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSalonsArgs = {
  order?: InputMaybe<Array<SalonSortInput>>;
  where?: InputMaybe<SalonFilterInput>;
};

export type Review = {
  __typename?: 'Review';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  star: Star;
  updatedAt: Scalars['DateTime']['output'];
};



export type Salon = {
  __typename?: 'Salon';
  AverageRating?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  englishName: Scalars['String']['output'];
  facebookLink?: Maybe<Scalars['String']['output']>;
  favorites: Array<Favorite>;
  georgianName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  instagramLink?: Maybe<Scalars['String']['output']>;
  isFavoritedByCurrentUser?: Maybe<Scalars['Boolean']['output']>;
  location: Scalars['String']['output'];
  owner?: Maybe<User>;
  phoneNumber: Scalars['String']['output'];
  pictures: Array<Scalars['String']['output']>;
  price: BudgetLevel;
  procedures: Array<Procedure>;
  reviews: Array<Review>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
  workingHours: Scalars['String']['output'];
};



export type SalonSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  englishName?: InputMaybe<SortEnumType>;
  facebookLink?: InputMaybe<SortEnumType>;
  georgianName?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  instagramLink?: InputMaybe<SortEnumType>;
  location?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  price?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  workingHours?: InputMaybe<SortEnumType>;
};

export type SortEnumType =
  | 'ASC'
  | 'DESC';

export type User = {
  __typename?: 'User';
  age: Scalars['Int']['output'];
  city?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  favoritedSalons: Array<Scalars['Int']['output']>;
  favorites: Array<Favorite>;
  gender: Genders;
  id: Scalars['Int']['output'];
  isVerified: Scalars['Boolean']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  reviews: Array<Review>;
  role: Roles;
  salons: Array<Salon>;
  updatedAt: Scalars['DateTime']['output'];
  userName: Scalars['String']['output'];
};

export type UserSortInput = {
  age?: InputMaybe<SortEnumType>;
  city?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  email?: InputMaybe<EmailSortInput>;
  emailVerification?: InputMaybe<EmailVerificationSortInput>;
  gender?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isVerified?: InputMaybe<SortEnumType>;
  password?: InputMaybe<SortEnumType>;
  passwordEmailVerification?: InputMaybe<PasswordVerificationSortInput>;
  phoneNumber?: InputMaybe<SortEnumType>;
  role?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  userName?: InputMaybe<SortEnumType>;
};

export type BooleanOperationFilterInput = {
  eq?: boolean | null | undefined;
  neq?: boolean | null | undefined;
};

export type BudgetLevel =
  | 'CHEAP'
  | 'CHEAPEST'
  | 'EXPENSIVE'
  | 'MEDIUM'
  | 'MOST_EXPENSIVE';

export type BudgetLevelOperationFilterInput = {
  eq?: BudgetLevel | null | undefined;
  in?: Array<BudgetLevel> | null | undefined;
  neq?: BudgetLevel | null | undefined;
  nin?: Array<BudgetLevel> | null | undefined;
};

export type DateTimeOperationFilterInput = {
  eq?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  in?: Array<string | null | undefined> | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  neq?: string | null | undefined;
  ngt?: string | null | undefined;
  ngte?: string | null | undefined;
  nin?: Array<string | null | undefined> | null | undefined;
  nlt?: string | null | undefined;
  nlte?: string | null | undefined;
};

export type EmailFilterInput = {
  and?: Array<EmailFilterInput> | null | undefined;
  or?: Array<EmailFilterInput> | null | undefined;
  value?: StringOperationFilterInput | null | undefined;
};

export type EmailVerificationFilterInput = {
  and?: Array<EmailVerificationFilterInput> | null | undefined;
  attempts?: IntOperationFilterInput | null | undefined;
  code?: StringOperationFilterInput | null | undefined;
  createdAt?: DateTimeOperationFilterInput | null | undefined;
  expiredAt?: DateTimeOperationFilterInput | null | undefined;
  id?: IntOperationFilterInput | null | undefined;
  or?: Array<EmailVerificationFilterInput> | null | undefined;
  updatedAt?: DateTimeOperationFilterInput | null | undefined;
  user?: UserFilterInput | null | undefined;
  userId?: IntOperationFilterInput | null | undefined;
};

export type FavoriteFilterInput = {
  and?: Array<FavoriteFilterInput> | null | undefined;
  createdAt?: DateTimeOperationFilterInput | null | undefined;
  id?: IntOperationFilterInput | null | undefined;
  or?: Array<FavoriteFilterInput> | null | undefined;
  salon?: SalonFilterInput | null | undefined;
  salonId?: IntOperationFilterInput | null | undefined;
  updatedAt?: DateTimeOperationFilterInput | null | undefined;
  user?: UserFilterInput | null | undefined;
  userId?: IntOperationFilterInput | null | undefined;
};

export type Genders =
  | 'FEMALE'
  | 'MALE'
  | 'OTHER';

export type GendersOperationFilterInput = {
  eq?: Genders | null | undefined;
  in?: Array<Genders> | null | undefined;
  neq?: Genders | null | undefined;
  nin?: Array<Genders> | null | undefined;
};

export type IntOperationFilterInput = {
  eq?: number | null | undefined;
  gt?: number | null | undefined;
  gte?: number | null | undefined;
  in?: Array<number | null | undefined> | null | undefined;
  lt?: number | null | undefined;
  lte?: number | null | undefined;
  neq?: number | null | undefined;
  ngt?: number | null | undefined;
  ngte?: number | null | undefined;
  nin?: Array<number | null | undefined> | null | undefined;
  nlt?: number | null | undefined;
  nlte?: number | null | undefined;
};

export type ListFilterInputTypeOfFavoriteFilterInput = {
  all?: FavoriteFilterInput | null | undefined;
  any?: boolean | null | undefined;
  none?: FavoriteFilterInput | null | undefined;
  some?: FavoriteFilterInput | null | undefined;
};

export type ListFilterInputTypeOfReviewFilterInput = {
  all?: ReviewFilterInput | null | undefined;
  any?: boolean | null | undefined;
  none?: ReviewFilterInput | null | undefined;
  some?: ReviewFilterInput | null | undefined;
};

export type ListFilterInputTypeOfSalonFilterInput = {
  all?: SalonFilterInput | null | undefined;
  any?: boolean | null | undefined;
  none?: SalonFilterInput | null | undefined;
  some?: SalonFilterInput | null | undefined;
};

export type ListIntOperationFilterInput = {
  all?: IntOperationFilterInput | null | undefined;
  any?: boolean | null | undefined;
  none?: IntOperationFilterInput | null | undefined;
  some?: IntOperationFilterInput | null | undefined;
};

export type ListProcedureFilterTypeFilterInput = {
  all?: ProcedureFilterInput | null | undefined;
  any?: boolean | null | undefined;
  none?: ProcedureFilterInput | null | undefined;
  some?: ProcedureFilterInput | null | undefined;
};

export type ListStringOperationFilterInput = {
  all?: StringOperationFilterInput | null | undefined;
  any?: boolean | null | undefined;
  none?: StringOperationFilterInput | null | undefined;
  some?: StringOperationFilterInput | null | undefined;
};

export type PasswordVerificationFilterInput = {
  and?: Array<PasswordVerificationFilterInput> | null | undefined;
  attempts?: IntOperationFilterInput | null | undefined;
  code?: StringOperationFilterInput | null | undefined;
  createdAt?: DateTimeOperationFilterInput | null | undefined;
  expiredAt?: DateTimeOperationFilterInput | null | undefined;
  id?: IntOperationFilterInput | null | undefined;
  or?: Array<PasswordVerificationFilterInput> | null | undefined;
  updatedAt?: DateTimeOperationFilterInput | null | undefined;
  user?: UserFilterInput | null | undefined;
  userId?: IntOperationFilterInput | null | undefined;
};

export type ProcedureFilterInput = {
  and?: Array<ProcedureFilterInput> | null | undefined;
  createdAt?: DateTimeOperationFilterInput | null | undefined;
  finishedWorks?: ListStringOperationFilterInput | null | undefined;
  gender?: GendersOperationFilterInput | null | undefined;
  id?: IntOperationFilterInput | null | undefined;
  masters?: ListStringOperationFilterInput | null | undefined;
  or?: Array<ProcedureFilterInput> | null | undefined;
  procedureType?: ProcedureTypeOperationFilterInput | null | undefined;
  salon?: SalonFilterInput | null | undefined;
  salonId?: IntOperationFilterInput | null | undefined;
  updatedAt?: DateTimeOperationFilterInput | null | undefined;
};

export type ProcedureType =
  | 'BARBER'
  | 'COSMETIC'
  | 'HAIR'
  | 'LASER'
  | 'NAIL'
  | 'TATTOO';

export type ProcedureTypeOperationFilterInput = {
  eq?: ProcedureType | null | undefined;
  in?: Array<ProcedureType> | null | undefined;
  neq?: ProcedureType | null | undefined;
  nin?: Array<ProcedureType> | null | undefined;
};

export type ReviewFilterInput = {
  and?: Array<ReviewFilterInput> | null | undefined;
  comment?: StringOperationFilterInput | null | undefined;
  createdAt?: DateTimeOperationFilterInput | null | undefined;
  id?: IntOperationFilterInput | null | undefined;
  or?: Array<ReviewFilterInput> | null | undefined;
  star?: StarOperationFilterInput | null | undefined;
  updatedAt?: DateTimeOperationFilterInput | null | undefined;
};

export type Roles =
  | 'ADMIN'
  | 'ORGANIZATOR'
  | 'USER';

export type RolesOperationFilterInput = {
  eq?: Roles | null | undefined;
  in?: Array<Roles> | null | undefined;
  neq?: Roles | null | undefined;
  nin?: Array<Roles> | null | undefined;
};

export type SalonFilterInput = {
  and?: Array<SalonFilterInput> | null | undefined;
  createdAt?: DateTimeOperationFilterInput | null | undefined;
  description?: StringOperationFilterInput | null | undefined;
  email?: StringOperationFilterInput | null | undefined;
  englishName?: StringOperationFilterInput | null | undefined;
  facebookLink?: StringOperationFilterInput | null | undefined;
  favorites?: ListFilterInputTypeOfFavoriteFilterInput | null | undefined;
  georgianName?: StringOperationFilterInput | null | undefined;
  id?: IntOperationFilterInput | null | undefined;
  instagramLink?: StringOperationFilterInput | null | undefined;
  location?: StringOperationFilterInput | null | undefined;
  or?: Array<SalonFilterInput> | null | undefined;
  phoneNumber?: StringOperationFilterInput | null | undefined;
  pictures?: ListStringOperationFilterInput | null | undefined;
  price?: BudgetLevelOperationFilterInput | null | undefined;
  procedures?: ListProcedureFilterTypeFilterInput | null | undefined;
  reviews?: ListFilterInputTypeOfReviewFilterInput | null | undefined;
  updatedAt?: DateTimeOperationFilterInput | null | undefined;
  user?: UserFilterInput | null | undefined;
  userId?: IntOperationFilterInput | null | undefined;
  workingHours?: StringOperationFilterInput | null | undefined;
};

export type Star =
  | 'FIVE'
  | 'FOUR'
  | 'ONE'
  | 'THREE'
  | 'TWO';

export type StarOperationFilterInput = {
  eq?: Star | null | undefined;
  in?: Array<Star> | null | undefined;
  neq?: Star | null | undefined;
  nin?: Array<Star> | null | undefined;
};

export type StringOperationFilterInput = {
  and?: Array<StringOperationFilterInput> | null | undefined;
  contains?: string | null | undefined;
  endsWith?: string | null | undefined;
  eq?: string | null | undefined;
  in?: Array<string | null | undefined> | null | undefined;
  ncontains?: string | null | undefined;
  nendsWith?: string | null | undefined;
  neq?: string | null | undefined;
  nin?: Array<string | null | undefined> | null | undefined;
  nstartsWith?: string | null | undefined;
  or?: Array<StringOperationFilterInput> | null | undefined;
  startsWith?: string | null | undefined;
};

export type UserFilterInput = {
  age?: IntOperationFilterInput | null | undefined;
  and?: Array<UserFilterInput> | null | undefined;
  city?: StringOperationFilterInput | null | undefined;
  createdAt?: DateTimeOperationFilterInput | null | undefined;
  email?: EmailFilterInput | null | undefined;
  emailVerification?: EmailVerificationFilterInput | null | undefined;
  favoritedSalons?: ListIntOperationFilterInput | null | undefined;
  favorites?: ListFilterInputTypeOfFavoriteFilterInput | null | undefined;
  gender?: GendersOperationFilterInput | null | undefined;
  id?: IntOperationFilterInput | null | undefined;
  isVerified?: BooleanOperationFilterInput | null | undefined;
  or?: Array<UserFilterInput> | null | undefined;
  password?: StringOperationFilterInput | null | undefined;
  passwordEmailVerification?: PasswordVerificationFilterInput | null | undefined;
  phoneNumber?: StringOperationFilterInput | null | undefined;
  reviews?: ListFilterInputTypeOfReviewFilterInput | null | undefined;
  role?: RolesOperationFilterInput | null | undefined;
  salons?: ListFilterInputTypeOfSalonFilterInput | null | undefined;
  updatedAt?: DateTimeOperationFilterInput | null | undefined;
  userName?: StringOperationFilterInput | null | undefined;
};

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { me: Array<{ id: number, userName: string, email: string, role: Roles, phoneNumber: string | null, createdAt: string, updatedAt: string, city: string | null, age: number, favorites: Array<{ id: number, userId: number, salonId: number, salon: { id: number, englishName: string, georgianName: string, pictures: Array<string>, location: string } }>, salons: Array<{ id: number, englishName: string, georgianName: string, isFavoritedByCurrentUser: boolean | null, pictures: Array<string> }>, reviews: Array<{ id: number, star: Star, createdAt: string, comment: string | null }> }> };

export type GetSalonByIdQueryVariables = Exact<{
  id: number;
}>;


export type GetSalonByIdQuery = { getSalonById: Array<{ id: number, englishName: string, georgianName: string, email: string | null, location: string, phoneNumber: string, workingHours: string, description: string | null, facebookLink: string | null, instagramLink: string | null, isFavoritedByCurrentUser: boolean | null, pictures: Array<string>, price: BudgetLevel, AverageRating: number | null, userId: number, procedures: Array<{ id: number, salonId: number, masters: Array<string>, procedureType: ProcedureType, finishedWorks: Array<string> }> }> };

export type GetSalonsQueryVariables = Exact<{
  where?: SalonFilterInput | null | undefined;
}>;


export type GetSalonsQuery = { getSalons: Array<{ id: number, englishName: string, georgianName: string, location: string, pictures: Array<string>, description: string | null, facebookLink: string | null, instagramLink: string | null, userId: number, isFavoritedByCurrentUser: boolean | null, phoneNumber: string, price: BudgetLevel, AverageRating: number | null }> };

export type GetMySalonsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySalonsQuery = { getMySalons: Array<{ id: number, userId: number, description: string | null, pictures: Array<string>, price: BudgetLevel, englishName: string, georgianName: string, location: string }> };

export const GetUserDocument = gql`
    query GetUser {
  me {
    id
    userName
    email
    role
    phoneNumber
    createdAt
    updatedAt
    city
    age
    favorites {
      id
      userId
      salonId
      salon {
        id
        englishName
        georgianName
        pictures
        location
      }
    }
    salons {
      id
      englishName
      georgianName
      isFavoritedByCurrentUser
      pictures
    }
    reviews {
      id
      star
      createdAt
      comment
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUserGQL extends Apollo.Query<GetUserQuery, GetUserQueryVariables> {
    document = GetUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetSalonByIdDocument = gql`
    query getSalonById($id: Int!) {
  getSalonById(id: $id) {
    id
    englishName
    georgianName
    email
    location
    phoneNumber
    workingHours
    description
    facebookLink
    instagramLink
    isFavoritedByCurrentUser
    pictures
    price
    AverageRating
    userId
    procedures {
      id
      salonId
      masters
      procedureType
      finishedWorks
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSalonByIdGQL extends Apollo.Query<GetSalonByIdQuery, GetSalonByIdQueryVariables> {
    document = GetSalonByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetSalonsDocument = gql`
    query getSalons($where: SalonFilterInput) {
  getSalons(where: $where) {
    id
    englishName
    georgianName
    location
    pictures
    description
    facebookLink
    instagramLink
    userId
    isFavoritedByCurrentUser
    phoneNumber
    price
    AverageRating
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSalonsGQL extends Apollo.Query<GetSalonsQuery, GetSalonsQueryVariables> {
    document = GetSalonsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetMySalonsDocument = gql`
    query getMySalons {
  getMySalons {
    id
    userId
    description
    pictures
    price
    englishName
    georgianName
    location
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetMySalonsGQL extends Apollo.Query<GetMySalonsQuery, GetMySalonsQueryVariables> {
    document = GetMySalonsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }