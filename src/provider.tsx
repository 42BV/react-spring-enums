import React, { createContext } from 'react';

import { useEnums } from './hooks';
import { EnumsState } from './service';

export const EnumsContext = createContext<EnumsState>({ enums: {} });

export const EnumsProvider: React.FC = ({ children }) => {
  const enums = useEnums();
  return <EnumsContext.Provider value={enums}>{children}</EnumsContext.Provider>;
};
