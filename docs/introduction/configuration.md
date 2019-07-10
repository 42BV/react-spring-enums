---
layout: default
title: Configuration
description: 'Configuration instructions for @42.nl/react-spring-enums.'
has_toc: false
parent: Getting started
permalink: /configuration
nav_order: 3
---

## Back-end endpoint

In order to expose the enums for the frontend it is mandatory to configure an endpoint on which the enums are fetchable. In most of the applications we create at 42 we use a Java based Spring Boot backend.

The following example shows how to configure an endpoint that exposes enum constants in existing entity classes for a Spring Boot backend.

```java
// EnumController.java

@RestController
@RequestMapping("/enums")
class EnumController {

    private final Map<String, Set<String>> registry = new HashMap<>();

    @Autowired
    EnumController(EnumClassPathScanningCandidateComponentProvider enumProvider) {
        enumProvider.findCandidateComponents(Application.class.getPackage().getName())
            .forEach(component -> {
                Class<Enum<?>> componentClass = forName(component.getBeanClassName());
                registry.put(componentClass.getSimpleName(), stream(componentClass.getEnumConstants())
                    .map(Enum::name)
                    .collect(toSet()));
            });
    }

    @GetMapping
    Map<String, Set<String>> findAll() {
        return registry;
    }

}

// EnumClassPathScanningCandidateComponentProvider.java

/**
 * EnumClassPathScanningCandidateComponentProvider is a specialization of {@link ClassPathScanningCandidateComponentProvider}
 * that only takes enum values into account.
 *
 * Furthermore it overrides the default behaviour of the {@link ClassPathScanningCandidateComponentProvider}
 * that checks that the classes that are found on the classpath are non-abstract. By their definition, an
 * enum that contains abstract methods or implements an interface is abstract and ignored.
 * This does not serve our purpose, hence the specialisation.
 */
@Component
class EnumClassPathScanningCandidateComponentProvider extends ClassPathScanningCandidateComponentProvider {

    EnumClassPathScanningCandidateComponentProvider() {
        super(false);
        addIncludeFilter(new IsEnumFilter());
    }

    /**
     * Determine whether the given bean definition qualifies as candidate.
     *
     * The default implementation checks whether the class is concrete
     * but this is does not work for us because an enum is considered abstract
     * when it implements an interface or has an abstract method.
     *
     * The JavaDoc of the default implementation also states that
     * this behaviour can be overridden in subclasses.
     *
     * @param beanDefinition the bean definition to check
     * @return whether the bean definition qualifies as a candidate component
     */
    @Override
    protected boolean isCandidateComponent(AnnotatedBeanDefinition beanDefinition) {
        return beanDefinition.getMetadata().isIndependent();
    }

    private static class IsEnumFilter implements TypeFilter {

        @Override
        public boolean match(MetadataReader metadataReader, MetadataReaderFactory metadataReaderFactory) throws IOException {
            String className = metadataReader.getClassMetadata().getClassName();
            Class<Enum> clazz = Classes.forName(className);
            return clazz.isEnum();
        }
    }
}
```

## React provider

We assume you have a working React project with React version 16.8. In order to retrieve the enums from the backend
we have to define a configuration object and mount the Provider component. This is best defined in the entrypoint of the application, in our case `index.tsx`.

```js
// index.tsx

import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { configureEnums, EnumsProvider } from '@42.nl/react-spring-enums';
...

configureEnums({
    // The URL which will provide the enums over a GET request.
    enumsUrl: '/api/enums',
    // Whether or not the 'enumsUrl' should be called with authentication.
    needsAuthentication: true
});

...

render(
    <EnumsProvider>
        <App />
    </EnumsProvider>
), document.getElementById('root');
```

Finally you will have to load the enums from the back-end using the `loadEnums` function. If in order for the constraints to be loaded you need to be logged in, you should load the enums as soon as you know that you are logged in:

```js
// login.tsx

import { loadEnums } from '@42.nl/react-spring-enums';
import { login } from 'somewhere';

class Login extends Component {
  doLogin(username, password) {
    login({ username, password }).then(loadEnums); // Load enums ASAP
  }

  render() {
    // Render here which calls doLogin
  }
}
```
