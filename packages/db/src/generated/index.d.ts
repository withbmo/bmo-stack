
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model OAuthAccount
 * 
 */
export type OAuthAccount = $Result.DefaultSelection<Prisma.$OAuthAccountPayload>
/**
 * Model Otp
 * 
 */
export type Otp = $Result.DefaultSelection<Prisma.$OtpPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Environment
 * 
 */
export type Environment = $Result.DefaultSelection<Prisma.$EnvironmentPayload>
/**
 * Model DeployJob
 * 
 */
export type DeployJob = $Result.DefaultSelection<Prisma.$DeployJobPayload>
/**
 * Model WizardBuild
 * 
 */
export type WizardBuild = $Result.DefaultSelection<Prisma.$WizardBuildPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model UserPaymentMethod
 * 
 */
export type UserPaymentMethod = $Result.DefaultSelection<Prisma.$UserPaymentMethodPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model Invoice
 * 
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model StripeWebhookEvent
 * 
 */
export type StripeWebhookEvent = $Result.DefaultSelection<Prisma.$StripeWebhookEventPayload>
/**
 * Model UsageCounter
 * 
 */
export type UsageCounter = $Result.DefaultSelection<Prisma.$UsageCounterPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const DeployJobStatus: {
  queued: 'queued',
  running: 'running',
  succeeded: 'succeeded',
  failed: 'failed',
  canceled: 'canceled'
};

export type DeployJobStatus = (typeof DeployJobStatus)[keyof typeof DeployJobStatus]

}

export type DeployJobStatus = $Enums.DeployJobStatus

export const DeployJobStatus: typeof $Enums.DeployJobStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oAuthAccount`: Exposes CRUD operations for the **OAuthAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OAuthAccounts
    * const oAuthAccounts = await prisma.oAuthAccount.findMany()
    * ```
    */
  get oAuthAccount(): Prisma.OAuthAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.otp`: Exposes CRUD operations for the **Otp** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Otps
    * const otps = await prisma.otp.findMany()
    * ```
    */
  get otp(): Prisma.OtpDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.environment`: Exposes CRUD operations for the **Environment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Environments
    * const environments = await prisma.environment.findMany()
    * ```
    */
  get environment(): Prisma.EnvironmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deployJob`: Exposes CRUD operations for the **DeployJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeployJobs
    * const deployJobs = await prisma.deployJob.findMany()
    * ```
    */
  get deployJob(): Prisma.DeployJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wizardBuild`: Exposes CRUD operations for the **WizardBuild** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WizardBuilds
    * const wizardBuilds = await prisma.wizardBuild.findMany()
    * ```
    */
  get wizardBuild(): Prisma.WizardBuildDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userPaymentMethod`: Exposes CRUD operations for the **UserPaymentMethod** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserPaymentMethods
    * const userPaymentMethods = await prisma.userPaymentMethod.findMany()
    * ```
    */
  get userPaymentMethod(): Prisma.UserPaymentMethodDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stripeWebhookEvent`: Exposes CRUD operations for the **StripeWebhookEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StripeWebhookEvents
    * const stripeWebhookEvents = await prisma.stripeWebhookEvent.findMany()
    * ```
    */
  get stripeWebhookEvent(): Prisma.StripeWebhookEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usageCounter`: Exposes CRUD operations for the **UsageCounter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsageCounters
    * const usageCounters = await prisma.usageCounter.findMany()
    * ```
    */
  get usageCounter(): Prisma.UsageCounterDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    OAuthAccount: 'OAuthAccount',
    Otp: 'Otp',
    Project: 'Project',
    Environment: 'Environment',
    DeployJob: 'DeployJob',
    WizardBuild: 'WizardBuild',
    Subscription: 'Subscription',
    UserPaymentMethod: 'UserPaymentMethod',
    Payment: 'Payment',
    Invoice: 'Invoice',
    StripeWebhookEvent: 'StripeWebhookEvent',
    UsageCounter: 'UsageCounter'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "oAuthAccount" | "otp" | "project" | "environment" | "deployJob" | "wizardBuild" | "subscription" | "userPaymentMethod" | "payment" | "invoice" | "stripeWebhookEvent" | "usageCounter"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      OAuthAccount: {
        payload: Prisma.$OAuthAccountPayload<ExtArgs>
        fields: Prisma.OAuthAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OAuthAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OAuthAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          findFirst: {
            args: Prisma.OAuthAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OAuthAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          findMany: {
            args: Prisma.OAuthAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>[]
          }
          create: {
            args: Prisma.OAuthAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          createMany: {
            args: Prisma.OAuthAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OAuthAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>[]
          }
          delete: {
            args: Prisma.OAuthAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          update: {
            args: Prisma.OAuthAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          deleteMany: {
            args: Prisma.OAuthAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OAuthAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OAuthAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>[]
          }
          upsert: {
            args: Prisma.OAuthAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          aggregate: {
            args: Prisma.OAuthAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOAuthAccount>
          }
          groupBy: {
            args: Prisma.OAuthAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<OAuthAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.OAuthAccountCountArgs<ExtArgs>
            result: $Utils.Optional<OAuthAccountCountAggregateOutputType> | number
          }
        }
      }
      Otp: {
        payload: Prisma.$OtpPayload<ExtArgs>
        fields: Prisma.OtpFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OtpFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OtpFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload>
          }
          findFirst: {
            args: Prisma.OtpFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OtpFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload>
          }
          findMany: {
            args: Prisma.OtpFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload>[]
          }
          create: {
            args: Prisma.OtpCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload>
          }
          createMany: {
            args: Prisma.OtpCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OtpCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload>[]
          }
          delete: {
            args: Prisma.OtpDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload>
          }
          update: {
            args: Prisma.OtpUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload>
          }
          deleteMany: {
            args: Prisma.OtpDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OtpUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OtpUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload>[]
          }
          upsert: {
            args: Prisma.OtpUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpPayload>
          }
          aggregate: {
            args: Prisma.OtpAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOtp>
          }
          groupBy: {
            args: Prisma.OtpGroupByArgs<ExtArgs>
            result: $Utils.Optional<OtpGroupByOutputType>[]
          }
          count: {
            args: Prisma.OtpCountArgs<ExtArgs>
            result: $Utils.Optional<OtpCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Environment: {
        payload: Prisma.$EnvironmentPayload<ExtArgs>
        fields: Prisma.EnvironmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnvironmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnvironmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          findFirst: {
            args: Prisma.EnvironmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnvironmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          findMany: {
            args: Prisma.EnvironmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>[]
          }
          create: {
            args: Prisma.EnvironmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          createMany: {
            args: Prisma.EnvironmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EnvironmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>[]
          }
          delete: {
            args: Prisma.EnvironmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          update: {
            args: Prisma.EnvironmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          deleteMany: {
            args: Prisma.EnvironmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnvironmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EnvironmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>[]
          }
          upsert: {
            args: Prisma.EnvironmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          aggregate: {
            args: Prisma.EnvironmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnvironment>
          }
          groupBy: {
            args: Prisma.EnvironmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnvironmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnvironmentCountArgs<ExtArgs>
            result: $Utils.Optional<EnvironmentCountAggregateOutputType> | number
          }
        }
      }
      DeployJob: {
        payload: Prisma.$DeployJobPayload<ExtArgs>
        fields: Prisma.DeployJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeployJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeployJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload>
          }
          findFirst: {
            args: Prisma.DeployJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeployJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload>
          }
          findMany: {
            args: Prisma.DeployJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload>[]
          }
          create: {
            args: Prisma.DeployJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload>
          }
          createMany: {
            args: Prisma.DeployJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeployJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload>[]
          }
          delete: {
            args: Prisma.DeployJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload>
          }
          update: {
            args: Prisma.DeployJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload>
          }
          deleteMany: {
            args: Prisma.DeployJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeployJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeployJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload>[]
          }
          upsert: {
            args: Prisma.DeployJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployJobPayload>
          }
          aggregate: {
            args: Prisma.DeployJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeployJob>
          }
          groupBy: {
            args: Prisma.DeployJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeployJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeployJobCountArgs<ExtArgs>
            result: $Utils.Optional<DeployJobCountAggregateOutputType> | number
          }
        }
      }
      WizardBuild: {
        payload: Prisma.$WizardBuildPayload<ExtArgs>
        fields: Prisma.WizardBuildFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WizardBuildFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WizardBuildFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload>
          }
          findFirst: {
            args: Prisma.WizardBuildFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WizardBuildFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload>
          }
          findMany: {
            args: Prisma.WizardBuildFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload>[]
          }
          create: {
            args: Prisma.WizardBuildCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload>
          }
          createMany: {
            args: Prisma.WizardBuildCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WizardBuildCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload>[]
          }
          delete: {
            args: Prisma.WizardBuildDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload>
          }
          update: {
            args: Prisma.WizardBuildUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload>
          }
          deleteMany: {
            args: Prisma.WizardBuildDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WizardBuildUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WizardBuildUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload>[]
          }
          upsert: {
            args: Prisma.WizardBuildUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WizardBuildPayload>
          }
          aggregate: {
            args: Prisma.WizardBuildAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWizardBuild>
          }
          groupBy: {
            args: Prisma.WizardBuildGroupByArgs<ExtArgs>
            result: $Utils.Optional<WizardBuildGroupByOutputType>[]
          }
          count: {
            args: Prisma.WizardBuildCountArgs<ExtArgs>
            result: $Utils.Optional<WizardBuildCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      UserPaymentMethod: {
        payload: Prisma.$UserPaymentMethodPayload<ExtArgs>
        fields: Prisma.UserPaymentMethodFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserPaymentMethodFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserPaymentMethodFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload>
          }
          findFirst: {
            args: Prisma.UserPaymentMethodFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserPaymentMethodFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload>
          }
          findMany: {
            args: Prisma.UserPaymentMethodFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload>[]
          }
          create: {
            args: Prisma.UserPaymentMethodCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload>
          }
          createMany: {
            args: Prisma.UserPaymentMethodCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserPaymentMethodCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload>[]
          }
          delete: {
            args: Prisma.UserPaymentMethodDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload>
          }
          update: {
            args: Prisma.UserPaymentMethodUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload>
          }
          deleteMany: {
            args: Prisma.UserPaymentMethodDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserPaymentMethodUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserPaymentMethodUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload>[]
          }
          upsert: {
            args: Prisma.UserPaymentMethodUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPaymentMethodPayload>
          }
          aggregate: {
            args: Prisma.UserPaymentMethodAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserPaymentMethod>
          }
          groupBy: {
            args: Prisma.UserPaymentMethodGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserPaymentMethodGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserPaymentMethodCountArgs<ExtArgs>
            result: $Utils.Optional<UserPaymentMethodCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      StripeWebhookEvent: {
        payload: Prisma.$StripeWebhookEventPayload<ExtArgs>
        fields: Prisma.StripeWebhookEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StripeWebhookEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StripeWebhookEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>
          }
          findFirst: {
            args: Prisma.StripeWebhookEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StripeWebhookEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>
          }
          findMany: {
            args: Prisma.StripeWebhookEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>[]
          }
          create: {
            args: Prisma.StripeWebhookEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>
          }
          createMany: {
            args: Prisma.StripeWebhookEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StripeWebhookEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>[]
          }
          delete: {
            args: Prisma.StripeWebhookEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>
          }
          update: {
            args: Prisma.StripeWebhookEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>
          }
          deleteMany: {
            args: Prisma.StripeWebhookEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StripeWebhookEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StripeWebhookEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>[]
          }
          upsert: {
            args: Prisma.StripeWebhookEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>
          }
          aggregate: {
            args: Prisma.StripeWebhookEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStripeWebhookEvent>
          }
          groupBy: {
            args: Prisma.StripeWebhookEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<StripeWebhookEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.StripeWebhookEventCountArgs<ExtArgs>
            result: $Utils.Optional<StripeWebhookEventCountAggregateOutputType> | number
          }
        }
      }
      UsageCounter: {
        payload: Prisma.$UsageCounterPayload<ExtArgs>
        fields: Prisma.UsageCounterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsageCounterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsageCounterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload>
          }
          findFirst: {
            args: Prisma.UsageCounterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsageCounterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload>
          }
          findMany: {
            args: Prisma.UsageCounterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload>[]
          }
          create: {
            args: Prisma.UsageCounterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload>
          }
          createMany: {
            args: Prisma.UsageCounterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsageCounterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload>[]
          }
          delete: {
            args: Prisma.UsageCounterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload>
          }
          update: {
            args: Prisma.UsageCounterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload>
          }
          deleteMany: {
            args: Prisma.UsageCounterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsageCounterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsageCounterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload>[]
          }
          upsert: {
            args: Prisma.UsageCounterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageCounterPayload>
          }
          aggregate: {
            args: Prisma.UsageCounterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsageCounter>
          }
          groupBy: {
            args: Prisma.UsageCounterGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsageCounterGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsageCounterCountArgs<ExtArgs>
            result: $Utils.Optional<UsageCounterCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    oAuthAccount?: OAuthAccountOmit
    otp?: OtpOmit
    project?: ProjectOmit
    environment?: EnvironmentOmit
    deployJob?: DeployJobOmit
    wizardBuild?: WizardBuildOmit
    subscription?: SubscriptionOmit
    userPaymentMethod?: UserPaymentMethodOmit
    payment?: PaymentOmit
    invoice?: InvoiceOmit
    stripeWebhookEvent?: StripeWebhookEventOmit
    usageCounter?: UsageCounterOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    projects: number
    environments: number
    deployJobs: number
    wizardBuilds: number
    otps: number
    oauthAccounts: number
    paymentMethods: number
    payments: number
    invoices: number
    subscriptions: number
    usageCounters: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | UserCountOutputTypeCountProjectsArgs
    environments?: boolean | UserCountOutputTypeCountEnvironmentsArgs
    deployJobs?: boolean | UserCountOutputTypeCountDeployJobsArgs
    wizardBuilds?: boolean | UserCountOutputTypeCountWizardBuildsArgs
    otps?: boolean | UserCountOutputTypeCountOtpsArgs
    oauthAccounts?: boolean | UserCountOutputTypeCountOauthAccountsArgs
    paymentMethods?: boolean | UserCountOutputTypeCountPaymentMethodsArgs
    payments?: boolean | UserCountOutputTypeCountPaymentsArgs
    invoices?: boolean | UserCountOutputTypeCountInvoicesArgs
    subscriptions?: boolean | UserCountOutputTypeCountSubscriptionsArgs
    usageCounters?: boolean | UserCountOutputTypeCountUsageCountersArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEnvironmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnvironmentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDeployJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeployJobWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWizardBuildsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WizardBuildWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOtpsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OtpWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOauthAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OAuthAccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPaymentMethodsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPaymentMethodWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUsageCountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageCounterWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    deployJobs: number
    wizardBuilds: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deployJobs?: boolean | ProjectCountOutputTypeCountDeployJobsArgs
    wizardBuilds?: boolean | ProjectCountOutputTypeCountWizardBuildsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountDeployJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeployJobWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountWizardBuildsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WizardBuildWhereInput
  }


  /**
   * Count Type EnvironmentCountOutputType
   */

  export type EnvironmentCountOutputType = {
    deployJobs: number
  }

  export type EnvironmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deployJobs?: boolean | EnvironmentCountOutputTypeCountDeployJobsArgs
  }

  // Custom InputTypes
  /**
   * EnvironmentCountOutputType without action
   */
  export type EnvironmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnvironmentCountOutputType
     */
    select?: EnvironmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EnvironmentCountOutputType without action
   */
  export type EnvironmentCountOutputTypeCountDeployJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeployJobWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    fullName: string | null
    bio: string | null
    avatarUrl: string | null
    hashedPassword: string | null
    isActive: boolean | null
    isSuperuser: boolean | null
    isEmailVerified: boolean | null
    stripeCustomerId: string | null
    novuSubscriberId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    fullName: string | null
    bio: string | null
    avatarUrl: string | null
    hashedPassword: string | null
    isActive: boolean | null
    isSuperuser: boolean | null
    isEmailVerified: boolean | null
    stripeCustomerId: string | null
    novuSubscriberId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    fullName: number
    bio: number
    avatarUrl: number
    hashedPassword: number
    isActive: number
    isSuperuser: number
    isEmailVerified: number
    stripeCustomerId: number
    novuSubscriberId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    fullName?: true
    bio?: true
    avatarUrl?: true
    hashedPassword?: true
    isActive?: true
    isSuperuser?: true
    isEmailVerified?: true
    stripeCustomerId?: true
    novuSubscriberId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    fullName?: true
    bio?: true
    avatarUrl?: true
    hashedPassword?: true
    isActive?: true
    isSuperuser?: true
    isEmailVerified?: true
    stripeCustomerId?: true
    novuSubscriberId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    fullName?: true
    bio?: true
    avatarUrl?: true
    hashedPassword?: true
    isActive?: true
    isSuperuser?: true
    isEmailVerified?: true
    stripeCustomerId?: true
    novuSubscriberId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    fullName: string | null
    bio: string | null
    avatarUrl: string | null
    hashedPassword: string
    isActive: boolean
    isSuperuser: boolean
    isEmailVerified: boolean
    stripeCustomerId: string | null
    novuSubscriberId: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    fullName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    hashedPassword?: boolean
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: boolean
    novuSubscriberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | User$projectsArgs<ExtArgs>
    environments?: boolean | User$environmentsArgs<ExtArgs>
    deployJobs?: boolean | User$deployJobsArgs<ExtArgs>
    wizardBuilds?: boolean | User$wizardBuildsArgs<ExtArgs>
    otps?: boolean | User$otpsArgs<ExtArgs>
    oauthAccounts?: boolean | User$oauthAccountsArgs<ExtArgs>
    paymentMethods?: boolean | User$paymentMethodsArgs<ExtArgs>
    payments?: boolean | User$paymentsArgs<ExtArgs>
    invoices?: boolean | User$invoicesArgs<ExtArgs>
    subscriptions?: boolean | User$subscriptionsArgs<ExtArgs>
    usageCounters?: boolean | User$usageCountersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    fullName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    hashedPassword?: boolean
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: boolean
    novuSubscriberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    fullName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    hashedPassword?: boolean
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: boolean
    novuSubscriberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    fullName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    hashedPassword?: boolean
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: boolean
    novuSubscriberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "fullName" | "bio" | "avatarUrl" | "hashedPassword" | "isActive" | "isSuperuser" | "isEmailVerified" | "stripeCustomerId" | "novuSubscriberId" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | User$projectsArgs<ExtArgs>
    environments?: boolean | User$environmentsArgs<ExtArgs>
    deployJobs?: boolean | User$deployJobsArgs<ExtArgs>
    wizardBuilds?: boolean | User$wizardBuildsArgs<ExtArgs>
    otps?: boolean | User$otpsArgs<ExtArgs>
    oauthAccounts?: boolean | User$oauthAccountsArgs<ExtArgs>
    paymentMethods?: boolean | User$paymentMethodsArgs<ExtArgs>
    payments?: boolean | User$paymentsArgs<ExtArgs>
    invoices?: boolean | User$invoicesArgs<ExtArgs>
    subscriptions?: boolean | User$subscriptionsArgs<ExtArgs>
    usageCounters?: boolean | User$usageCountersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      environments: Prisma.$EnvironmentPayload<ExtArgs>[]
      deployJobs: Prisma.$DeployJobPayload<ExtArgs>[]
      wizardBuilds: Prisma.$WizardBuildPayload<ExtArgs>[]
      otps: Prisma.$OtpPayload<ExtArgs>[]
      oauthAccounts: Prisma.$OAuthAccountPayload<ExtArgs>[]
      paymentMethods: Prisma.$UserPaymentMethodPayload<ExtArgs>[]
      payments: Prisma.$PaymentPayload<ExtArgs>[]
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
      subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[]
      usageCounters: Prisma.$UsageCounterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      fullName: string | null
      bio: string | null
      avatarUrl: string | null
      hashedPassword: string
      isActive: boolean
      isSuperuser: boolean
      isEmailVerified: boolean
      stripeCustomerId: string | null
      novuSubscriberId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends User$projectsArgs<ExtArgs> = {}>(args?: Subset<T, User$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    environments<T extends User$environmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$environmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    deployJobs<T extends User$deployJobsArgs<ExtArgs> = {}>(args?: Subset<T, User$deployJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    wizardBuilds<T extends User$wizardBuildsArgs<ExtArgs> = {}>(args?: Subset<T, User$wizardBuildsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    otps<T extends User$otpsArgs<ExtArgs> = {}>(args?: Subset<T, User$otpsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    oauthAccounts<T extends User$oauthAccountsArgs<ExtArgs> = {}>(args?: Subset<T, User$oauthAccountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    paymentMethods<T extends User$paymentMethodsArgs<ExtArgs> = {}>(args?: Subset<T, User$paymentMethodsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payments<T extends User$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, User$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invoices<T extends User$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, User$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    subscriptions<T extends User$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, User$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    usageCounters<T extends User$usageCountersArgs<ExtArgs> = {}>(args?: Subset<T, User$usageCountersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly bio: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly hashedPassword: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly isSuperuser: FieldRef<"User", 'Boolean'>
    readonly isEmailVerified: FieldRef<"User", 'Boolean'>
    readonly stripeCustomerId: FieldRef<"User", 'String'>
    readonly novuSubscriberId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.projects
   */
  export type User$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.environments
   */
  export type User$environmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    where?: EnvironmentWhereInput
    orderBy?: EnvironmentOrderByWithRelationInput | EnvironmentOrderByWithRelationInput[]
    cursor?: EnvironmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[]
  }

  /**
   * User.deployJobs
   */
  export type User$deployJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    where?: DeployJobWhereInput
    orderBy?: DeployJobOrderByWithRelationInput | DeployJobOrderByWithRelationInput[]
    cursor?: DeployJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeployJobScalarFieldEnum | DeployJobScalarFieldEnum[]
  }

  /**
   * User.wizardBuilds
   */
  export type User$wizardBuildsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    where?: WizardBuildWhereInput
    orderBy?: WizardBuildOrderByWithRelationInput | WizardBuildOrderByWithRelationInput[]
    cursor?: WizardBuildWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WizardBuildScalarFieldEnum | WizardBuildScalarFieldEnum[]
  }

  /**
   * User.otps
   */
  export type User$otpsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
    where?: OtpWhereInput
    orderBy?: OtpOrderByWithRelationInput | OtpOrderByWithRelationInput[]
    cursor?: OtpWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OtpScalarFieldEnum | OtpScalarFieldEnum[]
  }

  /**
   * User.oauthAccounts
   */
  export type User$oauthAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    where?: OAuthAccountWhereInput
    orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[]
    cursor?: OAuthAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[]
  }

  /**
   * User.paymentMethods
   */
  export type User$paymentMethodsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
    where?: UserPaymentMethodWhereInput
    orderBy?: UserPaymentMethodOrderByWithRelationInput | UserPaymentMethodOrderByWithRelationInput[]
    cursor?: UserPaymentMethodWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserPaymentMethodScalarFieldEnum | UserPaymentMethodScalarFieldEnum[]
  }

  /**
   * User.payments
   */
  export type User$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * User.invoices
   */
  export type User$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * User.subscriptions
   */
  export type User$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * User.usageCounters
   */
  export type User$usageCountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
    where?: UsageCounterWhereInput
    orderBy?: UsageCounterOrderByWithRelationInput | UsageCounterOrderByWithRelationInput[]
    cursor?: UsageCounterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsageCounterScalarFieldEnum | UsageCounterScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model OAuthAccount
   */

  export type AggregateOAuthAccount = {
    _count: OAuthAccountCountAggregateOutputType | null
    _min: OAuthAccountMinAggregateOutputType | null
    _max: OAuthAccountMaxAggregateOutputType | null
  }

  export type OAuthAccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    provider: string | null
    accountId: string | null
    accountEmail: string | null
    accessToken: string | null
    refreshToken: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type OAuthAccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    provider: string | null
    accountId: string | null
    accountEmail: string | null
    accessToken: string | null
    refreshToken: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type OAuthAccountCountAggregateOutputType = {
    id: number
    userId: number
    provider: number
    accountId: number
    accountEmail: number
    accessToken: number
    refreshToken: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type OAuthAccountMinAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    accountId?: true
    accountEmail?: true
    accessToken?: true
    refreshToken?: true
    expiresAt?: true
    createdAt?: true
  }

  export type OAuthAccountMaxAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    accountId?: true
    accountEmail?: true
    accessToken?: true
    refreshToken?: true
    expiresAt?: true
    createdAt?: true
  }

  export type OAuthAccountCountAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    accountId?: true
    accountEmail?: true
    accessToken?: true
    refreshToken?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type OAuthAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OAuthAccount to aggregate.
     */
    where?: OAuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthAccounts to fetch.
     */
    orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OAuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OAuthAccounts
    **/
    _count?: true | OAuthAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OAuthAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OAuthAccountMaxAggregateInputType
  }

  export type GetOAuthAccountAggregateType<T extends OAuthAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateOAuthAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOAuthAccount[P]>
      : GetScalarType<T[P], AggregateOAuthAccount[P]>
  }




  export type OAuthAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OAuthAccountWhereInput
    orderBy?: OAuthAccountOrderByWithAggregationInput | OAuthAccountOrderByWithAggregationInput[]
    by: OAuthAccountScalarFieldEnum[] | OAuthAccountScalarFieldEnum
    having?: OAuthAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OAuthAccountCountAggregateInputType | true
    _min?: OAuthAccountMinAggregateInputType
    _max?: OAuthAccountMaxAggregateInputType
  }

  export type OAuthAccountGroupByOutputType = {
    id: string
    userId: string
    provider: string
    accountId: string
    accountEmail: string | null
    accessToken: string | null
    refreshToken: string | null
    expiresAt: Date | null
    createdAt: Date
    _count: OAuthAccountCountAggregateOutputType | null
    _min: OAuthAccountMinAggregateOutputType | null
    _max: OAuthAccountMaxAggregateOutputType | null
  }

  type GetOAuthAccountGroupByPayload<T extends OAuthAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OAuthAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OAuthAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OAuthAccountGroupByOutputType[P]>
            : GetScalarType<T[P], OAuthAccountGroupByOutputType[P]>
        }
      >
    >


  export type OAuthAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    accountId?: boolean
    accountEmail?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oAuthAccount"]>

  export type OAuthAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    accountId?: boolean
    accountEmail?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oAuthAccount"]>

  export type OAuthAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    accountId?: boolean
    accountEmail?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oAuthAccount"]>

  export type OAuthAccountSelectScalar = {
    id?: boolean
    userId?: boolean
    provider?: boolean
    accountId?: boolean
    accountEmail?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type OAuthAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "provider" | "accountId" | "accountEmail" | "accessToken" | "refreshToken" | "expiresAt" | "createdAt", ExtArgs["result"]["oAuthAccount"]>
  export type OAuthAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OAuthAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OAuthAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OAuthAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OAuthAccount"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      provider: string
      accountId: string
      accountEmail: string | null
      accessToken: string | null
      refreshToken: string | null
      expiresAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["oAuthAccount"]>
    composites: {}
  }

  type OAuthAccountGetPayload<S extends boolean | null | undefined | OAuthAccountDefaultArgs> = $Result.GetResult<Prisma.$OAuthAccountPayload, S>

  type OAuthAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OAuthAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OAuthAccountCountAggregateInputType | true
    }

  export interface OAuthAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OAuthAccount'], meta: { name: 'OAuthAccount' } }
    /**
     * Find zero or one OAuthAccount that matches the filter.
     * @param {OAuthAccountFindUniqueArgs} args - Arguments to find a OAuthAccount
     * @example
     * // Get one OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OAuthAccountFindUniqueArgs>(args: SelectSubset<T, OAuthAccountFindUniqueArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OAuthAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OAuthAccountFindUniqueOrThrowArgs} args - Arguments to find a OAuthAccount
     * @example
     * // Get one OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OAuthAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, OAuthAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OAuthAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountFindFirstArgs} args - Arguments to find a OAuthAccount
     * @example
     * // Get one OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OAuthAccountFindFirstArgs>(args?: SelectSubset<T, OAuthAccountFindFirstArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OAuthAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountFindFirstOrThrowArgs} args - Arguments to find a OAuthAccount
     * @example
     * // Get one OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OAuthAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, OAuthAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OAuthAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OAuthAccounts
     * const oAuthAccounts = await prisma.oAuthAccount.findMany()
     * 
     * // Get first 10 OAuthAccounts
     * const oAuthAccounts = await prisma.oAuthAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oAuthAccountWithIdOnly = await prisma.oAuthAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OAuthAccountFindManyArgs>(args?: SelectSubset<T, OAuthAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OAuthAccount.
     * @param {OAuthAccountCreateArgs} args - Arguments to create a OAuthAccount.
     * @example
     * // Create one OAuthAccount
     * const OAuthAccount = await prisma.oAuthAccount.create({
     *   data: {
     *     // ... data to create a OAuthAccount
     *   }
     * })
     * 
     */
    create<T extends OAuthAccountCreateArgs>(args: SelectSubset<T, OAuthAccountCreateArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OAuthAccounts.
     * @param {OAuthAccountCreateManyArgs} args - Arguments to create many OAuthAccounts.
     * @example
     * // Create many OAuthAccounts
     * const oAuthAccount = await prisma.oAuthAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OAuthAccountCreateManyArgs>(args?: SelectSubset<T, OAuthAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OAuthAccounts and returns the data saved in the database.
     * @param {OAuthAccountCreateManyAndReturnArgs} args - Arguments to create many OAuthAccounts.
     * @example
     * // Create many OAuthAccounts
     * const oAuthAccount = await prisma.oAuthAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OAuthAccounts and only return the `id`
     * const oAuthAccountWithIdOnly = await prisma.oAuthAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OAuthAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, OAuthAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OAuthAccount.
     * @param {OAuthAccountDeleteArgs} args - Arguments to delete one OAuthAccount.
     * @example
     * // Delete one OAuthAccount
     * const OAuthAccount = await prisma.oAuthAccount.delete({
     *   where: {
     *     // ... filter to delete one OAuthAccount
     *   }
     * })
     * 
     */
    delete<T extends OAuthAccountDeleteArgs>(args: SelectSubset<T, OAuthAccountDeleteArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OAuthAccount.
     * @param {OAuthAccountUpdateArgs} args - Arguments to update one OAuthAccount.
     * @example
     * // Update one OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OAuthAccountUpdateArgs>(args: SelectSubset<T, OAuthAccountUpdateArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OAuthAccounts.
     * @param {OAuthAccountDeleteManyArgs} args - Arguments to filter OAuthAccounts to delete.
     * @example
     * // Delete a few OAuthAccounts
     * const { count } = await prisma.oAuthAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OAuthAccountDeleteManyArgs>(args?: SelectSubset<T, OAuthAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OAuthAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OAuthAccounts
     * const oAuthAccount = await prisma.oAuthAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OAuthAccountUpdateManyArgs>(args: SelectSubset<T, OAuthAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OAuthAccounts and returns the data updated in the database.
     * @param {OAuthAccountUpdateManyAndReturnArgs} args - Arguments to update many OAuthAccounts.
     * @example
     * // Update many OAuthAccounts
     * const oAuthAccount = await prisma.oAuthAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OAuthAccounts and only return the `id`
     * const oAuthAccountWithIdOnly = await prisma.oAuthAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OAuthAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, OAuthAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OAuthAccount.
     * @param {OAuthAccountUpsertArgs} args - Arguments to update or create a OAuthAccount.
     * @example
     * // Update or create a OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.upsert({
     *   create: {
     *     // ... data to create a OAuthAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OAuthAccount we want to update
     *   }
     * })
     */
    upsert<T extends OAuthAccountUpsertArgs>(args: SelectSubset<T, OAuthAccountUpsertArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OAuthAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountCountArgs} args - Arguments to filter OAuthAccounts to count.
     * @example
     * // Count the number of OAuthAccounts
     * const count = await prisma.oAuthAccount.count({
     *   where: {
     *     // ... the filter for the OAuthAccounts we want to count
     *   }
     * })
    **/
    count<T extends OAuthAccountCountArgs>(
      args?: Subset<T, OAuthAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OAuthAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OAuthAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OAuthAccountAggregateArgs>(args: Subset<T, OAuthAccountAggregateArgs>): Prisma.PrismaPromise<GetOAuthAccountAggregateType<T>>

    /**
     * Group by OAuthAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OAuthAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OAuthAccountGroupByArgs['orderBy'] }
        : { orderBy?: OAuthAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OAuthAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOAuthAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OAuthAccount model
   */
  readonly fields: OAuthAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OAuthAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OAuthAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OAuthAccount model
   */
  interface OAuthAccountFieldRefs {
    readonly id: FieldRef<"OAuthAccount", 'String'>
    readonly userId: FieldRef<"OAuthAccount", 'String'>
    readonly provider: FieldRef<"OAuthAccount", 'String'>
    readonly accountId: FieldRef<"OAuthAccount", 'String'>
    readonly accountEmail: FieldRef<"OAuthAccount", 'String'>
    readonly accessToken: FieldRef<"OAuthAccount", 'String'>
    readonly refreshToken: FieldRef<"OAuthAccount", 'String'>
    readonly expiresAt: FieldRef<"OAuthAccount", 'DateTime'>
    readonly createdAt: FieldRef<"OAuthAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OAuthAccount findUnique
   */
  export type OAuthAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthAccount to fetch.
     */
    where: OAuthAccountWhereUniqueInput
  }

  /**
   * OAuthAccount findUniqueOrThrow
   */
  export type OAuthAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthAccount to fetch.
     */
    where: OAuthAccountWhereUniqueInput
  }

  /**
   * OAuthAccount findFirst
   */
  export type OAuthAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthAccount to fetch.
     */
    where?: OAuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthAccounts to fetch.
     */
    orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OAuthAccounts.
     */
    cursor?: OAuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OAuthAccounts.
     */
    distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[]
  }

  /**
   * OAuthAccount findFirstOrThrow
   */
  export type OAuthAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthAccount to fetch.
     */
    where?: OAuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthAccounts to fetch.
     */
    orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OAuthAccounts.
     */
    cursor?: OAuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OAuthAccounts.
     */
    distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[]
  }

  /**
   * OAuthAccount findMany
   */
  export type OAuthAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthAccounts to fetch.
     */
    where?: OAuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthAccounts to fetch.
     */
    orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OAuthAccounts.
     */
    cursor?: OAuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthAccounts.
     */
    skip?: number
    distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[]
  }

  /**
   * OAuthAccount create
   */
  export type OAuthAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a OAuthAccount.
     */
    data: XOR<OAuthAccountCreateInput, OAuthAccountUncheckedCreateInput>
  }

  /**
   * OAuthAccount createMany
   */
  export type OAuthAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OAuthAccounts.
     */
    data: OAuthAccountCreateManyInput | OAuthAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OAuthAccount createManyAndReturn
   */
  export type OAuthAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * The data used to create many OAuthAccounts.
     */
    data: OAuthAccountCreateManyInput | OAuthAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OAuthAccount update
   */
  export type OAuthAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a OAuthAccount.
     */
    data: XOR<OAuthAccountUpdateInput, OAuthAccountUncheckedUpdateInput>
    /**
     * Choose, which OAuthAccount to update.
     */
    where: OAuthAccountWhereUniqueInput
  }

  /**
   * OAuthAccount updateMany
   */
  export type OAuthAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OAuthAccounts.
     */
    data: XOR<OAuthAccountUpdateManyMutationInput, OAuthAccountUncheckedUpdateManyInput>
    /**
     * Filter which OAuthAccounts to update
     */
    where?: OAuthAccountWhereInput
    /**
     * Limit how many OAuthAccounts to update.
     */
    limit?: number
  }

  /**
   * OAuthAccount updateManyAndReturn
   */
  export type OAuthAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * The data used to update OAuthAccounts.
     */
    data: XOR<OAuthAccountUpdateManyMutationInput, OAuthAccountUncheckedUpdateManyInput>
    /**
     * Filter which OAuthAccounts to update
     */
    where?: OAuthAccountWhereInput
    /**
     * Limit how many OAuthAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OAuthAccount upsert
   */
  export type OAuthAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the OAuthAccount to update in case it exists.
     */
    where: OAuthAccountWhereUniqueInput
    /**
     * In case the OAuthAccount found by the `where` argument doesn't exist, create a new OAuthAccount with this data.
     */
    create: XOR<OAuthAccountCreateInput, OAuthAccountUncheckedCreateInput>
    /**
     * In case the OAuthAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OAuthAccountUpdateInput, OAuthAccountUncheckedUpdateInput>
  }

  /**
   * OAuthAccount delete
   */
  export type OAuthAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter which OAuthAccount to delete.
     */
    where: OAuthAccountWhereUniqueInput
  }

  /**
   * OAuthAccount deleteMany
   */
  export type OAuthAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OAuthAccounts to delete
     */
    where?: OAuthAccountWhereInput
    /**
     * Limit how many OAuthAccounts to delete.
     */
    limit?: number
  }

  /**
   * OAuthAccount without action
   */
  export type OAuthAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
  }


  /**
   * Model Otp
   */

  export type AggregateOtp = {
    _count: OtpCountAggregateOutputType | null
    _avg: OtpAvgAggregateOutputType | null
    _sum: OtpSumAggregateOutputType | null
    _min: OtpMinAggregateOutputType | null
    _max: OtpMaxAggregateOutputType | null
  }

  export type OtpAvgAggregateOutputType = {
    attemptsCount: number | null
  }

  export type OtpSumAggregateOutputType = {
    attemptsCount: number | null
  }

  export type OtpMinAggregateOutputType = {
    id: string | null
    userId: string | null
    codeHash: string | null
    idempotencyKey: string | null
    purpose: string | null
    attemptsCount: number | null
    isUsed: boolean | null
    expiresAt: Date | null
    nextRequestAt: Date | null
    createdAt: Date | null
  }

  export type OtpMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    codeHash: string | null
    idempotencyKey: string | null
    purpose: string | null
    attemptsCount: number | null
    isUsed: boolean | null
    expiresAt: Date | null
    nextRequestAt: Date | null
    createdAt: Date | null
  }

  export type OtpCountAggregateOutputType = {
    id: number
    userId: number
    codeHash: number
    idempotencyKey: number
    purpose: number
    attemptsCount: number
    isUsed: number
    expiresAt: number
    nextRequestAt: number
    createdAt: number
    _all: number
  }


  export type OtpAvgAggregateInputType = {
    attemptsCount?: true
  }

  export type OtpSumAggregateInputType = {
    attemptsCount?: true
  }

  export type OtpMinAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    idempotencyKey?: true
    purpose?: true
    attemptsCount?: true
    isUsed?: true
    expiresAt?: true
    nextRequestAt?: true
    createdAt?: true
  }

  export type OtpMaxAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    idempotencyKey?: true
    purpose?: true
    attemptsCount?: true
    isUsed?: true
    expiresAt?: true
    nextRequestAt?: true
    createdAt?: true
  }

  export type OtpCountAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    idempotencyKey?: true
    purpose?: true
    attemptsCount?: true
    isUsed?: true
    expiresAt?: true
    nextRequestAt?: true
    createdAt?: true
    _all?: true
  }

  export type OtpAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Otp to aggregate.
     */
    where?: OtpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Otps to fetch.
     */
    orderBy?: OtpOrderByWithRelationInput | OtpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OtpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Otps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Otps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Otps
    **/
    _count?: true | OtpCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OtpAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OtpSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OtpMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OtpMaxAggregateInputType
  }

  export type GetOtpAggregateType<T extends OtpAggregateArgs> = {
        [P in keyof T & keyof AggregateOtp]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOtp[P]>
      : GetScalarType<T[P], AggregateOtp[P]>
  }




  export type OtpGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OtpWhereInput
    orderBy?: OtpOrderByWithAggregationInput | OtpOrderByWithAggregationInput[]
    by: OtpScalarFieldEnum[] | OtpScalarFieldEnum
    having?: OtpScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OtpCountAggregateInputType | true
    _avg?: OtpAvgAggregateInputType
    _sum?: OtpSumAggregateInputType
    _min?: OtpMinAggregateInputType
    _max?: OtpMaxAggregateInputType
  }

  export type OtpGroupByOutputType = {
    id: string
    userId: string
    codeHash: string
    idempotencyKey: string | null
    purpose: string
    attemptsCount: number
    isUsed: boolean
    expiresAt: Date
    nextRequestAt: Date | null
    createdAt: Date
    _count: OtpCountAggregateOutputType | null
    _avg: OtpAvgAggregateOutputType | null
    _sum: OtpSumAggregateOutputType | null
    _min: OtpMinAggregateOutputType | null
    _max: OtpMaxAggregateOutputType | null
  }

  type GetOtpGroupByPayload<T extends OtpGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OtpGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OtpGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OtpGroupByOutputType[P]>
            : GetScalarType<T[P], OtpGroupByOutputType[P]>
        }
      >
    >


  export type OtpSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    idempotencyKey?: boolean
    purpose?: boolean
    attemptsCount?: boolean
    isUsed?: boolean
    expiresAt?: boolean
    nextRequestAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["otp"]>

  export type OtpSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    idempotencyKey?: boolean
    purpose?: boolean
    attemptsCount?: boolean
    isUsed?: boolean
    expiresAt?: boolean
    nextRequestAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["otp"]>

  export type OtpSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    idempotencyKey?: boolean
    purpose?: boolean
    attemptsCount?: boolean
    isUsed?: boolean
    expiresAt?: boolean
    nextRequestAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["otp"]>

  export type OtpSelectScalar = {
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    idempotencyKey?: boolean
    purpose?: boolean
    attemptsCount?: boolean
    isUsed?: boolean
    expiresAt?: boolean
    nextRequestAt?: boolean
    createdAt?: boolean
  }

  export type OtpOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "codeHash" | "idempotencyKey" | "purpose" | "attemptsCount" | "isUsed" | "expiresAt" | "nextRequestAt" | "createdAt", ExtArgs["result"]["otp"]>
  export type OtpInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OtpIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OtpIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OtpPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Otp"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      codeHash: string
      idempotencyKey: string | null
      purpose: string
      attemptsCount: number
      isUsed: boolean
      expiresAt: Date
      nextRequestAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["otp"]>
    composites: {}
  }

  type OtpGetPayload<S extends boolean | null | undefined | OtpDefaultArgs> = $Result.GetResult<Prisma.$OtpPayload, S>

  type OtpCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OtpFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OtpCountAggregateInputType | true
    }

  export interface OtpDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Otp'], meta: { name: 'Otp' } }
    /**
     * Find zero or one Otp that matches the filter.
     * @param {OtpFindUniqueArgs} args - Arguments to find a Otp
     * @example
     * // Get one Otp
     * const otp = await prisma.otp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OtpFindUniqueArgs>(args: SelectSubset<T, OtpFindUniqueArgs<ExtArgs>>): Prisma__OtpClient<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Otp that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OtpFindUniqueOrThrowArgs} args - Arguments to find a Otp
     * @example
     * // Get one Otp
     * const otp = await prisma.otp.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OtpFindUniqueOrThrowArgs>(args: SelectSubset<T, OtpFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OtpClient<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Otp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpFindFirstArgs} args - Arguments to find a Otp
     * @example
     * // Get one Otp
     * const otp = await prisma.otp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OtpFindFirstArgs>(args?: SelectSubset<T, OtpFindFirstArgs<ExtArgs>>): Prisma__OtpClient<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Otp that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpFindFirstOrThrowArgs} args - Arguments to find a Otp
     * @example
     * // Get one Otp
     * const otp = await prisma.otp.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OtpFindFirstOrThrowArgs>(args?: SelectSubset<T, OtpFindFirstOrThrowArgs<ExtArgs>>): Prisma__OtpClient<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Otps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Otps
     * const otps = await prisma.otp.findMany()
     * 
     * // Get first 10 Otps
     * const otps = await prisma.otp.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const otpWithIdOnly = await prisma.otp.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OtpFindManyArgs>(args?: SelectSubset<T, OtpFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Otp.
     * @param {OtpCreateArgs} args - Arguments to create a Otp.
     * @example
     * // Create one Otp
     * const Otp = await prisma.otp.create({
     *   data: {
     *     // ... data to create a Otp
     *   }
     * })
     * 
     */
    create<T extends OtpCreateArgs>(args: SelectSubset<T, OtpCreateArgs<ExtArgs>>): Prisma__OtpClient<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Otps.
     * @param {OtpCreateManyArgs} args - Arguments to create many Otps.
     * @example
     * // Create many Otps
     * const otp = await prisma.otp.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OtpCreateManyArgs>(args?: SelectSubset<T, OtpCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Otps and returns the data saved in the database.
     * @param {OtpCreateManyAndReturnArgs} args - Arguments to create many Otps.
     * @example
     * // Create many Otps
     * const otp = await prisma.otp.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Otps and only return the `id`
     * const otpWithIdOnly = await prisma.otp.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OtpCreateManyAndReturnArgs>(args?: SelectSubset<T, OtpCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Otp.
     * @param {OtpDeleteArgs} args - Arguments to delete one Otp.
     * @example
     * // Delete one Otp
     * const Otp = await prisma.otp.delete({
     *   where: {
     *     // ... filter to delete one Otp
     *   }
     * })
     * 
     */
    delete<T extends OtpDeleteArgs>(args: SelectSubset<T, OtpDeleteArgs<ExtArgs>>): Prisma__OtpClient<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Otp.
     * @param {OtpUpdateArgs} args - Arguments to update one Otp.
     * @example
     * // Update one Otp
     * const otp = await prisma.otp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OtpUpdateArgs>(args: SelectSubset<T, OtpUpdateArgs<ExtArgs>>): Prisma__OtpClient<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Otps.
     * @param {OtpDeleteManyArgs} args - Arguments to filter Otps to delete.
     * @example
     * // Delete a few Otps
     * const { count } = await prisma.otp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OtpDeleteManyArgs>(args?: SelectSubset<T, OtpDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Otps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Otps
     * const otp = await prisma.otp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OtpUpdateManyArgs>(args: SelectSubset<T, OtpUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Otps and returns the data updated in the database.
     * @param {OtpUpdateManyAndReturnArgs} args - Arguments to update many Otps.
     * @example
     * // Update many Otps
     * const otp = await prisma.otp.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Otps and only return the `id`
     * const otpWithIdOnly = await prisma.otp.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OtpUpdateManyAndReturnArgs>(args: SelectSubset<T, OtpUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Otp.
     * @param {OtpUpsertArgs} args - Arguments to update or create a Otp.
     * @example
     * // Update or create a Otp
     * const otp = await prisma.otp.upsert({
     *   create: {
     *     // ... data to create a Otp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Otp we want to update
     *   }
     * })
     */
    upsert<T extends OtpUpsertArgs>(args: SelectSubset<T, OtpUpsertArgs<ExtArgs>>): Prisma__OtpClient<$Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Otps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpCountArgs} args - Arguments to filter Otps to count.
     * @example
     * // Count the number of Otps
     * const count = await prisma.otp.count({
     *   where: {
     *     // ... the filter for the Otps we want to count
     *   }
     * })
    **/
    count<T extends OtpCountArgs>(
      args?: Subset<T, OtpCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OtpCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Otp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OtpAggregateArgs>(args: Subset<T, OtpAggregateArgs>): Prisma.PrismaPromise<GetOtpAggregateType<T>>

    /**
     * Group by Otp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OtpGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OtpGroupByArgs['orderBy'] }
        : { orderBy?: OtpGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OtpGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOtpGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Otp model
   */
  readonly fields: OtpFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Otp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OtpClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Otp model
   */
  interface OtpFieldRefs {
    readonly id: FieldRef<"Otp", 'String'>
    readonly userId: FieldRef<"Otp", 'String'>
    readonly codeHash: FieldRef<"Otp", 'String'>
    readonly idempotencyKey: FieldRef<"Otp", 'String'>
    readonly purpose: FieldRef<"Otp", 'String'>
    readonly attemptsCount: FieldRef<"Otp", 'Int'>
    readonly isUsed: FieldRef<"Otp", 'Boolean'>
    readonly expiresAt: FieldRef<"Otp", 'DateTime'>
    readonly nextRequestAt: FieldRef<"Otp", 'DateTime'>
    readonly createdAt: FieldRef<"Otp", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Otp findUnique
   */
  export type OtpFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
    /**
     * Filter, which Otp to fetch.
     */
    where: OtpWhereUniqueInput
  }

  /**
   * Otp findUniqueOrThrow
   */
  export type OtpFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
    /**
     * Filter, which Otp to fetch.
     */
    where: OtpWhereUniqueInput
  }

  /**
   * Otp findFirst
   */
  export type OtpFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
    /**
     * Filter, which Otp to fetch.
     */
    where?: OtpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Otps to fetch.
     */
    orderBy?: OtpOrderByWithRelationInput | OtpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Otps.
     */
    cursor?: OtpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Otps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Otps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Otps.
     */
    distinct?: OtpScalarFieldEnum | OtpScalarFieldEnum[]
  }

  /**
   * Otp findFirstOrThrow
   */
  export type OtpFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
    /**
     * Filter, which Otp to fetch.
     */
    where?: OtpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Otps to fetch.
     */
    orderBy?: OtpOrderByWithRelationInput | OtpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Otps.
     */
    cursor?: OtpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Otps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Otps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Otps.
     */
    distinct?: OtpScalarFieldEnum | OtpScalarFieldEnum[]
  }

  /**
   * Otp findMany
   */
  export type OtpFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
    /**
     * Filter, which Otps to fetch.
     */
    where?: OtpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Otps to fetch.
     */
    orderBy?: OtpOrderByWithRelationInput | OtpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Otps.
     */
    cursor?: OtpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Otps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Otps.
     */
    skip?: number
    distinct?: OtpScalarFieldEnum | OtpScalarFieldEnum[]
  }

  /**
   * Otp create
   */
  export type OtpCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
    /**
     * The data needed to create a Otp.
     */
    data: XOR<OtpCreateInput, OtpUncheckedCreateInput>
  }

  /**
   * Otp createMany
   */
  export type OtpCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Otps.
     */
    data: OtpCreateManyInput | OtpCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Otp createManyAndReturn
   */
  export type OtpCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * The data used to create many Otps.
     */
    data: OtpCreateManyInput | OtpCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Otp update
   */
  export type OtpUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
    /**
     * The data needed to update a Otp.
     */
    data: XOR<OtpUpdateInput, OtpUncheckedUpdateInput>
    /**
     * Choose, which Otp to update.
     */
    where: OtpWhereUniqueInput
  }

  /**
   * Otp updateMany
   */
  export type OtpUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Otps.
     */
    data: XOR<OtpUpdateManyMutationInput, OtpUncheckedUpdateManyInput>
    /**
     * Filter which Otps to update
     */
    where?: OtpWhereInput
    /**
     * Limit how many Otps to update.
     */
    limit?: number
  }

  /**
   * Otp updateManyAndReturn
   */
  export type OtpUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * The data used to update Otps.
     */
    data: XOR<OtpUpdateManyMutationInput, OtpUncheckedUpdateManyInput>
    /**
     * Filter which Otps to update
     */
    where?: OtpWhereInput
    /**
     * Limit how many Otps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Otp upsert
   */
  export type OtpUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
    /**
     * The filter to search for the Otp to update in case it exists.
     */
    where: OtpWhereUniqueInput
    /**
     * In case the Otp found by the `where` argument doesn't exist, create a new Otp with this data.
     */
    create: XOR<OtpCreateInput, OtpUncheckedCreateInput>
    /**
     * In case the Otp was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OtpUpdateInput, OtpUncheckedUpdateInput>
  }

  /**
   * Otp delete
   */
  export type OtpDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
    /**
     * Filter which Otp to delete.
     */
    where: OtpWhereUniqueInput
  }

  /**
   * Otp deleteMany
   */
  export type OtpDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Otps to delete
     */
    where?: OtpWhereInput
    /**
     * Limit how many Otps to delete.
     */
    limit?: number
  }

  /**
   * Otp without action
   */
  export type OtpDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Otp
     */
    select?: OtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Otp
     */
    omit?: OtpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    name: string | null
    slug: string | null
    repoExportEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    name: string | null
    slug: string | null
    repoExportEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    ownerId: number
    name: number
    slug: number
    repoExportEnabled: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    ownerId?: true
    name?: true
    slug?: true
    repoExportEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    ownerId?: true
    name?: true
    slug?: true
    repoExportEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    ownerId?: true
    name?: true
    slug?: true
    repoExportEnabled?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    ownerId: string
    name: string
    slug: string
    repoExportEnabled: boolean
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    name?: boolean
    slug?: boolean
    repoExportEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    deployJobs?: boolean | Project$deployJobsArgs<ExtArgs>
    wizardBuilds?: boolean | Project$wizardBuildsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    name?: boolean
    slug?: boolean
    repoExportEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    name?: boolean
    slug?: boolean
    repoExportEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    ownerId?: boolean
    name?: boolean
    slug?: boolean
    repoExportEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ownerId" | "name" | "slug" | "repoExportEnabled" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    deployJobs?: boolean | Project$deployJobsArgs<ExtArgs>
    wizardBuilds?: boolean | Project$wizardBuildsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      deployJobs: Prisma.$DeployJobPayload<ExtArgs>[]
      wizardBuilds: Prisma.$WizardBuildPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      name: string
      slug: string
      repoExportEnabled: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    deployJobs<T extends Project$deployJobsArgs<ExtArgs> = {}>(args?: Subset<T, Project$deployJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    wizardBuilds<T extends Project$wizardBuildsArgs<ExtArgs> = {}>(args?: Subset<T, Project$wizardBuildsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly ownerId: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly slug: FieldRef<"Project", 'String'>
    readonly repoExportEnabled: FieldRef<"Project", 'Boolean'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.deployJobs
   */
  export type Project$deployJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    where?: DeployJobWhereInput
    orderBy?: DeployJobOrderByWithRelationInput | DeployJobOrderByWithRelationInput[]
    cursor?: DeployJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeployJobScalarFieldEnum | DeployJobScalarFieldEnum[]
  }

  /**
   * Project.wizardBuilds
   */
  export type Project$wizardBuildsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    where?: WizardBuildWhereInput
    orderBy?: WizardBuildOrderByWithRelationInput | WizardBuildOrderByWithRelationInput[]
    cursor?: WizardBuildWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WizardBuildScalarFieldEnum | WizardBuildScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Environment
   */

  export type AggregateEnvironment = {
    _count: EnvironmentCountAggregateOutputType | null
    _min: EnvironmentMinAggregateOutputType | null
    _max: EnvironmentMaxAggregateOutputType | null
  }

  export type EnvironmentMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    projectId: string | null
    name: string | null
    displayName: string | null
    tierPolicy: string | null
    executionMode: string | null
    region: string | null
    visibility: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EnvironmentMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    projectId: string | null
    name: string | null
    displayName: string | null
    tierPolicy: string | null
    executionMode: string | null
    region: string | null
    visibility: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EnvironmentCountAggregateOutputType = {
    id: number
    ownerId: number
    projectId: number
    name: number
    displayName: number
    tierPolicy: number
    executionMode: number
    region: number
    visibility: number
    config: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EnvironmentMinAggregateInputType = {
    id?: true
    ownerId?: true
    projectId?: true
    name?: true
    displayName?: true
    tierPolicy?: true
    executionMode?: true
    region?: true
    visibility?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EnvironmentMaxAggregateInputType = {
    id?: true
    ownerId?: true
    projectId?: true
    name?: true
    displayName?: true
    tierPolicy?: true
    executionMode?: true
    region?: true
    visibility?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EnvironmentCountAggregateInputType = {
    id?: true
    ownerId?: true
    projectId?: true
    name?: true
    displayName?: true
    tierPolicy?: true
    executionMode?: true
    region?: true
    visibility?: true
    config?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EnvironmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Environment to aggregate.
     */
    where?: EnvironmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Environments to fetch.
     */
    orderBy?: EnvironmentOrderByWithRelationInput | EnvironmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnvironmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Environments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Environments
    **/
    _count?: true | EnvironmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnvironmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnvironmentMaxAggregateInputType
  }

  export type GetEnvironmentAggregateType<T extends EnvironmentAggregateArgs> = {
        [P in keyof T & keyof AggregateEnvironment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnvironment[P]>
      : GetScalarType<T[P], AggregateEnvironment[P]>
  }




  export type EnvironmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnvironmentWhereInput
    orderBy?: EnvironmentOrderByWithAggregationInput | EnvironmentOrderByWithAggregationInput[]
    by: EnvironmentScalarFieldEnum[] | EnvironmentScalarFieldEnum
    having?: EnvironmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnvironmentCountAggregateInputType | true
    _min?: EnvironmentMinAggregateInputType
    _max?: EnvironmentMaxAggregateInputType
  }

  export type EnvironmentGroupByOutputType = {
    id: string
    ownerId: string
    projectId: string | null
    name: string
    displayName: string
    tierPolicy: string
    executionMode: string
    region: string
    visibility: string
    config: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: EnvironmentCountAggregateOutputType | null
    _min: EnvironmentMinAggregateOutputType | null
    _max: EnvironmentMaxAggregateOutputType | null
  }

  type GetEnvironmentGroupByPayload<T extends EnvironmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnvironmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnvironmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnvironmentGroupByOutputType[P]>
            : GetScalarType<T[P], EnvironmentGroupByOutputType[P]>
        }
      >
    >


  export type EnvironmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    projectId?: boolean
    name?: boolean
    displayName?: boolean
    tierPolicy?: boolean
    executionMode?: boolean
    region?: boolean
    visibility?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    deployJobs?: boolean | Environment$deployJobsArgs<ExtArgs>
    _count?: boolean | EnvironmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["environment"]>

  export type EnvironmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    projectId?: boolean
    name?: boolean
    displayName?: boolean
    tierPolicy?: boolean
    executionMode?: boolean
    region?: boolean
    visibility?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["environment"]>

  export type EnvironmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    projectId?: boolean
    name?: boolean
    displayName?: boolean
    tierPolicy?: boolean
    executionMode?: boolean
    region?: boolean
    visibility?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["environment"]>

  export type EnvironmentSelectScalar = {
    id?: boolean
    ownerId?: boolean
    projectId?: boolean
    name?: boolean
    displayName?: boolean
    tierPolicy?: boolean
    executionMode?: boolean
    region?: boolean
    visibility?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EnvironmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ownerId" | "projectId" | "name" | "displayName" | "tierPolicy" | "executionMode" | "region" | "visibility" | "config" | "createdAt" | "updatedAt", ExtArgs["result"]["environment"]>
  export type EnvironmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    deployJobs?: boolean | Environment$deployJobsArgs<ExtArgs>
    _count?: boolean | EnvironmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EnvironmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EnvironmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EnvironmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Environment"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      deployJobs: Prisma.$DeployJobPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      projectId: string | null
      name: string
      displayName: string
      tierPolicy: string
      executionMode: string
      region: string
      visibility: string
      config: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["environment"]>
    composites: {}
  }

  type EnvironmentGetPayload<S extends boolean | null | undefined | EnvironmentDefaultArgs> = $Result.GetResult<Prisma.$EnvironmentPayload, S>

  type EnvironmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EnvironmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EnvironmentCountAggregateInputType | true
    }

  export interface EnvironmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Environment'], meta: { name: 'Environment' } }
    /**
     * Find zero or one Environment that matches the filter.
     * @param {EnvironmentFindUniqueArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnvironmentFindUniqueArgs>(args: SelectSubset<T, EnvironmentFindUniqueArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Environment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EnvironmentFindUniqueOrThrowArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnvironmentFindUniqueOrThrowArgs>(args: SelectSubset<T, EnvironmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Environment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentFindFirstArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnvironmentFindFirstArgs>(args?: SelectSubset<T, EnvironmentFindFirstArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Environment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentFindFirstOrThrowArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnvironmentFindFirstOrThrowArgs>(args?: SelectSubset<T, EnvironmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Environments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Environments
     * const environments = await prisma.environment.findMany()
     * 
     * // Get first 10 Environments
     * const environments = await prisma.environment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const environmentWithIdOnly = await prisma.environment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EnvironmentFindManyArgs>(args?: SelectSubset<T, EnvironmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Environment.
     * @param {EnvironmentCreateArgs} args - Arguments to create a Environment.
     * @example
     * // Create one Environment
     * const Environment = await prisma.environment.create({
     *   data: {
     *     // ... data to create a Environment
     *   }
     * })
     * 
     */
    create<T extends EnvironmentCreateArgs>(args: SelectSubset<T, EnvironmentCreateArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Environments.
     * @param {EnvironmentCreateManyArgs} args - Arguments to create many Environments.
     * @example
     * // Create many Environments
     * const environment = await prisma.environment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnvironmentCreateManyArgs>(args?: SelectSubset<T, EnvironmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Environments and returns the data saved in the database.
     * @param {EnvironmentCreateManyAndReturnArgs} args - Arguments to create many Environments.
     * @example
     * // Create many Environments
     * const environment = await prisma.environment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Environments and only return the `id`
     * const environmentWithIdOnly = await prisma.environment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EnvironmentCreateManyAndReturnArgs>(args?: SelectSubset<T, EnvironmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Environment.
     * @param {EnvironmentDeleteArgs} args - Arguments to delete one Environment.
     * @example
     * // Delete one Environment
     * const Environment = await prisma.environment.delete({
     *   where: {
     *     // ... filter to delete one Environment
     *   }
     * })
     * 
     */
    delete<T extends EnvironmentDeleteArgs>(args: SelectSubset<T, EnvironmentDeleteArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Environment.
     * @param {EnvironmentUpdateArgs} args - Arguments to update one Environment.
     * @example
     * // Update one Environment
     * const environment = await prisma.environment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnvironmentUpdateArgs>(args: SelectSubset<T, EnvironmentUpdateArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Environments.
     * @param {EnvironmentDeleteManyArgs} args - Arguments to filter Environments to delete.
     * @example
     * // Delete a few Environments
     * const { count } = await prisma.environment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnvironmentDeleteManyArgs>(args?: SelectSubset<T, EnvironmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Environments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Environments
     * const environment = await prisma.environment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnvironmentUpdateManyArgs>(args: SelectSubset<T, EnvironmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Environments and returns the data updated in the database.
     * @param {EnvironmentUpdateManyAndReturnArgs} args - Arguments to update many Environments.
     * @example
     * // Update many Environments
     * const environment = await prisma.environment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Environments and only return the `id`
     * const environmentWithIdOnly = await prisma.environment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EnvironmentUpdateManyAndReturnArgs>(args: SelectSubset<T, EnvironmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Environment.
     * @param {EnvironmentUpsertArgs} args - Arguments to update or create a Environment.
     * @example
     * // Update or create a Environment
     * const environment = await prisma.environment.upsert({
     *   create: {
     *     // ... data to create a Environment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Environment we want to update
     *   }
     * })
     */
    upsert<T extends EnvironmentUpsertArgs>(args: SelectSubset<T, EnvironmentUpsertArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Environments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentCountArgs} args - Arguments to filter Environments to count.
     * @example
     * // Count the number of Environments
     * const count = await prisma.environment.count({
     *   where: {
     *     // ... the filter for the Environments we want to count
     *   }
     * })
    **/
    count<T extends EnvironmentCountArgs>(
      args?: Subset<T, EnvironmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnvironmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Environment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EnvironmentAggregateArgs>(args: Subset<T, EnvironmentAggregateArgs>): Prisma.PrismaPromise<GetEnvironmentAggregateType<T>>

    /**
     * Group by Environment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EnvironmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnvironmentGroupByArgs['orderBy'] }
        : { orderBy?: EnvironmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EnvironmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnvironmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Environment model
   */
  readonly fields: EnvironmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Environment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnvironmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    deployJobs<T extends Environment$deployJobsArgs<ExtArgs> = {}>(args?: Subset<T, Environment$deployJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Environment model
   */
  interface EnvironmentFieldRefs {
    readonly id: FieldRef<"Environment", 'String'>
    readonly ownerId: FieldRef<"Environment", 'String'>
    readonly projectId: FieldRef<"Environment", 'String'>
    readonly name: FieldRef<"Environment", 'String'>
    readonly displayName: FieldRef<"Environment", 'String'>
    readonly tierPolicy: FieldRef<"Environment", 'String'>
    readonly executionMode: FieldRef<"Environment", 'String'>
    readonly region: FieldRef<"Environment", 'String'>
    readonly visibility: FieldRef<"Environment", 'String'>
    readonly config: FieldRef<"Environment", 'Json'>
    readonly createdAt: FieldRef<"Environment", 'DateTime'>
    readonly updatedAt: FieldRef<"Environment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Environment findUnique
   */
  export type EnvironmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter, which Environment to fetch.
     */
    where: EnvironmentWhereUniqueInput
  }

  /**
   * Environment findUniqueOrThrow
   */
  export type EnvironmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter, which Environment to fetch.
     */
    where: EnvironmentWhereUniqueInput
  }

  /**
   * Environment findFirst
   */
  export type EnvironmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter, which Environment to fetch.
     */
    where?: EnvironmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Environments to fetch.
     */
    orderBy?: EnvironmentOrderByWithRelationInput | EnvironmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Environments.
     */
    cursor?: EnvironmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Environments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Environments.
     */
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[]
  }

  /**
   * Environment findFirstOrThrow
   */
  export type EnvironmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter, which Environment to fetch.
     */
    where?: EnvironmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Environments to fetch.
     */
    orderBy?: EnvironmentOrderByWithRelationInput | EnvironmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Environments.
     */
    cursor?: EnvironmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Environments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Environments.
     */
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[]
  }

  /**
   * Environment findMany
   */
  export type EnvironmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter, which Environments to fetch.
     */
    where?: EnvironmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Environments to fetch.
     */
    orderBy?: EnvironmentOrderByWithRelationInput | EnvironmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Environments.
     */
    cursor?: EnvironmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Environments.
     */
    skip?: number
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[]
  }

  /**
   * Environment create
   */
  export type EnvironmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Environment.
     */
    data: XOR<EnvironmentCreateInput, EnvironmentUncheckedCreateInput>
  }

  /**
   * Environment createMany
   */
  export type EnvironmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Environments.
     */
    data: EnvironmentCreateManyInput | EnvironmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Environment createManyAndReturn
   */
  export type EnvironmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * The data used to create many Environments.
     */
    data: EnvironmentCreateManyInput | EnvironmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Environment update
   */
  export type EnvironmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Environment.
     */
    data: XOR<EnvironmentUpdateInput, EnvironmentUncheckedUpdateInput>
    /**
     * Choose, which Environment to update.
     */
    where: EnvironmentWhereUniqueInput
  }

  /**
   * Environment updateMany
   */
  export type EnvironmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Environments.
     */
    data: XOR<EnvironmentUpdateManyMutationInput, EnvironmentUncheckedUpdateManyInput>
    /**
     * Filter which Environments to update
     */
    where?: EnvironmentWhereInput
    /**
     * Limit how many Environments to update.
     */
    limit?: number
  }

  /**
   * Environment updateManyAndReturn
   */
  export type EnvironmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * The data used to update Environments.
     */
    data: XOR<EnvironmentUpdateManyMutationInput, EnvironmentUncheckedUpdateManyInput>
    /**
     * Filter which Environments to update
     */
    where?: EnvironmentWhereInput
    /**
     * Limit how many Environments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Environment upsert
   */
  export type EnvironmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Environment to update in case it exists.
     */
    where: EnvironmentWhereUniqueInput
    /**
     * In case the Environment found by the `where` argument doesn't exist, create a new Environment with this data.
     */
    create: XOR<EnvironmentCreateInput, EnvironmentUncheckedCreateInput>
    /**
     * In case the Environment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnvironmentUpdateInput, EnvironmentUncheckedUpdateInput>
  }

  /**
   * Environment delete
   */
  export type EnvironmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter which Environment to delete.
     */
    where: EnvironmentWhereUniqueInput
  }

  /**
   * Environment deleteMany
   */
  export type EnvironmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Environments to delete
     */
    where?: EnvironmentWhereInput
    /**
     * Limit how many Environments to delete.
     */
    limit?: number
  }

  /**
   * Environment.deployJobs
   */
  export type Environment$deployJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    where?: DeployJobWhereInput
    orderBy?: DeployJobOrderByWithRelationInput | DeployJobOrderByWithRelationInput[]
    cursor?: DeployJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeployJobScalarFieldEnum | DeployJobScalarFieldEnum[]
  }

  /**
   * Environment without action
   */
  export type EnvironmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
  }


  /**
   * Model DeployJob
   */

  export type AggregateDeployJob = {
    _count: DeployJobCountAggregateOutputType | null
    _min: DeployJobMinAggregateOutputType | null
    _max: DeployJobMaxAggregateOutputType | null
  }

  export type DeployJobMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    environmentId: string | null
    triggeredByUserId: string | null
    status: $Enums.DeployJobStatus | null
    currentStep: string | null
    executionModeSnapshot: string | null
    createdAt: Date | null
    startedAt: Date | null
    finishedAt: Date | null
  }

  export type DeployJobMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    environmentId: string | null
    triggeredByUserId: string | null
    status: $Enums.DeployJobStatus | null
    currentStep: string | null
    executionModeSnapshot: string | null
    createdAt: Date | null
    startedAt: Date | null
    finishedAt: Date | null
  }

  export type DeployJobCountAggregateOutputType = {
    id: number
    projectId: number
    environmentId: number
    triggeredByUserId: number
    status: number
    currentStep: number
    steps: number
    source: number
    executionModeSnapshot: number
    createdAt: number
    startedAt: number
    finishedAt: number
    _all: number
  }


  export type DeployJobMinAggregateInputType = {
    id?: true
    projectId?: true
    environmentId?: true
    triggeredByUserId?: true
    status?: true
    currentStep?: true
    executionModeSnapshot?: true
    createdAt?: true
    startedAt?: true
    finishedAt?: true
  }

  export type DeployJobMaxAggregateInputType = {
    id?: true
    projectId?: true
    environmentId?: true
    triggeredByUserId?: true
    status?: true
    currentStep?: true
    executionModeSnapshot?: true
    createdAt?: true
    startedAt?: true
    finishedAt?: true
  }

  export type DeployJobCountAggregateInputType = {
    id?: true
    projectId?: true
    environmentId?: true
    triggeredByUserId?: true
    status?: true
    currentStep?: true
    steps?: true
    source?: true
    executionModeSnapshot?: true
    createdAt?: true
    startedAt?: true
    finishedAt?: true
    _all?: true
  }

  export type DeployJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeployJob to aggregate.
     */
    where?: DeployJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeployJobs to fetch.
     */
    orderBy?: DeployJobOrderByWithRelationInput | DeployJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeployJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeployJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeployJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeployJobs
    **/
    _count?: true | DeployJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeployJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeployJobMaxAggregateInputType
  }

  export type GetDeployJobAggregateType<T extends DeployJobAggregateArgs> = {
        [P in keyof T & keyof AggregateDeployJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeployJob[P]>
      : GetScalarType<T[P], AggregateDeployJob[P]>
  }




  export type DeployJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeployJobWhereInput
    orderBy?: DeployJobOrderByWithAggregationInput | DeployJobOrderByWithAggregationInput[]
    by: DeployJobScalarFieldEnum[] | DeployJobScalarFieldEnum
    having?: DeployJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeployJobCountAggregateInputType | true
    _min?: DeployJobMinAggregateInputType
    _max?: DeployJobMaxAggregateInputType
  }

  export type DeployJobGroupByOutputType = {
    id: string
    projectId: string
    environmentId: string
    triggeredByUserId: string | null
    status: $Enums.DeployJobStatus
    currentStep: string | null
    steps: JsonValue
    source: JsonValue
    executionModeSnapshot: string
    createdAt: Date
    startedAt: Date | null
    finishedAt: Date | null
    _count: DeployJobCountAggregateOutputType | null
    _min: DeployJobMinAggregateOutputType | null
    _max: DeployJobMaxAggregateOutputType | null
  }

  type GetDeployJobGroupByPayload<T extends DeployJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeployJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeployJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeployJobGroupByOutputType[P]>
            : GetScalarType<T[P], DeployJobGroupByOutputType[P]>
        }
      >
    >


  export type DeployJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    environmentId?: boolean
    triggeredByUserId?: boolean
    status?: boolean
    currentStep?: boolean
    steps?: boolean
    source?: boolean
    executionModeSnapshot?: boolean
    createdAt?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
    triggeredBy?: boolean | DeployJob$triggeredByArgs<ExtArgs>
  }, ExtArgs["result"]["deployJob"]>

  export type DeployJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    environmentId?: boolean
    triggeredByUserId?: boolean
    status?: boolean
    currentStep?: boolean
    steps?: boolean
    source?: boolean
    executionModeSnapshot?: boolean
    createdAt?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
    triggeredBy?: boolean | DeployJob$triggeredByArgs<ExtArgs>
  }, ExtArgs["result"]["deployJob"]>

  export type DeployJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    environmentId?: boolean
    triggeredByUserId?: boolean
    status?: boolean
    currentStep?: boolean
    steps?: boolean
    source?: boolean
    executionModeSnapshot?: boolean
    createdAt?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
    triggeredBy?: boolean | DeployJob$triggeredByArgs<ExtArgs>
  }, ExtArgs["result"]["deployJob"]>

  export type DeployJobSelectScalar = {
    id?: boolean
    projectId?: boolean
    environmentId?: boolean
    triggeredByUserId?: boolean
    status?: boolean
    currentStep?: boolean
    steps?: boolean
    source?: boolean
    executionModeSnapshot?: boolean
    createdAt?: boolean
    startedAt?: boolean
    finishedAt?: boolean
  }

  export type DeployJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "environmentId" | "triggeredByUserId" | "status" | "currentStep" | "steps" | "source" | "executionModeSnapshot" | "createdAt" | "startedAt" | "finishedAt", ExtArgs["result"]["deployJob"]>
  export type DeployJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
    triggeredBy?: boolean | DeployJob$triggeredByArgs<ExtArgs>
  }
  export type DeployJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
    triggeredBy?: boolean | DeployJob$triggeredByArgs<ExtArgs>
  }
  export type DeployJobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
    triggeredBy?: boolean | DeployJob$triggeredByArgs<ExtArgs>
  }

  export type $DeployJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeployJob"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      environment: Prisma.$EnvironmentPayload<ExtArgs>
      triggeredBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      environmentId: string
      triggeredByUserId: string | null
      status: $Enums.DeployJobStatus
      currentStep: string | null
      steps: Prisma.JsonValue
      source: Prisma.JsonValue
      executionModeSnapshot: string
      createdAt: Date
      startedAt: Date | null
      finishedAt: Date | null
    }, ExtArgs["result"]["deployJob"]>
    composites: {}
  }

  type DeployJobGetPayload<S extends boolean | null | undefined | DeployJobDefaultArgs> = $Result.GetResult<Prisma.$DeployJobPayload, S>

  type DeployJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeployJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeployJobCountAggregateInputType | true
    }

  export interface DeployJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeployJob'], meta: { name: 'DeployJob' } }
    /**
     * Find zero or one DeployJob that matches the filter.
     * @param {DeployJobFindUniqueArgs} args - Arguments to find a DeployJob
     * @example
     * // Get one DeployJob
     * const deployJob = await prisma.deployJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeployJobFindUniqueArgs>(args: SelectSubset<T, DeployJobFindUniqueArgs<ExtArgs>>): Prisma__DeployJobClient<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DeployJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeployJobFindUniqueOrThrowArgs} args - Arguments to find a DeployJob
     * @example
     * // Get one DeployJob
     * const deployJob = await prisma.deployJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeployJobFindUniqueOrThrowArgs>(args: SelectSubset<T, DeployJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeployJobClient<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeployJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployJobFindFirstArgs} args - Arguments to find a DeployJob
     * @example
     * // Get one DeployJob
     * const deployJob = await prisma.deployJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeployJobFindFirstArgs>(args?: SelectSubset<T, DeployJobFindFirstArgs<ExtArgs>>): Prisma__DeployJobClient<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeployJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployJobFindFirstOrThrowArgs} args - Arguments to find a DeployJob
     * @example
     * // Get one DeployJob
     * const deployJob = await prisma.deployJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeployJobFindFirstOrThrowArgs>(args?: SelectSubset<T, DeployJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeployJobClient<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DeployJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeployJobs
     * const deployJobs = await prisma.deployJob.findMany()
     * 
     * // Get first 10 DeployJobs
     * const deployJobs = await prisma.deployJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deployJobWithIdOnly = await prisma.deployJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeployJobFindManyArgs>(args?: SelectSubset<T, DeployJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DeployJob.
     * @param {DeployJobCreateArgs} args - Arguments to create a DeployJob.
     * @example
     * // Create one DeployJob
     * const DeployJob = await prisma.deployJob.create({
     *   data: {
     *     // ... data to create a DeployJob
     *   }
     * })
     * 
     */
    create<T extends DeployJobCreateArgs>(args: SelectSubset<T, DeployJobCreateArgs<ExtArgs>>): Prisma__DeployJobClient<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DeployJobs.
     * @param {DeployJobCreateManyArgs} args - Arguments to create many DeployJobs.
     * @example
     * // Create many DeployJobs
     * const deployJob = await prisma.deployJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeployJobCreateManyArgs>(args?: SelectSubset<T, DeployJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DeployJobs and returns the data saved in the database.
     * @param {DeployJobCreateManyAndReturnArgs} args - Arguments to create many DeployJobs.
     * @example
     * // Create many DeployJobs
     * const deployJob = await prisma.deployJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DeployJobs and only return the `id`
     * const deployJobWithIdOnly = await prisma.deployJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeployJobCreateManyAndReturnArgs>(args?: SelectSubset<T, DeployJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DeployJob.
     * @param {DeployJobDeleteArgs} args - Arguments to delete one DeployJob.
     * @example
     * // Delete one DeployJob
     * const DeployJob = await prisma.deployJob.delete({
     *   where: {
     *     // ... filter to delete one DeployJob
     *   }
     * })
     * 
     */
    delete<T extends DeployJobDeleteArgs>(args: SelectSubset<T, DeployJobDeleteArgs<ExtArgs>>): Prisma__DeployJobClient<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DeployJob.
     * @param {DeployJobUpdateArgs} args - Arguments to update one DeployJob.
     * @example
     * // Update one DeployJob
     * const deployJob = await prisma.deployJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeployJobUpdateArgs>(args: SelectSubset<T, DeployJobUpdateArgs<ExtArgs>>): Prisma__DeployJobClient<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DeployJobs.
     * @param {DeployJobDeleteManyArgs} args - Arguments to filter DeployJobs to delete.
     * @example
     * // Delete a few DeployJobs
     * const { count } = await prisma.deployJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeployJobDeleteManyArgs>(args?: SelectSubset<T, DeployJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeployJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeployJobs
     * const deployJob = await prisma.deployJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeployJobUpdateManyArgs>(args: SelectSubset<T, DeployJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeployJobs and returns the data updated in the database.
     * @param {DeployJobUpdateManyAndReturnArgs} args - Arguments to update many DeployJobs.
     * @example
     * // Update many DeployJobs
     * const deployJob = await prisma.deployJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DeployJobs and only return the `id`
     * const deployJobWithIdOnly = await prisma.deployJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeployJobUpdateManyAndReturnArgs>(args: SelectSubset<T, DeployJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DeployJob.
     * @param {DeployJobUpsertArgs} args - Arguments to update or create a DeployJob.
     * @example
     * // Update or create a DeployJob
     * const deployJob = await prisma.deployJob.upsert({
     *   create: {
     *     // ... data to create a DeployJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeployJob we want to update
     *   }
     * })
     */
    upsert<T extends DeployJobUpsertArgs>(args: SelectSubset<T, DeployJobUpsertArgs<ExtArgs>>): Prisma__DeployJobClient<$Result.GetResult<Prisma.$DeployJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DeployJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployJobCountArgs} args - Arguments to filter DeployJobs to count.
     * @example
     * // Count the number of DeployJobs
     * const count = await prisma.deployJob.count({
     *   where: {
     *     // ... the filter for the DeployJobs we want to count
     *   }
     * })
    **/
    count<T extends DeployJobCountArgs>(
      args?: Subset<T, DeployJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeployJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeployJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeployJobAggregateArgs>(args: Subset<T, DeployJobAggregateArgs>): Prisma.PrismaPromise<GetDeployJobAggregateType<T>>

    /**
     * Group by DeployJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeployJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeployJobGroupByArgs['orderBy'] }
        : { orderBy?: DeployJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeployJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeployJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeployJob model
   */
  readonly fields: DeployJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeployJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeployJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    environment<T extends EnvironmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnvironmentDefaultArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    triggeredBy<T extends DeployJob$triggeredByArgs<ExtArgs> = {}>(args?: Subset<T, DeployJob$triggeredByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DeployJob model
   */
  interface DeployJobFieldRefs {
    readonly id: FieldRef<"DeployJob", 'String'>
    readonly projectId: FieldRef<"DeployJob", 'String'>
    readonly environmentId: FieldRef<"DeployJob", 'String'>
    readonly triggeredByUserId: FieldRef<"DeployJob", 'String'>
    readonly status: FieldRef<"DeployJob", 'DeployJobStatus'>
    readonly currentStep: FieldRef<"DeployJob", 'String'>
    readonly steps: FieldRef<"DeployJob", 'Json'>
    readonly source: FieldRef<"DeployJob", 'Json'>
    readonly executionModeSnapshot: FieldRef<"DeployJob", 'String'>
    readonly createdAt: FieldRef<"DeployJob", 'DateTime'>
    readonly startedAt: FieldRef<"DeployJob", 'DateTime'>
    readonly finishedAt: FieldRef<"DeployJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DeployJob findUnique
   */
  export type DeployJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    /**
     * Filter, which DeployJob to fetch.
     */
    where: DeployJobWhereUniqueInput
  }

  /**
   * DeployJob findUniqueOrThrow
   */
  export type DeployJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    /**
     * Filter, which DeployJob to fetch.
     */
    where: DeployJobWhereUniqueInput
  }

  /**
   * DeployJob findFirst
   */
  export type DeployJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    /**
     * Filter, which DeployJob to fetch.
     */
    where?: DeployJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeployJobs to fetch.
     */
    orderBy?: DeployJobOrderByWithRelationInput | DeployJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeployJobs.
     */
    cursor?: DeployJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeployJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeployJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeployJobs.
     */
    distinct?: DeployJobScalarFieldEnum | DeployJobScalarFieldEnum[]
  }

  /**
   * DeployJob findFirstOrThrow
   */
  export type DeployJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    /**
     * Filter, which DeployJob to fetch.
     */
    where?: DeployJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeployJobs to fetch.
     */
    orderBy?: DeployJobOrderByWithRelationInput | DeployJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeployJobs.
     */
    cursor?: DeployJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeployJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeployJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeployJobs.
     */
    distinct?: DeployJobScalarFieldEnum | DeployJobScalarFieldEnum[]
  }

  /**
   * DeployJob findMany
   */
  export type DeployJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    /**
     * Filter, which DeployJobs to fetch.
     */
    where?: DeployJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeployJobs to fetch.
     */
    orderBy?: DeployJobOrderByWithRelationInput | DeployJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeployJobs.
     */
    cursor?: DeployJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeployJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeployJobs.
     */
    skip?: number
    distinct?: DeployJobScalarFieldEnum | DeployJobScalarFieldEnum[]
  }

  /**
   * DeployJob create
   */
  export type DeployJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    /**
     * The data needed to create a DeployJob.
     */
    data: XOR<DeployJobCreateInput, DeployJobUncheckedCreateInput>
  }

  /**
   * DeployJob createMany
   */
  export type DeployJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeployJobs.
     */
    data: DeployJobCreateManyInput | DeployJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DeployJob createManyAndReturn
   */
  export type DeployJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * The data used to create many DeployJobs.
     */
    data: DeployJobCreateManyInput | DeployJobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeployJob update
   */
  export type DeployJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    /**
     * The data needed to update a DeployJob.
     */
    data: XOR<DeployJobUpdateInput, DeployJobUncheckedUpdateInput>
    /**
     * Choose, which DeployJob to update.
     */
    where: DeployJobWhereUniqueInput
  }

  /**
   * DeployJob updateMany
   */
  export type DeployJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeployJobs.
     */
    data: XOR<DeployJobUpdateManyMutationInput, DeployJobUncheckedUpdateManyInput>
    /**
     * Filter which DeployJobs to update
     */
    where?: DeployJobWhereInput
    /**
     * Limit how many DeployJobs to update.
     */
    limit?: number
  }

  /**
   * DeployJob updateManyAndReturn
   */
  export type DeployJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * The data used to update DeployJobs.
     */
    data: XOR<DeployJobUpdateManyMutationInput, DeployJobUncheckedUpdateManyInput>
    /**
     * Filter which DeployJobs to update
     */
    where?: DeployJobWhereInput
    /**
     * Limit how many DeployJobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeployJob upsert
   */
  export type DeployJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    /**
     * The filter to search for the DeployJob to update in case it exists.
     */
    where: DeployJobWhereUniqueInput
    /**
     * In case the DeployJob found by the `where` argument doesn't exist, create a new DeployJob with this data.
     */
    create: XOR<DeployJobCreateInput, DeployJobUncheckedCreateInput>
    /**
     * In case the DeployJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeployJobUpdateInput, DeployJobUncheckedUpdateInput>
  }

  /**
   * DeployJob delete
   */
  export type DeployJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
    /**
     * Filter which DeployJob to delete.
     */
    where: DeployJobWhereUniqueInput
  }

  /**
   * DeployJob deleteMany
   */
  export type DeployJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeployJobs to delete
     */
    where?: DeployJobWhereInput
    /**
     * Limit how many DeployJobs to delete.
     */
    limit?: number
  }

  /**
   * DeployJob.triggeredBy
   */
  export type DeployJob$triggeredByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * DeployJob without action
   */
  export type DeployJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployJob
     */
    select?: DeployJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployJob
     */
    omit?: DeployJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployJobInclude<ExtArgs> | null
  }


  /**
   * Model WizardBuild
   */

  export type AggregateWizardBuild = {
    _count: WizardBuildCountAggregateOutputType | null
    _min: WizardBuildMinAggregateOutputType | null
    _max: WizardBuildMaxAggregateOutputType | null
  }

  export type WizardBuildMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    projectId: string | null
    version: string | null
    createdAt: Date | null
  }

  export type WizardBuildMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    projectId: string | null
    version: string | null
    createdAt: Date | null
  }

  export type WizardBuildCountAggregateOutputType = {
    id: number
    ownerId: number
    projectId: number
    version: number
    inputs: number
    manifest: number
    lock: number
    createdAt: number
    _all: number
  }


  export type WizardBuildMinAggregateInputType = {
    id?: true
    ownerId?: true
    projectId?: true
    version?: true
    createdAt?: true
  }

  export type WizardBuildMaxAggregateInputType = {
    id?: true
    ownerId?: true
    projectId?: true
    version?: true
    createdAt?: true
  }

  export type WizardBuildCountAggregateInputType = {
    id?: true
    ownerId?: true
    projectId?: true
    version?: true
    inputs?: true
    manifest?: true
    lock?: true
    createdAt?: true
    _all?: true
  }

  export type WizardBuildAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WizardBuild to aggregate.
     */
    where?: WizardBuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WizardBuilds to fetch.
     */
    orderBy?: WizardBuildOrderByWithRelationInput | WizardBuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WizardBuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WizardBuilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WizardBuilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WizardBuilds
    **/
    _count?: true | WizardBuildCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WizardBuildMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WizardBuildMaxAggregateInputType
  }

  export type GetWizardBuildAggregateType<T extends WizardBuildAggregateArgs> = {
        [P in keyof T & keyof AggregateWizardBuild]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWizardBuild[P]>
      : GetScalarType<T[P], AggregateWizardBuild[P]>
  }




  export type WizardBuildGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WizardBuildWhereInput
    orderBy?: WizardBuildOrderByWithAggregationInput | WizardBuildOrderByWithAggregationInput[]
    by: WizardBuildScalarFieldEnum[] | WizardBuildScalarFieldEnum
    having?: WizardBuildScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WizardBuildCountAggregateInputType | true
    _min?: WizardBuildMinAggregateInputType
    _max?: WizardBuildMaxAggregateInputType
  }

  export type WizardBuildGroupByOutputType = {
    id: string
    ownerId: string
    projectId: string
    version: string
    inputs: JsonValue
    manifest: JsonValue
    lock: JsonValue | null
    createdAt: Date
    _count: WizardBuildCountAggregateOutputType | null
    _min: WizardBuildMinAggregateOutputType | null
    _max: WizardBuildMaxAggregateOutputType | null
  }

  type GetWizardBuildGroupByPayload<T extends WizardBuildGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WizardBuildGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WizardBuildGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WizardBuildGroupByOutputType[P]>
            : GetScalarType<T[P], WizardBuildGroupByOutputType[P]>
        }
      >
    >


  export type WizardBuildSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    projectId?: boolean
    version?: boolean
    inputs?: boolean
    manifest?: boolean
    lock?: boolean
    createdAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wizardBuild"]>

  export type WizardBuildSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    projectId?: boolean
    version?: boolean
    inputs?: boolean
    manifest?: boolean
    lock?: boolean
    createdAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wizardBuild"]>

  export type WizardBuildSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    projectId?: boolean
    version?: boolean
    inputs?: boolean
    manifest?: boolean
    lock?: boolean
    createdAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wizardBuild"]>

  export type WizardBuildSelectScalar = {
    id?: boolean
    ownerId?: boolean
    projectId?: boolean
    version?: boolean
    inputs?: boolean
    manifest?: boolean
    lock?: boolean
    createdAt?: boolean
  }

  export type WizardBuildOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ownerId" | "projectId" | "version" | "inputs" | "manifest" | "lock" | "createdAt", ExtArgs["result"]["wizardBuild"]>
  export type WizardBuildInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type WizardBuildIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type WizardBuildIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $WizardBuildPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WizardBuild"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      projectId: string
      version: string
      inputs: Prisma.JsonValue
      manifest: Prisma.JsonValue
      lock: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["wizardBuild"]>
    composites: {}
  }

  type WizardBuildGetPayload<S extends boolean | null | undefined | WizardBuildDefaultArgs> = $Result.GetResult<Prisma.$WizardBuildPayload, S>

  type WizardBuildCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WizardBuildFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WizardBuildCountAggregateInputType | true
    }

  export interface WizardBuildDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WizardBuild'], meta: { name: 'WizardBuild' } }
    /**
     * Find zero or one WizardBuild that matches the filter.
     * @param {WizardBuildFindUniqueArgs} args - Arguments to find a WizardBuild
     * @example
     * // Get one WizardBuild
     * const wizardBuild = await prisma.wizardBuild.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WizardBuildFindUniqueArgs>(args: SelectSubset<T, WizardBuildFindUniqueArgs<ExtArgs>>): Prisma__WizardBuildClient<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WizardBuild that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WizardBuildFindUniqueOrThrowArgs} args - Arguments to find a WizardBuild
     * @example
     * // Get one WizardBuild
     * const wizardBuild = await prisma.wizardBuild.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WizardBuildFindUniqueOrThrowArgs>(args: SelectSubset<T, WizardBuildFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WizardBuildClient<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WizardBuild that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WizardBuildFindFirstArgs} args - Arguments to find a WizardBuild
     * @example
     * // Get one WizardBuild
     * const wizardBuild = await prisma.wizardBuild.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WizardBuildFindFirstArgs>(args?: SelectSubset<T, WizardBuildFindFirstArgs<ExtArgs>>): Prisma__WizardBuildClient<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WizardBuild that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WizardBuildFindFirstOrThrowArgs} args - Arguments to find a WizardBuild
     * @example
     * // Get one WizardBuild
     * const wizardBuild = await prisma.wizardBuild.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WizardBuildFindFirstOrThrowArgs>(args?: SelectSubset<T, WizardBuildFindFirstOrThrowArgs<ExtArgs>>): Prisma__WizardBuildClient<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WizardBuilds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WizardBuildFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WizardBuilds
     * const wizardBuilds = await prisma.wizardBuild.findMany()
     * 
     * // Get first 10 WizardBuilds
     * const wizardBuilds = await prisma.wizardBuild.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const wizardBuildWithIdOnly = await prisma.wizardBuild.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WizardBuildFindManyArgs>(args?: SelectSubset<T, WizardBuildFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WizardBuild.
     * @param {WizardBuildCreateArgs} args - Arguments to create a WizardBuild.
     * @example
     * // Create one WizardBuild
     * const WizardBuild = await prisma.wizardBuild.create({
     *   data: {
     *     // ... data to create a WizardBuild
     *   }
     * })
     * 
     */
    create<T extends WizardBuildCreateArgs>(args: SelectSubset<T, WizardBuildCreateArgs<ExtArgs>>): Prisma__WizardBuildClient<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WizardBuilds.
     * @param {WizardBuildCreateManyArgs} args - Arguments to create many WizardBuilds.
     * @example
     * // Create many WizardBuilds
     * const wizardBuild = await prisma.wizardBuild.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WizardBuildCreateManyArgs>(args?: SelectSubset<T, WizardBuildCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WizardBuilds and returns the data saved in the database.
     * @param {WizardBuildCreateManyAndReturnArgs} args - Arguments to create many WizardBuilds.
     * @example
     * // Create many WizardBuilds
     * const wizardBuild = await prisma.wizardBuild.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WizardBuilds and only return the `id`
     * const wizardBuildWithIdOnly = await prisma.wizardBuild.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WizardBuildCreateManyAndReturnArgs>(args?: SelectSubset<T, WizardBuildCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WizardBuild.
     * @param {WizardBuildDeleteArgs} args - Arguments to delete one WizardBuild.
     * @example
     * // Delete one WizardBuild
     * const WizardBuild = await prisma.wizardBuild.delete({
     *   where: {
     *     // ... filter to delete one WizardBuild
     *   }
     * })
     * 
     */
    delete<T extends WizardBuildDeleteArgs>(args: SelectSubset<T, WizardBuildDeleteArgs<ExtArgs>>): Prisma__WizardBuildClient<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WizardBuild.
     * @param {WizardBuildUpdateArgs} args - Arguments to update one WizardBuild.
     * @example
     * // Update one WizardBuild
     * const wizardBuild = await prisma.wizardBuild.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WizardBuildUpdateArgs>(args: SelectSubset<T, WizardBuildUpdateArgs<ExtArgs>>): Prisma__WizardBuildClient<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WizardBuilds.
     * @param {WizardBuildDeleteManyArgs} args - Arguments to filter WizardBuilds to delete.
     * @example
     * // Delete a few WizardBuilds
     * const { count } = await prisma.wizardBuild.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WizardBuildDeleteManyArgs>(args?: SelectSubset<T, WizardBuildDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WizardBuilds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WizardBuildUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WizardBuilds
     * const wizardBuild = await prisma.wizardBuild.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WizardBuildUpdateManyArgs>(args: SelectSubset<T, WizardBuildUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WizardBuilds and returns the data updated in the database.
     * @param {WizardBuildUpdateManyAndReturnArgs} args - Arguments to update many WizardBuilds.
     * @example
     * // Update many WizardBuilds
     * const wizardBuild = await prisma.wizardBuild.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WizardBuilds and only return the `id`
     * const wizardBuildWithIdOnly = await prisma.wizardBuild.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WizardBuildUpdateManyAndReturnArgs>(args: SelectSubset<T, WizardBuildUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WizardBuild.
     * @param {WizardBuildUpsertArgs} args - Arguments to update or create a WizardBuild.
     * @example
     * // Update or create a WizardBuild
     * const wizardBuild = await prisma.wizardBuild.upsert({
     *   create: {
     *     // ... data to create a WizardBuild
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WizardBuild we want to update
     *   }
     * })
     */
    upsert<T extends WizardBuildUpsertArgs>(args: SelectSubset<T, WizardBuildUpsertArgs<ExtArgs>>): Prisma__WizardBuildClient<$Result.GetResult<Prisma.$WizardBuildPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WizardBuilds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WizardBuildCountArgs} args - Arguments to filter WizardBuilds to count.
     * @example
     * // Count the number of WizardBuilds
     * const count = await prisma.wizardBuild.count({
     *   where: {
     *     // ... the filter for the WizardBuilds we want to count
     *   }
     * })
    **/
    count<T extends WizardBuildCountArgs>(
      args?: Subset<T, WizardBuildCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WizardBuildCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WizardBuild.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WizardBuildAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WizardBuildAggregateArgs>(args: Subset<T, WizardBuildAggregateArgs>): Prisma.PrismaPromise<GetWizardBuildAggregateType<T>>

    /**
     * Group by WizardBuild.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WizardBuildGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WizardBuildGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WizardBuildGroupByArgs['orderBy'] }
        : { orderBy?: WizardBuildGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WizardBuildGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWizardBuildGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WizardBuild model
   */
  readonly fields: WizardBuildFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WizardBuild.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WizardBuildClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WizardBuild model
   */
  interface WizardBuildFieldRefs {
    readonly id: FieldRef<"WizardBuild", 'String'>
    readonly ownerId: FieldRef<"WizardBuild", 'String'>
    readonly projectId: FieldRef<"WizardBuild", 'String'>
    readonly version: FieldRef<"WizardBuild", 'String'>
    readonly inputs: FieldRef<"WizardBuild", 'Json'>
    readonly manifest: FieldRef<"WizardBuild", 'Json'>
    readonly lock: FieldRef<"WizardBuild", 'Json'>
    readonly createdAt: FieldRef<"WizardBuild", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WizardBuild findUnique
   */
  export type WizardBuildFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    /**
     * Filter, which WizardBuild to fetch.
     */
    where: WizardBuildWhereUniqueInput
  }

  /**
   * WizardBuild findUniqueOrThrow
   */
  export type WizardBuildFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    /**
     * Filter, which WizardBuild to fetch.
     */
    where: WizardBuildWhereUniqueInput
  }

  /**
   * WizardBuild findFirst
   */
  export type WizardBuildFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    /**
     * Filter, which WizardBuild to fetch.
     */
    where?: WizardBuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WizardBuilds to fetch.
     */
    orderBy?: WizardBuildOrderByWithRelationInput | WizardBuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WizardBuilds.
     */
    cursor?: WizardBuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WizardBuilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WizardBuilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WizardBuilds.
     */
    distinct?: WizardBuildScalarFieldEnum | WizardBuildScalarFieldEnum[]
  }

  /**
   * WizardBuild findFirstOrThrow
   */
  export type WizardBuildFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    /**
     * Filter, which WizardBuild to fetch.
     */
    where?: WizardBuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WizardBuilds to fetch.
     */
    orderBy?: WizardBuildOrderByWithRelationInput | WizardBuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WizardBuilds.
     */
    cursor?: WizardBuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WizardBuilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WizardBuilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WizardBuilds.
     */
    distinct?: WizardBuildScalarFieldEnum | WizardBuildScalarFieldEnum[]
  }

  /**
   * WizardBuild findMany
   */
  export type WizardBuildFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    /**
     * Filter, which WizardBuilds to fetch.
     */
    where?: WizardBuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WizardBuilds to fetch.
     */
    orderBy?: WizardBuildOrderByWithRelationInput | WizardBuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WizardBuilds.
     */
    cursor?: WizardBuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WizardBuilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WizardBuilds.
     */
    skip?: number
    distinct?: WizardBuildScalarFieldEnum | WizardBuildScalarFieldEnum[]
  }

  /**
   * WizardBuild create
   */
  export type WizardBuildCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    /**
     * The data needed to create a WizardBuild.
     */
    data: XOR<WizardBuildCreateInput, WizardBuildUncheckedCreateInput>
  }

  /**
   * WizardBuild createMany
   */
  export type WizardBuildCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WizardBuilds.
     */
    data: WizardBuildCreateManyInput | WizardBuildCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WizardBuild createManyAndReturn
   */
  export type WizardBuildCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * The data used to create many WizardBuilds.
     */
    data: WizardBuildCreateManyInput | WizardBuildCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WizardBuild update
   */
  export type WizardBuildUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    /**
     * The data needed to update a WizardBuild.
     */
    data: XOR<WizardBuildUpdateInput, WizardBuildUncheckedUpdateInput>
    /**
     * Choose, which WizardBuild to update.
     */
    where: WizardBuildWhereUniqueInput
  }

  /**
   * WizardBuild updateMany
   */
  export type WizardBuildUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WizardBuilds.
     */
    data: XOR<WizardBuildUpdateManyMutationInput, WizardBuildUncheckedUpdateManyInput>
    /**
     * Filter which WizardBuilds to update
     */
    where?: WizardBuildWhereInput
    /**
     * Limit how many WizardBuilds to update.
     */
    limit?: number
  }

  /**
   * WizardBuild updateManyAndReturn
   */
  export type WizardBuildUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * The data used to update WizardBuilds.
     */
    data: XOR<WizardBuildUpdateManyMutationInput, WizardBuildUncheckedUpdateManyInput>
    /**
     * Filter which WizardBuilds to update
     */
    where?: WizardBuildWhereInput
    /**
     * Limit how many WizardBuilds to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WizardBuild upsert
   */
  export type WizardBuildUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    /**
     * The filter to search for the WizardBuild to update in case it exists.
     */
    where: WizardBuildWhereUniqueInput
    /**
     * In case the WizardBuild found by the `where` argument doesn't exist, create a new WizardBuild with this data.
     */
    create: XOR<WizardBuildCreateInput, WizardBuildUncheckedCreateInput>
    /**
     * In case the WizardBuild was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WizardBuildUpdateInput, WizardBuildUncheckedUpdateInput>
  }

  /**
   * WizardBuild delete
   */
  export type WizardBuildDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
    /**
     * Filter which WizardBuild to delete.
     */
    where: WizardBuildWhereUniqueInput
  }

  /**
   * WizardBuild deleteMany
   */
  export type WizardBuildDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WizardBuilds to delete
     */
    where?: WizardBuildWhereInput
    /**
     * Limit how many WizardBuilds to delete.
     */
    limit?: number
  }

  /**
   * WizardBuild without action
   */
  export type WizardBuildDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WizardBuild
     */
    select?: WizardBuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WizardBuild
     */
    omit?: WizardBuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WizardBuildInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    planId: string | null
    status: string | null
    stripeSubscriptionId: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    planId: string | null
    status: string | null
    stripeSubscriptionId: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    planId: number
    status: number
    stripeSubscriptionId: number
    currentPeriodStart: number
    currentPeriodEnd: number
    cancelAtPeriodEnd: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    planId?: true
    status?: true
    stripeSubscriptionId?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    planId?: true
    status?: true
    stripeSubscriptionId?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    planId?: true
    status?: true
    stripeSubscriptionId?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    userId: string
    planId: string | null
    status: string
    stripeSubscriptionId: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
    createdAt: Date
    updatedAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    planId?: boolean
    status?: boolean
    stripeSubscriptionId?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    planId?: boolean
    status?: boolean
    stripeSubscriptionId?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    planId?: boolean
    status?: boolean
    stripeSubscriptionId?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    planId?: boolean
    status?: boolean
    stripeSubscriptionId?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "planId" | "status" | "stripeSubscriptionId" | "currentPeriodStart" | "currentPeriodEnd" | "cancelAtPeriodEnd" | "createdAt" | "updatedAt", ExtArgs["result"]["subscription"]>
  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      planId: string | null
      status: string
      stripeSubscriptionId: string
      currentPeriodStart: Date
      currentPeriodEnd: Date
      cancelAtPeriodEnd: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions and returns the data updated in the database.
     * @param {SubscriptionUpdateManyAndReturnArgs} args - Arguments to update many Subscriptions.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly userId: FieldRef<"Subscription", 'String'>
    readonly planId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly stripeSubscriptionId: FieldRef<"Subscription", 'String'>
    readonly currentPeriodStart: FieldRef<"Subscription", 'DateTime'>
    readonly currentPeriodEnd: FieldRef<"Subscription", 'DateTime'>
    readonly cancelAtPeriodEnd: FieldRef<"Subscription", 'Boolean'>
    readonly createdAt: FieldRef<"Subscription", 'DateTime'>
    readonly updatedAt: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
  }

  /**
   * Subscription updateManyAndReturn
   */
  export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to delete.
     */
    limit?: number
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model UserPaymentMethod
   */

  export type AggregateUserPaymentMethod = {
    _count: UserPaymentMethodCountAggregateOutputType | null
    _avg: UserPaymentMethodAvgAggregateOutputType | null
    _sum: UserPaymentMethodSumAggregateOutputType | null
    _min: UserPaymentMethodMinAggregateOutputType | null
    _max: UserPaymentMethodMaxAggregateOutputType | null
  }

  export type UserPaymentMethodAvgAggregateOutputType = {
    expiryMonth: number | null
    expiryYear: number | null
  }

  export type UserPaymentMethodSumAggregateOutputType = {
    expiryMonth: number | null
    expiryYear: number | null
  }

  export type UserPaymentMethodMinAggregateOutputType = {
    id: string | null
    userId: string | null
    stripePaymentMethodId: string | null
    type: string | null
    last4: string | null
    brand: string | null
    expiryMonth: number | null
    expiryYear: number | null
    isDefault: boolean | null
    createdAt: Date | null
  }

  export type UserPaymentMethodMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    stripePaymentMethodId: string | null
    type: string | null
    last4: string | null
    brand: string | null
    expiryMonth: number | null
    expiryYear: number | null
    isDefault: boolean | null
    createdAt: Date | null
  }

  export type UserPaymentMethodCountAggregateOutputType = {
    id: number
    userId: number
    stripePaymentMethodId: number
    type: number
    last4: number
    brand: number
    expiryMonth: number
    expiryYear: number
    isDefault: number
    createdAt: number
    _all: number
  }


  export type UserPaymentMethodAvgAggregateInputType = {
    expiryMonth?: true
    expiryYear?: true
  }

  export type UserPaymentMethodSumAggregateInputType = {
    expiryMonth?: true
    expiryYear?: true
  }

  export type UserPaymentMethodMinAggregateInputType = {
    id?: true
    userId?: true
    stripePaymentMethodId?: true
    type?: true
    last4?: true
    brand?: true
    expiryMonth?: true
    expiryYear?: true
    isDefault?: true
    createdAt?: true
  }

  export type UserPaymentMethodMaxAggregateInputType = {
    id?: true
    userId?: true
    stripePaymentMethodId?: true
    type?: true
    last4?: true
    brand?: true
    expiryMonth?: true
    expiryYear?: true
    isDefault?: true
    createdAt?: true
  }

  export type UserPaymentMethodCountAggregateInputType = {
    id?: true
    userId?: true
    stripePaymentMethodId?: true
    type?: true
    last4?: true
    brand?: true
    expiryMonth?: true
    expiryYear?: true
    isDefault?: true
    createdAt?: true
    _all?: true
  }

  export type UserPaymentMethodAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPaymentMethod to aggregate.
     */
    where?: UserPaymentMethodWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPaymentMethods to fetch.
     */
    orderBy?: UserPaymentMethodOrderByWithRelationInput | UserPaymentMethodOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserPaymentMethodWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPaymentMethods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPaymentMethods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserPaymentMethods
    **/
    _count?: true | UserPaymentMethodCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserPaymentMethodAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserPaymentMethodSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserPaymentMethodMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserPaymentMethodMaxAggregateInputType
  }

  export type GetUserPaymentMethodAggregateType<T extends UserPaymentMethodAggregateArgs> = {
        [P in keyof T & keyof AggregateUserPaymentMethod]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserPaymentMethod[P]>
      : GetScalarType<T[P], AggregateUserPaymentMethod[P]>
  }




  export type UserPaymentMethodGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPaymentMethodWhereInput
    orderBy?: UserPaymentMethodOrderByWithAggregationInput | UserPaymentMethodOrderByWithAggregationInput[]
    by: UserPaymentMethodScalarFieldEnum[] | UserPaymentMethodScalarFieldEnum
    having?: UserPaymentMethodScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserPaymentMethodCountAggregateInputType | true
    _avg?: UserPaymentMethodAvgAggregateInputType
    _sum?: UserPaymentMethodSumAggregateInputType
    _min?: UserPaymentMethodMinAggregateInputType
    _max?: UserPaymentMethodMaxAggregateInputType
  }

  export type UserPaymentMethodGroupByOutputType = {
    id: string
    userId: string
    stripePaymentMethodId: string
    type: string
    last4: string
    brand: string | null
    expiryMonth: number | null
    expiryYear: number | null
    isDefault: boolean
    createdAt: Date
    _count: UserPaymentMethodCountAggregateOutputType | null
    _avg: UserPaymentMethodAvgAggregateOutputType | null
    _sum: UserPaymentMethodSumAggregateOutputType | null
    _min: UserPaymentMethodMinAggregateOutputType | null
    _max: UserPaymentMethodMaxAggregateOutputType | null
  }

  type GetUserPaymentMethodGroupByPayload<T extends UserPaymentMethodGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserPaymentMethodGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserPaymentMethodGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserPaymentMethodGroupByOutputType[P]>
            : GetScalarType<T[P], UserPaymentMethodGroupByOutputType[P]>
        }
      >
    >


  export type UserPaymentMethodSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripePaymentMethodId?: boolean
    type?: boolean
    last4?: boolean
    brand?: boolean
    expiryMonth?: boolean
    expiryYear?: boolean
    isDefault?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPaymentMethod"]>

  export type UserPaymentMethodSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripePaymentMethodId?: boolean
    type?: boolean
    last4?: boolean
    brand?: boolean
    expiryMonth?: boolean
    expiryYear?: boolean
    isDefault?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPaymentMethod"]>

  export type UserPaymentMethodSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripePaymentMethodId?: boolean
    type?: boolean
    last4?: boolean
    brand?: boolean
    expiryMonth?: boolean
    expiryYear?: boolean
    isDefault?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPaymentMethod"]>

  export type UserPaymentMethodSelectScalar = {
    id?: boolean
    userId?: boolean
    stripePaymentMethodId?: boolean
    type?: boolean
    last4?: boolean
    brand?: boolean
    expiryMonth?: boolean
    expiryYear?: boolean
    isDefault?: boolean
    createdAt?: boolean
  }

  export type UserPaymentMethodOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "stripePaymentMethodId" | "type" | "last4" | "brand" | "expiryMonth" | "expiryYear" | "isDefault" | "createdAt", ExtArgs["result"]["userPaymentMethod"]>
  export type UserPaymentMethodInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserPaymentMethodIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserPaymentMethodIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserPaymentMethodPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserPaymentMethod"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      stripePaymentMethodId: string
      type: string
      last4: string
      brand: string | null
      expiryMonth: number | null
      expiryYear: number | null
      isDefault: boolean
      createdAt: Date
    }, ExtArgs["result"]["userPaymentMethod"]>
    composites: {}
  }

  type UserPaymentMethodGetPayload<S extends boolean | null | undefined | UserPaymentMethodDefaultArgs> = $Result.GetResult<Prisma.$UserPaymentMethodPayload, S>

  type UserPaymentMethodCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserPaymentMethodFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserPaymentMethodCountAggregateInputType | true
    }

  export interface UserPaymentMethodDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserPaymentMethod'], meta: { name: 'UserPaymentMethod' } }
    /**
     * Find zero or one UserPaymentMethod that matches the filter.
     * @param {UserPaymentMethodFindUniqueArgs} args - Arguments to find a UserPaymentMethod
     * @example
     * // Get one UserPaymentMethod
     * const userPaymentMethod = await prisma.userPaymentMethod.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserPaymentMethodFindUniqueArgs>(args: SelectSubset<T, UserPaymentMethodFindUniqueArgs<ExtArgs>>): Prisma__UserPaymentMethodClient<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserPaymentMethod that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserPaymentMethodFindUniqueOrThrowArgs} args - Arguments to find a UserPaymentMethod
     * @example
     * // Get one UserPaymentMethod
     * const userPaymentMethod = await prisma.userPaymentMethod.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserPaymentMethodFindUniqueOrThrowArgs>(args: SelectSubset<T, UserPaymentMethodFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserPaymentMethodClient<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPaymentMethod that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaymentMethodFindFirstArgs} args - Arguments to find a UserPaymentMethod
     * @example
     * // Get one UserPaymentMethod
     * const userPaymentMethod = await prisma.userPaymentMethod.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserPaymentMethodFindFirstArgs>(args?: SelectSubset<T, UserPaymentMethodFindFirstArgs<ExtArgs>>): Prisma__UserPaymentMethodClient<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPaymentMethod that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaymentMethodFindFirstOrThrowArgs} args - Arguments to find a UserPaymentMethod
     * @example
     * // Get one UserPaymentMethod
     * const userPaymentMethod = await prisma.userPaymentMethod.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserPaymentMethodFindFirstOrThrowArgs>(args?: SelectSubset<T, UserPaymentMethodFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserPaymentMethodClient<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserPaymentMethods that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaymentMethodFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPaymentMethods
     * const userPaymentMethods = await prisma.userPaymentMethod.findMany()
     * 
     * // Get first 10 UserPaymentMethods
     * const userPaymentMethods = await prisma.userPaymentMethod.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userPaymentMethodWithIdOnly = await prisma.userPaymentMethod.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserPaymentMethodFindManyArgs>(args?: SelectSubset<T, UserPaymentMethodFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserPaymentMethod.
     * @param {UserPaymentMethodCreateArgs} args - Arguments to create a UserPaymentMethod.
     * @example
     * // Create one UserPaymentMethod
     * const UserPaymentMethod = await prisma.userPaymentMethod.create({
     *   data: {
     *     // ... data to create a UserPaymentMethod
     *   }
     * })
     * 
     */
    create<T extends UserPaymentMethodCreateArgs>(args: SelectSubset<T, UserPaymentMethodCreateArgs<ExtArgs>>): Prisma__UserPaymentMethodClient<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserPaymentMethods.
     * @param {UserPaymentMethodCreateManyArgs} args - Arguments to create many UserPaymentMethods.
     * @example
     * // Create many UserPaymentMethods
     * const userPaymentMethod = await prisma.userPaymentMethod.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserPaymentMethodCreateManyArgs>(args?: SelectSubset<T, UserPaymentMethodCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserPaymentMethods and returns the data saved in the database.
     * @param {UserPaymentMethodCreateManyAndReturnArgs} args - Arguments to create many UserPaymentMethods.
     * @example
     * // Create many UserPaymentMethods
     * const userPaymentMethod = await prisma.userPaymentMethod.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserPaymentMethods and only return the `id`
     * const userPaymentMethodWithIdOnly = await prisma.userPaymentMethod.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserPaymentMethodCreateManyAndReturnArgs>(args?: SelectSubset<T, UserPaymentMethodCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserPaymentMethod.
     * @param {UserPaymentMethodDeleteArgs} args - Arguments to delete one UserPaymentMethod.
     * @example
     * // Delete one UserPaymentMethod
     * const UserPaymentMethod = await prisma.userPaymentMethod.delete({
     *   where: {
     *     // ... filter to delete one UserPaymentMethod
     *   }
     * })
     * 
     */
    delete<T extends UserPaymentMethodDeleteArgs>(args: SelectSubset<T, UserPaymentMethodDeleteArgs<ExtArgs>>): Prisma__UserPaymentMethodClient<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserPaymentMethod.
     * @param {UserPaymentMethodUpdateArgs} args - Arguments to update one UserPaymentMethod.
     * @example
     * // Update one UserPaymentMethod
     * const userPaymentMethod = await prisma.userPaymentMethod.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserPaymentMethodUpdateArgs>(args: SelectSubset<T, UserPaymentMethodUpdateArgs<ExtArgs>>): Prisma__UserPaymentMethodClient<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserPaymentMethods.
     * @param {UserPaymentMethodDeleteManyArgs} args - Arguments to filter UserPaymentMethods to delete.
     * @example
     * // Delete a few UserPaymentMethods
     * const { count } = await prisma.userPaymentMethod.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserPaymentMethodDeleteManyArgs>(args?: SelectSubset<T, UserPaymentMethodDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPaymentMethods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaymentMethodUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPaymentMethods
     * const userPaymentMethod = await prisma.userPaymentMethod.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserPaymentMethodUpdateManyArgs>(args: SelectSubset<T, UserPaymentMethodUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPaymentMethods and returns the data updated in the database.
     * @param {UserPaymentMethodUpdateManyAndReturnArgs} args - Arguments to update many UserPaymentMethods.
     * @example
     * // Update many UserPaymentMethods
     * const userPaymentMethod = await prisma.userPaymentMethod.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserPaymentMethods and only return the `id`
     * const userPaymentMethodWithIdOnly = await prisma.userPaymentMethod.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserPaymentMethodUpdateManyAndReturnArgs>(args: SelectSubset<T, UserPaymentMethodUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserPaymentMethod.
     * @param {UserPaymentMethodUpsertArgs} args - Arguments to update or create a UserPaymentMethod.
     * @example
     * // Update or create a UserPaymentMethod
     * const userPaymentMethod = await prisma.userPaymentMethod.upsert({
     *   create: {
     *     // ... data to create a UserPaymentMethod
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPaymentMethod we want to update
     *   }
     * })
     */
    upsert<T extends UserPaymentMethodUpsertArgs>(args: SelectSubset<T, UserPaymentMethodUpsertArgs<ExtArgs>>): Prisma__UserPaymentMethodClient<$Result.GetResult<Prisma.$UserPaymentMethodPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserPaymentMethods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaymentMethodCountArgs} args - Arguments to filter UserPaymentMethods to count.
     * @example
     * // Count the number of UserPaymentMethods
     * const count = await prisma.userPaymentMethod.count({
     *   where: {
     *     // ... the filter for the UserPaymentMethods we want to count
     *   }
     * })
    **/
    count<T extends UserPaymentMethodCountArgs>(
      args?: Subset<T, UserPaymentMethodCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserPaymentMethodCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserPaymentMethod.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaymentMethodAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserPaymentMethodAggregateArgs>(args: Subset<T, UserPaymentMethodAggregateArgs>): Prisma.PrismaPromise<GetUserPaymentMethodAggregateType<T>>

    /**
     * Group by UserPaymentMethod.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaymentMethodGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserPaymentMethodGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserPaymentMethodGroupByArgs['orderBy'] }
        : { orderBy?: UserPaymentMethodGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserPaymentMethodGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPaymentMethodGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserPaymentMethod model
   */
  readonly fields: UserPaymentMethodFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserPaymentMethod.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserPaymentMethodClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserPaymentMethod model
   */
  interface UserPaymentMethodFieldRefs {
    readonly id: FieldRef<"UserPaymentMethod", 'String'>
    readonly userId: FieldRef<"UserPaymentMethod", 'String'>
    readonly stripePaymentMethodId: FieldRef<"UserPaymentMethod", 'String'>
    readonly type: FieldRef<"UserPaymentMethod", 'String'>
    readonly last4: FieldRef<"UserPaymentMethod", 'String'>
    readonly brand: FieldRef<"UserPaymentMethod", 'String'>
    readonly expiryMonth: FieldRef<"UserPaymentMethod", 'Int'>
    readonly expiryYear: FieldRef<"UserPaymentMethod", 'Int'>
    readonly isDefault: FieldRef<"UserPaymentMethod", 'Boolean'>
    readonly createdAt: FieldRef<"UserPaymentMethod", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserPaymentMethod findUnique
   */
  export type UserPaymentMethodFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
    /**
     * Filter, which UserPaymentMethod to fetch.
     */
    where: UserPaymentMethodWhereUniqueInput
  }

  /**
   * UserPaymentMethod findUniqueOrThrow
   */
  export type UserPaymentMethodFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
    /**
     * Filter, which UserPaymentMethod to fetch.
     */
    where: UserPaymentMethodWhereUniqueInput
  }

  /**
   * UserPaymentMethod findFirst
   */
  export type UserPaymentMethodFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
    /**
     * Filter, which UserPaymentMethod to fetch.
     */
    where?: UserPaymentMethodWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPaymentMethods to fetch.
     */
    orderBy?: UserPaymentMethodOrderByWithRelationInput | UserPaymentMethodOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPaymentMethods.
     */
    cursor?: UserPaymentMethodWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPaymentMethods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPaymentMethods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPaymentMethods.
     */
    distinct?: UserPaymentMethodScalarFieldEnum | UserPaymentMethodScalarFieldEnum[]
  }

  /**
   * UserPaymentMethod findFirstOrThrow
   */
  export type UserPaymentMethodFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
    /**
     * Filter, which UserPaymentMethod to fetch.
     */
    where?: UserPaymentMethodWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPaymentMethods to fetch.
     */
    orderBy?: UserPaymentMethodOrderByWithRelationInput | UserPaymentMethodOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPaymentMethods.
     */
    cursor?: UserPaymentMethodWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPaymentMethods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPaymentMethods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPaymentMethods.
     */
    distinct?: UserPaymentMethodScalarFieldEnum | UserPaymentMethodScalarFieldEnum[]
  }

  /**
   * UserPaymentMethod findMany
   */
  export type UserPaymentMethodFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
    /**
     * Filter, which UserPaymentMethods to fetch.
     */
    where?: UserPaymentMethodWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPaymentMethods to fetch.
     */
    orderBy?: UserPaymentMethodOrderByWithRelationInput | UserPaymentMethodOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserPaymentMethods.
     */
    cursor?: UserPaymentMethodWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPaymentMethods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPaymentMethods.
     */
    skip?: number
    distinct?: UserPaymentMethodScalarFieldEnum | UserPaymentMethodScalarFieldEnum[]
  }

  /**
   * UserPaymentMethod create
   */
  export type UserPaymentMethodCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
    /**
     * The data needed to create a UserPaymentMethod.
     */
    data: XOR<UserPaymentMethodCreateInput, UserPaymentMethodUncheckedCreateInput>
  }

  /**
   * UserPaymentMethod createMany
   */
  export type UserPaymentMethodCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserPaymentMethods.
     */
    data: UserPaymentMethodCreateManyInput | UserPaymentMethodCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserPaymentMethod createManyAndReturn
   */
  export type UserPaymentMethodCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * The data used to create many UserPaymentMethods.
     */
    data: UserPaymentMethodCreateManyInput | UserPaymentMethodCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPaymentMethod update
   */
  export type UserPaymentMethodUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
    /**
     * The data needed to update a UserPaymentMethod.
     */
    data: XOR<UserPaymentMethodUpdateInput, UserPaymentMethodUncheckedUpdateInput>
    /**
     * Choose, which UserPaymentMethod to update.
     */
    where: UserPaymentMethodWhereUniqueInput
  }

  /**
   * UserPaymentMethod updateMany
   */
  export type UserPaymentMethodUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserPaymentMethods.
     */
    data: XOR<UserPaymentMethodUpdateManyMutationInput, UserPaymentMethodUncheckedUpdateManyInput>
    /**
     * Filter which UserPaymentMethods to update
     */
    where?: UserPaymentMethodWhereInput
    /**
     * Limit how many UserPaymentMethods to update.
     */
    limit?: number
  }

  /**
   * UserPaymentMethod updateManyAndReturn
   */
  export type UserPaymentMethodUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * The data used to update UserPaymentMethods.
     */
    data: XOR<UserPaymentMethodUpdateManyMutationInput, UserPaymentMethodUncheckedUpdateManyInput>
    /**
     * Filter which UserPaymentMethods to update
     */
    where?: UserPaymentMethodWhereInput
    /**
     * Limit how many UserPaymentMethods to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPaymentMethod upsert
   */
  export type UserPaymentMethodUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
    /**
     * The filter to search for the UserPaymentMethod to update in case it exists.
     */
    where: UserPaymentMethodWhereUniqueInput
    /**
     * In case the UserPaymentMethod found by the `where` argument doesn't exist, create a new UserPaymentMethod with this data.
     */
    create: XOR<UserPaymentMethodCreateInput, UserPaymentMethodUncheckedCreateInput>
    /**
     * In case the UserPaymentMethod was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserPaymentMethodUpdateInput, UserPaymentMethodUncheckedUpdateInput>
  }

  /**
   * UserPaymentMethod delete
   */
  export type UserPaymentMethodDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
    /**
     * Filter which UserPaymentMethod to delete.
     */
    where: UserPaymentMethodWhereUniqueInput
  }

  /**
   * UserPaymentMethod deleteMany
   */
  export type UserPaymentMethodDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPaymentMethods to delete
     */
    where?: UserPaymentMethodWhereInput
    /**
     * Limit how many UserPaymentMethods to delete.
     */
    limit?: number
  }

  /**
   * UserPaymentMethod without action
   */
  export type UserPaymentMethodDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPaymentMethod
     */
    select?: UserPaymentMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPaymentMethod
     */
    omit?: UserPaymentMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaymentMethodInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: number | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    stripePaymentId: string | null
    amount: number | null
    currency: string | null
    status: string | null
    description: string | null
    createdAt: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    stripePaymentId: string | null
    amount: number | null
    currency: string | null
    status: string | null
    description: string | null
    createdAt: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    userId: number
    stripePaymentId: number
    amount: number
    currency: number
    status: number
    description: number
    createdAt: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    userId?: true
    stripePaymentId?: true
    amount?: true
    currency?: true
    status?: true
    description?: true
    createdAt?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    userId?: true
    stripePaymentId?: true
    amount?: true
    currency?: true
    status?: true
    description?: true
    createdAt?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    userId?: true
    stripePaymentId?: true
    amount?: true
    currency?: true
    status?: true
    description?: true
    createdAt?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    userId: string
    stripePaymentId: string
    amount: number
    currency: string
    status: string
    description: string | null
    createdAt: Date
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripePaymentId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripePaymentId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripePaymentId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    userId?: boolean
    stripePaymentId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "stripePaymentId" | "amount" | "currency" | "status" | "description" | "createdAt", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      stripePaymentId: string
      /**
       * Amount in minor units (e.g. cents)
       */
      amount: number
      currency: string
      status: string
      description: string | null
      createdAt: Date
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly userId: FieldRef<"Payment", 'String'>
    readonly stripePaymentId: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Int'>
    readonly currency: FieldRef<"Payment", 'String'>
    readonly status: FieldRef<"Payment", 'String'>
    readonly description: FieldRef<"Payment", 'String'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    amount: number | null
  }

  export type InvoiceSumAggregateOutputType = {
    amount: number | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    stripeInvoiceId: string | null
    amount: number | null
    currency: string | null
    status: string | null
    paidAt: Date | null
    dueDate: Date | null
    invoiceUrl: string | null
    pdfUrl: string | null
    createdAt: Date | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    stripeInvoiceId: string | null
    amount: number | null
    currency: string | null
    status: string | null
    paidAt: Date | null
    dueDate: Date | null
    invoiceUrl: string | null
    pdfUrl: string | null
    createdAt: Date | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    userId: number
    stripeInvoiceId: number
    amount: number
    currency: number
    status: number
    paidAt: number
    dueDate: number
    invoiceUrl: number
    pdfUrl: number
    createdAt: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    amount?: true
  }

  export type InvoiceSumAggregateInputType = {
    amount?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    userId?: true
    stripeInvoiceId?: true
    amount?: true
    currency?: true
    status?: true
    paidAt?: true
    dueDate?: true
    invoiceUrl?: true
    pdfUrl?: true
    createdAt?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    userId?: true
    stripeInvoiceId?: true
    amount?: true
    currency?: true
    status?: true
    paidAt?: true
    dueDate?: true
    invoiceUrl?: true
    pdfUrl?: true
    createdAt?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    userId?: true
    stripeInvoiceId?: true
    amount?: true
    currency?: true
    status?: true
    paidAt?: true
    dueDate?: true
    invoiceUrl?: true
    pdfUrl?: true
    createdAt?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    userId: string
    stripeInvoiceId: string
    amount: number
    currency: string
    status: string
    paidAt: Date | null
    dueDate: Date | null
    invoiceUrl: string | null
    pdfUrl: string | null
    createdAt: Date
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeInvoiceId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    paidAt?: boolean
    dueDate?: boolean
    invoiceUrl?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeInvoiceId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    paidAt?: boolean
    dueDate?: boolean
    invoiceUrl?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeInvoiceId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    paidAt?: boolean
    dueDate?: boolean
    invoiceUrl?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectScalar = {
    id?: boolean
    userId?: boolean
    stripeInvoiceId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    paidAt?: boolean
    dueDate?: boolean
    invoiceUrl?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
  }

  export type InvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "stripeInvoiceId" | "amount" | "currency" | "status" | "paidAt" | "dueDate" | "invoiceUrl" | "pdfUrl" | "createdAt", ExtArgs["result"]["invoice"]>
  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      stripeInvoiceId: string
      /**
       * Amount in minor units (e.g. cents)
       */
      amount: number
      currency: string
      status: string
      paidAt: Date | null
      dueDate: Date | null
      invoiceUrl: string | null
      pdfUrl: string | null
      createdAt: Date
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invoices and returns the data saved in the database.
     * @param {InvoiceCreateManyAndReturnArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices and returns the data updated in the database.
     * @param {InvoiceUpdateManyAndReturnArgs} args - Arguments to update many Invoices.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, InvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly userId: FieldRef<"Invoice", 'String'>
    readonly stripeInvoiceId: FieldRef<"Invoice", 'String'>
    readonly amount: FieldRef<"Invoice", 'Int'>
    readonly currency: FieldRef<"Invoice", 'String'>
    readonly status: FieldRef<"Invoice", 'String'>
    readonly paidAt: FieldRef<"Invoice", 'DateTime'>
    readonly dueDate: FieldRef<"Invoice", 'DateTime'>
    readonly invoiceUrl: FieldRef<"Invoice", 'String'>
    readonly pdfUrl: FieldRef<"Invoice", 'String'>
    readonly createdAt: FieldRef<"Invoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invoice createManyAndReturn
   */
  export type InvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to update.
     */
    limit?: number
  }

  /**
   * Invoice updateManyAndReturn
   */
  export type InvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to delete.
     */
    limit?: number
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model StripeWebhookEvent
   */

  export type AggregateStripeWebhookEvent = {
    _count: StripeWebhookEventCountAggregateOutputType | null
    _min: StripeWebhookEventMinAggregateOutputType | null
    _max: StripeWebhookEventMaxAggregateOutputType | null
  }

  export type StripeWebhookEventMinAggregateOutputType = {
    id: string | null
    type: string | null
    createdAt: Date | null
  }

  export type StripeWebhookEventMaxAggregateOutputType = {
    id: string | null
    type: string | null
    createdAt: Date | null
  }

  export type StripeWebhookEventCountAggregateOutputType = {
    id: number
    type: number
    createdAt: number
    _all: number
  }


  export type StripeWebhookEventMinAggregateInputType = {
    id?: true
    type?: true
    createdAt?: true
  }

  export type StripeWebhookEventMaxAggregateInputType = {
    id?: true
    type?: true
    createdAt?: true
  }

  export type StripeWebhookEventCountAggregateInputType = {
    id?: true
    type?: true
    createdAt?: true
    _all?: true
  }

  export type StripeWebhookEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StripeWebhookEvent to aggregate.
     */
    where?: StripeWebhookEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeWebhookEvents to fetch.
     */
    orderBy?: StripeWebhookEventOrderByWithRelationInput | StripeWebhookEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StripeWebhookEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeWebhookEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeWebhookEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StripeWebhookEvents
    **/
    _count?: true | StripeWebhookEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StripeWebhookEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StripeWebhookEventMaxAggregateInputType
  }

  export type GetStripeWebhookEventAggregateType<T extends StripeWebhookEventAggregateArgs> = {
        [P in keyof T & keyof AggregateStripeWebhookEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStripeWebhookEvent[P]>
      : GetScalarType<T[P], AggregateStripeWebhookEvent[P]>
  }




  export type StripeWebhookEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StripeWebhookEventWhereInput
    orderBy?: StripeWebhookEventOrderByWithAggregationInput | StripeWebhookEventOrderByWithAggregationInput[]
    by: StripeWebhookEventScalarFieldEnum[] | StripeWebhookEventScalarFieldEnum
    having?: StripeWebhookEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StripeWebhookEventCountAggregateInputType | true
    _min?: StripeWebhookEventMinAggregateInputType
    _max?: StripeWebhookEventMaxAggregateInputType
  }

  export type StripeWebhookEventGroupByOutputType = {
    id: string
    type: string
    createdAt: Date
    _count: StripeWebhookEventCountAggregateOutputType | null
    _min: StripeWebhookEventMinAggregateOutputType | null
    _max: StripeWebhookEventMaxAggregateOutputType | null
  }

  type GetStripeWebhookEventGroupByPayload<T extends StripeWebhookEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StripeWebhookEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StripeWebhookEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StripeWebhookEventGroupByOutputType[P]>
            : GetScalarType<T[P], StripeWebhookEventGroupByOutputType[P]>
        }
      >
    >


  export type StripeWebhookEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["stripeWebhookEvent"]>

  export type StripeWebhookEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["stripeWebhookEvent"]>

  export type StripeWebhookEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["stripeWebhookEvent"]>

  export type StripeWebhookEventSelectScalar = {
    id?: boolean
    type?: boolean
    createdAt?: boolean
  }

  export type StripeWebhookEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "createdAt", ExtArgs["result"]["stripeWebhookEvent"]>

  export type $StripeWebhookEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StripeWebhookEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Stripe event id (e.g. evt_...)
       */
      id: string
      type: string
      createdAt: Date
    }, ExtArgs["result"]["stripeWebhookEvent"]>
    composites: {}
  }

  type StripeWebhookEventGetPayload<S extends boolean | null | undefined | StripeWebhookEventDefaultArgs> = $Result.GetResult<Prisma.$StripeWebhookEventPayload, S>

  type StripeWebhookEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StripeWebhookEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StripeWebhookEventCountAggregateInputType | true
    }

  export interface StripeWebhookEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StripeWebhookEvent'], meta: { name: 'StripeWebhookEvent' } }
    /**
     * Find zero or one StripeWebhookEvent that matches the filter.
     * @param {StripeWebhookEventFindUniqueArgs} args - Arguments to find a StripeWebhookEvent
     * @example
     * // Get one StripeWebhookEvent
     * const stripeWebhookEvent = await prisma.stripeWebhookEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StripeWebhookEventFindUniqueArgs>(args: SelectSubset<T, StripeWebhookEventFindUniqueArgs<ExtArgs>>): Prisma__StripeWebhookEventClient<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StripeWebhookEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StripeWebhookEventFindUniqueOrThrowArgs} args - Arguments to find a StripeWebhookEvent
     * @example
     * // Get one StripeWebhookEvent
     * const stripeWebhookEvent = await prisma.stripeWebhookEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StripeWebhookEventFindUniqueOrThrowArgs>(args: SelectSubset<T, StripeWebhookEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StripeWebhookEventClient<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StripeWebhookEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeWebhookEventFindFirstArgs} args - Arguments to find a StripeWebhookEvent
     * @example
     * // Get one StripeWebhookEvent
     * const stripeWebhookEvent = await prisma.stripeWebhookEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StripeWebhookEventFindFirstArgs>(args?: SelectSubset<T, StripeWebhookEventFindFirstArgs<ExtArgs>>): Prisma__StripeWebhookEventClient<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StripeWebhookEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeWebhookEventFindFirstOrThrowArgs} args - Arguments to find a StripeWebhookEvent
     * @example
     * // Get one StripeWebhookEvent
     * const stripeWebhookEvent = await prisma.stripeWebhookEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StripeWebhookEventFindFirstOrThrowArgs>(args?: SelectSubset<T, StripeWebhookEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__StripeWebhookEventClient<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StripeWebhookEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeWebhookEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StripeWebhookEvents
     * const stripeWebhookEvents = await prisma.stripeWebhookEvent.findMany()
     * 
     * // Get first 10 StripeWebhookEvents
     * const stripeWebhookEvents = await prisma.stripeWebhookEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stripeWebhookEventWithIdOnly = await prisma.stripeWebhookEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StripeWebhookEventFindManyArgs>(args?: SelectSubset<T, StripeWebhookEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StripeWebhookEvent.
     * @param {StripeWebhookEventCreateArgs} args - Arguments to create a StripeWebhookEvent.
     * @example
     * // Create one StripeWebhookEvent
     * const StripeWebhookEvent = await prisma.stripeWebhookEvent.create({
     *   data: {
     *     // ... data to create a StripeWebhookEvent
     *   }
     * })
     * 
     */
    create<T extends StripeWebhookEventCreateArgs>(args: SelectSubset<T, StripeWebhookEventCreateArgs<ExtArgs>>): Prisma__StripeWebhookEventClient<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StripeWebhookEvents.
     * @param {StripeWebhookEventCreateManyArgs} args - Arguments to create many StripeWebhookEvents.
     * @example
     * // Create many StripeWebhookEvents
     * const stripeWebhookEvent = await prisma.stripeWebhookEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StripeWebhookEventCreateManyArgs>(args?: SelectSubset<T, StripeWebhookEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StripeWebhookEvents and returns the data saved in the database.
     * @param {StripeWebhookEventCreateManyAndReturnArgs} args - Arguments to create many StripeWebhookEvents.
     * @example
     * // Create many StripeWebhookEvents
     * const stripeWebhookEvent = await prisma.stripeWebhookEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StripeWebhookEvents and only return the `id`
     * const stripeWebhookEventWithIdOnly = await prisma.stripeWebhookEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StripeWebhookEventCreateManyAndReturnArgs>(args?: SelectSubset<T, StripeWebhookEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StripeWebhookEvent.
     * @param {StripeWebhookEventDeleteArgs} args - Arguments to delete one StripeWebhookEvent.
     * @example
     * // Delete one StripeWebhookEvent
     * const StripeWebhookEvent = await prisma.stripeWebhookEvent.delete({
     *   where: {
     *     // ... filter to delete one StripeWebhookEvent
     *   }
     * })
     * 
     */
    delete<T extends StripeWebhookEventDeleteArgs>(args: SelectSubset<T, StripeWebhookEventDeleteArgs<ExtArgs>>): Prisma__StripeWebhookEventClient<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StripeWebhookEvent.
     * @param {StripeWebhookEventUpdateArgs} args - Arguments to update one StripeWebhookEvent.
     * @example
     * // Update one StripeWebhookEvent
     * const stripeWebhookEvent = await prisma.stripeWebhookEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StripeWebhookEventUpdateArgs>(args: SelectSubset<T, StripeWebhookEventUpdateArgs<ExtArgs>>): Prisma__StripeWebhookEventClient<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StripeWebhookEvents.
     * @param {StripeWebhookEventDeleteManyArgs} args - Arguments to filter StripeWebhookEvents to delete.
     * @example
     * // Delete a few StripeWebhookEvents
     * const { count } = await prisma.stripeWebhookEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StripeWebhookEventDeleteManyArgs>(args?: SelectSubset<T, StripeWebhookEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StripeWebhookEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeWebhookEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StripeWebhookEvents
     * const stripeWebhookEvent = await prisma.stripeWebhookEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StripeWebhookEventUpdateManyArgs>(args: SelectSubset<T, StripeWebhookEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StripeWebhookEvents and returns the data updated in the database.
     * @param {StripeWebhookEventUpdateManyAndReturnArgs} args - Arguments to update many StripeWebhookEvents.
     * @example
     * // Update many StripeWebhookEvents
     * const stripeWebhookEvent = await prisma.stripeWebhookEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StripeWebhookEvents and only return the `id`
     * const stripeWebhookEventWithIdOnly = await prisma.stripeWebhookEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StripeWebhookEventUpdateManyAndReturnArgs>(args: SelectSubset<T, StripeWebhookEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StripeWebhookEvent.
     * @param {StripeWebhookEventUpsertArgs} args - Arguments to update or create a StripeWebhookEvent.
     * @example
     * // Update or create a StripeWebhookEvent
     * const stripeWebhookEvent = await prisma.stripeWebhookEvent.upsert({
     *   create: {
     *     // ... data to create a StripeWebhookEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StripeWebhookEvent we want to update
     *   }
     * })
     */
    upsert<T extends StripeWebhookEventUpsertArgs>(args: SelectSubset<T, StripeWebhookEventUpsertArgs<ExtArgs>>): Prisma__StripeWebhookEventClient<$Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StripeWebhookEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeWebhookEventCountArgs} args - Arguments to filter StripeWebhookEvents to count.
     * @example
     * // Count the number of StripeWebhookEvents
     * const count = await prisma.stripeWebhookEvent.count({
     *   where: {
     *     // ... the filter for the StripeWebhookEvents we want to count
     *   }
     * })
    **/
    count<T extends StripeWebhookEventCountArgs>(
      args?: Subset<T, StripeWebhookEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StripeWebhookEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StripeWebhookEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeWebhookEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StripeWebhookEventAggregateArgs>(args: Subset<T, StripeWebhookEventAggregateArgs>): Prisma.PrismaPromise<GetStripeWebhookEventAggregateType<T>>

    /**
     * Group by StripeWebhookEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeWebhookEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StripeWebhookEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StripeWebhookEventGroupByArgs['orderBy'] }
        : { orderBy?: StripeWebhookEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StripeWebhookEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStripeWebhookEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StripeWebhookEvent model
   */
  readonly fields: StripeWebhookEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StripeWebhookEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StripeWebhookEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StripeWebhookEvent model
   */
  interface StripeWebhookEventFieldRefs {
    readonly id: FieldRef<"StripeWebhookEvent", 'String'>
    readonly type: FieldRef<"StripeWebhookEvent", 'String'>
    readonly createdAt: FieldRef<"StripeWebhookEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StripeWebhookEvent findUnique
   */
  export type StripeWebhookEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * Filter, which StripeWebhookEvent to fetch.
     */
    where: StripeWebhookEventWhereUniqueInput
  }

  /**
   * StripeWebhookEvent findUniqueOrThrow
   */
  export type StripeWebhookEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * Filter, which StripeWebhookEvent to fetch.
     */
    where: StripeWebhookEventWhereUniqueInput
  }

  /**
   * StripeWebhookEvent findFirst
   */
  export type StripeWebhookEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * Filter, which StripeWebhookEvent to fetch.
     */
    where?: StripeWebhookEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeWebhookEvents to fetch.
     */
    orderBy?: StripeWebhookEventOrderByWithRelationInput | StripeWebhookEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StripeWebhookEvents.
     */
    cursor?: StripeWebhookEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeWebhookEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeWebhookEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StripeWebhookEvents.
     */
    distinct?: StripeWebhookEventScalarFieldEnum | StripeWebhookEventScalarFieldEnum[]
  }

  /**
   * StripeWebhookEvent findFirstOrThrow
   */
  export type StripeWebhookEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * Filter, which StripeWebhookEvent to fetch.
     */
    where?: StripeWebhookEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeWebhookEvents to fetch.
     */
    orderBy?: StripeWebhookEventOrderByWithRelationInput | StripeWebhookEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StripeWebhookEvents.
     */
    cursor?: StripeWebhookEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeWebhookEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeWebhookEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StripeWebhookEvents.
     */
    distinct?: StripeWebhookEventScalarFieldEnum | StripeWebhookEventScalarFieldEnum[]
  }

  /**
   * StripeWebhookEvent findMany
   */
  export type StripeWebhookEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * Filter, which StripeWebhookEvents to fetch.
     */
    where?: StripeWebhookEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeWebhookEvents to fetch.
     */
    orderBy?: StripeWebhookEventOrderByWithRelationInput | StripeWebhookEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StripeWebhookEvents.
     */
    cursor?: StripeWebhookEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeWebhookEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeWebhookEvents.
     */
    skip?: number
    distinct?: StripeWebhookEventScalarFieldEnum | StripeWebhookEventScalarFieldEnum[]
  }

  /**
   * StripeWebhookEvent create
   */
  export type StripeWebhookEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * The data needed to create a StripeWebhookEvent.
     */
    data: XOR<StripeWebhookEventCreateInput, StripeWebhookEventUncheckedCreateInput>
  }

  /**
   * StripeWebhookEvent createMany
   */
  export type StripeWebhookEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StripeWebhookEvents.
     */
    data: StripeWebhookEventCreateManyInput | StripeWebhookEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StripeWebhookEvent createManyAndReturn
   */
  export type StripeWebhookEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * The data used to create many StripeWebhookEvents.
     */
    data: StripeWebhookEventCreateManyInput | StripeWebhookEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StripeWebhookEvent update
   */
  export type StripeWebhookEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * The data needed to update a StripeWebhookEvent.
     */
    data: XOR<StripeWebhookEventUpdateInput, StripeWebhookEventUncheckedUpdateInput>
    /**
     * Choose, which StripeWebhookEvent to update.
     */
    where: StripeWebhookEventWhereUniqueInput
  }

  /**
   * StripeWebhookEvent updateMany
   */
  export type StripeWebhookEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StripeWebhookEvents.
     */
    data: XOR<StripeWebhookEventUpdateManyMutationInput, StripeWebhookEventUncheckedUpdateManyInput>
    /**
     * Filter which StripeWebhookEvents to update
     */
    where?: StripeWebhookEventWhereInput
    /**
     * Limit how many StripeWebhookEvents to update.
     */
    limit?: number
  }

  /**
   * StripeWebhookEvent updateManyAndReturn
   */
  export type StripeWebhookEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * The data used to update StripeWebhookEvents.
     */
    data: XOR<StripeWebhookEventUpdateManyMutationInput, StripeWebhookEventUncheckedUpdateManyInput>
    /**
     * Filter which StripeWebhookEvents to update
     */
    where?: StripeWebhookEventWhereInput
    /**
     * Limit how many StripeWebhookEvents to update.
     */
    limit?: number
  }

  /**
   * StripeWebhookEvent upsert
   */
  export type StripeWebhookEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * The filter to search for the StripeWebhookEvent to update in case it exists.
     */
    where: StripeWebhookEventWhereUniqueInput
    /**
     * In case the StripeWebhookEvent found by the `where` argument doesn't exist, create a new StripeWebhookEvent with this data.
     */
    create: XOR<StripeWebhookEventCreateInput, StripeWebhookEventUncheckedCreateInput>
    /**
     * In case the StripeWebhookEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StripeWebhookEventUpdateInput, StripeWebhookEventUncheckedUpdateInput>
  }

  /**
   * StripeWebhookEvent delete
   */
  export type StripeWebhookEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
    /**
     * Filter which StripeWebhookEvent to delete.
     */
    where: StripeWebhookEventWhereUniqueInput
  }

  /**
   * StripeWebhookEvent deleteMany
   */
  export type StripeWebhookEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StripeWebhookEvents to delete
     */
    where?: StripeWebhookEventWhereInput
    /**
     * Limit how many StripeWebhookEvents to delete.
     */
    limit?: number
  }

  /**
   * StripeWebhookEvent without action
   */
  export type StripeWebhookEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeWebhookEvent
     */
    select?: StripeWebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StripeWebhookEvent
     */
    omit?: StripeWebhookEventOmit<ExtArgs> | null
  }


  /**
   * Model UsageCounter
   */

  export type AggregateUsageCounter = {
    _count: UsageCounterCountAggregateOutputType | null
    _avg: UsageCounterAvgAggregateOutputType | null
    _sum: UsageCounterSumAggregateOutputType | null
    _min: UsageCounterMinAggregateOutputType | null
    _max: UsageCounterMaxAggregateOutputType | null
  }

  export type UsageCounterAvgAggregateOutputType = {
    used: number | null
  }

  export type UsageCounterSumAggregateOutputType = {
    used: number | null
  }

  export type UsageCounterMinAggregateOutputType = {
    id: string | null
    userId: string | null
    featureId: string | null
    periodStart: Date | null
    periodEnd: Date | null
    used: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UsageCounterMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    featureId: string | null
    periodStart: Date | null
    periodEnd: Date | null
    used: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UsageCounterCountAggregateOutputType = {
    id: number
    userId: number
    featureId: number
    periodStart: number
    periodEnd: number
    used: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UsageCounterAvgAggregateInputType = {
    used?: true
  }

  export type UsageCounterSumAggregateInputType = {
    used?: true
  }

  export type UsageCounterMinAggregateInputType = {
    id?: true
    userId?: true
    featureId?: true
    periodStart?: true
    periodEnd?: true
    used?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UsageCounterMaxAggregateInputType = {
    id?: true
    userId?: true
    featureId?: true
    periodStart?: true
    periodEnd?: true
    used?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UsageCounterCountAggregateInputType = {
    id?: true
    userId?: true
    featureId?: true
    periodStart?: true
    periodEnd?: true
    used?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UsageCounterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageCounter to aggregate.
     */
    where?: UsageCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageCounters to fetch.
     */
    orderBy?: UsageCounterOrderByWithRelationInput | UsageCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsageCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageCounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsageCounters
    **/
    _count?: true | UsageCounterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsageCounterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsageCounterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsageCounterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsageCounterMaxAggregateInputType
  }

  export type GetUsageCounterAggregateType<T extends UsageCounterAggregateArgs> = {
        [P in keyof T & keyof AggregateUsageCounter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsageCounter[P]>
      : GetScalarType<T[P], AggregateUsageCounter[P]>
  }




  export type UsageCounterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageCounterWhereInput
    orderBy?: UsageCounterOrderByWithAggregationInput | UsageCounterOrderByWithAggregationInput[]
    by: UsageCounterScalarFieldEnum[] | UsageCounterScalarFieldEnum
    having?: UsageCounterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsageCounterCountAggregateInputType | true
    _avg?: UsageCounterAvgAggregateInputType
    _sum?: UsageCounterSumAggregateInputType
    _min?: UsageCounterMinAggregateInputType
    _max?: UsageCounterMaxAggregateInputType
  }

  export type UsageCounterGroupByOutputType = {
    id: string
    userId: string
    featureId: string
    periodStart: Date
    periodEnd: Date
    used: number
    createdAt: Date
    updatedAt: Date
    _count: UsageCounterCountAggregateOutputType | null
    _avg: UsageCounterAvgAggregateOutputType | null
    _sum: UsageCounterSumAggregateOutputType | null
    _min: UsageCounterMinAggregateOutputType | null
    _max: UsageCounterMaxAggregateOutputType | null
  }

  type GetUsageCounterGroupByPayload<T extends UsageCounterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsageCounterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsageCounterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsageCounterGroupByOutputType[P]>
            : GetScalarType<T[P], UsageCounterGroupByOutputType[P]>
        }
      >
    >


  export type UsageCounterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    featureId?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    used?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageCounter"]>

  export type UsageCounterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    featureId?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    used?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageCounter"]>

  export type UsageCounterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    featureId?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    used?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageCounter"]>

  export type UsageCounterSelectScalar = {
    id?: boolean
    userId?: boolean
    featureId?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    used?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UsageCounterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "featureId" | "periodStart" | "periodEnd" | "used" | "createdAt" | "updatedAt", ExtArgs["result"]["usageCounter"]>
  export type UsageCounterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UsageCounterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UsageCounterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UsageCounterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UsageCounter"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      featureId: string
      periodStart: Date
      periodEnd: Date
      used: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["usageCounter"]>
    composites: {}
  }

  type UsageCounterGetPayload<S extends boolean | null | undefined | UsageCounterDefaultArgs> = $Result.GetResult<Prisma.$UsageCounterPayload, S>

  type UsageCounterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsageCounterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsageCounterCountAggregateInputType | true
    }

  export interface UsageCounterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UsageCounter'], meta: { name: 'UsageCounter' } }
    /**
     * Find zero or one UsageCounter that matches the filter.
     * @param {UsageCounterFindUniqueArgs} args - Arguments to find a UsageCounter
     * @example
     * // Get one UsageCounter
     * const usageCounter = await prisma.usageCounter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsageCounterFindUniqueArgs>(args: SelectSubset<T, UsageCounterFindUniqueArgs<ExtArgs>>): Prisma__UsageCounterClient<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UsageCounter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsageCounterFindUniqueOrThrowArgs} args - Arguments to find a UsageCounter
     * @example
     * // Get one UsageCounter
     * const usageCounter = await prisma.usageCounter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsageCounterFindUniqueOrThrowArgs>(args: SelectSubset<T, UsageCounterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsageCounterClient<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsageCounter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageCounterFindFirstArgs} args - Arguments to find a UsageCounter
     * @example
     * // Get one UsageCounter
     * const usageCounter = await prisma.usageCounter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsageCounterFindFirstArgs>(args?: SelectSubset<T, UsageCounterFindFirstArgs<ExtArgs>>): Prisma__UsageCounterClient<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsageCounter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageCounterFindFirstOrThrowArgs} args - Arguments to find a UsageCounter
     * @example
     * // Get one UsageCounter
     * const usageCounter = await prisma.usageCounter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsageCounterFindFirstOrThrowArgs>(args?: SelectSubset<T, UsageCounterFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsageCounterClient<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UsageCounters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageCounterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsageCounters
     * const usageCounters = await prisma.usageCounter.findMany()
     * 
     * // Get first 10 UsageCounters
     * const usageCounters = await prisma.usageCounter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usageCounterWithIdOnly = await prisma.usageCounter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsageCounterFindManyArgs>(args?: SelectSubset<T, UsageCounterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UsageCounter.
     * @param {UsageCounterCreateArgs} args - Arguments to create a UsageCounter.
     * @example
     * // Create one UsageCounter
     * const UsageCounter = await prisma.usageCounter.create({
     *   data: {
     *     // ... data to create a UsageCounter
     *   }
     * })
     * 
     */
    create<T extends UsageCounterCreateArgs>(args: SelectSubset<T, UsageCounterCreateArgs<ExtArgs>>): Prisma__UsageCounterClient<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UsageCounters.
     * @param {UsageCounterCreateManyArgs} args - Arguments to create many UsageCounters.
     * @example
     * // Create many UsageCounters
     * const usageCounter = await prisma.usageCounter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsageCounterCreateManyArgs>(args?: SelectSubset<T, UsageCounterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UsageCounters and returns the data saved in the database.
     * @param {UsageCounterCreateManyAndReturnArgs} args - Arguments to create many UsageCounters.
     * @example
     * // Create many UsageCounters
     * const usageCounter = await prisma.usageCounter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UsageCounters and only return the `id`
     * const usageCounterWithIdOnly = await prisma.usageCounter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsageCounterCreateManyAndReturnArgs>(args?: SelectSubset<T, UsageCounterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UsageCounter.
     * @param {UsageCounterDeleteArgs} args - Arguments to delete one UsageCounter.
     * @example
     * // Delete one UsageCounter
     * const UsageCounter = await prisma.usageCounter.delete({
     *   where: {
     *     // ... filter to delete one UsageCounter
     *   }
     * })
     * 
     */
    delete<T extends UsageCounterDeleteArgs>(args: SelectSubset<T, UsageCounterDeleteArgs<ExtArgs>>): Prisma__UsageCounterClient<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UsageCounter.
     * @param {UsageCounterUpdateArgs} args - Arguments to update one UsageCounter.
     * @example
     * // Update one UsageCounter
     * const usageCounter = await prisma.usageCounter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsageCounterUpdateArgs>(args: SelectSubset<T, UsageCounterUpdateArgs<ExtArgs>>): Prisma__UsageCounterClient<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UsageCounters.
     * @param {UsageCounterDeleteManyArgs} args - Arguments to filter UsageCounters to delete.
     * @example
     * // Delete a few UsageCounters
     * const { count } = await prisma.usageCounter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsageCounterDeleteManyArgs>(args?: SelectSubset<T, UsageCounterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageCounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageCounterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsageCounters
     * const usageCounter = await prisma.usageCounter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsageCounterUpdateManyArgs>(args: SelectSubset<T, UsageCounterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageCounters and returns the data updated in the database.
     * @param {UsageCounterUpdateManyAndReturnArgs} args - Arguments to update many UsageCounters.
     * @example
     * // Update many UsageCounters
     * const usageCounter = await prisma.usageCounter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UsageCounters and only return the `id`
     * const usageCounterWithIdOnly = await prisma.usageCounter.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsageCounterUpdateManyAndReturnArgs>(args: SelectSubset<T, UsageCounterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UsageCounter.
     * @param {UsageCounterUpsertArgs} args - Arguments to update or create a UsageCounter.
     * @example
     * // Update or create a UsageCounter
     * const usageCounter = await prisma.usageCounter.upsert({
     *   create: {
     *     // ... data to create a UsageCounter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsageCounter we want to update
     *   }
     * })
     */
    upsert<T extends UsageCounterUpsertArgs>(args: SelectSubset<T, UsageCounterUpsertArgs<ExtArgs>>): Prisma__UsageCounterClient<$Result.GetResult<Prisma.$UsageCounterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UsageCounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageCounterCountArgs} args - Arguments to filter UsageCounters to count.
     * @example
     * // Count the number of UsageCounters
     * const count = await prisma.usageCounter.count({
     *   where: {
     *     // ... the filter for the UsageCounters we want to count
     *   }
     * })
    **/
    count<T extends UsageCounterCountArgs>(
      args?: Subset<T, UsageCounterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsageCounterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsageCounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageCounterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsageCounterAggregateArgs>(args: Subset<T, UsageCounterAggregateArgs>): Prisma.PrismaPromise<GetUsageCounterAggregateType<T>>

    /**
     * Group by UsageCounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageCounterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsageCounterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsageCounterGroupByArgs['orderBy'] }
        : { orderBy?: UsageCounterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsageCounterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsageCounterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UsageCounter model
   */
  readonly fields: UsageCounterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UsageCounter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsageCounterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UsageCounter model
   */
  interface UsageCounterFieldRefs {
    readonly id: FieldRef<"UsageCounter", 'String'>
    readonly userId: FieldRef<"UsageCounter", 'String'>
    readonly featureId: FieldRef<"UsageCounter", 'String'>
    readonly periodStart: FieldRef<"UsageCounter", 'DateTime'>
    readonly periodEnd: FieldRef<"UsageCounter", 'DateTime'>
    readonly used: FieldRef<"UsageCounter", 'Int'>
    readonly createdAt: FieldRef<"UsageCounter", 'DateTime'>
    readonly updatedAt: FieldRef<"UsageCounter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UsageCounter findUnique
   */
  export type UsageCounterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
    /**
     * Filter, which UsageCounter to fetch.
     */
    where: UsageCounterWhereUniqueInput
  }

  /**
   * UsageCounter findUniqueOrThrow
   */
  export type UsageCounterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
    /**
     * Filter, which UsageCounter to fetch.
     */
    where: UsageCounterWhereUniqueInput
  }

  /**
   * UsageCounter findFirst
   */
  export type UsageCounterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
    /**
     * Filter, which UsageCounter to fetch.
     */
    where?: UsageCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageCounters to fetch.
     */
    orderBy?: UsageCounterOrderByWithRelationInput | UsageCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageCounters.
     */
    cursor?: UsageCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageCounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageCounters.
     */
    distinct?: UsageCounterScalarFieldEnum | UsageCounterScalarFieldEnum[]
  }

  /**
   * UsageCounter findFirstOrThrow
   */
  export type UsageCounterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
    /**
     * Filter, which UsageCounter to fetch.
     */
    where?: UsageCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageCounters to fetch.
     */
    orderBy?: UsageCounterOrderByWithRelationInput | UsageCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageCounters.
     */
    cursor?: UsageCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageCounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageCounters.
     */
    distinct?: UsageCounterScalarFieldEnum | UsageCounterScalarFieldEnum[]
  }

  /**
   * UsageCounter findMany
   */
  export type UsageCounterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
    /**
     * Filter, which UsageCounters to fetch.
     */
    where?: UsageCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageCounters to fetch.
     */
    orderBy?: UsageCounterOrderByWithRelationInput | UsageCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsageCounters.
     */
    cursor?: UsageCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageCounters.
     */
    skip?: number
    distinct?: UsageCounterScalarFieldEnum | UsageCounterScalarFieldEnum[]
  }

  /**
   * UsageCounter create
   */
  export type UsageCounterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
    /**
     * The data needed to create a UsageCounter.
     */
    data: XOR<UsageCounterCreateInput, UsageCounterUncheckedCreateInput>
  }

  /**
   * UsageCounter createMany
   */
  export type UsageCounterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UsageCounters.
     */
    data: UsageCounterCreateManyInput | UsageCounterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsageCounter createManyAndReturn
   */
  export type UsageCounterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * The data used to create many UsageCounters.
     */
    data: UsageCounterCreateManyInput | UsageCounterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsageCounter update
   */
  export type UsageCounterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
    /**
     * The data needed to update a UsageCounter.
     */
    data: XOR<UsageCounterUpdateInput, UsageCounterUncheckedUpdateInput>
    /**
     * Choose, which UsageCounter to update.
     */
    where: UsageCounterWhereUniqueInput
  }

  /**
   * UsageCounter updateMany
   */
  export type UsageCounterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UsageCounters.
     */
    data: XOR<UsageCounterUpdateManyMutationInput, UsageCounterUncheckedUpdateManyInput>
    /**
     * Filter which UsageCounters to update
     */
    where?: UsageCounterWhereInput
    /**
     * Limit how many UsageCounters to update.
     */
    limit?: number
  }

  /**
   * UsageCounter updateManyAndReturn
   */
  export type UsageCounterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * The data used to update UsageCounters.
     */
    data: XOR<UsageCounterUpdateManyMutationInput, UsageCounterUncheckedUpdateManyInput>
    /**
     * Filter which UsageCounters to update
     */
    where?: UsageCounterWhereInput
    /**
     * Limit how many UsageCounters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsageCounter upsert
   */
  export type UsageCounterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
    /**
     * The filter to search for the UsageCounter to update in case it exists.
     */
    where: UsageCounterWhereUniqueInput
    /**
     * In case the UsageCounter found by the `where` argument doesn't exist, create a new UsageCounter with this data.
     */
    create: XOR<UsageCounterCreateInput, UsageCounterUncheckedCreateInput>
    /**
     * In case the UsageCounter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsageCounterUpdateInput, UsageCounterUncheckedUpdateInput>
  }

  /**
   * UsageCounter delete
   */
  export type UsageCounterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
    /**
     * Filter which UsageCounter to delete.
     */
    where: UsageCounterWhereUniqueInput
  }

  /**
   * UsageCounter deleteMany
   */
  export type UsageCounterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageCounters to delete
     */
    where?: UsageCounterWhereInput
    /**
     * Limit how many UsageCounters to delete.
     */
    limit?: number
  }

  /**
   * UsageCounter without action
   */
  export type UsageCounterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageCounter
     */
    select?: UsageCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageCounter
     */
    omit?: UsageCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageCounterInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    fullName: 'fullName',
    bio: 'bio',
    avatarUrl: 'avatarUrl',
    hashedPassword: 'hashedPassword',
    isActive: 'isActive',
    isSuperuser: 'isSuperuser',
    isEmailVerified: 'isEmailVerified',
    stripeCustomerId: 'stripeCustomerId',
    novuSubscriberId: 'novuSubscriberId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const OAuthAccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    provider: 'provider',
    accountId: 'accountId',
    accountEmail: 'accountEmail',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type OAuthAccountScalarFieldEnum = (typeof OAuthAccountScalarFieldEnum)[keyof typeof OAuthAccountScalarFieldEnum]


  export const OtpScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    codeHash: 'codeHash',
    idempotencyKey: 'idempotencyKey',
    purpose: 'purpose',
    attemptsCount: 'attemptsCount',
    isUsed: 'isUsed',
    expiresAt: 'expiresAt',
    nextRequestAt: 'nextRequestAt',
    createdAt: 'createdAt'
  };

  export type OtpScalarFieldEnum = (typeof OtpScalarFieldEnum)[keyof typeof OtpScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    name: 'name',
    slug: 'slug',
    repoExportEnabled: 'repoExportEnabled',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const EnvironmentScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    projectId: 'projectId',
    name: 'name',
    displayName: 'displayName',
    tierPolicy: 'tierPolicy',
    executionMode: 'executionMode',
    region: 'region',
    visibility: 'visibility',
    config: 'config',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EnvironmentScalarFieldEnum = (typeof EnvironmentScalarFieldEnum)[keyof typeof EnvironmentScalarFieldEnum]


  export const DeployJobScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    environmentId: 'environmentId',
    triggeredByUserId: 'triggeredByUserId',
    status: 'status',
    currentStep: 'currentStep',
    steps: 'steps',
    source: 'source',
    executionModeSnapshot: 'executionModeSnapshot',
    createdAt: 'createdAt',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt'
  };

  export type DeployJobScalarFieldEnum = (typeof DeployJobScalarFieldEnum)[keyof typeof DeployJobScalarFieldEnum]


  export const WizardBuildScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    projectId: 'projectId',
    version: 'version',
    inputs: 'inputs',
    manifest: 'manifest',
    lock: 'lock',
    createdAt: 'createdAt'
  };

  export type WizardBuildScalarFieldEnum = (typeof WizardBuildScalarFieldEnum)[keyof typeof WizardBuildScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    planId: 'planId',
    status: 'status',
    stripeSubscriptionId: 'stripeSubscriptionId',
    currentPeriodStart: 'currentPeriodStart',
    currentPeriodEnd: 'currentPeriodEnd',
    cancelAtPeriodEnd: 'cancelAtPeriodEnd',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const UserPaymentMethodScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    stripePaymentMethodId: 'stripePaymentMethodId',
    type: 'type',
    last4: 'last4',
    brand: 'brand',
    expiryMonth: 'expiryMonth',
    expiryYear: 'expiryYear',
    isDefault: 'isDefault',
    createdAt: 'createdAt'
  };

  export type UserPaymentMethodScalarFieldEnum = (typeof UserPaymentMethodScalarFieldEnum)[keyof typeof UserPaymentMethodScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    stripePaymentId: 'stripePaymentId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    description: 'description',
    createdAt: 'createdAt'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    stripeInvoiceId: 'stripeInvoiceId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    paidAt: 'paidAt',
    dueDate: 'dueDate',
    invoiceUrl: 'invoiceUrl',
    pdfUrl: 'pdfUrl',
    createdAt: 'createdAt'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const StripeWebhookEventScalarFieldEnum: {
    id: 'id',
    type: 'type',
    createdAt: 'createdAt'
  };

  export type StripeWebhookEventScalarFieldEnum = (typeof StripeWebhookEventScalarFieldEnum)[keyof typeof StripeWebhookEventScalarFieldEnum]


  export const UsageCounterScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    featureId: 'featureId',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    used: 'used',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UsageCounterScalarFieldEnum = (typeof UsageCounterScalarFieldEnum)[keyof typeof UsageCounterScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DeployJobStatus'
   */
  export type EnumDeployJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeployJobStatus'>
    


  /**
   * Reference to a field of type 'DeployJobStatus[]'
   */
  export type ListEnumDeployJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeployJobStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    fullName?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    hashedPassword?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    isSuperuser?: BoolFilter<"User"> | boolean
    isEmailVerified?: BoolFilter<"User"> | boolean
    stripeCustomerId?: StringNullableFilter<"User"> | string | null
    novuSubscriberId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    projects?: ProjectListRelationFilter
    environments?: EnvironmentListRelationFilter
    deployJobs?: DeployJobListRelationFilter
    wizardBuilds?: WizardBuildListRelationFilter
    otps?: OtpListRelationFilter
    oauthAccounts?: OAuthAccountListRelationFilter
    paymentMethods?: UserPaymentMethodListRelationFilter
    payments?: PaymentListRelationFilter
    invoices?: InvoiceListRelationFilter
    subscriptions?: SubscriptionListRelationFilter
    usageCounters?: UsageCounterListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    fullName?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    hashedPassword?: SortOrder
    isActive?: SortOrder
    isSuperuser?: SortOrder
    isEmailVerified?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    novuSubscriberId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
    environments?: EnvironmentOrderByRelationAggregateInput
    deployJobs?: DeployJobOrderByRelationAggregateInput
    wizardBuilds?: WizardBuildOrderByRelationAggregateInput
    otps?: OtpOrderByRelationAggregateInput
    oauthAccounts?: OAuthAccountOrderByRelationAggregateInput
    paymentMethods?: UserPaymentMethodOrderByRelationAggregateInput
    payments?: PaymentOrderByRelationAggregateInput
    invoices?: InvoiceOrderByRelationAggregateInput
    subscriptions?: SubscriptionOrderByRelationAggregateInput
    usageCounters?: UsageCounterOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    stripeCustomerId?: string
    novuSubscriberId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    fullName?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    hashedPassword?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    isSuperuser?: BoolFilter<"User"> | boolean
    isEmailVerified?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    projects?: ProjectListRelationFilter
    environments?: EnvironmentListRelationFilter
    deployJobs?: DeployJobListRelationFilter
    wizardBuilds?: WizardBuildListRelationFilter
    otps?: OtpListRelationFilter
    oauthAccounts?: OAuthAccountListRelationFilter
    paymentMethods?: UserPaymentMethodListRelationFilter
    payments?: PaymentListRelationFilter
    invoices?: InvoiceListRelationFilter
    subscriptions?: SubscriptionListRelationFilter
    usageCounters?: UsageCounterListRelationFilter
  }, "id" | "email" | "username" | "stripeCustomerId" | "novuSubscriberId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    fullName?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    hashedPassword?: SortOrder
    isActive?: SortOrder
    isSuperuser?: SortOrder
    isEmailVerified?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    novuSubscriberId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringNullableWithAggregatesFilter<"User"> | string | null
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    hashedPassword?: StringWithAggregatesFilter<"User"> | string
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    isSuperuser?: BoolWithAggregatesFilter<"User"> | boolean
    isEmailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    stripeCustomerId?: StringNullableWithAggregatesFilter<"User"> | string | null
    novuSubscriberId?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type OAuthAccountWhereInput = {
    AND?: OAuthAccountWhereInput | OAuthAccountWhereInput[]
    OR?: OAuthAccountWhereInput[]
    NOT?: OAuthAccountWhereInput | OAuthAccountWhereInput[]
    id?: StringFilter<"OAuthAccount"> | string
    userId?: StringFilter<"OAuthAccount"> | string
    provider?: StringFilter<"OAuthAccount"> | string
    accountId?: StringFilter<"OAuthAccount"> | string
    accountEmail?: StringNullableFilter<"OAuthAccount"> | string | null
    accessToken?: StringNullableFilter<"OAuthAccount"> | string | null
    refreshToken?: StringNullableFilter<"OAuthAccount"> | string | null
    expiresAt?: DateTimeNullableFilter<"OAuthAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"OAuthAccount"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type OAuthAccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    accountId?: SortOrder
    accountEmail?: SortOrderInput | SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type OAuthAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_accountId?: OAuthAccountProviderAccountIdCompoundUniqueInput
    AND?: OAuthAccountWhereInput | OAuthAccountWhereInput[]
    OR?: OAuthAccountWhereInput[]
    NOT?: OAuthAccountWhereInput | OAuthAccountWhereInput[]
    userId?: StringFilter<"OAuthAccount"> | string
    provider?: StringFilter<"OAuthAccount"> | string
    accountId?: StringFilter<"OAuthAccount"> | string
    accountEmail?: StringNullableFilter<"OAuthAccount"> | string | null
    accessToken?: StringNullableFilter<"OAuthAccount"> | string | null
    refreshToken?: StringNullableFilter<"OAuthAccount"> | string | null
    expiresAt?: DateTimeNullableFilter<"OAuthAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"OAuthAccount"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_accountId">

  export type OAuthAccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    accountId?: SortOrder
    accountEmail?: SortOrderInput | SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: OAuthAccountCountOrderByAggregateInput
    _max?: OAuthAccountMaxOrderByAggregateInput
    _min?: OAuthAccountMinOrderByAggregateInput
  }

  export type OAuthAccountScalarWhereWithAggregatesInput = {
    AND?: OAuthAccountScalarWhereWithAggregatesInput | OAuthAccountScalarWhereWithAggregatesInput[]
    OR?: OAuthAccountScalarWhereWithAggregatesInput[]
    NOT?: OAuthAccountScalarWhereWithAggregatesInput | OAuthAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OAuthAccount"> | string
    userId?: StringWithAggregatesFilter<"OAuthAccount"> | string
    provider?: StringWithAggregatesFilter<"OAuthAccount"> | string
    accountId?: StringWithAggregatesFilter<"OAuthAccount"> | string
    accountEmail?: StringNullableWithAggregatesFilter<"OAuthAccount"> | string | null
    accessToken?: StringNullableWithAggregatesFilter<"OAuthAccount"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"OAuthAccount"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"OAuthAccount"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"OAuthAccount"> | Date | string
  }

  export type OtpWhereInput = {
    AND?: OtpWhereInput | OtpWhereInput[]
    OR?: OtpWhereInput[]
    NOT?: OtpWhereInput | OtpWhereInput[]
    id?: StringFilter<"Otp"> | string
    userId?: StringFilter<"Otp"> | string
    codeHash?: StringFilter<"Otp"> | string
    idempotencyKey?: StringNullableFilter<"Otp"> | string | null
    purpose?: StringFilter<"Otp"> | string
    attemptsCount?: IntFilter<"Otp"> | number
    isUsed?: BoolFilter<"Otp"> | boolean
    expiresAt?: DateTimeFilter<"Otp"> | Date | string
    nextRequestAt?: DateTimeNullableFilter<"Otp"> | Date | string | null
    createdAt?: DateTimeFilter<"Otp"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type OtpOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    idempotencyKey?: SortOrderInput | SortOrder
    purpose?: SortOrder
    attemptsCount?: SortOrder
    isUsed?: SortOrder
    expiresAt?: SortOrder
    nextRequestAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type OtpWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    idempotencyKey?: string
    AND?: OtpWhereInput | OtpWhereInput[]
    OR?: OtpWhereInput[]
    NOT?: OtpWhereInput | OtpWhereInput[]
    userId?: StringFilter<"Otp"> | string
    codeHash?: StringFilter<"Otp"> | string
    purpose?: StringFilter<"Otp"> | string
    attemptsCount?: IntFilter<"Otp"> | number
    isUsed?: BoolFilter<"Otp"> | boolean
    expiresAt?: DateTimeFilter<"Otp"> | Date | string
    nextRequestAt?: DateTimeNullableFilter<"Otp"> | Date | string | null
    createdAt?: DateTimeFilter<"Otp"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "idempotencyKey">

  export type OtpOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    idempotencyKey?: SortOrderInput | SortOrder
    purpose?: SortOrder
    attemptsCount?: SortOrder
    isUsed?: SortOrder
    expiresAt?: SortOrder
    nextRequestAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: OtpCountOrderByAggregateInput
    _avg?: OtpAvgOrderByAggregateInput
    _max?: OtpMaxOrderByAggregateInput
    _min?: OtpMinOrderByAggregateInput
    _sum?: OtpSumOrderByAggregateInput
  }

  export type OtpScalarWhereWithAggregatesInput = {
    AND?: OtpScalarWhereWithAggregatesInput | OtpScalarWhereWithAggregatesInput[]
    OR?: OtpScalarWhereWithAggregatesInput[]
    NOT?: OtpScalarWhereWithAggregatesInput | OtpScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Otp"> | string
    userId?: StringWithAggregatesFilter<"Otp"> | string
    codeHash?: StringWithAggregatesFilter<"Otp"> | string
    idempotencyKey?: StringNullableWithAggregatesFilter<"Otp"> | string | null
    purpose?: StringWithAggregatesFilter<"Otp"> | string
    attemptsCount?: IntWithAggregatesFilter<"Otp"> | number
    isUsed?: BoolWithAggregatesFilter<"Otp"> | boolean
    expiresAt?: DateTimeWithAggregatesFilter<"Otp"> | Date | string
    nextRequestAt?: DateTimeNullableWithAggregatesFilter<"Otp"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Otp"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    ownerId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    slug?: StringFilter<"Project"> | string
    repoExportEnabled?: BoolFilter<"Project"> | boolean
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    deployJobs?: DeployJobListRelationFilter
    wizardBuilds?: WizardBuildListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    repoExportEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    deployJobs?: DeployJobOrderByRelationAggregateInput
    wizardBuilds?: WizardBuildOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ownerId_slug?: ProjectOwnerIdSlugCompoundUniqueInput
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    ownerId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    slug?: StringFilter<"Project"> | string
    repoExportEnabled?: BoolFilter<"Project"> | boolean
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    deployJobs?: DeployJobListRelationFilter
    wizardBuilds?: WizardBuildListRelationFilter
  }, "id" | "ownerId_slug">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    repoExportEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    ownerId?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    slug?: StringWithAggregatesFilter<"Project"> | string
    repoExportEnabled?: BoolWithAggregatesFilter<"Project"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type EnvironmentWhereInput = {
    AND?: EnvironmentWhereInput | EnvironmentWhereInput[]
    OR?: EnvironmentWhereInput[]
    NOT?: EnvironmentWhereInput | EnvironmentWhereInput[]
    id?: StringFilter<"Environment"> | string
    ownerId?: StringFilter<"Environment"> | string
    projectId?: StringNullableFilter<"Environment"> | string | null
    name?: StringFilter<"Environment"> | string
    displayName?: StringFilter<"Environment"> | string
    tierPolicy?: StringFilter<"Environment"> | string
    executionMode?: StringFilter<"Environment"> | string
    region?: StringFilter<"Environment"> | string
    visibility?: StringFilter<"Environment"> | string
    config?: JsonNullableFilter<"Environment">
    createdAt?: DateTimeFilter<"Environment"> | Date | string
    updatedAt?: DateTimeFilter<"Environment"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    deployJobs?: DeployJobListRelationFilter
  }

  export type EnvironmentOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    name?: SortOrder
    displayName?: SortOrder
    tierPolicy?: SortOrder
    executionMode?: SortOrder
    region?: SortOrder
    visibility?: SortOrder
    config?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    deployJobs?: DeployJobOrderByRelationAggregateInput
  }

  export type EnvironmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ownerId_name?: EnvironmentOwnerIdNameCompoundUniqueInput
    AND?: EnvironmentWhereInput | EnvironmentWhereInput[]
    OR?: EnvironmentWhereInput[]
    NOT?: EnvironmentWhereInput | EnvironmentWhereInput[]
    ownerId?: StringFilter<"Environment"> | string
    projectId?: StringNullableFilter<"Environment"> | string | null
    name?: StringFilter<"Environment"> | string
    displayName?: StringFilter<"Environment"> | string
    tierPolicy?: StringFilter<"Environment"> | string
    executionMode?: StringFilter<"Environment"> | string
    region?: StringFilter<"Environment"> | string
    visibility?: StringFilter<"Environment"> | string
    config?: JsonNullableFilter<"Environment">
    createdAt?: DateTimeFilter<"Environment"> | Date | string
    updatedAt?: DateTimeFilter<"Environment"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    deployJobs?: DeployJobListRelationFilter
  }, "id" | "ownerId_name">

  export type EnvironmentOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    name?: SortOrder
    displayName?: SortOrder
    tierPolicy?: SortOrder
    executionMode?: SortOrder
    region?: SortOrder
    visibility?: SortOrder
    config?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EnvironmentCountOrderByAggregateInput
    _max?: EnvironmentMaxOrderByAggregateInput
    _min?: EnvironmentMinOrderByAggregateInput
  }

  export type EnvironmentScalarWhereWithAggregatesInput = {
    AND?: EnvironmentScalarWhereWithAggregatesInput | EnvironmentScalarWhereWithAggregatesInput[]
    OR?: EnvironmentScalarWhereWithAggregatesInput[]
    NOT?: EnvironmentScalarWhereWithAggregatesInput | EnvironmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Environment"> | string
    ownerId?: StringWithAggregatesFilter<"Environment"> | string
    projectId?: StringNullableWithAggregatesFilter<"Environment"> | string | null
    name?: StringWithAggregatesFilter<"Environment"> | string
    displayName?: StringWithAggregatesFilter<"Environment"> | string
    tierPolicy?: StringWithAggregatesFilter<"Environment"> | string
    executionMode?: StringWithAggregatesFilter<"Environment"> | string
    region?: StringWithAggregatesFilter<"Environment"> | string
    visibility?: StringWithAggregatesFilter<"Environment"> | string
    config?: JsonNullableWithAggregatesFilter<"Environment">
    createdAt?: DateTimeWithAggregatesFilter<"Environment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Environment"> | Date | string
  }

  export type DeployJobWhereInput = {
    AND?: DeployJobWhereInput | DeployJobWhereInput[]
    OR?: DeployJobWhereInput[]
    NOT?: DeployJobWhereInput | DeployJobWhereInput[]
    id?: StringFilter<"DeployJob"> | string
    projectId?: StringFilter<"DeployJob"> | string
    environmentId?: StringFilter<"DeployJob"> | string
    triggeredByUserId?: StringNullableFilter<"DeployJob"> | string | null
    status?: EnumDeployJobStatusFilter<"DeployJob"> | $Enums.DeployJobStatus
    currentStep?: StringNullableFilter<"DeployJob"> | string | null
    steps?: JsonFilter<"DeployJob">
    source?: JsonFilter<"DeployJob">
    executionModeSnapshot?: StringFilter<"DeployJob"> | string
    createdAt?: DateTimeFilter<"DeployJob"> | Date | string
    startedAt?: DateTimeNullableFilter<"DeployJob"> | Date | string | null
    finishedAt?: DateTimeNullableFilter<"DeployJob"> | Date | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    environment?: XOR<EnvironmentScalarRelationFilter, EnvironmentWhereInput>
    triggeredBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type DeployJobOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    environmentId?: SortOrder
    triggeredByUserId?: SortOrderInput | SortOrder
    status?: SortOrder
    currentStep?: SortOrderInput | SortOrder
    steps?: SortOrder
    source?: SortOrder
    executionModeSnapshot?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    finishedAt?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
    environment?: EnvironmentOrderByWithRelationInput
    triggeredBy?: UserOrderByWithRelationInput
  }

  export type DeployJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DeployJobWhereInput | DeployJobWhereInput[]
    OR?: DeployJobWhereInput[]
    NOT?: DeployJobWhereInput | DeployJobWhereInput[]
    projectId?: StringFilter<"DeployJob"> | string
    environmentId?: StringFilter<"DeployJob"> | string
    triggeredByUserId?: StringNullableFilter<"DeployJob"> | string | null
    status?: EnumDeployJobStatusFilter<"DeployJob"> | $Enums.DeployJobStatus
    currentStep?: StringNullableFilter<"DeployJob"> | string | null
    steps?: JsonFilter<"DeployJob">
    source?: JsonFilter<"DeployJob">
    executionModeSnapshot?: StringFilter<"DeployJob"> | string
    createdAt?: DateTimeFilter<"DeployJob"> | Date | string
    startedAt?: DateTimeNullableFilter<"DeployJob"> | Date | string | null
    finishedAt?: DateTimeNullableFilter<"DeployJob"> | Date | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    environment?: XOR<EnvironmentScalarRelationFilter, EnvironmentWhereInput>
    triggeredBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type DeployJobOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    environmentId?: SortOrder
    triggeredByUserId?: SortOrderInput | SortOrder
    status?: SortOrder
    currentStep?: SortOrderInput | SortOrder
    steps?: SortOrder
    source?: SortOrder
    executionModeSnapshot?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    finishedAt?: SortOrderInput | SortOrder
    _count?: DeployJobCountOrderByAggregateInput
    _max?: DeployJobMaxOrderByAggregateInput
    _min?: DeployJobMinOrderByAggregateInput
  }

  export type DeployJobScalarWhereWithAggregatesInput = {
    AND?: DeployJobScalarWhereWithAggregatesInput | DeployJobScalarWhereWithAggregatesInput[]
    OR?: DeployJobScalarWhereWithAggregatesInput[]
    NOT?: DeployJobScalarWhereWithAggregatesInput | DeployJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DeployJob"> | string
    projectId?: StringWithAggregatesFilter<"DeployJob"> | string
    environmentId?: StringWithAggregatesFilter<"DeployJob"> | string
    triggeredByUserId?: StringNullableWithAggregatesFilter<"DeployJob"> | string | null
    status?: EnumDeployJobStatusWithAggregatesFilter<"DeployJob"> | $Enums.DeployJobStatus
    currentStep?: StringNullableWithAggregatesFilter<"DeployJob"> | string | null
    steps?: JsonWithAggregatesFilter<"DeployJob">
    source?: JsonWithAggregatesFilter<"DeployJob">
    executionModeSnapshot?: StringWithAggregatesFilter<"DeployJob"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DeployJob"> | Date | string
    startedAt?: DateTimeNullableWithAggregatesFilter<"DeployJob"> | Date | string | null
    finishedAt?: DateTimeNullableWithAggregatesFilter<"DeployJob"> | Date | string | null
  }

  export type WizardBuildWhereInput = {
    AND?: WizardBuildWhereInput | WizardBuildWhereInput[]
    OR?: WizardBuildWhereInput[]
    NOT?: WizardBuildWhereInput | WizardBuildWhereInput[]
    id?: StringFilter<"WizardBuild"> | string
    ownerId?: StringFilter<"WizardBuild"> | string
    projectId?: StringFilter<"WizardBuild"> | string
    version?: StringFilter<"WizardBuild"> | string
    inputs?: JsonFilter<"WizardBuild">
    manifest?: JsonFilter<"WizardBuild">
    lock?: JsonNullableFilter<"WizardBuild">
    createdAt?: DateTimeFilter<"WizardBuild"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type WizardBuildOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    projectId?: SortOrder
    version?: SortOrder
    inputs?: SortOrder
    manifest?: SortOrder
    lock?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    project?: ProjectOrderByWithRelationInput
  }

  export type WizardBuildWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WizardBuildWhereInput | WizardBuildWhereInput[]
    OR?: WizardBuildWhereInput[]
    NOT?: WizardBuildWhereInput | WizardBuildWhereInput[]
    ownerId?: StringFilter<"WizardBuild"> | string
    projectId?: StringFilter<"WizardBuild"> | string
    version?: StringFilter<"WizardBuild"> | string
    inputs?: JsonFilter<"WizardBuild">
    manifest?: JsonFilter<"WizardBuild">
    lock?: JsonNullableFilter<"WizardBuild">
    createdAt?: DateTimeFilter<"WizardBuild"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type WizardBuildOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    projectId?: SortOrder
    version?: SortOrder
    inputs?: SortOrder
    manifest?: SortOrder
    lock?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: WizardBuildCountOrderByAggregateInput
    _max?: WizardBuildMaxOrderByAggregateInput
    _min?: WizardBuildMinOrderByAggregateInput
  }

  export type WizardBuildScalarWhereWithAggregatesInput = {
    AND?: WizardBuildScalarWhereWithAggregatesInput | WizardBuildScalarWhereWithAggregatesInput[]
    OR?: WizardBuildScalarWhereWithAggregatesInput[]
    NOT?: WizardBuildScalarWhereWithAggregatesInput | WizardBuildScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WizardBuild"> | string
    ownerId?: StringWithAggregatesFilter<"WizardBuild"> | string
    projectId?: StringWithAggregatesFilter<"WizardBuild"> | string
    version?: StringWithAggregatesFilter<"WizardBuild"> | string
    inputs?: JsonWithAggregatesFilter<"WizardBuild">
    manifest?: JsonWithAggregatesFilter<"WizardBuild">
    lock?: JsonNullableWithAggregatesFilter<"WizardBuild">
    createdAt?: DateTimeWithAggregatesFilter<"WizardBuild"> | Date | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    planId?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    stripeSubscriptionId?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeFilter<"Subscription"> | Date | string
    currentPeriodEnd?: DateTimeFilter<"Subscription"> | Date | string
    cancelAtPeriodEnd?: BoolFilter<"Subscription"> | boolean
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    planId?: SortOrderInput | SortOrder
    status?: SortOrder
    stripeSubscriptionId?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripeSubscriptionId?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    userId?: StringFilter<"Subscription"> | string
    planId?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeFilter<"Subscription"> | Date | string
    currentPeriodEnd?: DateTimeFilter<"Subscription"> | Date | string
    cancelAtPeriodEnd?: BoolFilter<"Subscription"> | boolean
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "stripeSubscriptionId">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    planId?: SortOrderInput | SortOrder
    status?: SortOrder
    stripeSubscriptionId?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    userId?: StringWithAggregatesFilter<"Subscription"> | string
    planId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    status?: StringWithAggregatesFilter<"Subscription"> | string
    stripeSubscriptionId?: StringWithAggregatesFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    currentPeriodEnd?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    cancelAtPeriodEnd?: BoolWithAggregatesFilter<"Subscription"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type UserPaymentMethodWhereInput = {
    AND?: UserPaymentMethodWhereInput | UserPaymentMethodWhereInput[]
    OR?: UserPaymentMethodWhereInput[]
    NOT?: UserPaymentMethodWhereInput | UserPaymentMethodWhereInput[]
    id?: StringFilter<"UserPaymentMethod"> | string
    userId?: StringFilter<"UserPaymentMethod"> | string
    stripePaymentMethodId?: StringFilter<"UserPaymentMethod"> | string
    type?: StringFilter<"UserPaymentMethod"> | string
    last4?: StringFilter<"UserPaymentMethod"> | string
    brand?: StringNullableFilter<"UserPaymentMethod"> | string | null
    expiryMonth?: IntNullableFilter<"UserPaymentMethod"> | number | null
    expiryYear?: IntNullableFilter<"UserPaymentMethod"> | number | null
    isDefault?: BoolFilter<"UserPaymentMethod"> | boolean
    createdAt?: DateTimeFilter<"UserPaymentMethod"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserPaymentMethodOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentMethodId?: SortOrder
    type?: SortOrder
    last4?: SortOrder
    brand?: SortOrderInput | SortOrder
    expiryMonth?: SortOrderInput | SortOrder
    expiryYear?: SortOrderInput | SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserPaymentMethodWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripePaymentMethodId?: string
    AND?: UserPaymentMethodWhereInput | UserPaymentMethodWhereInput[]
    OR?: UserPaymentMethodWhereInput[]
    NOT?: UserPaymentMethodWhereInput | UserPaymentMethodWhereInput[]
    userId?: StringFilter<"UserPaymentMethod"> | string
    type?: StringFilter<"UserPaymentMethod"> | string
    last4?: StringFilter<"UserPaymentMethod"> | string
    brand?: StringNullableFilter<"UserPaymentMethod"> | string | null
    expiryMonth?: IntNullableFilter<"UserPaymentMethod"> | number | null
    expiryYear?: IntNullableFilter<"UserPaymentMethod"> | number | null
    isDefault?: BoolFilter<"UserPaymentMethod"> | boolean
    createdAt?: DateTimeFilter<"UserPaymentMethod"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "stripePaymentMethodId">

  export type UserPaymentMethodOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentMethodId?: SortOrder
    type?: SortOrder
    last4?: SortOrder
    brand?: SortOrderInput | SortOrder
    expiryMonth?: SortOrderInput | SortOrder
    expiryYear?: SortOrderInput | SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    _count?: UserPaymentMethodCountOrderByAggregateInput
    _avg?: UserPaymentMethodAvgOrderByAggregateInput
    _max?: UserPaymentMethodMaxOrderByAggregateInput
    _min?: UserPaymentMethodMinOrderByAggregateInput
    _sum?: UserPaymentMethodSumOrderByAggregateInput
  }

  export type UserPaymentMethodScalarWhereWithAggregatesInput = {
    AND?: UserPaymentMethodScalarWhereWithAggregatesInput | UserPaymentMethodScalarWhereWithAggregatesInput[]
    OR?: UserPaymentMethodScalarWhereWithAggregatesInput[]
    NOT?: UserPaymentMethodScalarWhereWithAggregatesInput | UserPaymentMethodScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserPaymentMethod"> | string
    userId?: StringWithAggregatesFilter<"UserPaymentMethod"> | string
    stripePaymentMethodId?: StringWithAggregatesFilter<"UserPaymentMethod"> | string
    type?: StringWithAggregatesFilter<"UserPaymentMethod"> | string
    last4?: StringWithAggregatesFilter<"UserPaymentMethod"> | string
    brand?: StringNullableWithAggregatesFilter<"UserPaymentMethod"> | string | null
    expiryMonth?: IntNullableWithAggregatesFilter<"UserPaymentMethod"> | number | null
    expiryYear?: IntNullableWithAggregatesFilter<"UserPaymentMethod"> | number | null
    isDefault?: BoolWithAggregatesFilter<"UserPaymentMethod"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"UserPaymentMethod"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    userId?: StringFilter<"Payment"> | string
    stripePaymentId?: StringFilter<"Payment"> | string
    amount?: IntFilter<"Payment"> | number
    currency?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    description?: StringNullableFilter<"Payment"> | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripePaymentId?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    userId?: StringFilter<"Payment"> | string
    amount?: IntFilter<"Payment"> | number
    currency?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    description?: StringNullableFilter<"Payment"> | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "stripePaymentId">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    userId?: StringWithAggregatesFilter<"Payment"> | string
    stripePaymentId?: StringWithAggregatesFilter<"Payment"> | string
    amount?: IntWithAggregatesFilter<"Payment"> | number
    currency?: StringWithAggregatesFilter<"Payment"> | string
    status?: StringWithAggregatesFilter<"Payment"> | string
    description?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: StringFilter<"Invoice"> | string
    userId?: StringFilter<"Invoice"> | string
    stripeInvoiceId?: StringFilter<"Invoice"> | string
    amount?: IntFilter<"Invoice"> | number
    currency?: StringFilter<"Invoice"> | string
    status?: StringFilter<"Invoice"> | string
    paidAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    dueDate?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    invoiceUrl?: StringNullableFilter<"Invoice"> | string | null
    pdfUrl?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeInvoiceId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    dueDate?: SortOrderInput | SortOrder
    invoiceUrl?: SortOrderInput | SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripeInvoiceId?: string
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    userId?: StringFilter<"Invoice"> | string
    amount?: IntFilter<"Invoice"> | number
    currency?: StringFilter<"Invoice"> | string
    status?: StringFilter<"Invoice"> | string
    paidAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    dueDate?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    invoiceUrl?: StringNullableFilter<"Invoice"> | string | null
    pdfUrl?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "stripeInvoiceId">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeInvoiceId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    dueDate?: SortOrderInput | SortOrder
    invoiceUrl?: SortOrderInput | SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _avg?: InvoiceAvgOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
    _sum?: InvoiceSumOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invoice"> | string
    userId?: StringWithAggregatesFilter<"Invoice"> | string
    stripeInvoiceId?: StringWithAggregatesFilter<"Invoice"> | string
    amount?: IntWithAggregatesFilter<"Invoice"> | number
    currency?: StringWithAggregatesFilter<"Invoice"> | string
    status?: StringWithAggregatesFilter<"Invoice"> | string
    paidAt?: DateTimeNullableWithAggregatesFilter<"Invoice"> | Date | string | null
    dueDate?: DateTimeNullableWithAggregatesFilter<"Invoice"> | Date | string | null
    invoiceUrl?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    pdfUrl?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
  }

  export type StripeWebhookEventWhereInput = {
    AND?: StripeWebhookEventWhereInput | StripeWebhookEventWhereInput[]
    OR?: StripeWebhookEventWhereInput[]
    NOT?: StripeWebhookEventWhereInput | StripeWebhookEventWhereInput[]
    id?: StringFilter<"StripeWebhookEvent"> | string
    type?: StringFilter<"StripeWebhookEvent"> | string
    createdAt?: DateTimeFilter<"StripeWebhookEvent"> | Date | string
  }

  export type StripeWebhookEventOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type StripeWebhookEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StripeWebhookEventWhereInput | StripeWebhookEventWhereInput[]
    OR?: StripeWebhookEventWhereInput[]
    NOT?: StripeWebhookEventWhereInput | StripeWebhookEventWhereInput[]
    type?: StringFilter<"StripeWebhookEvent"> | string
    createdAt?: DateTimeFilter<"StripeWebhookEvent"> | Date | string
  }, "id">

  export type StripeWebhookEventOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    _count?: StripeWebhookEventCountOrderByAggregateInput
    _max?: StripeWebhookEventMaxOrderByAggregateInput
    _min?: StripeWebhookEventMinOrderByAggregateInput
  }

  export type StripeWebhookEventScalarWhereWithAggregatesInput = {
    AND?: StripeWebhookEventScalarWhereWithAggregatesInput | StripeWebhookEventScalarWhereWithAggregatesInput[]
    OR?: StripeWebhookEventScalarWhereWithAggregatesInput[]
    NOT?: StripeWebhookEventScalarWhereWithAggregatesInput | StripeWebhookEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StripeWebhookEvent"> | string
    type?: StringWithAggregatesFilter<"StripeWebhookEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"StripeWebhookEvent"> | Date | string
  }

  export type UsageCounterWhereInput = {
    AND?: UsageCounterWhereInput | UsageCounterWhereInput[]
    OR?: UsageCounterWhereInput[]
    NOT?: UsageCounterWhereInput | UsageCounterWhereInput[]
    id?: StringFilter<"UsageCounter"> | string
    userId?: StringFilter<"UsageCounter"> | string
    featureId?: StringFilter<"UsageCounter"> | string
    periodStart?: DateTimeFilter<"UsageCounter"> | Date | string
    periodEnd?: DateTimeFilter<"UsageCounter"> | Date | string
    used?: IntFilter<"UsageCounter"> | number
    createdAt?: DateTimeFilter<"UsageCounter"> | Date | string
    updatedAt?: DateTimeFilter<"UsageCounter"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UsageCounterOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    featureId?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UsageCounterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_featureId_periodStart_periodEnd?: UsageCounterUserIdFeatureIdPeriodStartPeriodEndCompoundUniqueInput
    AND?: UsageCounterWhereInput | UsageCounterWhereInput[]
    OR?: UsageCounterWhereInput[]
    NOT?: UsageCounterWhereInput | UsageCounterWhereInput[]
    userId?: StringFilter<"UsageCounter"> | string
    featureId?: StringFilter<"UsageCounter"> | string
    periodStart?: DateTimeFilter<"UsageCounter"> | Date | string
    periodEnd?: DateTimeFilter<"UsageCounter"> | Date | string
    used?: IntFilter<"UsageCounter"> | number
    createdAt?: DateTimeFilter<"UsageCounter"> | Date | string
    updatedAt?: DateTimeFilter<"UsageCounter"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_featureId_periodStart_periodEnd">

  export type UsageCounterOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    featureId?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UsageCounterCountOrderByAggregateInput
    _avg?: UsageCounterAvgOrderByAggregateInput
    _max?: UsageCounterMaxOrderByAggregateInput
    _min?: UsageCounterMinOrderByAggregateInput
    _sum?: UsageCounterSumOrderByAggregateInput
  }

  export type UsageCounterScalarWhereWithAggregatesInput = {
    AND?: UsageCounterScalarWhereWithAggregatesInput | UsageCounterScalarWhereWithAggregatesInput[]
    OR?: UsageCounterScalarWhereWithAggregatesInput[]
    NOT?: UsageCounterScalarWhereWithAggregatesInput | UsageCounterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UsageCounter"> | string
    userId?: StringWithAggregatesFilter<"UsageCounter"> | string
    featureId?: StringWithAggregatesFilter<"UsageCounter"> | string
    periodStart?: DateTimeWithAggregatesFilter<"UsageCounter"> | Date | string
    periodEnd?: DateTimeWithAggregatesFilter<"UsageCounter"> | Date | string
    used?: IntWithAggregatesFilter<"UsageCounter"> | number
    createdAt?: DateTimeWithAggregatesFilter<"UsageCounter"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UsageCounter"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    otps?: OtpCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountCreateInput = {
    id?: string
    provider: string
    accountId: string
    accountEmail?: string | null
    accessToken?: string | null
    refreshToken?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutOauthAccountsInput
  }

  export type OAuthAccountUncheckedCreateInput = {
    id?: string
    userId: string
    provider: string
    accountId: string
    accountEmail?: string | null
    accessToken?: string | null
    refreshToken?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OAuthAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountEmail?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOauthAccountsNestedInput
  }

  export type OAuthAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountEmail?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountCreateManyInput = {
    id?: string
    userId: string
    provider: string
    accountId: string
    accountEmail?: string | null
    accessToken?: string | null
    refreshToken?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OAuthAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountEmail?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountEmail?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpCreateInput = {
    id?: string
    codeHash: string
    idempotencyKey?: string | null
    purpose: string
    attemptsCount?: number
    isUsed?: boolean
    expiresAt: Date | string
    nextRequestAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutOtpsInput
  }

  export type OtpUncheckedCreateInput = {
    id?: string
    userId: string
    codeHash: string
    idempotencyKey?: string | null
    purpose: string
    attemptsCount?: number
    isUsed?: boolean
    expiresAt: Date | string
    nextRequestAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OtpUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRequestAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOtpsNestedInput
  }

  export type OtpUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRequestAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpCreateManyInput = {
    id?: string
    userId: string
    codeHash: string
    idempotencyKey?: string | null
    purpose: string
    attemptsCount?: number
    isUsed?: boolean
    expiresAt: Date | string
    nextRequestAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OtpUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRequestAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRequestAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    slug: string
    repoExportEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutProjectsInput
    deployJobs?: DeployJobCreateNestedManyWithoutProjectInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    ownerId: string
    name: string
    slug: string
    repoExportEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutProjectInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutProjectsNestedInput
    deployJobs?: DeployJobUpdateManyWithoutProjectNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployJobs?: DeployJobUncheckedUpdateManyWithoutProjectNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    ownerId: string
    name: string
    slug: string
    repoExportEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnvironmentCreateInput = {
    id?: string
    projectId?: string | null
    name: string
    displayName: string
    tierPolicy?: string
    executionMode?: string
    region?: string
    visibility?: string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutEnvironmentsInput
    deployJobs?: DeployJobCreateNestedManyWithoutEnvironmentInput
  }

  export type EnvironmentUncheckedCreateInput = {
    id?: string
    ownerId: string
    projectId?: string | null
    name: string
    displayName: string
    tierPolicy?: string
    executionMode?: string
    region?: string
    visibility?: string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutEnvironmentInput
  }

  export type EnvironmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    tierPolicy?: StringFieldUpdateOperationsInput | string
    executionMode?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutEnvironmentsNestedInput
    deployJobs?: DeployJobUpdateManyWithoutEnvironmentNestedInput
  }

  export type EnvironmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    tierPolicy?: StringFieldUpdateOperationsInput | string
    executionMode?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployJobs?: DeployJobUncheckedUpdateManyWithoutEnvironmentNestedInput
  }

  export type EnvironmentCreateManyInput = {
    id?: string
    ownerId: string
    projectId?: string | null
    name: string
    displayName: string
    tierPolicy?: string
    executionMode?: string
    region?: string
    visibility?: string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EnvironmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    tierPolicy?: StringFieldUpdateOperationsInput | string
    executionMode?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnvironmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    tierPolicy?: StringFieldUpdateOperationsInput | string
    executionMode?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeployJobCreateInput = {
    id?: string
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutDeployJobsInput
    environment: EnvironmentCreateNestedOneWithoutDeployJobsInput
    triggeredBy?: UserCreateNestedOneWithoutDeployJobsInput
  }

  export type DeployJobUncheckedCreateInput = {
    id?: string
    projectId: string
    environmentId: string
    triggeredByUserId?: string | null
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
  }

  export type DeployJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutDeployJobsNestedInput
    environment?: EnvironmentUpdateOneRequiredWithoutDeployJobsNestedInput
    triggeredBy?: UserUpdateOneWithoutDeployJobsNestedInput
  }

  export type DeployJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DeployJobCreateManyInput = {
    id?: string
    projectId: string
    environmentId: string
    triggeredByUserId?: string | null
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
  }

  export type DeployJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DeployJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WizardBuildCreateInput = {
    id?: string
    version: string
    inputs: JsonNullValueInput | InputJsonValue
    manifest: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    owner: UserCreateNestedOneWithoutWizardBuildsInput
    project: ProjectCreateNestedOneWithoutWizardBuildsInput
  }

  export type WizardBuildUncheckedCreateInput = {
    id?: string
    ownerId: string
    projectId: string
    version: string
    inputs: JsonNullValueInput | InputJsonValue
    manifest: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type WizardBuildUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    manifest?: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutWizardBuildsNestedInput
    project?: ProjectUpdateOneRequiredWithoutWizardBuildsNestedInput
  }

  export type WizardBuildUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    manifest?: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WizardBuildCreateManyInput = {
    id?: string
    ownerId: string
    projectId: string
    version: string
    inputs: JsonNullValueInput | InputJsonValue
    manifest: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type WizardBuildUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    manifest?: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WizardBuildUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    manifest?: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateInput = {
    id?: string
    planId?: string | null
    status: string
    stripeSubscriptionId: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    userId: string
    planId?: string | null
    status: string
    stripeSubscriptionId: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    userId: string
    planId?: string | null
    status: string
    stripeSubscriptionId: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPaymentMethodCreateInput = {
    id?: string
    stripePaymentMethodId: string
    type: string
    last4: string
    brand?: string | null
    expiryMonth?: number | null
    expiryYear?: number | null
    isDefault?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPaymentMethodsInput
  }

  export type UserPaymentMethodUncheckedCreateInput = {
    id?: string
    userId: string
    stripePaymentMethodId: string
    type: string
    last4: string
    brand?: string | null
    expiryMonth?: number | null
    expiryYear?: number | null
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type UserPaymentMethodUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentMethodId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    last4?: StringFieldUpdateOperationsInput | string
    brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiryMonth?: NullableIntFieldUpdateOperationsInput | number | null
    expiryYear?: NullableIntFieldUpdateOperationsInput | number | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPaymentMethodsNestedInput
  }

  export type UserPaymentMethodUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripePaymentMethodId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    last4?: StringFieldUpdateOperationsInput | string
    brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiryMonth?: NullableIntFieldUpdateOperationsInput | number | null
    expiryYear?: NullableIntFieldUpdateOperationsInput | number | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPaymentMethodCreateManyInput = {
    id?: string
    userId: string
    stripePaymentMethodId: string
    type: string
    last4: string
    brand?: string | null
    expiryMonth?: number | null
    expiryYear?: number | null
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type UserPaymentMethodUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentMethodId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    last4?: StringFieldUpdateOperationsInput | string
    brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiryMonth?: NullableIntFieldUpdateOperationsInput | number | null
    expiryYear?: NullableIntFieldUpdateOperationsInput | number | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPaymentMethodUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripePaymentMethodId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    last4?: StringFieldUpdateOperationsInput | string
    brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiryMonth?: NullableIntFieldUpdateOperationsInput | number | null
    expiryYear?: NullableIntFieldUpdateOperationsInput | number | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    id?: string
    stripePaymentId: string
    amount: number
    currency?: string
    status: string
    description?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    userId: string
    stripePaymentId: string
    amount: number
    currency?: string
    status: string
    description?: string | null
    createdAt?: Date | string
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyInput = {
    id?: string
    userId: string
    stripePaymentId: string
    amount: number
    currency?: string
    status: string
    description?: string | null
    createdAt?: Date | string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateInput = {
    id?: string
    stripeInvoiceId: string
    amount: number
    currency?: string
    status: string
    paidAt?: Date | string | null
    dueDate?: Date | string | null
    invoiceUrl?: string | null
    pdfUrl?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutInvoicesInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    userId: string
    stripeInvoiceId: string
    amount: number
    currency?: string
    status: string
    paidAt?: Date | string | null
    dueDate?: Date | string | null
    invoiceUrl?: string | null
    pdfUrl?: string | null
    createdAt?: Date | string
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutInvoicesNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateManyInput = {
    id?: string
    userId: string
    stripeInvoiceId: string
    amount: number
    currency?: string
    status: string
    paidAt?: Date | string | null
    dueDate?: Date | string | null
    invoiceUrl?: string | null
    pdfUrl?: string | null
    createdAt?: Date | string
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StripeWebhookEventCreateInput = {
    id: string
    type: string
    createdAt?: Date | string
  }

  export type StripeWebhookEventUncheckedCreateInput = {
    id: string
    type: string
    createdAt?: Date | string
  }

  export type StripeWebhookEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StripeWebhookEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StripeWebhookEventCreateManyInput = {
    id: string
    type: string
    createdAt?: Date | string
  }

  export type StripeWebhookEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StripeWebhookEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageCounterCreateInput = {
    id?: string
    featureId: string
    periodStart: Date | string
    periodEnd: Date | string
    used?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUsageCountersInput
  }

  export type UsageCounterUncheckedCreateInput = {
    id?: string
    userId: string
    featureId: string
    periodStart: Date | string
    periodEnd: Date | string
    used?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsageCounterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    featureId?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUsageCountersNestedInput
  }

  export type UsageCounterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    featureId?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageCounterCreateManyInput = {
    id?: string
    userId: string
    featureId: string
    periodStart: Date | string
    periodEnd: Date | string
    used?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsageCounterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    featureId?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageCounterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    featureId?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type EnvironmentListRelationFilter = {
    every?: EnvironmentWhereInput
    some?: EnvironmentWhereInput
    none?: EnvironmentWhereInput
  }

  export type DeployJobListRelationFilter = {
    every?: DeployJobWhereInput
    some?: DeployJobWhereInput
    none?: DeployJobWhereInput
  }

  export type WizardBuildListRelationFilter = {
    every?: WizardBuildWhereInput
    some?: WizardBuildWhereInput
    none?: WizardBuildWhereInput
  }

  export type OtpListRelationFilter = {
    every?: OtpWhereInput
    some?: OtpWhereInput
    none?: OtpWhereInput
  }

  export type OAuthAccountListRelationFilter = {
    every?: OAuthAccountWhereInput
    some?: OAuthAccountWhereInput
    none?: OAuthAccountWhereInput
  }

  export type UserPaymentMethodListRelationFilter = {
    every?: UserPaymentMethodWhereInput
    some?: UserPaymentMethodWhereInput
    none?: UserPaymentMethodWhereInput
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type InvoiceListRelationFilter = {
    every?: InvoiceWhereInput
    some?: InvoiceWhereInput
    none?: InvoiceWhereInput
  }

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput
    some?: SubscriptionWhereInput
    none?: SubscriptionWhereInput
  }

  export type UsageCounterListRelationFilter = {
    every?: UsageCounterWhereInput
    some?: UsageCounterWhereInput
    none?: UsageCounterWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EnvironmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeployJobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WizardBuildOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OtpOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OAuthAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserPaymentMethodOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsageCounterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    fullName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    hashedPassword?: SortOrder
    isActive?: SortOrder
    isSuperuser?: SortOrder
    isEmailVerified?: SortOrder
    stripeCustomerId?: SortOrder
    novuSubscriberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    fullName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    hashedPassword?: SortOrder
    isActive?: SortOrder
    isSuperuser?: SortOrder
    isEmailVerified?: SortOrder
    stripeCustomerId?: SortOrder
    novuSubscriberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    fullName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    hashedPassword?: SortOrder
    isActive?: SortOrder
    isSuperuser?: SortOrder
    isEmailVerified?: SortOrder
    stripeCustomerId?: SortOrder
    novuSubscriberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type OAuthAccountProviderAccountIdCompoundUniqueInput = {
    provider: string
    accountId: string
  }

  export type OAuthAccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    accountId?: SortOrder
    accountEmail?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OAuthAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    accountId?: SortOrder
    accountEmail?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OAuthAccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    accountId?: SortOrder
    accountEmail?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type OtpCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    idempotencyKey?: SortOrder
    purpose?: SortOrder
    attemptsCount?: SortOrder
    isUsed?: SortOrder
    expiresAt?: SortOrder
    nextRequestAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OtpAvgOrderByAggregateInput = {
    attemptsCount?: SortOrder
  }

  export type OtpMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    idempotencyKey?: SortOrder
    purpose?: SortOrder
    attemptsCount?: SortOrder
    isUsed?: SortOrder
    expiresAt?: SortOrder
    nextRequestAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OtpMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    idempotencyKey?: SortOrder
    purpose?: SortOrder
    attemptsCount?: SortOrder
    isUsed?: SortOrder
    expiresAt?: SortOrder
    nextRequestAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OtpSumOrderByAggregateInput = {
    attemptsCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ProjectOwnerIdSlugCompoundUniqueInput = {
    ownerId: string
    slug: string
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    repoExportEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    repoExportEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    repoExportEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnvironmentOwnerIdNameCompoundUniqueInput = {
    ownerId: string
    name: string
  }

  export type EnvironmentCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    tierPolicy?: SortOrder
    executionMode?: SortOrder
    region?: SortOrder
    visibility?: SortOrder
    config?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnvironmentMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    tierPolicy?: SortOrder
    executionMode?: SortOrder
    region?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnvironmentMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    tierPolicy?: SortOrder
    executionMode?: SortOrder
    region?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumDeployJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeployJobStatus | EnumDeployJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeployJobStatus[] | ListEnumDeployJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeployJobStatus[] | ListEnumDeployJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeployJobStatusFilter<$PrismaModel> | $Enums.DeployJobStatus
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type EnvironmentScalarRelationFilter = {
    is?: EnvironmentWhereInput
    isNot?: EnvironmentWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type DeployJobCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    environmentId?: SortOrder
    triggeredByUserId?: SortOrder
    status?: SortOrder
    currentStep?: SortOrder
    steps?: SortOrder
    source?: SortOrder
    executionModeSnapshot?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
  }

  export type DeployJobMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    environmentId?: SortOrder
    triggeredByUserId?: SortOrder
    status?: SortOrder
    currentStep?: SortOrder
    executionModeSnapshot?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
  }

  export type DeployJobMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    environmentId?: SortOrder
    triggeredByUserId?: SortOrder
    status?: SortOrder
    currentStep?: SortOrder
    executionModeSnapshot?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
  }

  export type EnumDeployJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeployJobStatus | EnumDeployJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeployJobStatus[] | ListEnumDeployJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeployJobStatus[] | ListEnumDeployJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeployJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeployJobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeployJobStatusFilter<$PrismaModel>
    _max?: NestedEnumDeployJobStatusFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type WizardBuildCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    projectId?: SortOrder
    version?: SortOrder
    inputs?: SortOrder
    manifest?: SortOrder
    lock?: SortOrder
    createdAt?: SortOrder
  }

  export type WizardBuildMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    projectId?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
  }

  export type WizardBuildMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    projectId?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    stripeSubscriptionId?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    stripeSubscriptionId?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    stripeSubscriptionId?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserPaymentMethodCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentMethodId?: SortOrder
    type?: SortOrder
    last4?: SortOrder
    brand?: SortOrder
    expiryMonth?: SortOrder
    expiryYear?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type UserPaymentMethodAvgOrderByAggregateInput = {
    expiryMonth?: SortOrder
    expiryYear?: SortOrder
  }

  export type UserPaymentMethodMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentMethodId?: SortOrder
    type?: SortOrder
    last4?: SortOrder
    brand?: SortOrder
    expiryMonth?: SortOrder
    expiryYear?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type UserPaymentMethodMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentMethodId?: SortOrder
    type?: SortOrder
    last4?: SortOrder
    brand?: SortOrder
    expiryMonth?: SortOrder
    expiryYear?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type UserPaymentMethodSumOrderByAggregateInput = {
    expiryMonth?: SortOrder
    expiryYear?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeInvoiceId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    dueDate?: SortOrder
    invoiceUrl?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type InvoiceAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeInvoiceId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    dueDate?: SortOrder
    invoiceUrl?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeInvoiceId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    dueDate?: SortOrder
    invoiceUrl?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type InvoiceSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type StripeWebhookEventCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type StripeWebhookEventMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type StripeWebhookEventMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageCounterUserIdFeatureIdPeriodStartPeriodEndCompoundUniqueInput = {
    userId: string
    featureId: string
    periodStart: Date | string
    periodEnd: Date | string
  }

  export type UsageCounterCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    featureId?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsageCounterAvgOrderByAggregateInput = {
    used?: SortOrder
  }

  export type UsageCounterMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    featureId?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsageCounterMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    featureId?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsageCounterSumOrderByAggregateInput = {
    used?: SortOrder
  }

  export type ProjectCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type EnvironmentCreateNestedManyWithoutOwnerInput = {
    create?: XOR<EnvironmentCreateWithoutOwnerInput, EnvironmentUncheckedCreateWithoutOwnerInput> | EnvironmentCreateWithoutOwnerInput[] | EnvironmentUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: EnvironmentCreateOrConnectWithoutOwnerInput | EnvironmentCreateOrConnectWithoutOwnerInput[]
    createMany?: EnvironmentCreateManyOwnerInputEnvelope
    connect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[]
  }

  export type DeployJobCreateNestedManyWithoutTriggeredByInput = {
    create?: XOR<DeployJobCreateWithoutTriggeredByInput, DeployJobUncheckedCreateWithoutTriggeredByInput> | DeployJobCreateWithoutTriggeredByInput[] | DeployJobUncheckedCreateWithoutTriggeredByInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutTriggeredByInput | DeployJobCreateOrConnectWithoutTriggeredByInput[]
    createMany?: DeployJobCreateManyTriggeredByInputEnvelope
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
  }

  export type WizardBuildCreateNestedManyWithoutOwnerInput = {
    create?: XOR<WizardBuildCreateWithoutOwnerInput, WizardBuildUncheckedCreateWithoutOwnerInput> | WizardBuildCreateWithoutOwnerInput[] | WizardBuildUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WizardBuildCreateOrConnectWithoutOwnerInput | WizardBuildCreateOrConnectWithoutOwnerInput[]
    createMany?: WizardBuildCreateManyOwnerInputEnvelope
    connect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
  }

  export type OtpCreateNestedManyWithoutUserInput = {
    create?: XOR<OtpCreateWithoutUserInput, OtpUncheckedCreateWithoutUserInput> | OtpCreateWithoutUserInput[] | OtpUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OtpCreateOrConnectWithoutUserInput | OtpCreateOrConnectWithoutUserInput[]
    createMany?: OtpCreateManyUserInputEnvelope
    connect?: OtpWhereUniqueInput | OtpWhereUniqueInput[]
  }

  export type OAuthAccountCreateNestedManyWithoutUserInput = {
    create?: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput> | OAuthAccountCreateWithoutUserInput[] | OAuthAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthAccountCreateOrConnectWithoutUserInput | OAuthAccountCreateOrConnectWithoutUserInput[]
    createMany?: OAuthAccountCreateManyUserInputEnvelope
    connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
  }

  export type UserPaymentMethodCreateNestedManyWithoutUserInput = {
    create?: XOR<UserPaymentMethodCreateWithoutUserInput, UserPaymentMethodUncheckedCreateWithoutUserInput> | UserPaymentMethodCreateWithoutUserInput[] | UserPaymentMethodUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPaymentMethodCreateOrConnectWithoutUserInput | UserPaymentMethodCreateOrConnectWithoutUserInput[]
    createMany?: UserPaymentMethodCreateManyUserInputEnvelope
    connect?: UserPaymentMethodWhereUniqueInput | UserPaymentMethodWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutUserInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type InvoiceCreateNestedManyWithoutUserInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type SubscriptionCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type UsageCounterCreateNestedManyWithoutUserInput = {
    create?: XOR<UsageCounterCreateWithoutUserInput, UsageCounterUncheckedCreateWithoutUserInput> | UsageCounterCreateWithoutUserInput[] | UsageCounterUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UsageCounterCreateOrConnectWithoutUserInput | UsageCounterCreateOrConnectWithoutUserInput[]
    createMany?: UsageCounterCreateManyUserInputEnvelope
    connect?: UsageCounterWhereUniqueInput | UsageCounterWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type EnvironmentUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<EnvironmentCreateWithoutOwnerInput, EnvironmentUncheckedCreateWithoutOwnerInput> | EnvironmentCreateWithoutOwnerInput[] | EnvironmentUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: EnvironmentCreateOrConnectWithoutOwnerInput | EnvironmentCreateOrConnectWithoutOwnerInput[]
    createMany?: EnvironmentCreateManyOwnerInputEnvelope
    connect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[]
  }

  export type DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput = {
    create?: XOR<DeployJobCreateWithoutTriggeredByInput, DeployJobUncheckedCreateWithoutTriggeredByInput> | DeployJobCreateWithoutTriggeredByInput[] | DeployJobUncheckedCreateWithoutTriggeredByInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutTriggeredByInput | DeployJobCreateOrConnectWithoutTriggeredByInput[]
    createMany?: DeployJobCreateManyTriggeredByInputEnvelope
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
  }

  export type WizardBuildUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<WizardBuildCreateWithoutOwnerInput, WizardBuildUncheckedCreateWithoutOwnerInput> | WizardBuildCreateWithoutOwnerInput[] | WizardBuildUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WizardBuildCreateOrConnectWithoutOwnerInput | WizardBuildCreateOrConnectWithoutOwnerInput[]
    createMany?: WizardBuildCreateManyOwnerInputEnvelope
    connect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
  }

  export type OtpUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OtpCreateWithoutUserInput, OtpUncheckedCreateWithoutUserInput> | OtpCreateWithoutUserInput[] | OtpUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OtpCreateOrConnectWithoutUserInput | OtpCreateOrConnectWithoutUserInput[]
    createMany?: OtpCreateManyUserInputEnvelope
    connect?: OtpWhereUniqueInput | OtpWhereUniqueInput[]
  }

  export type OAuthAccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput> | OAuthAccountCreateWithoutUserInput[] | OAuthAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthAccountCreateOrConnectWithoutUserInput | OAuthAccountCreateOrConnectWithoutUserInput[]
    createMany?: OAuthAccountCreateManyUserInputEnvelope
    connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
  }

  export type UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserPaymentMethodCreateWithoutUserInput, UserPaymentMethodUncheckedCreateWithoutUserInput> | UserPaymentMethodCreateWithoutUserInput[] | UserPaymentMethodUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPaymentMethodCreateOrConnectWithoutUserInput | UserPaymentMethodCreateOrConnectWithoutUserInput[]
    createMany?: UserPaymentMethodCreateManyUserInputEnvelope
    connect?: UserPaymentMethodWhereUniqueInput | UserPaymentMethodWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type UsageCounterUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UsageCounterCreateWithoutUserInput, UsageCounterUncheckedCreateWithoutUserInput> | UsageCounterCreateWithoutUserInput[] | UsageCounterUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UsageCounterCreateOrConnectWithoutUserInput | UsageCounterCreateOrConnectWithoutUserInput[]
    createMany?: UsageCounterCreateManyUserInputEnvelope
    connect?: UsageCounterWhereUniqueInput | UsageCounterWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProjectUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutOwnerInput | ProjectUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutOwnerInput | ProjectUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutOwnerInput | ProjectUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type EnvironmentUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<EnvironmentCreateWithoutOwnerInput, EnvironmentUncheckedCreateWithoutOwnerInput> | EnvironmentCreateWithoutOwnerInput[] | EnvironmentUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: EnvironmentCreateOrConnectWithoutOwnerInput | EnvironmentCreateOrConnectWithoutOwnerInput[]
    upsert?: EnvironmentUpsertWithWhereUniqueWithoutOwnerInput | EnvironmentUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: EnvironmentCreateManyOwnerInputEnvelope
    set?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[]
    disconnect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[]
    delete?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[]
    connect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[]
    update?: EnvironmentUpdateWithWhereUniqueWithoutOwnerInput | EnvironmentUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: EnvironmentUpdateManyWithWhereWithoutOwnerInput | EnvironmentUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: EnvironmentScalarWhereInput | EnvironmentScalarWhereInput[]
  }

  export type DeployJobUpdateManyWithoutTriggeredByNestedInput = {
    create?: XOR<DeployJobCreateWithoutTriggeredByInput, DeployJobUncheckedCreateWithoutTriggeredByInput> | DeployJobCreateWithoutTriggeredByInput[] | DeployJobUncheckedCreateWithoutTriggeredByInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutTriggeredByInput | DeployJobCreateOrConnectWithoutTriggeredByInput[]
    upsert?: DeployJobUpsertWithWhereUniqueWithoutTriggeredByInput | DeployJobUpsertWithWhereUniqueWithoutTriggeredByInput[]
    createMany?: DeployJobCreateManyTriggeredByInputEnvelope
    set?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    disconnect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    delete?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    update?: DeployJobUpdateWithWhereUniqueWithoutTriggeredByInput | DeployJobUpdateWithWhereUniqueWithoutTriggeredByInput[]
    updateMany?: DeployJobUpdateManyWithWhereWithoutTriggeredByInput | DeployJobUpdateManyWithWhereWithoutTriggeredByInput[]
    deleteMany?: DeployJobScalarWhereInput | DeployJobScalarWhereInput[]
  }

  export type WizardBuildUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<WizardBuildCreateWithoutOwnerInput, WizardBuildUncheckedCreateWithoutOwnerInput> | WizardBuildCreateWithoutOwnerInput[] | WizardBuildUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WizardBuildCreateOrConnectWithoutOwnerInput | WizardBuildCreateOrConnectWithoutOwnerInput[]
    upsert?: WizardBuildUpsertWithWhereUniqueWithoutOwnerInput | WizardBuildUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: WizardBuildCreateManyOwnerInputEnvelope
    set?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    disconnect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    delete?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    connect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    update?: WizardBuildUpdateWithWhereUniqueWithoutOwnerInput | WizardBuildUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: WizardBuildUpdateManyWithWhereWithoutOwnerInput | WizardBuildUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: WizardBuildScalarWhereInput | WizardBuildScalarWhereInput[]
  }

  export type OtpUpdateManyWithoutUserNestedInput = {
    create?: XOR<OtpCreateWithoutUserInput, OtpUncheckedCreateWithoutUserInput> | OtpCreateWithoutUserInput[] | OtpUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OtpCreateOrConnectWithoutUserInput | OtpCreateOrConnectWithoutUserInput[]
    upsert?: OtpUpsertWithWhereUniqueWithoutUserInput | OtpUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OtpCreateManyUserInputEnvelope
    set?: OtpWhereUniqueInput | OtpWhereUniqueInput[]
    disconnect?: OtpWhereUniqueInput | OtpWhereUniqueInput[]
    delete?: OtpWhereUniqueInput | OtpWhereUniqueInput[]
    connect?: OtpWhereUniqueInput | OtpWhereUniqueInput[]
    update?: OtpUpdateWithWhereUniqueWithoutUserInput | OtpUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OtpUpdateManyWithWhereWithoutUserInput | OtpUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OtpScalarWhereInput | OtpScalarWhereInput[]
  }

  export type OAuthAccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput> | OAuthAccountCreateWithoutUserInput[] | OAuthAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthAccountCreateOrConnectWithoutUserInput | OAuthAccountCreateOrConnectWithoutUserInput[]
    upsert?: OAuthAccountUpsertWithWhereUniqueWithoutUserInput | OAuthAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OAuthAccountCreateManyUserInputEnvelope
    set?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    disconnect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    delete?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    update?: OAuthAccountUpdateWithWhereUniqueWithoutUserInput | OAuthAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OAuthAccountUpdateManyWithWhereWithoutUserInput | OAuthAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[]
  }

  export type UserPaymentMethodUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserPaymentMethodCreateWithoutUserInput, UserPaymentMethodUncheckedCreateWithoutUserInput> | UserPaymentMethodCreateWithoutUserInput[] | UserPaymentMethodUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPaymentMethodCreateOrConnectWithoutUserInput | UserPaymentMethodCreateOrConnectWithoutUserInput[]
    upsert?: UserPaymentMethodUpsertWithWhereUniqueWithoutUserInput | UserPaymentMethodUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserPaymentMethodCreateManyUserInputEnvelope
    set?: UserPaymentMethodWhereUniqueInput | UserPaymentMethodWhereUniqueInput[]
    disconnect?: UserPaymentMethodWhereUniqueInput | UserPaymentMethodWhereUniqueInput[]
    delete?: UserPaymentMethodWhereUniqueInput | UserPaymentMethodWhereUniqueInput[]
    connect?: UserPaymentMethodWhereUniqueInput | UserPaymentMethodWhereUniqueInput[]
    update?: UserPaymentMethodUpdateWithWhereUniqueWithoutUserInput | UserPaymentMethodUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserPaymentMethodUpdateManyWithWhereWithoutUserInput | UserPaymentMethodUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserPaymentMethodScalarWhereInput | UserPaymentMethodScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutUserNestedInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutUserInput | PaymentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutUserInput | PaymentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutUserInput | PaymentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type InvoiceUpdateManyWithoutUserNestedInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutUserInput | InvoiceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutUserInput | InvoiceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutUserInput | InvoiceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type SubscriptionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutUserInput | SubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutUserInput | SubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutUserInput | SubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type UsageCounterUpdateManyWithoutUserNestedInput = {
    create?: XOR<UsageCounterCreateWithoutUserInput, UsageCounterUncheckedCreateWithoutUserInput> | UsageCounterCreateWithoutUserInput[] | UsageCounterUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UsageCounterCreateOrConnectWithoutUserInput | UsageCounterCreateOrConnectWithoutUserInput[]
    upsert?: UsageCounterUpsertWithWhereUniqueWithoutUserInput | UsageCounterUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UsageCounterCreateManyUserInputEnvelope
    set?: UsageCounterWhereUniqueInput | UsageCounterWhereUniqueInput[]
    disconnect?: UsageCounterWhereUniqueInput | UsageCounterWhereUniqueInput[]
    delete?: UsageCounterWhereUniqueInput | UsageCounterWhereUniqueInput[]
    connect?: UsageCounterWhereUniqueInput | UsageCounterWhereUniqueInput[]
    update?: UsageCounterUpdateWithWhereUniqueWithoutUserInput | UsageCounterUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UsageCounterUpdateManyWithWhereWithoutUserInput | UsageCounterUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UsageCounterScalarWhereInput | UsageCounterScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutOwnerInput | ProjectUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutOwnerInput | ProjectUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutOwnerInput | ProjectUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<EnvironmentCreateWithoutOwnerInput, EnvironmentUncheckedCreateWithoutOwnerInput> | EnvironmentCreateWithoutOwnerInput[] | EnvironmentUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: EnvironmentCreateOrConnectWithoutOwnerInput | EnvironmentCreateOrConnectWithoutOwnerInput[]
    upsert?: EnvironmentUpsertWithWhereUniqueWithoutOwnerInput | EnvironmentUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: EnvironmentCreateManyOwnerInputEnvelope
    set?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[]
    disconnect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[]
    delete?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[]
    connect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[]
    update?: EnvironmentUpdateWithWhereUniqueWithoutOwnerInput | EnvironmentUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: EnvironmentUpdateManyWithWhereWithoutOwnerInput | EnvironmentUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: EnvironmentScalarWhereInput | EnvironmentScalarWhereInput[]
  }

  export type DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput = {
    create?: XOR<DeployJobCreateWithoutTriggeredByInput, DeployJobUncheckedCreateWithoutTriggeredByInput> | DeployJobCreateWithoutTriggeredByInput[] | DeployJobUncheckedCreateWithoutTriggeredByInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutTriggeredByInput | DeployJobCreateOrConnectWithoutTriggeredByInput[]
    upsert?: DeployJobUpsertWithWhereUniqueWithoutTriggeredByInput | DeployJobUpsertWithWhereUniqueWithoutTriggeredByInput[]
    createMany?: DeployJobCreateManyTriggeredByInputEnvelope
    set?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    disconnect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    delete?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    update?: DeployJobUpdateWithWhereUniqueWithoutTriggeredByInput | DeployJobUpdateWithWhereUniqueWithoutTriggeredByInput[]
    updateMany?: DeployJobUpdateManyWithWhereWithoutTriggeredByInput | DeployJobUpdateManyWithWhereWithoutTriggeredByInput[]
    deleteMany?: DeployJobScalarWhereInput | DeployJobScalarWhereInput[]
  }

  export type WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<WizardBuildCreateWithoutOwnerInput, WizardBuildUncheckedCreateWithoutOwnerInput> | WizardBuildCreateWithoutOwnerInput[] | WizardBuildUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WizardBuildCreateOrConnectWithoutOwnerInput | WizardBuildCreateOrConnectWithoutOwnerInput[]
    upsert?: WizardBuildUpsertWithWhereUniqueWithoutOwnerInput | WizardBuildUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: WizardBuildCreateManyOwnerInputEnvelope
    set?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    disconnect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    delete?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    connect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    update?: WizardBuildUpdateWithWhereUniqueWithoutOwnerInput | WizardBuildUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: WizardBuildUpdateManyWithWhereWithoutOwnerInput | WizardBuildUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: WizardBuildScalarWhereInput | WizardBuildScalarWhereInput[]
  }

  export type OtpUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OtpCreateWithoutUserInput, OtpUncheckedCreateWithoutUserInput> | OtpCreateWithoutUserInput[] | OtpUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OtpCreateOrConnectWithoutUserInput | OtpCreateOrConnectWithoutUserInput[]
    upsert?: OtpUpsertWithWhereUniqueWithoutUserInput | OtpUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OtpCreateManyUserInputEnvelope
    set?: OtpWhereUniqueInput | OtpWhereUniqueInput[]
    disconnect?: OtpWhereUniqueInput | OtpWhereUniqueInput[]
    delete?: OtpWhereUniqueInput | OtpWhereUniqueInput[]
    connect?: OtpWhereUniqueInput | OtpWhereUniqueInput[]
    update?: OtpUpdateWithWhereUniqueWithoutUserInput | OtpUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OtpUpdateManyWithWhereWithoutUserInput | OtpUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OtpScalarWhereInput | OtpScalarWhereInput[]
  }

  export type OAuthAccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput> | OAuthAccountCreateWithoutUserInput[] | OAuthAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthAccountCreateOrConnectWithoutUserInput | OAuthAccountCreateOrConnectWithoutUserInput[]
    upsert?: OAuthAccountUpsertWithWhereUniqueWithoutUserInput | OAuthAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OAuthAccountCreateManyUserInputEnvelope
    set?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    disconnect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    delete?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    update?: OAuthAccountUpdateWithWhereUniqueWithoutUserInput | OAuthAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OAuthAccountUpdateManyWithWhereWithoutUserInput | OAuthAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[]
  }

  export type UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserPaymentMethodCreateWithoutUserInput, UserPaymentMethodUncheckedCreateWithoutUserInput> | UserPaymentMethodCreateWithoutUserInput[] | UserPaymentMethodUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPaymentMethodCreateOrConnectWithoutUserInput | UserPaymentMethodCreateOrConnectWithoutUserInput[]
    upsert?: UserPaymentMethodUpsertWithWhereUniqueWithoutUserInput | UserPaymentMethodUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserPaymentMethodCreateManyUserInputEnvelope
    set?: UserPaymentMethodWhereUniqueInput | UserPaymentMethodWhereUniqueInput[]
    disconnect?: UserPaymentMethodWhereUniqueInput | UserPaymentMethodWhereUniqueInput[]
    delete?: UserPaymentMethodWhereUniqueInput | UserPaymentMethodWhereUniqueInput[]
    connect?: UserPaymentMethodWhereUniqueInput | UserPaymentMethodWhereUniqueInput[]
    update?: UserPaymentMethodUpdateWithWhereUniqueWithoutUserInput | UserPaymentMethodUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserPaymentMethodUpdateManyWithWhereWithoutUserInput | UserPaymentMethodUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserPaymentMethodScalarWhereInput | UserPaymentMethodScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutUserInput | PaymentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutUserInput | PaymentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutUserInput | PaymentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutUserInput | InvoiceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutUserInput | InvoiceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutUserInput | InvoiceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutUserInput | SubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutUserInput | SubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutUserInput | SubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type UsageCounterUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UsageCounterCreateWithoutUserInput, UsageCounterUncheckedCreateWithoutUserInput> | UsageCounterCreateWithoutUserInput[] | UsageCounterUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UsageCounterCreateOrConnectWithoutUserInput | UsageCounterCreateOrConnectWithoutUserInput[]
    upsert?: UsageCounterUpsertWithWhereUniqueWithoutUserInput | UsageCounterUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UsageCounterCreateManyUserInputEnvelope
    set?: UsageCounterWhereUniqueInput | UsageCounterWhereUniqueInput[]
    disconnect?: UsageCounterWhereUniqueInput | UsageCounterWhereUniqueInput[]
    delete?: UsageCounterWhereUniqueInput | UsageCounterWhereUniqueInput[]
    connect?: UsageCounterWhereUniqueInput | UsageCounterWhereUniqueInput[]
    update?: UsageCounterUpdateWithWhereUniqueWithoutUserInput | UsageCounterUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UsageCounterUpdateManyWithWhereWithoutUserInput | UsageCounterUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UsageCounterScalarWhereInput | UsageCounterScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutOauthAccountsInput = {
    create?: XOR<UserCreateWithoutOauthAccountsInput, UserUncheckedCreateWithoutOauthAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOauthAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutOauthAccountsNestedInput = {
    create?: XOR<UserCreateWithoutOauthAccountsInput, UserUncheckedCreateWithoutOauthAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOauthAccountsInput
    upsert?: UserUpsertWithoutOauthAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOauthAccountsInput, UserUpdateWithoutOauthAccountsInput>, UserUncheckedUpdateWithoutOauthAccountsInput>
  }

  export type UserCreateNestedOneWithoutOtpsInput = {
    create?: XOR<UserCreateWithoutOtpsInput, UserUncheckedCreateWithoutOtpsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOtpsInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutOtpsNestedInput = {
    create?: XOR<UserCreateWithoutOtpsInput, UserUncheckedCreateWithoutOtpsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOtpsInput
    upsert?: UserUpsertWithoutOtpsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOtpsInput, UserUpdateWithoutOtpsInput>, UserUncheckedUpdateWithoutOtpsInput>
  }

  export type UserCreateNestedOneWithoutProjectsInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type DeployJobCreateNestedManyWithoutProjectInput = {
    create?: XOR<DeployJobCreateWithoutProjectInput, DeployJobUncheckedCreateWithoutProjectInput> | DeployJobCreateWithoutProjectInput[] | DeployJobUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutProjectInput | DeployJobCreateOrConnectWithoutProjectInput[]
    createMany?: DeployJobCreateManyProjectInputEnvelope
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
  }

  export type WizardBuildCreateNestedManyWithoutProjectInput = {
    create?: XOR<WizardBuildCreateWithoutProjectInput, WizardBuildUncheckedCreateWithoutProjectInput> | WizardBuildCreateWithoutProjectInput[] | WizardBuildUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: WizardBuildCreateOrConnectWithoutProjectInput | WizardBuildCreateOrConnectWithoutProjectInput[]
    createMany?: WizardBuildCreateManyProjectInputEnvelope
    connect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
  }

  export type DeployJobUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<DeployJobCreateWithoutProjectInput, DeployJobUncheckedCreateWithoutProjectInput> | DeployJobCreateWithoutProjectInput[] | DeployJobUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutProjectInput | DeployJobCreateOrConnectWithoutProjectInput[]
    createMany?: DeployJobCreateManyProjectInputEnvelope
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
  }

  export type WizardBuildUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<WizardBuildCreateWithoutProjectInput, WizardBuildUncheckedCreateWithoutProjectInput> | WizardBuildCreateWithoutProjectInput[] | WizardBuildUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: WizardBuildCreateOrConnectWithoutProjectInput | WizardBuildCreateOrConnectWithoutProjectInput[]
    createMany?: WizardBuildCreateManyProjectInputEnvelope
    connect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    upsert?: UserUpsertWithoutProjectsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectsInput, UserUpdateWithoutProjectsInput>, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type DeployJobUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DeployJobCreateWithoutProjectInput, DeployJobUncheckedCreateWithoutProjectInput> | DeployJobCreateWithoutProjectInput[] | DeployJobUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutProjectInput | DeployJobCreateOrConnectWithoutProjectInput[]
    upsert?: DeployJobUpsertWithWhereUniqueWithoutProjectInput | DeployJobUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DeployJobCreateManyProjectInputEnvelope
    set?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    disconnect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    delete?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    update?: DeployJobUpdateWithWhereUniqueWithoutProjectInput | DeployJobUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DeployJobUpdateManyWithWhereWithoutProjectInput | DeployJobUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DeployJobScalarWhereInput | DeployJobScalarWhereInput[]
  }

  export type WizardBuildUpdateManyWithoutProjectNestedInput = {
    create?: XOR<WizardBuildCreateWithoutProjectInput, WizardBuildUncheckedCreateWithoutProjectInput> | WizardBuildCreateWithoutProjectInput[] | WizardBuildUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: WizardBuildCreateOrConnectWithoutProjectInput | WizardBuildCreateOrConnectWithoutProjectInput[]
    upsert?: WizardBuildUpsertWithWhereUniqueWithoutProjectInput | WizardBuildUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: WizardBuildCreateManyProjectInputEnvelope
    set?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    disconnect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    delete?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    connect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    update?: WizardBuildUpdateWithWhereUniqueWithoutProjectInput | WizardBuildUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: WizardBuildUpdateManyWithWhereWithoutProjectInput | WizardBuildUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: WizardBuildScalarWhereInput | WizardBuildScalarWhereInput[]
  }

  export type DeployJobUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DeployJobCreateWithoutProjectInput, DeployJobUncheckedCreateWithoutProjectInput> | DeployJobCreateWithoutProjectInput[] | DeployJobUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutProjectInput | DeployJobCreateOrConnectWithoutProjectInput[]
    upsert?: DeployJobUpsertWithWhereUniqueWithoutProjectInput | DeployJobUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DeployJobCreateManyProjectInputEnvelope
    set?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    disconnect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    delete?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    update?: DeployJobUpdateWithWhereUniqueWithoutProjectInput | DeployJobUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DeployJobUpdateManyWithWhereWithoutProjectInput | DeployJobUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DeployJobScalarWhereInput | DeployJobScalarWhereInput[]
  }

  export type WizardBuildUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<WizardBuildCreateWithoutProjectInput, WizardBuildUncheckedCreateWithoutProjectInput> | WizardBuildCreateWithoutProjectInput[] | WizardBuildUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: WizardBuildCreateOrConnectWithoutProjectInput | WizardBuildCreateOrConnectWithoutProjectInput[]
    upsert?: WizardBuildUpsertWithWhereUniqueWithoutProjectInput | WizardBuildUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: WizardBuildCreateManyProjectInputEnvelope
    set?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    disconnect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    delete?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    connect?: WizardBuildWhereUniqueInput | WizardBuildWhereUniqueInput[]
    update?: WizardBuildUpdateWithWhereUniqueWithoutProjectInput | WizardBuildUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: WizardBuildUpdateManyWithWhereWithoutProjectInput | WizardBuildUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: WizardBuildScalarWhereInput | WizardBuildScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutEnvironmentsInput = {
    create?: XOR<UserCreateWithoutEnvironmentsInput, UserUncheckedCreateWithoutEnvironmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEnvironmentsInput
    connect?: UserWhereUniqueInput
  }

  export type DeployJobCreateNestedManyWithoutEnvironmentInput = {
    create?: XOR<DeployJobCreateWithoutEnvironmentInput, DeployJobUncheckedCreateWithoutEnvironmentInput> | DeployJobCreateWithoutEnvironmentInput[] | DeployJobUncheckedCreateWithoutEnvironmentInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutEnvironmentInput | DeployJobCreateOrConnectWithoutEnvironmentInput[]
    createMany?: DeployJobCreateManyEnvironmentInputEnvelope
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
  }

  export type DeployJobUncheckedCreateNestedManyWithoutEnvironmentInput = {
    create?: XOR<DeployJobCreateWithoutEnvironmentInput, DeployJobUncheckedCreateWithoutEnvironmentInput> | DeployJobCreateWithoutEnvironmentInput[] | DeployJobUncheckedCreateWithoutEnvironmentInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutEnvironmentInput | DeployJobCreateOrConnectWithoutEnvironmentInput[]
    createMany?: DeployJobCreateManyEnvironmentInputEnvelope
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutEnvironmentsNestedInput = {
    create?: XOR<UserCreateWithoutEnvironmentsInput, UserUncheckedCreateWithoutEnvironmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEnvironmentsInput
    upsert?: UserUpsertWithoutEnvironmentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEnvironmentsInput, UserUpdateWithoutEnvironmentsInput>, UserUncheckedUpdateWithoutEnvironmentsInput>
  }

  export type DeployJobUpdateManyWithoutEnvironmentNestedInput = {
    create?: XOR<DeployJobCreateWithoutEnvironmentInput, DeployJobUncheckedCreateWithoutEnvironmentInput> | DeployJobCreateWithoutEnvironmentInput[] | DeployJobUncheckedCreateWithoutEnvironmentInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutEnvironmentInput | DeployJobCreateOrConnectWithoutEnvironmentInput[]
    upsert?: DeployJobUpsertWithWhereUniqueWithoutEnvironmentInput | DeployJobUpsertWithWhereUniqueWithoutEnvironmentInput[]
    createMany?: DeployJobCreateManyEnvironmentInputEnvelope
    set?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    disconnect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    delete?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    update?: DeployJobUpdateWithWhereUniqueWithoutEnvironmentInput | DeployJobUpdateWithWhereUniqueWithoutEnvironmentInput[]
    updateMany?: DeployJobUpdateManyWithWhereWithoutEnvironmentInput | DeployJobUpdateManyWithWhereWithoutEnvironmentInput[]
    deleteMany?: DeployJobScalarWhereInput | DeployJobScalarWhereInput[]
  }

  export type DeployJobUncheckedUpdateManyWithoutEnvironmentNestedInput = {
    create?: XOR<DeployJobCreateWithoutEnvironmentInput, DeployJobUncheckedCreateWithoutEnvironmentInput> | DeployJobCreateWithoutEnvironmentInput[] | DeployJobUncheckedCreateWithoutEnvironmentInput[]
    connectOrCreate?: DeployJobCreateOrConnectWithoutEnvironmentInput | DeployJobCreateOrConnectWithoutEnvironmentInput[]
    upsert?: DeployJobUpsertWithWhereUniqueWithoutEnvironmentInput | DeployJobUpsertWithWhereUniqueWithoutEnvironmentInput[]
    createMany?: DeployJobCreateManyEnvironmentInputEnvelope
    set?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    disconnect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    delete?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    connect?: DeployJobWhereUniqueInput | DeployJobWhereUniqueInput[]
    update?: DeployJobUpdateWithWhereUniqueWithoutEnvironmentInput | DeployJobUpdateWithWhereUniqueWithoutEnvironmentInput[]
    updateMany?: DeployJobUpdateManyWithWhereWithoutEnvironmentInput | DeployJobUpdateManyWithWhereWithoutEnvironmentInput[]
    deleteMany?: DeployJobScalarWhereInput | DeployJobScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutDeployJobsInput = {
    create?: XOR<ProjectCreateWithoutDeployJobsInput, ProjectUncheckedCreateWithoutDeployJobsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDeployJobsInput
    connect?: ProjectWhereUniqueInput
  }

  export type EnvironmentCreateNestedOneWithoutDeployJobsInput = {
    create?: XOR<EnvironmentCreateWithoutDeployJobsInput, EnvironmentUncheckedCreateWithoutDeployJobsInput>
    connectOrCreate?: EnvironmentCreateOrConnectWithoutDeployJobsInput
    connect?: EnvironmentWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutDeployJobsInput = {
    create?: XOR<UserCreateWithoutDeployJobsInput, UserUncheckedCreateWithoutDeployJobsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDeployJobsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumDeployJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.DeployJobStatus
  }

  export type ProjectUpdateOneRequiredWithoutDeployJobsNestedInput = {
    create?: XOR<ProjectCreateWithoutDeployJobsInput, ProjectUncheckedCreateWithoutDeployJobsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDeployJobsInput
    upsert?: ProjectUpsertWithoutDeployJobsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutDeployJobsInput, ProjectUpdateWithoutDeployJobsInput>, ProjectUncheckedUpdateWithoutDeployJobsInput>
  }

  export type EnvironmentUpdateOneRequiredWithoutDeployJobsNestedInput = {
    create?: XOR<EnvironmentCreateWithoutDeployJobsInput, EnvironmentUncheckedCreateWithoutDeployJobsInput>
    connectOrCreate?: EnvironmentCreateOrConnectWithoutDeployJobsInput
    upsert?: EnvironmentUpsertWithoutDeployJobsInput
    connect?: EnvironmentWhereUniqueInput
    update?: XOR<XOR<EnvironmentUpdateToOneWithWhereWithoutDeployJobsInput, EnvironmentUpdateWithoutDeployJobsInput>, EnvironmentUncheckedUpdateWithoutDeployJobsInput>
  }

  export type UserUpdateOneWithoutDeployJobsNestedInput = {
    create?: XOR<UserCreateWithoutDeployJobsInput, UserUncheckedCreateWithoutDeployJobsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDeployJobsInput
    upsert?: UserUpsertWithoutDeployJobsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDeployJobsInput, UserUpdateWithoutDeployJobsInput>, UserUncheckedUpdateWithoutDeployJobsInput>
  }

  export type UserCreateNestedOneWithoutWizardBuildsInput = {
    create?: XOR<UserCreateWithoutWizardBuildsInput, UserUncheckedCreateWithoutWizardBuildsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWizardBuildsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectCreateNestedOneWithoutWizardBuildsInput = {
    create?: XOR<ProjectCreateWithoutWizardBuildsInput, ProjectUncheckedCreateWithoutWizardBuildsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutWizardBuildsInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutWizardBuildsNestedInput = {
    create?: XOR<UserCreateWithoutWizardBuildsInput, UserUncheckedCreateWithoutWizardBuildsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWizardBuildsInput
    upsert?: UserUpsertWithoutWizardBuildsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWizardBuildsInput, UserUpdateWithoutWizardBuildsInput>, UserUncheckedUpdateWithoutWizardBuildsInput>
  }

  export type ProjectUpdateOneRequiredWithoutWizardBuildsNestedInput = {
    create?: XOR<ProjectCreateWithoutWizardBuildsInput, ProjectUncheckedCreateWithoutWizardBuildsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutWizardBuildsInput
    upsert?: ProjectUpsertWithoutWizardBuildsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutWizardBuildsInput, ProjectUpdateWithoutWizardBuildsInput>, ProjectUncheckedUpdateWithoutWizardBuildsInput>
  }

  export type UserCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionsInput
    upsert?: UserUpsertWithoutSubscriptionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubscriptionsInput, UserUpdateWithoutSubscriptionsInput>, UserUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type UserCreateNestedOneWithoutPaymentMethodsInput = {
    create?: XOR<UserCreateWithoutPaymentMethodsInput, UserUncheckedCreateWithoutPaymentMethodsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentMethodsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutPaymentMethodsNestedInput = {
    create?: XOR<UserCreateWithoutPaymentMethodsInput, UserUncheckedCreateWithoutPaymentMethodsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentMethodsInput
    upsert?: UserUpsertWithoutPaymentMethodsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPaymentMethodsInput, UserUpdateWithoutPaymentMethodsInput>, UserUncheckedUpdateWithoutPaymentMethodsInput>
  }

  export type UserCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentsInput
    upsert?: UserUpsertWithoutPaymentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPaymentsInput, UserUpdateWithoutPaymentsInput>, UserUncheckedUpdateWithoutPaymentsInput>
  }

  export type UserCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvoicesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvoicesInput
    upsert?: UserUpsertWithoutInvoicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInvoicesInput, UserUpdateWithoutInvoicesInput>, UserUncheckedUpdateWithoutInvoicesInput>
  }

  export type UserCreateNestedOneWithoutUsageCountersInput = {
    create?: XOR<UserCreateWithoutUsageCountersInput, UserUncheckedCreateWithoutUsageCountersInput>
    connectOrCreate?: UserCreateOrConnectWithoutUsageCountersInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUsageCountersNestedInput = {
    create?: XOR<UserCreateWithoutUsageCountersInput, UserUncheckedCreateWithoutUsageCountersInput>
    connectOrCreate?: UserCreateOrConnectWithoutUsageCountersInput
    upsert?: UserUpsertWithoutUsageCountersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUsageCountersInput, UserUpdateWithoutUsageCountersInput>, UserUncheckedUpdateWithoutUsageCountersInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumDeployJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeployJobStatus | EnumDeployJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeployJobStatus[] | ListEnumDeployJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeployJobStatus[] | ListEnumDeployJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeployJobStatusFilter<$PrismaModel> | $Enums.DeployJobStatus
  }

  export type NestedEnumDeployJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeployJobStatus | EnumDeployJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeployJobStatus[] | ListEnumDeployJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeployJobStatus[] | ListEnumDeployJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeployJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeployJobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeployJobStatusFilter<$PrismaModel>
    _max?: NestedEnumDeployJobStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ProjectCreateWithoutOwnerInput = {
    id?: string
    name: string
    slug: string
    repoExportEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deployJobs?: DeployJobCreateNestedManyWithoutProjectInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    slug: string
    repoExportEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutProjectInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput>
  }

  export type ProjectCreateManyOwnerInputEnvelope = {
    data: ProjectCreateManyOwnerInput | ProjectCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type EnvironmentCreateWithoutOwnerInput = {
    id?: string
    projectId?: string | null
    name: string
    displayName: string
    tierPolicy?: string
    executionMode?: string
    region?: string
    visibility?: string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deployJobs?: DeployJobCreateNestedManyWithoutEnvironmentInput
  }

  export type EnvironmentUncheckedCreateWithoutOwnerInput = {
    id?: string
    projectId?: string | null
    name: string
    displayName: string
    tierPolicy?: string
    executionMode?: string
    region?: string
    visibility?: string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutEnvironmentInput
  }

  export type EnvironmentCreateOrConnectWithoutOwnerInput = {
    where: EnvironmentWhereUniqueInput
    create: XOR<EnvironmentCreateWithoutOwnerInput, EnvironmentUncheckedCreateWithoutOwnerInput>
  }

  export type EnvironmentCreateManyOwnerInputEnvelope = {
    data: EnvironmentCreateManyOwnerInput | EnvironmentCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type DeployJobCreateWithoutTriggeredByInput = {
    id?: string
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutDeployJobsInput
    environment: EnvironmentCreateNestedOneWithoutDeployJobsInput
  }

  export type DeployJobUncheckedCreateWithoutTriggeredByInput = {
    id?: string
    projectId: string
    environmentId: string
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
  }

  export type DeployJobCreateOrConnectWithoutTriggeredByInput = {
    where: DeployJobWhereUniqueInput
    create: XOR<DeployJobCreateWithoutTriggeredByInput, DeployJobUncheckedCreateWithoutTriggeredByInput>
  }

  export type DeployJobCreateManyTriggeredByInputEnvelope = {
    data: DeployJobCreateManyTriggeredByInput | DeployJobCreateManyTriggeredByInput[]
    skipDuplicates?: boolean
  }

  export type WizardBuildCreateWithoutOwnerInput = {
    id?: string
    version: string
    inputs: JsonNullValueInput | InputJsonValue
    manifest: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutWizardBuildsInput
  }

  export type WizardBuildUncheckedCreateWithoutOwnerInput = {
    id?: string
    projectId: string
    version: string
    inputs: JsonNullValueInput | InputJsonValue
    manifest: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type WizardBuildCreateOrConnectWithoutOwnerInput = {
    where: WizardBuildWhereUniqueInput
    create: XOR<WizardBuildCreateWithoutOwnerInput, WizardBuildUncheckedCreateWithoutOwnerInput>
  }

  export type WizardBuildCreateManyOwnerInputEnvelope = {
    data: WizardBuildCreateManyOwnerInput | WizardBuildCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type OtpCreateWithoutUserInput = {
    id?: string
    codeHash: string
    idempotencyKey?: string | null
    purpose: string
    attemptsCount?: number
    isUsed?: boolean
    expiresAt: Date | string
    nextRequestAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OtpUncheckedCreateWithoutUserInput = {
    id?: string
    codeHash: string
    idempotencyKey?: string | null
    purpose: string
    attemptsCount?: number
    isUsed?: boolean
    expiresAt: Date | string
    nextRequestAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OtpCreateOrConnectWithoutUserInput = {
    where: OtpWhereUniqueInput
    create: XOR<OtpCreateWithoutUserInput, OtpUncheckedCreateWithoutUserInput>
  }

  export type OtpCreateManyUserInputEnvelope = {
    data: OtpCreateManyUserInput | OtpCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OAuthAccountCreateWithoutUserInput = {
    id?: string
    provider: string
    accountId: string
    accountEmail?: string | null
    accessToken?: string | null
    refreshToken?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OAuthAccountUncheckedCreateWithoutUserInput = {
    id?: string
    provider: string
    accountId: string
    accountEmail?: string | null
    accessToken?: string | null
    refreshToken?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OAuthAccountCreateOrConnectWithoutUserInput = {
    where: OAuthAccountWhereUniqueInput
    create: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput>
  }

  export type OAuthAccountCreateManyUserInputEnvelope = {
    data: OAuthAccountCreateManyUserInput | OAuthAccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserPaymentMethodCreateWithoutUserInput = {
    id?: string
    stripePaymentMethodId: string
    type: string
    last4: string
    brand?: string | null
    expiryMonth?: number | null
    expiryYear?: number | null
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type UserPaymentMethodUncheckedCreateWithoutUserInput = {
    id?: string
    stripePaymentMethodId: string
    type: string
    last4: string
    brand?: string | null
    expiryMonth?: number | null
    expiryYear?: number | null
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type UserPaymentMethodCreateOrConnectWithoutUserInput = {
    where: UserPaymentMethodWhereUniqueInput
    create: XOR<UserPaymentMethodCreateWithoutUserInput, UserPaymentMethodUncheckedCreateWithoutUserInput>
  }

  export type UserPaymentMethodCreateManyUserInputEnvelope = {
    data: UserPaymentMethodCreateManyUserInput | UserPaymentMethodCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutUserInput = {
    id?: string
    stripePaymentId: string
    amount: number
    currency?: string
    status: string
    description?: string | null
    createdAt?: Date | string
  }

  export type PaymentUncheckedCreateWithoutUserInput = {
    id?: string
    stripePaymentId: string
    amount: number
    currency?: string
    status: string
    description?: string | null
    createdAt?: Date | string
  }

  export type PaymentCreateOrConnectWithoutUserInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput>
  }

  export type PaymentCreateManyUserInputEnvelope = {
    data: PaymentCreateManyUserInput | PaymentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type InvoiceCreateWithoutUserInput = {
    id?: string
    stripeInvoiceId: string
    amount: number
    currency?: string
    status: string
    paidAt?: Date | string | null
    dueDate?: Date | string | null
    invoiceUrl?: string | null
    pdfUrl?: string | null
    createdAt?: Date | string
  }

  export type InvoiceUncheckedCreateWithoutUserInput = {
    id?: string
    stripeInvoiceId: string
    amount: number
    currency?: string
    status: string
    paidAt?: Date | string | null
    dueDate?: Date | string | null
    invoiceUrl?: string | null
    pdfUrl?: string | null
    createdAt?: Date | string
  }

  export type InvoiceCreateOrConnectWithoutUserInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput>
  }

  export type InvoiceCreateManyUserInputEnvelope = {
    data: InvoiceCreateManyUserInput | InvoiceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionCreateWithoutUserInput = {
    id?: string
    planId?: string | null
    status: string
    stripeSubscriptionId: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    planId?: string | null
    status: string
    stripeSubscriptionId: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionCreateManyUserInputEnvelope = {
    data: SubscriptionCreateManyUserInput | SubscriptionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UsageCounterCreateWithoutUserInput = {
    id?: string
    featureId: string
    periodStart: Date | string
    periodEnd: Date | string
    used?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsageCounterUncheckedCreateWithoutUserInput = {
    id?: string
    featureId: string
    periodStart: Date | string
    periodEnd: Date | string
    used?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsageCounterCreateOrConnectWithoutUserInput = {
    where: UsageCounterWhereUniqueInput
    create: XOR<UsageCounterCreateWithoutUserInput, UsageCounterUncheckedCreateWithoutUserInput>
  }

  export type UsageCounterCreateManyUserInputEnvelope = {
    data: UsageCounterCreateManyUserInput | UsageCounterCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithWhereUniqueWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutOwnerInput, ProjectUncheckedUpdateWithoutOwnerInput>
    create: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutOwnerInput, ProjectUncheckedUpdateWithoutOwnerInput>
  }

  export type ProjectUpdateManyWithWhereWithoutOwnerInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutOwnerInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    ownerId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    slug?: StringFilter<"Project"> | string
    repoExportEnabled?: BoolFilter<"Project"> | boolean
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type EnvironmentUpsertWithWhereUniqueWithoutOwnerInput = {
    where: EnvironmentWhereUniqueInput
    update: XOR<EnvironmentUpdateWithoutOwnerInput, EnvironmentUncheckedUpdateWithoutOwnerInput>
    create: XOR<EnvironmentCreateWithoutOwnerInput, EnvironmentUncheckedCreateWithoutOwnerInput>
  }

  export type EnvironmentUpdateWithWhereUniqueWithoutOwnerInput = {
    where: EnvironmentWhereUniqueInput
    data: XOR<EnvironmentUpdateWithoutOwnerInput, EnvironmentUncheckedUpdateWithoutOwnerInput>
  }

  export type EnvironmentUpdateManyWithWhereWithoutOwnerInput = {
    where: EnvironmentScalarWhereInput
    data: XOR<EnvironmentUpdateManyMutationInput, EnvironmentUncheckedUpdateManyWithoutOwnerInput>
  }

  export type EnvironmentScalarWhereInput = {
    AND?: EnvironmentScalarWhereInput | EnvironmentScalarWhereInput[]
    OR?: EnvironmentScalarWhereInput[]
    NOT?: EnvironmentScalarWhereInput | EnvironmentScalarWhereInput[]
    id?: StringFilter<"Environment"> | string
    ownerId?: StringFilter<"Environment"> | string
    projectId?: StringNullableFilter<"Environment"> | string | null
    name?: StringFilter<"Environment"> | string
    displayName?: StringFilter<"Environment"> | string
    tierPolicy?: StringFilter<"Environment"> | string
    executionMode?: StringFilter<"Environment"> | string
    region?: StringFilter<"Environment"> | string
    visibility?: StringFilter<"Environment"> | string
    config?: JsonNullableFilter<"Environment">
    createdAt?: DateTimeFilter<"Environment"> | Date | string
    updatedAt?: DateTimeFilter<"Environment"> | Date | string
  }

  export type DeployJobUpsertWithWhereUniqueWithoutTriggeredByInput = {
    where: DeployJobWhereUniqueInput
    update: XOR<DeployJobUpdateWithoutTriggeredByInput, DeployJobUncheckedUpdateWithoutTriggeredByInput>
    create: XOR<DeployJobCreateWithoutTriggeredByInput, DeployJobUncheckedCreateWithoutTriggeredByInput>
  }

  export type DeployJobUpdateWithWhereUniqueWithoutTriggeredByInput = {
    where: DeployJobWhereUniqueInput
    data: XOR<DeployJobUpdateWithoutTriggeredByInput, DeployJobUncheckedUpdateWithoutTriggeredByInput>
  }

  export type DeployJobUpdateManyWithWhereWithoutTriggeredByInput = {
    where: DeployJobScalarWhereInput
    data: XOR<DeployJobUpdateManyMutationInput, DeployJobUncheckedUpdateManyWithoutTriggeredByInput>
  }

  export type DeployJobScalarWhereInput = {
    AND?: DeployJobScalarWhereInput | DeployJobScalarWhereInput[]
    OR?: DeployJobScalarWhereInput[]
    NOT?: DeployJobScalarWhereInput | DeployJobScalarWhereInput[]
    id?: StringFilter<"DeployJob"> | string
    projectId?: StringFilter<"DeployJob"> | string
    environmentId?: StringFilter<"DeployJob"> | string
    triggeredByUserId?: StringNullableFilter<"DeployJob"> | string | null
    status?: EnumDeployJobStatusFilter<"DeployJob"> | $Enums.DeployJobStatus
    currentStep?: StringNullableFilter<"DeployJob"> | string | null
    steps?: JsonFilter<"DeployJob">
    source?: JsonFilter<"DeployJob">
    executionModeSnapshot?: StringFilter<"DeployJob"> | string
    createdAt?: DateTimeFilter<"DeployJob"> | Date | string
    startedAt?: DateTimeNullableFilter<"DeployJob"> | Date | string | null
    finishedAt?: DateTimeNullableFilter<"DeployJob"> | Date | string | null
  }

  export type WizardBuildUpsertWithWhereUniqueWithoutOwnerInput = {
    where: WizardBuildWhereUniqueInput
    update: XOR<WizardBuildUpdateWithoutOwnerInput, WizardBuildUncheckedUpdateWithoutOwnerInput>
    create: XOR<WizardBuildCreateWithoutOwnerInput, WizardBuildUncheckedCreateWithoutOwnerInput>
  }

  export type WizardBuildUpdateWithWhereUniqueWithoutOwnerInput = {
    where: WizardBuildWhereUniqueInput
    data: XOR<WizardBuildUpdateWithoutOwnerInput, WizardBuildUncheckedUpdateWithoutOwnerInput>
  }

  export type WizardBuildUpdateManyWithWhereWithoutOwnerInput = {
    where: WizardBuildScalarWhereInput
    data: XOR<WizardBuildUpdateManyMutationInput, WizardBuildUncheckedUpdateManyWithoutOwnerInput>
  }

  export type WizardBuildScalarWhereInput = {
    AND?: WizardBuildScalarWhereInput | WizardBuildScalarWhereInput[]
    OR?: WizardBuildScalarWhereInput[]
    NOT?: WizardBuildScalarWhereInput | WizardBuildScalarWhereInput[]
    id?: StringFilter<"WizardBuild"> | string
    ownerId?: StringFilter<"WizardBuild"> | string
    projectId?: StringFilter<"WizardBuild"> | string
    version?: StringFilter<"WizardBuild"> | string
    inputs?: JsonFilter<"WizardBuild">
    manifest?: JsonFilter<"WizardBuild">
    lock?: JsonNullableFilter<"WizardBuild">
    createdAt?: DateTimeFilter<"WizardBuild"> | Date | string
  }

  export type OtpUpsertWithWhereUniqueWithoutUserInput = {
    where: OtpWhereUniqueInput
    update: XOR<OtpUpdateWithoutUserInput, OtpUncheckedUpdateWithoutUserInput>
    create: XOR<OtpCreateWithoutUserInput, OtpUncheckedCreateWithoutUserInput>
  }

  export type OtpUpdateWithWhereUniqueWithoutUserInput = {
    where: OtpWhereUniqueInput
    data: XOR<OtpUpdateWithoutUserInput, OtpUncheckedUpdateWithoutUserInput>
  }

  export type OtpUpdateManyWithWhereWithoutUserInput = {
    where: OtpScalarWhereInput
    data: XOR<OtpUpdateManyMutationInput, OtpUncheckedUpdateManyWithoutUserInput>
  }

  export type OtpScalarWhereInput = {
    AND?: OtpScalarWhereInput | OtpScalarWhereInput[]
    OR?: OtpScalarWhereInput[]
    NOT?: OtpScalarWhereInput | OtpScalarWhereInput[]
    id?: StringFilter<"Otp"> | string
    userId?: StringFilter<"Otp"> | string
    codeHash?: StringFilter<"Otp"> | string
    idempotencyKey?: StringNullableFilter<"Otp"> | string | null
    purpose?: StringFilter<"Otp"> | string
    attemptsCount?: IntFilter<"Otp"> | number
    isUsed?: BoolFilter<"Otp"> | boolean
    expiresAt?: DateTimeFilter<"Otp"> | Date | string
    nextRequestAt?: DateTimeNullableFilter<"Otp"> | Date | string | null
    createdAt?: DateTimeFilter<"Otp"> | Date | string
  }

  export type OAuthAccountUpsertWithWhereUniqueWithoutUserInput = {
    where: OAuthAccountWhereUniqueInput
    update: XOR<OAuthAccountUpdateWithoutUserInput, OAuthAccountUncheckedUpdateWithoutUserInput>
    create: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput>
  }

  export type OAuthAccountUpdateWithWhereUniqueWithoutUserInput = {
    where: OAuthAccountWhereUniqueInput
    data: XOR<OAuthAccountUpdateWithoutUserInput, OAuthAccountUncheckedUpdateWithoutUserInput>
  }

  export type OAuthAccountUpdateManyWithWhereWithoutUserInput = {
    where: OAuthAccountScalarWhereInput
    data: XOR<OAuthAccountUpdateManyMutationInput, OAuthAccountUncheckedUpdateManyWithoutUserInput>
  }

  export type OAuthAccountScalarWhereInput = {
    AND?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[]
    OR?: OAuthAccountScalarWhereInput[]
    NOT?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[]
    id?: StringFilter<"OAuthAccount"> | string
    userId?: StringFilter<"OAuthAccount"> | string
    provider?: StringFilter<"OAuthAccount"> | string
    accountId?: StringFilter<"OAuthAccount"> | string
    accountEmail?: StringNullableFilter<"OAuthAccount"> | string | null
    accessToken?: StringNullableFilter<"OAuthAccount"> | string | null
    refreshToken?: StringNullableFilter<"OAuthAccount"> | string | null
    expiresAt?: DateTimeNullableFilter<"OAuthAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"OAuthAccount"> | Date | string
  }

  export type UserPaymentMethodUpsertWithWhereUniqueWithoutUserInput = {
    where: UserPaymentMethodWhereUniqueInput
    update: XOR<UserPaymentMethodUpdateWithoutUserInput, UserPaymentMethodUncheckedUpdateWithoutUserInput>
    create: XOR<UserPaymentMethodCreateWithoutUserInput, UserPaymentMethodUncheckedCreateWithoutUserInput>
  }

  export type UserPaymentMethodUpdateWithWhereUniqueWithoutUserInput = {
    where: UserPaymentMethodWhereUniqueInput
    data: XOR<UserPaymentMethodUpdateWithoutUserInput, UserPaymentMethodUncheckedUpdateWithoutUserInput>
  }

  export type UserPaymentMethodUpdateManyWithWhereWithoutUserInput = {
    where: UserPaymentMethodScalarWhereInput
    data: XOR<UserPaymentMethodUpdateManyMutationInput, UserPaymentMethodUncheckedUpdateManyWithoutUserInput>
  }

  export type UserPaymentMethodScalarWhereInput = {
    AND?: UserPaymentMethodScalarWhereInput | UserPaymentMethodScalarWhereInput[]
    OR?: UserPaymentMethodScalarWhereInput[]
    NOT?: UserPaymentMethodScalarWhereInput | UserPaymentMethodScalarWhereInput[]
    id?: StringFilter<"UserPaymentMethod"> | string
    userId?: StringFilter<"UserPaymentMethod"> | string
    stripePaymentMethodId?: StringFilter<"UserPaymentMethod"> | string
    type?: StringFilter<"UserPaymentMethod"> | string
    last4?: StringFilter<"UserPaymentMethod"> | string
    brand?: StringNullableFilter<"UserPaymentMethod"> | string | null
    expiryMonth?: IntNullableFilter<"UserPaymentMethod"> | number | null
    expiryYear?: IntNullableFilter<"UserPaymentMethod"> | number | null
    isDefault?: BoolFilter<"UserPaymentMethod"> | boolean
    createdAt?: DateTimeFilter<"UserPaymentMethod"> | Date | string
  }

  export type PaymentUpsertWithWhereUniqueWithoutUserInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutUserInput, PaymentUncheckedUpdateWithoutUserInput>
    create: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutUserInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutUserInput, PaymentUncheckedUpdateWithoutUserInput>
  }

  export type PaymentUpdateManyWithWhereWithoutUserInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutUserInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: StringFilter<"Payment"> | string
    userId?: StringFilter<"Payment"> | string
    stripePaymentId?: StringFilter<"Payment"> | string
    amount?: IntFilter<"Payment"> | number
    currency?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    description?: StringNullableFilter<"Payment"> | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
  }

  export type InvoiceUpsertWithWhereUniqueWithoutUserInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutUserInput, InvoiceUncheckedUpdateWithoutUserInput>
    create: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutUserInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutUserInput, InvoiceUncheckedUpdateWithoutUserInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutUserInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutUserInput>
  }

  export type InvoiceScalarWhereInput = {
    AND?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    OR?: InvoiceScalarWhereInput[]
    NOT?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    id?: StringFilter<"Invoice"> | string
    userId?: StringFilter<"Invoice"> | string
    stripeInvoiceId?: StringFilter<"Invoice"> | string
    amount?: IntFilter<"Invoice"> | number
    currency?: StringFilter<"Invoice"> | string
    status?: StringFilter<"Invoice"> | string
    paidAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    dueDate?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    invoiceUrl?: StringNullableFilter<"Invoice"> | string | null
    pdfUrl?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutUserInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutUserInput>
  }

  export type SubscriptionScalarWhereInput = {
    AND?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    OR?: SubscriptionScalarWhereInput[]
    NOT?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    planId?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    stripeSubscriptionId?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeFilter<"Subscription"> | Date | string
    currentPeriodEnd?: DateTimeFilter<"Subscription"> | Date | string
    cancelAtPeriodEnd?: BoolFilter<"Subscription"> | boolean
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
  }

  export type UsageCounterUpsertWithWhereUniqueWithoutUserInput = {
    where: UsageCounterWhereUniqueInput
    update: XOR<UsageCounterUpdateWithoutUserInput, UsageCounterUncheckedUpdateWithoutUserInput>
    create: XOR<UsageCounterCreateWithoutUserInput, UsageCounterUncheckedCreateWithoutUserInput>
  }

  export type UsageCounterUpdateWithWhereUniqueWithoutUserInput = {
    where: UsageCounterWhereUniqueInput
    data: XOR<UsageCounterUpdateWithoutUserInput, UsageCounterUncheckedUpdateWithoutUserInput>
  }

  export type UsageCounterUpdateManyWithWhereWithoutUserInput = {
    where: UsageCounterScalarWhereInput
    data: XOR<UsageCounterUpdateManyMutationInput, UsageCounterUncheckedUpdateManyWithoutUserInput>
  }

  export type UsageCounterScalarWhereInput = {
    AND?: UsageCounterScalarWhereInput | UsageCounterScalarWhereInput[]
    OR?: UsageCounterScalarWhereInput[]
    NOT?: UsageCounterScalarWhereInput | UsageCounterScalarWhereInput[]
    id?: StringFilter<"UsageCounter"> | string
    userId?: StringFilter<"UsageCounter"> | string
    featureId?: StringFilter<"UsageCounter"> | string
    periodStart?: DateTimeFilter<"UsageCounter"> | Date | string
    periodEnd?: DateTimeFilter<"UsageCounter"> | Date | string
    used?: IntFilter<"UsageCounter"> | number
    createdAt?: DateTimeFilter<"UsageCounter"> | Date | string
    updatedAt?: DateTimeFilter<"UsageCounter"> | Date | string
  }

  export type UserCreateWithoutOauthAccountsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    otps?: OtpCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOauthAccountsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOauthAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOauthAccountsInput, UserUncheckedCreateWithoutOauthAccountsInput>
  }

  export type UserUpsertWithoutOauthAccountsInput = {
    update: XOR<UserUpdateWithoutOauthAccountsInput, UserUncheckedUpdateWithoutOauthAccountsInput>
    create: XOR<UserCreateWithoutOauthAccountsInput, UserUncheckedCreateWithoutOauthAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOauthAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOauthAccountsInput, UserUncheckedUpdateWithoutOauthAccountsInput>
  }

  export type UserUpdateWithoutOauthAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOauthAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutOtpsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOtpsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOtpsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOtpsInput, UserUncheckedCreateWithoutOtpsInput>
  }

  export type UserUpsertWithoutOtpsInput = {
    update: XOR<UserUpdateWithoutOtpsInput, UserUncheckedUpdateWithoutOtpsInput>
    create: XOR<UserCreateWithoutOtpsInput, UserUncheckedCreateWithoutOtpsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOtpsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOtpsInput, UserUncheckedUpdateWithoutOtpsInput>
  }

  export type UserUpdateWithoutOtpsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOtpsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutProjectsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    otps?: OtpCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProjectsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
  }

  export type DeployJobCreateWithoutProjectInput = {
    id?: string
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    environment: EnvironmentCreateNestedOneWithoutDeployJobsInput
    triggeredBy?: UserCreateNestedOneWithoutDeployJobsInput
  }

  export type DeployJobUncheckedCreateWithoutProjectInput = {
    id?: string
    environmentId: string
    triggeredByUserId?: string | null
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
  }

  export type DeployJobCreateOrConnectWithoutProjectInput = {
    where: DeployJobWhereUniqueInput
    create: XOR<DeployJobCreateWithoutProjectInput, DeployJobUncheckedCreateWithoutProjectInput>
  }

  export type DeployJobCreateManyProjectInputEnvelope = {
    data: DeployJobCreateManyProjectInput | DeployJobCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type WizardBuildCreateWithoutProjectInput = {
    id?: string
    version: string
    inputs: JsonNullValueInput | InputJsonValue
    manifest: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    owner: UserCreateNestedOneWithoutWizardBuildsInput
  }

  export type WizardBuildUncheckedCreateWithoutProjectInput = {
    id?: string
    ownerId: string
    version: string
    inputs: JsonNullValueInput | InputJsonValue
    manifest: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type WizardBuildCreateOrConnectWithoutProjectInput = {
    where: WizardBuildWhereUniqueInput
    create: XOR<WizardBuildCreateWithoutProjectInput, WizardBuildUncheckedCreateWithoutProjectInput>
  }

  export type WizardBuildCreateManyProjectInputEnvelope = {
    data: WizardBuildCreateManyProjectInput | WizardBuildCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutProjectsInput = {
    update: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type UserUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DeployJobUpsertWithWhereUniqueWithoutProjectInput = {
    where: DeployJobWhereUniqueInput
    update: XOR<DeployJobUpdateWithoutProjectInput, DeployJobUncheckedUpdateWithoutProjectInput>
    create: XOR<DeployJobCreateWithoutProjectInput, DeployJobUncheckedCreateWithoutProjectInput>
  }

  export type DeployJobUpdateWithWhereUniqueWithoutProjectInput = {
    where: DeployJobWhereUniqueInput
    data: XOR<DeployJobUpdateWithoutProjectInput, DeployJobUncheckedUpdateWithoutProjectInput>
  }

  export type DeployJobUpdateManyWithWhereWithoutProjectInput = {
    where: DeployJobScalarWhereInput
    data: XOR<DeployJobUpdateManyMutationInput, DeployJobUncheckedUpdateManyWithoutProjectInput>
  }

  export type WizardBuildUpsertWithWhereUniqueWithoutProjectInput = {
    where: WizardBuildWhereUniqueInput
    update: XOR<WizardBuildUpdateWithoutProjectInput, WizardBuildUncheckedUpdateWithoutProjectInput>
    create: XOR<WizardBuildCreateWithoutProjectInput, WizardBuildUncheckedCreateWithoutProjectInput>
  }

  export type WizardBuildUpdateWithWhereUniqueWithoutProjectInput = {
    where: WizardBuildWhereUniqueInput
    data: XOR<WizardBuildUpdateWithoutProjectInput, WizardBuildUncheckedUpdateWithoutProjectInput>
  }

  export type WizardBuildUpdateManyWithWhereWithoutProjectInput = {
    where: WizardBuildScalarWhereInput
    data: XOR<WizardBuildUpdateManyMutationInput, WizardBuildUncheckedUpdateManyWithoutProjectInput>
  }

  export type UserCreateWithoutEnvironmentsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    otps?: OtpCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEnvironmentsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEnvironmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEnvironmentsInput, UserUncheckedCreateWithoutEnvironmentsInput>
  }

  export type DeployJobCreateWithoutEnvironmentInput = {
    id?: string
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutDeployJobsInput
    triggeredBy?: UserCreateNestedOneWithoutDeployJobsInput
  }

  export type DeployJobUncheckedCreateWithoutEnvironmentInput = {
    id?: string
    projectId: string
    triggeredByUserId?: string | null
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
  }

  export type DeployJobCreateOrConnectWithoutEnvironmentInput = {
    where: DeployJobWhereUniqueInput
    create: XOR<DeployJobCreateWithoutEnvironmentInput, DeployJobUncheckedCreateWithoutEnvironmentInput>
  }

  export type DeployJobCreateManyEnvironmentInputEnvelope = {
    data: DeployJobCreateManyEnvironmentInput | DeployJobCreateManyEnvironmentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutEnvironmentsInput = {
    update: XOR<UserUpdateWithoutEnvironmentsInput, UserUncheckedUpdateWithoutEnvironmentsInput>
    create: XOR<UserCreateWithoutEnvironmentsInput, UserUncheckedCreateWithoutEnvironmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEnvironmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEnvironmentsInput, UserUncheckedUpdateWithoutEnvironmentsInput>
  }

  export type UserUpdateWithoutEnvironmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEnvironmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DeployJobUpsertWithWhereUniqueWithoutEnvironmentInput = {
    where: DeployJobWhereUniqueInput
    update: XOR<DeployJobUpdateWithoutEnvironmentInput, DeployJobUncheckedUpdateWithoutEnvironmentInput>
    create: XOR<DeployJobCreateWithoutEnvironmentInput, DeployJobUncheckedCreateWithoutEnvironmentInput>
  }

  export type DeployJobUpdateWithWhereUniqueWithoutEnvironmentInput = {
    where: DeployJobWhereUniqueInput
    data: XOR<DeployJobUpdateWithoutEnvironmentInput, DeployJobUncheckedUpdateWithoutEnvironmentInput>
  }

  export type DeployJobUpdateManyWithWhereWithoutEnvironmentInput = {
    where: DeployJobScalarWhereInput
    data: XOR<DeployJobUpdateManyMutationInput, DeployJobUncheckedUpdateManyWithoutEnvironmentInput>
  }

  export type ProjectCreateWithoutDeployJobsInput = {
    id?: string
    name: string
    slug: string
    repoExportEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutProjectsInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutDeployJobsInput = {
    id?: string
    ownerId: string
    name: string
    slug: string
    repoExportEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutDeployJobsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutDeployJobsInput, ProjectUncheckedCreateWithoutDeployJobsInput>
  }

  export type EnvironmentCreateWithoutDeployJobsInput = {
    id?: string
    projectId?: string | null
    name: string
    displayName: string
    tierPolicy?: string
    executionMode?: string
    region?: string
    visibility?: string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutEnvironmentsInput
  }

  export type EnvironmentUncheckedCreateWithoutDeployJobsInput = {
    id?: string
    ownerId: string
    projectId?: string | null
    name: string
    displayName: string
    tierPolicy?: string
    executionMode?: string
    region?: string
    visibility?: string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EnvironmentCreateOrConnectWithoutDeployJobsInput = {
    where: EnvironmentWhereUniqueInput
    create: XOR<EnvironmentCreateWithoutDeployJobsInput, EnvironmentUncheckedCreateWithoutDeployJobsInput>
  }

  export type UserCreateWithoutDeployJobsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    otps?: OtpCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDeployJobsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDeployJobsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDeployJobsInput, UserUncheckedCreateWithoutDeployJobsInput>
  }

  export type ProjectUpsertWithoutDeployJobsInput = {
    update: XOR<ProjectUpdateWithoutDeployJobsInput, ProjectUncheckedUpdateWithoutDeployJobsInput>
    create: XOR<ProjectCreateWithoutDeployJobsInput, ProjectUncheckedCreateWithoutDeployJobsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutDeployJobsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutDeployJobsInput, ProjectUncheckedUpdateWithoutDeployJobsInput>
  }

  export type ProjectUpdateWithoutDeployJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutProjectsNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutDeployJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type EnvironmentUpsertWithoutDeployJobsInput = {
    update: XOR<EnvironmentUpdateWithoutDeployJobsInput, EnvironmentUncheckedUpdateWithoutDeployJobsInput>
    create: XOR<EnvironmentCreateWithoutDeployJobsInput, EnvironmentUncheckedCreateWithoutDeployJobsInput>
    where?: EnvironmentWhereInput
  }

  export type EnvironmentUpdateToOneWithWhereWithoutDeployJobsInput = {
    where?: EnvironmentWhereInput
    data: XOR<EnvironmentUpdateWithoutDeployJobsInput, EnvironmentUncheckedUpdateWithoutDeployJobsInput>
  }

  export type EnvironmentUpdateWithoutDeployJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    tierPolicy?: StringFieldUpdateOperationsInput | string
    executionMode?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutEnvironmentsNestedInput
  }

  export type EnvironmentUncheckedUpdateWithoutDeployJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    tierPolicy?: StringFieldUpdateOperationsInput | string
    executionMode?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutDeployJobsInput = {
    update: XOR<UserUpdateWithoutDeployJobsInput, UserUncheckedUpdateWithoutDeployJobsInput>
    create: XOR<UserCreateWithoutDeployJobsInput, UserUncheckedCreateWithoutDeployJobsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDeployJobsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDeployJobsInput, UserUncheckedUpdateWithoutDeployJobsInput>
  }

  export type UserUpdateWithoutDeployJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDeployJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutWizardBuildsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    otps?: OtpCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWizardBuildsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWizardBuildsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWizardBuildsInput, UserUncheckedCreateWithoutWizardBuildsInput>
  }

  export type ProjectCreateWithoutWizardBuildsInput = {
    id?: string
    name: string
    slug: string
    repoExportEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutProjectsInput
    deployJobs?: DeployJobCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutWizardBuildsInput = {
    id?: string
    ownerId: string
    name: string
    slug: string
    repoExportEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutWizardBuildsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutWizardBuildsInput, ProjectUncheckedCreateWithoutWizardBuildsInput>
  }

  export type UserUpsertWithoutWizardBuildsInput = {
    update: XOR<UserUpdateWithoutWizardBuildsInput, UserUncheckedUpdateWithoutWizardBuildsInput>
    create: XOR<UserCreateWithoutWizardBuildsInput, UserUncheckedCreateWithoutWizardBuildsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWizardBuildsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWizardBuildsInput, UserUncheckedUpdateWithoutWizardBuildsInput>
  }

  export type UserUpdateWithoutWizardBuildsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWizardBuildsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectUpsertWithoutWizardBuildsInput = {
    update: XOR<ProjectUpdateWithoutWizardBuildsInput, ProjectUncheckedUpdateWithoutWizardBuildsInput>
    create: XOR<ProjectCreateWithoutWizardBuildsInput, ProjectUncheckedCreateWithoutWizardBuildsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutWizardBuildsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutWizardBuildsInput, ProjectUncheckedUpdateWithoutWizardBuildsInput>
  }

  export type ProjectUpdateWithoutWizardBuildsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutProjectsNestedInput
    deployJobs?: DeployJobUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutWizardBuildsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployJobs?: DeployJobUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserCreateWithoutSubscriptionsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    otps?: OtpCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSubscriptionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
  }

  export type UserUpsertWithoutSubscriptionsInput = {
    update: XOR<UserUpdateWithoutSubscriptionsInput, UserUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubscriptionsInput, UserUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type UserUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPaymentMethodsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    otps?: OtpCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPaymentMethodsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPaymentMethodsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPaymentMethodsInput, UserUncheckedCreateWithoutPaymentMethodsInput>
  }

  export type UserUpsertWithoutPaymentMethodsInput = {
    update: XOR<UserUpdateWithoutPaymentMethodsInput, UserUncheckedUpdateWithoutPaymentMethodsInput>
    create: XOR<UserCreateWithoutPaymentMethodsInput, UserUncheckedCreateWithoutPaymentMethodsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPaymentMethodsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPaymentMethodsInput, UserUncheckedUpdateWithoutPaymentMethodsInput>
  }

  export type UserUpdateWithoutPaymentMethodsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPaymentMethodsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPaymentsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    otps?: OtpCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPaymentsInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPaymentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
  }

  export type UserUpsertWithoutPaymentsInput = {
    update: XOR<UserUpdateWithoutPaymentsInput, UserUncheckedUpdateWithoutPaymentsInput>
    create: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPaymentsInput, UserUncheckedUpdateWithoutPaymentsInput>
  }

  export type UserUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutInvoicesInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    otps?: OtpCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutInvoicesInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    usageCounters?: UsageCounterUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutInvoicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
  }

  export type UserUpsertWithoutInvoicesInput = {
    update: XOR<UserUpdateWithoutInvoicesInput, UserUncheckedUpdateWithoutInvoicesInput>
    create: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInvoicesInput, UserUncheckedUpdateWithoutInvoicesInput>
  }

  export type UserUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    usageCounters?: UsageCounterUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutUsageCountersInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildCreateNestedManyWithoutOwnerInput
    otps?: OtpCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUsageCountersInput = {
    id?: string
    email: string
    username: string
    fullName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    hashedPassword: string
    isActive?: boolean
    isSuperuser?: boolean
    isEmailVerified?: boolean
    stripeCustomerId?: string | null
    novuSubscriberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    environments?: EnvironmentUncheckedCreateNestedManyWithoutOwnerInput
    deployJobs?: DeployJobUncheckedCreateNestedManyWithoutTriggeredByInput
    wizardBuilds?: WizardBuildUncheckedCreateNestedManyWithoutOwnerInput
    otps?: OtpUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
    paymentMethods?: UserPaymentMethodUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUsageCountersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUsageCountersInput, UserUncheckedCreateWithoutUsageCountersInput>
  }

  export type UserUpsertWithoutUsageCountersInput = {
    update: XOR<UserUpdateWithoutUsageCountersInput, UserUncheckedUpdateWithoutUsageCountersInput>
    create: XOR<UserCreateWithoutUsageCountersInput, UserUncheckedCreateWithoutUsageCountersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUsageCountersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUsageCountersInput, UserUncheckedUpdateWithoutUsageCountersInput>
  }

  export type UserUpdateWithoutUsageCountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutOwnerNestedInput
    otps?: OtpUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUsageCountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSuperuser?: BoolFieldUpdateOperationsInput | boolean
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    novuSubscriberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    environments?: EnvironmentUncheckedUpdateManyWithoutOwnerNestedInput
    deployJobs?: DeployJobUncheckedUpdateManyWithoutTriggeredByNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutOwnerNestedInput
    otps?: OtpUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
    paymentMethods?: UserPaymentMethodUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectCreateManyOwnerInput = {
    id?: string
    name: string
    slug: string
    repoExportEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EnvironmentCreateManyOwnerInput = {
    id?: string
    projectId?: string | null
    name: string
    displayName: string
    tierPolicy?: string
    executionMode?: string
    region?: string
    visibility?: string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeployJobCreateManyTriggeredByInput = {
    id?: string
    projectId: string
    environmentId: string
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
  }

  export type WizardBuildCreateManyOwnerInput = {
    id?: string
    projectId: string
    version: string
    inputs: JsonNullValueInput | InputJsonValue
    manifest: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OtpCreateManyUserInput = {
    id?: string
    codeHash: string
    idempotencyKey?: string | null
    purpose: string
    attemptsCount?: number
    isUsed?: boolean
    expiresAt: Date | string
    nextRequestAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OAuthAccountCreateManyUserInput = {
    id?: string
    provider: string
    accountId: string
    accountEmail?: string | null
    accessToken?: string | null
    refreshToken?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type UserPaymentMethodCreateManyUserInput = {
    id?: string
    stripePaymentMethodId: string
    type: string
    last4: string
    brand?: string | null
    expiryMonth?: number | null
    expiryYear?: number | null
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type PaymentCreateManyUserInput = {
    id?: string
    stripePaymentId: string
    amount: number
    currency?: string
    status: string
    description?: string | null
    createdAt?: Date | string
  }

  export type InvoiceCreateManyUserInput = {
    id?: string
    stripeInvoiceId: string
    amount: number
    currency?: string
    status: string
    paidAt?: Date | string | null
    dueDate?: Date | string | null
    invoiceUrl?: string | null
    pdfUrl?: string | null
    createdAt?: Date | string
  }

  export type SubscriptionCreateManyUserInput = {
    id?: string
    planId?: string | null
    status: string
    stripeSubscriptionId: string
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsageCounterCreateManyUserInput = {
    id?: string
    featureId: string
    periodStart: Date | string
    periodEnd: Date | string
    used?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployJobs?: DeployJobUpdateManyWithoutProjectNestedInput
    wizardBuilds?: WizardBuildUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployJobs?: DeployJobUncheckedUpdateManyWithoutProjectNestedInput
    wizardBuilds?: WizardBuildUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    repoExportEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnvironmentUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    tierPolicy?: StringFieldUpdateOperationsInput | string
    executionMode?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployJobs?: DeployJobUpdateManyWithoutEnvironmentNestedInput
  }

  export type EnvironmentUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    tierPolicy?: StringFieldUpdateOperationsInput | string
    executionMode?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployJobs?: DeployJobUncheckedUpdateManyWithoutEnvironmentNestedInput
  }

  export type EnvironmentUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    tierPolicy?: StringFieldUpdateOperationsInput | string
    executionMode?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeployJobUpdateWithoutTriggeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutDeployJobsNestedInput
    environment?: EnvironmentUpdateOneRequiredWithoutDeployJobsNestedInput
  }

  export type DeployJobUncheckedUpdateWithoutTriggeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DeployJobUncheckedUpdateManyWithoutTriggeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WizardBuildUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    manifest?: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutWizardBuildsNestedInput
  }

  export type WizardBuildUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    manifest?: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WizardBuildUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    manifest?: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRequestAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRequestAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRequestAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountEmail?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountEmail?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountEmail?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPaymentMethodUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentMethodId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    last4?: StringFieldUpdateOperationsInput | string
    brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiryMonth?: NullableIntFieldUpdateOperationsInput | number | null
    expiryYear?: NullableIntFieldUpdateOperationsInput | number | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPaymentMethodUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentMethodId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    last4?: StringFieldUpdateOperationsInput | string
    brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiryMonth?: NullableIntFieldUpdateOperationsInput | number | null
    expiryYear?: NullableIntFieldUpdateOperationsInput | number | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPaymentMethodUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentMethodId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    last4?: StringFieldUpdateOperationsInput | string
    brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiryMonth?: NullableIntFieldUpdateOperationsInput | number | null
    expiryYear?: NullableIntFieldUpdateOperationsInput | number | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageCounterUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    featureId?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageCounterUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    featureId?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageCounterUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    featureId?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeployJobCreateManyProjectInput = {
    id?: string
    environmentId: string
    triggeredByUserId?: string | null
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
  }

  export type WizardBuildCreateManyProjectInput = {
    id?: string
    ownerId: string
    version: string
    inputs: JsonNullValueInput | InputJsonValue
    manifest: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type DeployJobUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    environment?: EnvironmentUpdateOneRequiredWithoutDeployJobsNestedInput
    triggeredBy?: UserUpdateOneWithoutDeployJobsNestedInput
  }

  export type DeployJobUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DeployJobUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WizardBuildUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    manifest?: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutWizardBuildsNestedInput
  }

  export type WizardBuildUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    manifest?: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WizardBuildUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    manifest?: JsonNullValueInput | InputJsonValue
    lock?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeployJobCreateManyEnvironmentInput = {
    id?: string
    projectId: string
    triggeredByUserId?: string | null
    status?: $Enums.DeployJobStatus
    currentStep?: string | null
    steps: JsonNullValueInput | InputJsonValue
    source: JsonNullValueInput | InputJsonValue
    executionModeSnapshot: string
    createdAt?: Date | string
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
  }

  export type DeployJobUpdateWithoutEnvironmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutDeployJobsNestedInput
    triggeredBy?: UserUpdateOneWithoutDeployJobsNestedInput
  }

  export type DeployJobUncheckedUpdateWithoutEnvironmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DeployJobUncheckedUpdateManyWithoutEnvironmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDeployJobStatusFieldUpdateOperationsInput | $Enums.DeployJobStatus
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: JsonNullValueInput | InputJsonValue
    source?: JsonNullValueInput | InputJsonValue
    executionModeSnapshot?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}