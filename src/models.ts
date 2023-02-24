export type ComplexEnumType = {
  code: string;
  displayName: string;
};

export type EnumValues = string[] | ComplexEnumType[];
export type EnumValue = string | ComplexEnumType;

/**
 * The enums should have the following signature for simple enums:
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
 * or for complex enums:
 *
 * {
 *   "UserRole": [
 *     {
 *       "code": "ADMIN",
 *       "displayName": "Administrator"
 *     },
 *     {
 *       "code": "USER",
 *       "displayName": "User"
 *     }
 *   ],
 *   "BillingInterval": [
 *     {
 *       "code": "MONTHLY",
 *       "displayName": "Monthly"
 *     },
 *     {
 *       "code": "WEEKLY",
 *       "displayName": "Weekly",
 *       "onlyFor": "SPECIAL_CUSTOMER"
 *     }
 *   ]
 * }
 *
 * The keys represent the name of the enum, in the above case 'UserRole',
 * and 'BillingInterval'. The array points to the possible values
 * of the enum. In case of the complex enums, the code represents the value
 * and the displayName can be used to display i.e. a translation without
 * having to integrate a translation library or fetch a translation.
 */
export type Enums = {
  [enumName: string]: EnumValues;
};
