export interface iResponseJson {
  message: string;
  data: any;
  code: number;
}

// export interface IRedisUserModel {
//   user_id: number;
//   roles: string[];
//   role_ids: number[];
// }

export interface IRedisUserModel {
  user_id: number;
  role: string;
  role_id: number;
}

export interface BranchesRoles {
  role_id: number;
  role_name: string;
  hospital_id: number;
  hospital_name: string;
  branch_id: number;
  branch_name: string;
}

export interface CNIC {
  cnic_number: number;
}

export interface ContactNumber {
  contact_number: number;
}

export interface QueryType {
  cnic_number?: number;
  contact_number?: number;
}
