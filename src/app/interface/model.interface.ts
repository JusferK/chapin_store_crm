export interface Administrator {
  username:               string;
  isActive:               boolean;
}

export type AdministratorData = Administrator & {
  jwt:                    string;
};
