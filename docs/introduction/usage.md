---
layout: default
title: Usage
description: 'Usage instructions for @42.nl/react-spring-enums.'
parent: Introduction
permalink: /usage
has_toc: true
nav_order: 4
---

# Usage

This library provides access to enums through the React context API. This supports both functional and class component invocation.

#### Functional component

```js
import { useEnum, useEnums } from '@42.nl/react-spring-enums';

const RoleLister = () => {
  const myEnum = useEnum('userRole'); // Fetch single enum by key
  const { enums } = useEnums(); // Fetch entire collection of enums

  return myEnum.map(role => <span key={role}>{role}</span>);
};
```

#### Class component

```js
import { EnumsContext } from '@42.nl/react-spring-enums';

class RoleLister extends React.Component {
  render() {
    return (
      <EnumsContext.Consumer>
        {({ enums }) => {
          const userRoles = enums['userRole'];
          return userRoles.map(role => <span key={role}>{role}</span>)
        }
      </EnumsContext.Consumer>
    )
  }
}
```
