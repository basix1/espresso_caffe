// types/navigation.ts

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  Auth: undefined;
  ChatDetail: { id: string };
  NotFound: undefined;
} & AuthStackParamList;
