export type EnumValues = string[];

/**
 * The enums should have the following signature:
 *
 * {
 *   "UserRole": [
 *     "ADMIN",
 *     "USER"
 *  ],
 *  "BillingInterval": [
 *    "MONTHLY", "WEEKLY", "DAILY"
 *  ]
 * }
 *
 * The keys represent the name of the enum, in the above case 'UserRole',
 * and 'BillingInterval'. The array points to the possible values
 * of the enum.
 */
export interface Enums {
  [enumName: string]: EnumValues;
}
