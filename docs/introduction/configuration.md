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

In order to expose the enums for the frontend, it is mandatory to configure an endpoint on which the enums are fetchable. In most of the applications we create at 42 we use a Java based Spring Boot backend.

The following examples show how to configure an endpoint that exposes enum constants in existing entity classes for a Spring Boot backend.

### Simple enum types

Simple enum types only use a string representation of the enum.

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
```

```java
// EnumClassPathScanningCandidateComponentProvider.java

/**
 * EnumClassPathScanningCandidateComponentProvider is a specialization of {@link ClassPathScanningCandidateComponentProvider}
 * that only takes enum values into account.
 *
 * Furthermore it overrides the default behavior of the {@link ClassPathScanningCandidateComponentProvider}
 * that checks that the classes that are found on the classpath are non-abstract. By their definition, an
 * enum that contains abstract methods or implements an interface is abstract and ignored.
 * This does not serve our purpose, hence the specialization.
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
     * this behavior can be overridden in subclasses.
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

### Complex enum types

Complex enum types can hold more data than just the key representation of the enum.

```java
// EnumController.java

@RestController
@RequestMapping("/enums")
class EnumController {

    private final Map<String, List<Object>> registry = new HashMap<>();

    EnumController(BeanMapper beanMapper, EnumProvider enumProvider) {
        enumProvider.findCandidateComponents(Application.class.getPackage().getName())
                .forEach(component -> {
                    Class<Enum<?>> componentClass = Classes.forName(component.getBeanClassName());
                    if (!componentClass.isAnnotationPresent(EnumIgnored.class)) {
                        List<Object> constants = stream(componentClass.getEnumConstants())
                                .filter(constant -> !findField(componentClass, constant.name()).isAnnotationPresent(EnumIgnored.class))
                                .collect(toList());
                        if (componentClass.isAnnotationPresent(EnumAutoSelectable.class)) {
                            constants = convertEnumsToSelectableResults(constants, componentClass);
                        } else if (componentClass.isAnnotationPresent(EnumResult.class)) {
                            EnumResult enumResult = componentClass.getAnnotation(EnumResult.class);
                            constants = (List) beanMapper.map(constants, enumResult.value());
                        }
                        registry.put(componentClass.getSimpleName(), constants);
                    }
                });
    }

    private List<Object> convertEnumsToSelectableResults(List<Object> constants, Class<Enum<?>> componentClass) {
        List<Object> results = new ArrayList<>();
        for (Object constant : constants) {
            SelectableResult result = new SelectableResult();
            result.displayName = getDisplayName(constant);
            result.code = getCode(constant);
            results.add(result);
        }
        return results;
    }

    private String getCode(Object enumValue) {
        if (enumValue instanceof SelectableInterface) {
            Object code = ((SelectableInterface<?>)enumValue).getCode();
            return code instanceof Enum<?> ? ((Enum<?>)code).name() : (String)code;
        } else {
            return ((Enum<?>)enumValue).name();
        }
    }

    private String getDisplayName(Object enumValue) {
        return enumValue instanceof OverrideDisplayName ?
                ((OverrideDisplayName)enumValue).getDisplayName() :
                StringUtils.capitalize(((Enum<?>)enumValue).name().toLowerCase(Locale.ROOT).replaceAll("_", " "));
    }

    @GetMapping
    Map<String, List<Object>> findAll() {
        return registry;
    }

}
```

```java
// EnumAutoSelectable.java

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@EnumBase
public @interface EnumAutoSelectable {
}

```

```java
// EnumBase.java

@Target({ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface EnumBase {
}
```

```java
// EnumResult.java

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@EnumBase
public @interface EnumResult {
    /** Class type of the result class the enum can be mapped to */
    Class<? extends SelectableResult> value();
}
```

```java
// SelectableResult.java

public class SelectableResult {
    public String code;
    public String displayName;

    public SelectableResult() {}
    public SelectableResult(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }
}
```

```java
// SelectableInterface.java

public interface SelectableInterface<T> extends OverrideDisplayName {
    T getCode();
}
```

```java
// OverrideDisplayName.java

public interface OverrideDisplayName {
    String getDisplayName();
}
```

```java
// EnumProvider.java

/**
 * EnumClassPathScanningCandidateComponentProvider is a specialization of {@link ClassPathScanningCandidateComponentProvider}
 * that only takes enum values into account.
 *
 * Furthermore it overrides the default behavior of the {@link ClassPathScanningCandidateComponentProvider}
 * that checks that the classes that are found on the classpath are non-abstract. By their definition, an
 * enum that contains abstract methods or implements an interface is abstract and ignored.
 * This does not serve our purpose, hence the specialization.
 */
@Component
class EnumProvider extends ClassPathScanningCandidateComponentProvider {

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
     * this behavior can be overridden in subclasses.
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

We assume you have a working React project with React version 16.8+. In order to retrieve the enums from the backend
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
