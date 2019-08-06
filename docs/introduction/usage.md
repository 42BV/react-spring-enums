---
layout: default
title: Usage
description: 'Usage instructions for @42.nl/react-spring-enums.'
parent: Getting started
permalink: /usage
has_toc: true
nav_order: 4
---

This library provides access to enums through the React context API. This supports both functional and class component invocation.

## Getting enums

#### Functional component

```js
import { useEnum, useEnums } from '@42.nl/react-spring-enums';

function RoleLister {
  const userRole = useEnum('userRole'); // Fetch single enum by key
  const { enums } = useEnums(); // Fetch entire collection of enums

  return userRole.map(role => <span key={role}>{role}</span>);
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

## Using enums in forms

To facilitate using enums in forms in `@42.nl/ui-forms` components we
need to be able to provide the enums as a `Page` from
`@42.nl/spring-connect`.

This is what the utitlity `getEnumsAsPage` does for you. It creates
offline pagination for enums, to prevent the user from seeing to
many enums at once.

Look at the `fetchData` to see an example on how to use it:

```js
import { useEnum, getEnumsAsPage } from '@42.nl/react-spring-enums';

function Form() {
  const myEnum = useEnum('userRole');

  return (
    <form>
      <JarbModalPickerMultiple
        name="roles"
        jarb={{
          validator: 'User.roles',
          label: 'Roles'
        }}
        id="roles"
        label="Roles"
        placeholder="Pick a role"
        optionForValue={value => value}
        fetchData={(query, page) => {
          return getEnumsAsPage({
            enumValues: userRoles,
            page,
            query,
            size: 10, // 10 is the default you can omit this.
            oneBased: true // true is the default you can omit this
          });
        }}
      />
    </form>
  );
}
```
