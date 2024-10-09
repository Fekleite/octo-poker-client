export interface IUser {
  name: string;
  id: string;
  role: 'default' | 'admin'
}

export interface IRoom {
  name: string;
  code: string;
  users: IUser[];
}

export interface IVote {
  value: string | number;
  user: string;
}