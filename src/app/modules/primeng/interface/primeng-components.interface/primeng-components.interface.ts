export interface IPButton {
  label:                    string;
  severity:                 TSeverity;
  raised?:                  boolean;
  icon:                     string;
}

export type TSeverity = 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast';
