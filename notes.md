# **NestJS**
under the hood, nest uses http server frameworks like express/fastify. 
Nest provides a level of abstraction above these common frameworks.

### philosophy
Nest provides an out-of-the-box application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. The architecture is heavily inspired by Angular.

### `NestFactory` class

it is used to create a Nest application instance
## First steps

```bash
$ nest new project-name
```

### platform
nest aims to be a platform-agnostic framework.
Technically, Nest is able to work with any Node HTTP framework once an adapter is created. There are two HTTP platforms supported out-of-the-box: express and fastify. 

### Hint
To speed up the development process (x20 times faster builds), you can use the SWC builder: 

1. install

```bash
$ npm i --save-dev @swc/cli @swc/core
```
2. run
```bash
$ nest start -b swc
# OR nest start --builder swc
```
3. navigate to `http://localhost:3000/`

To run the application in watch mode, use the following command:

```bash
$ nest start -b swc -w
# OR nest start --builder swc --watch
```

also, the default command is:

```
bun run start:dev
```

why do i have to reload the page?

## Controllers
Controllers are responsible for handling incoming requests and sending responses back to the client.
A controller's purpose is to handle specific requests for the application. The routing mechanism determines which controller will handle each request. Often, a controller has multiple routes, and each route can perform a different action.

To create a basic controller, we use classes and decorators. Decorators link classes with the necessary metadata, allowing Nest to create a routing map that connects requests to their corresponding controllers.

### Hint
To quickly create a CRUD controller with built-in validation, you can use the CLI's CRUD generator: 
```bash
nest g resource [name].
```

### Routing

### Hint
To create a controller using the CLI, simply execute the $ nest g controller [name] command.

### responses
the response's status code is always 200 by default, except for POST requests which use 201. We can easily change this behavior by adding the @HttpCode(...) decorator at a handler-level (see Status codes).

### Request object
Handlers often need access to the client’s request details. Nest provides access to the request object from the underlying platform (Express by default). You can access the request object by instructing Nest to inject it using the @Req() decorator in the handler’s signature.

### Hint
To take advantage of express typings, make sure to install the @types/express package.

The request object represents the HTTP request and contains properties for the query string, parameters, HTTP headers, and body (read more here). In most cases, you don't need to manually access these properties. Instead, you can use dedicated decorators like @Body() or @Query(), which are available out of the box. Below is a list of the provided decorators and the corresponding platform-specific objects they represent.


| Decorador | Objeto Específico de la Plataforma | Descripción |
| :--- | :--- | :--- |
| `@Request()`, `@Req()` | `req` | El objeto completo de la solicitud HTTP. |
| `@Response()`, `@Res()`* | `res` | El objeto completo de la respuesta HTTP. |
| `@Next()` | `next` | La función para pasar el control al siguiente *middleware*. |
| `@Session()` | `req.session` | Acceso a la información de la sesión. |
| `@Param(key?: string)` | `req.params / req.params[key]` | Acceso a los parámetros de ruta (path parameters). |
| `@Body(key?: string)` | `req.body / req.body[key]` | Acceso al cuerpo de la solicitud (payload). |
| `@Query(key?: string)` | `req.query / req.query[key]` | Acceso a los parámetros de la *query string* de la URL. |
| `@Headers(name?: string)` | `req.headers / req.headers[name]` | Acceso a los encabezados (headers) de la solicitud. |
| `@Ip()` | `req.ip` | La dirección IP del cliente que realiza la solicitud. |
| `@HostParam()` | `req.hosts` | Parámetros relacionados con el host (dependiente de la plataforma). |

It's that simple. Nest provides decorators for all of the standard HTTP methods: @Get(), @Post(), @Put(), @Delete(), @Patch(), @Options(), and @Head(). In addition, @All() defines an endpoint that handles all of them.

@All() ???

### Status code#
As mentioned, the default status code for responses is always 200, except for POST requests, which default to 201. You can easily change this behavior by using the @HttpCode(...) decorator at the handler level.

```TypeScript
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

response headers ???

como puedo hacer el status code dinamico?

### Redirection
To redirect a response to a specific URL, you can either use a @Redirect() decorator or a library-specific response object (and call res.redirect() directly).

@Redirect() takes two arguments, url and statusCode, both are optional. The default value of statusCode is 302 (Found) if omitted.

```TypeScript
@Get()
@Redirect('https://nestjs.com', 301)
```

### Hint
Sometimes you may want to determine the HTTP status code or the redirect URL dynamically. Do this by returning an object following the HttpRedirectResponse interface (from @nestjs/common).
this isn't very clear to me 👆

### Route parameters
The route parameter token in the @Get() decorator example below illustrates this approach. These route parameters can then be accessed using the @Param() decorator, which should be added to the method signature.

```TypeScript
@Get(':id')
findOne(@Param() params: any): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

### Sub-domain routing
The @Controller decorator can take a host option to require that the HTTP host of the incoming requests matches some specific value.

```TypeScript
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
```
can also work with dynamic info on the host

### state sharing
didn't understand this ? 

### Asynchronicity#
We love modern JavaScript, especially its emphasis on asynchronous data handling. That’s why Nest fully supports async functions. Every async function must return a Promise, which allows you to return a deferred value that Nest can resolve automatically. Here's an example:

```TypeScript
cats.controller.tsJS

@Get()
async findAll(): Promise<any[]> {
  return [];
}
```
important: when using async, must return a promise

another valid approach is: 

Nest takes it a step further by allowing route handlers to return RxJS observable streams as well. Nest will handle the subscription internally and resolve the final emitted value once the stream completes.

```TypeScript
cats.controller.tsJS

@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

### Request payloads#
In our previous example, the POST route handler didn’t accept any client parameters. Let's fix that by adding the @Body() decorator.

Before we proceed (if you're using TypeScript), we need to define the DTO (Data Transfer Object) schema. 
### DTO's
A DTO is an object that specifies how data should be sent over the network. We could define the DTO schema using TypeScript interfaces or simple classes. However, we recommend using classes here. Why? Classes are part of the JavaScript ES6 standard, so they remain intact as real entities in the compiled JavaScript. In contrast, TypeScript interfaces are removed during transpilation, meaning Nest can't reference them at runtime. This is important because features like Pipes rely on having access to the metatype of variables at runtime, which is only possible with classes.

Let's create the CreateCatDto class:

```JavaScript
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```
It has only three basic properties. Thereafter we can use the newly created DTO inside the CatsController:


cats.controller.ts
```JavaScript

@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}

```

### Query parameters

´@Query()´ decorator to extract them from incoming requests

```JavaScript
@Get()
async findAll(@Query('age') age: number, @Query('breed') breed: string) {
  return `This action returns all cats filtered by age: ${age} and breed: ${breed}`;
}

```

controllers must always be part of a module:
```JavaScript

import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

# Providers
Providers are a core concept in Nest. Many of the basic Nest classes, such as services, repositories, factories, and helpers, can be treated as providers. The key idea behind a provider is that it can be injected as a dependency, allowing objects to form various relationships with each other. The responsibility of "wiring up" these objects is largely handled by the Nest runtime system.

![providers](./images/providers.png)


Our CatsService is a basic class with one property and two methods. The key addition here is the @Injectable() decorator. This decorator attaches metadata to the class, signaling that CatsService is a class that can be managed by the Nest IoC container.

## Dependency injection
In Nest, thanks to TypeScript's capabilities, managing dependencies is straightforward because they are resolved based on their type. In the example below, Nest will resolve the catsService by creating and returning an instance of CatsService

```JavaScript
constructor(private catsService: CatsService) {}

```

para maneras mas a fondo y personalizables de crear providers, podemos ver: 

[Custom providers](https://docs.nestjs.com/fundamentals/custom-providers)

### Property-based injection

´´´

import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}

´´´

Este es un concepto fundamental dentro de los sistemas de **Inyección de Dependencias (DI)**, como los que se encuentran en frameworks como Angular, NestJS, o incluso en patrones de diseño más genéricos.

A continuación, se explica en profundidad el concepto, su diferencia con la inyección por constructor, y el escenario específico donde resulta útil.

---

## 1. Contexto: Inyección de Dependencias (DI)

La Inyección de Dependencias es un patrón de diseño donde una clase no crea las dependencias que necesita, sino que las recibe de una fuente externa (el Contenedor DI). Esto facilita la modularidad, las pruebas unitarias y la gestión del código.

## 2. Inyección Basada en Constructor (Constructor-based injection)

Esta es la forma **estándar y recomendada** de inyectar dependencias en la mayoría de los casos.

*   **Mecanismo:** El Contenedor DI inspecciona el método `constructor()` de la clase. Para cada parámetro del constructor tipado como una dependencia (un *Provider*), el contenedor encuentra la instancia correcta y la pasa como argumento al crear el objeto.
*   **Ventaja principal:** Las dependencias son explícitas, obligatorias y están disponibles inmediatamente al instanciar la clase. La clase queda bien definida.

```typescript
// ESTÁNDAR: Inyección por Constructor
class BaseClass {
  // Los servicios deben ser pasados aquí
  constructor(private serviceA: ServiceA, private serviceB: ServiceB) {
    // serviceA y serviceB están disponibles aquí
  }
}
```

## 3. Inyección Basada en Propiedad (Property-based injection)

La inyección basada en propiedad es una alternativa que se utiliza en **casos muy específicos**, como el que se describe: herencia de clases compleja.

*   **Mecanismo:** En lugar de solicitar la dependencia a través del constructor, se utiliza un decorador (como `@Inject()` en el ejemplo) directamente sobre la declaración de una propiedad de la clase.
*   **Flujo:** El Contenedor DI crea primero la instancia de la clase (llamando al constructor sin las dependencias inyectadas por propiedad) y luego, en un segundo paso, asigna el valor de la dependencia a esa propiedad.

```typescript
// ALTERNATIVA: Inyección por Propiedad
class BaseClass {
  // El Contenedor DI inyecta el valor *después* de la construcción
  @Inject(ServiceA) public serviceA: ServiceA;
  @Inject(ServiceB) public serviceB: ServiceB;
  
  constructor() {
    // serviceA y serviceB NO están garantizados aquí, pero sí después de la inyección
  }
}
```

## 4. El Problema que Resuelve: Herencia

El principal beneficio de la inyección por propiedad surge en el contexto de la **herencia de clases (subclases)**.

### El Problema del `super()`

Cuando se utiliza la inyección por constructor en una jerarquía de clases:

1.  La **Clase Base** necesita `ServiceA` y `ServiceB`.
2.  Una **Subclase** extiende la Clase Base y además necesita `ServiceC`.
3.  El constructor de la Subclase **DEBE** aceptar *todas* las dependencias (`A`, `B`, y `C`) y pasarlas a la clase padre usando `super()`.

**Código Complicado por Constructor:**

```typescript
class BaseClass {
  constructor(protected A: ServiceA, protected B: ServiceB) { /* ... */ }
}

// Subclase obligada a manejar las dependencias del padre
class SubClass extends BaseClass {
  constructor(
    A: ServiceA, // <-- Dependencia del padre
    B: ServiceB, // <-- Dependencia del padre
    private C: ServiceC  // Dependencia propia
  ) {
    super(A, B); // <-- Es obligatorio pasar A y B a super()
  }
}
```

Si la Clase Base tiene 5 o 10 dependencias, o si hay varios niveles de herencia, el constructor de la Subclase se vuelve muy **largo, repetitivo y frágil** (si se añade una dependencia a la clase base, hay que actualizar todas las subclases). Esto es lo que el texto llama "cumbersome" (engorroso/molesto).

### La Solución con Inyección por Propiedad

Al usar inyección por propiedad en la **Clase Base**, esta se encarga de sus propias dependencias fuera del constructor. La Subclase puede entonces ignorarlas por completo y solo enfocarse en sus propias dependencias.

**Código Simplificado por Propiedad:**

```typescript
class BaseClass {
  // Las inyecta el Contenedor DI directamente en la propiedad.
  @Inject(ServiceA) protected serviceA: ServiceA; 
  @Inject(ServiceB) protected serviceB: ServiceB;
  // El constructor ahora puede no tomar argumentos DI
  constructor() { /* ... */ }
}

// Subclase solo se preocupa por sus dependencias (o ninguna)
class SubClass extends BaseClass {
  // Solo se inyecta su propia dependencia C si es necesario
  constructor(private serviceC: ServiceC) { 
    super(); // Solo se llama al constructor base sin argumentos DI
  }
}
```

## 5. Conclusión y Advertencia

La inyección basada en propiedad es un atajo práctico para **romper la rigidez del constructor en jerarquías de herencia complejas**.

Sin embargo, como regla general, **la inyección por constructor sigue siendo la práctica preferida** porque:
*   Garantiza que la dependencia existe al inicio de la vida de la instancia.
*   Hace que las dependencias requeridas sean transparentes y explícitas.

La inyección por propiedad se reserva para los "casos específicos" mencionados, donde la necesidad de simplificar la herencia es más importante que las buenas prácticas de constructor.

cuando hagamos un provider como el catsService, hay que registrarlo en los providers del modulo: 

```typescript

import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}

```

# Modules
A module is a class that is annotated with the @Module() decorator. This decorator provides metadata that Nest uses to organize and manage the application structure efficiently.
![modules 1](./images/modules_1.png)


