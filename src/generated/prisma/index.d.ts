
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model SnapTldState
 * 
 */
export type SnapTldState = $Result.DefaultSelection<Prisma.$SnapTldStatePayload>
/**
 * Model SnapTldFeedOverride
 * 
 */
export type SnapTldFeedOverride = $Result.DefaultSelection<Prisma.$SnapTldFeedOverridePayload>
/**
 * Model SnapTldReport
 * 
 */
export type SnapTldReport = $Result.DefaultSelection<Prisma.$SnapTldReportPayload>
/**
 * Model SnapTldImportedDomain
 * 
 */
export type SnapTldImportedDomain = $Result.DefaultSelection<Prisma.$SnapTldImportedDomainPayload>
/**
 * Model SnapTldDomainAnalysis
 * 
 */
export type SnapTldDomainAnalysis = $Result.DefaultSelection<Prisma.$SnapTldDomainAnalysisPayload>
/**
 * Model DriveItem
 * 
 */
export type DriveItem = $Result.DefaultSelection<Prisma.$DriveItemPayload>
/**
 * Model DriveActivity
 * 
 */
export type DriveActivity = $Result.DefaultSelection<Prisma.$DriveActivityPayload>
/**
 * Model BillingCompany
 * 
 */
export type BillingCompany = $Result.DefaultSelection<Prisma.$BillingCompanyPayload>
/**
 * Model BillingCustomer
 * 
 */
export type BillingCustomer = $Result.DefaultSelection<Prisma.$BillingCustomerPayload>
/**
 * Model BillingInvoice
 * 
 */
export type BillingInvoice = $Result.DefaultSelection<Prisma.$BillingInvoicePayload>
/**
 * Model BillingInvoiceLine
 * 
 */
export type BillingInvoiceLine = $Result.DefaultSelection<Prisma.$BillingInvoiceLinePayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model SubscriptionPricePoint
 * 
 */
export type SubscriptionPricePoint = $Result.DefaultSelection<Prisma.$SubscriptionPricePointPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more SnapTldStates
 * const snapTldStates = await prisma.snapTldState.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
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
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more SnapTldStates
   * const snapTldStates = await prisma.snapTldState.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.snapTldState`: Exposes CRUD operations for the **SnapTldState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SnapTldStates
    * const snapTldStates = await prisma.snapTldState.findMany()
    * ```
    */
  get snapTldState(): Prisma.SnapTldStateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.snapTldFeedOverride`: Exposes CRUD operations for the **SnapTldFeedOverride** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SnapTldFeedOverrides
    * const snapTldFeedOverrides = await prisma.snapTldFeedOverride.findMany()
    * ```
    */
  get snapTldFeedOverride(): Prisma.SnapTldFeedOverrideDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.snapTldReport`: Exposes CRUD operations for the **SnapTldReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SnapTldReports
    * const snapTldReports = await prisma.snapTldReport.findMany()
    * ```
    */
  get snapTldReport(): Prisma.SnapTldReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.snapTldImportedDomain`: Exposes CRUD operations for the **SnapTldImportedDomain** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SnapTldImportedDomains
    * const snapTldImportedDomains = await prisma.snapTldImportedDomain.findMany()
    * ```
    */
  get snapTldImportedDomain(): Prisma.SnapTldImportedDomainDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.snapTldDomainAnalysis`: Exposes CRUD operations for the **SnapTldDomainAnalysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SnapTldDomainAnalyses
    * const snapTldDomainAnalyses = await prisma.snapTldDomainAnalysis.findMany()
    * ```
    */
  get snapTldDomainAnalysis(): Prisma.SnapTldDomainAnalysisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.driveItem`: Exposes CRUD operations for the **DriveItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DriveItems
    * const driveItems = await prisma.driveItem.findMany()
    * ```
    */
  get driveItem(): Prisma.DriveItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.driveActivity`: Exposes CRUD operations for the **DriveActivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DriveActivities
    * const driveActivities = await prisma.driveActivity.findMany()
    * ```
    */
  get driveActivity(): Prisma.DriveActivityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.billingCompany`: Exposes CRUD operations for the **BillingCompany** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingCompanies
    * const billingCompanies = await prisma.billingCompany.findMany()
    * ```
    */
  get billingCompany(): Prisma.BillingCompanyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.billingCustomer`: Exposes CRUD operations for the **BillingCustomer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingCustomers
    * const billingCustomers = await prisma.billingCustomer.findMany()
    * ```
    */
  get billingCustomer(): Prisma.BillingCustomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.billingInvoice`: Exposes CRUD operations for the **BillingInvoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingInvoices
    * const billingInvoices = await prisma.billingInvoice.findMany()
    * ```
    */
  get billingInvoice(): Prisma.BillingInvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.billingInvoiceLine`: Exposes CRUD operations for the **BillingInvoiceLine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingInvoiceLines
    * const billingInvoiceLines = await prisma.billingInvoiceLine.findMany()
    * ```
    */
  get billingInvoiceLine(): Prisma.BillingInvoiceLineDelegate<ExtArgs, ClientOptions>;

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
   * `prisma.subscriptionPricePoint`: Exposes CRUD operations for the **SubscriptionPricePoint** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubscriptionPricePoints
    * const subscriptionPricePoints = await prisma.subscriptionPricePoint.findMany()
    * ```
    */
  get subscriptionPricePoint(): Prisma.SubscriptionPricePointDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
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
    SnapTldState: 'SnapTldState',
    SnapTldFeedOverride: 'SnapTldFeedOverride',
    SnapTldReport: 'SnapTldReport',
    SnapTldImportedDomain: 'SnapTldImportedDomain',
    SnapTldDomainAnalysis: 'SnapTldDomainAnalysis',
    DriveItem: 'DriveItem',
    DriveActivity: 'DriveActivity',
    BillingCompany: 'BillingCompany',
    BillingCustomer: 'BillingCustomer',
    BillingInvoice: 'BillingInvoice',
    BillingInvoiceLine: 'BillingInvoiceLine',
    Subscription: 'Subscription',
    SubscriptionPricePoint: 'SubscriptionPricePoint'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "snapTldState" | "snapTldFeedOverride" | "snapTldReport" | "snapTldImportedDomain" | "snapTldDomainAnalysis" | "driveItem" | "driveActivity" | "billingCompany" | "billingCustomer" | "billingInvoice" | "billingInvoiceLine" | "subscription" | "subscriptionPricePoint"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SnapTldState: {
        payload: Prisma.$SnapTldStatePayload<ExtArgs>
        fields: Prisma.SnapTldStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnapTldStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnapTldStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload>
          }
          findFirst: {
            args: Prisma.SnapTldStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnapTldStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload>
          }
          findMany: {
            args: Prisma.SnapTldStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload>[]
          }
          create: {
            args: Prisma.SnapTldStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload>
          }
          createMany: {
            args: Prisma.SnapTldStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnapTldStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload>[]
          }
          delete: {
            args: Prisma.SnapTldStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload>
          }
          update: {
            args: Prisma.SnapTldStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload>
          }
          deleteMany: {
            args: Prisma.SnapTldStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnapTldStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SnapTldStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload>[]
          }
          upsert: {
            args: Prisma.SnapTldStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldStatePayload>
          }
          aggregate: {
            args: Prisma.SnapTldStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnapTldState>
          }
          groupBy: {
            args: Prisma.SnapTldStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnapTldStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnapTldStateCountArgs<ExtArgs>
            result: $Utils.Optional<SnapTldStateCountAggregateOutputType> | number
          }
        }
      }
      SnapTldFeedOverride: {
        payload: Prisma.$SnapTldFeedOverridePayload<ExtArgs>
        fields: Prisma.SnapTldFeedOverrideFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnapTldFeedOverrideFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnapTldFeedOverrideFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload>
          }
          findFirst: {
            args: Prisma.SnapTldFeedOverrideFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnapTldFeedOverrideFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload>
          }
          findMany: {
            args: Prisma.SnapTldFeedOverrideFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload>[]
          }
          create: {
            args: Prisma.SnapTldFeedOverrideCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload>
          }
          createMany: {
            args: Prisma.SnapTldFeedOverrideCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnapTldFeedOverrideCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload>[]
          }
          delete: {
            args: Prisma.SnapTldFeedOverrideDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload>
          }
          update: {
            args: Prisma.SnapTldFeedOverrideUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload>
          }
          deleteMany: {
            args: Prisma.SnapTldFeedOverrideDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnapTldFeedOverrideUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SnapTldFeedOverrideUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload>[]
          }
          upsert: {
            args: Prisma.SnapTldFeedOverrideUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldFeedOverridePayload>
          }
          aggregate: {
            args: Prisma.SnapTldFeedOverrideAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnapTldFeedOverride>
          }
          groupBy: {
            args: Prisma.SnapTldFeedOverrideGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnapTldFeedOverrideGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnapTldFeedOverrideCountArgs<ExtArgs>
            result: $Utils.Optional<SnapTldFeedOverrideCountAggregateOutputType> | number
          }
        }
      }
      SnapTldReport: {
        payload: Prisma.$SnapTldReportPayload<ExtArgs>
        fields: Prisma.SnapTldReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnapTldReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnapTldReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload>
          }
          findFirst: {
            args: Prisma.SnapTldReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnapTldReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload>
          }
          findMany: {
            args: Prisma.SnapTldReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload>[]
          }
          create: {
            args: Prisma.SnapTldReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload>
          }
          createMany: {
            args: Prisma.SnapTldReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnapTldReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload>[]
          }
          delete: {
            args: Prisma.SnapTldReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload>
          }
          update: {
            args: Prisma.SnapTldReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload>
          }
          deleteMany: {
            args: Prisma.SnapTldReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnapTldReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SnapTldReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload>[]
          }
          upsert: {
            args: Prisma.SnapTldReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldReportPayload>
          }
          aggregate: {
            args: Prisma.SnapTldReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnapTldReport>
          }
          groupBy: {
            args: Prisma.SnapTldReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnapTldReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnapTldReportCountArgs<ExtArgs>
            result: $Utils.Optional<SnapTldReportCountAggregateOutputType> | number
          }
        }
      }
      SnapTldImportedDomain: {
        payload: Prisma.$SnapTldImportedDomainPayload<ExtArgs>
        fields: Prisma.SnapTldImportedDomainFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnapTldImportedDomainFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnapTldImportedDomainFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload>
          }
          findFirst: {
            args: Prisma.SnapTldImportedDomainFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnapTldImportedDomainFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload>
          }
          findMany: {
            args: Prisma.SnapTldImportedDomainFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload>[]
          }
          create: {
            args: Prisma.SnapTldImportedDomainCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload>
          }
          createMany: {
            args: Prisma.SnapTldImportedDomainCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnapTldImportedDomainCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload>[]
          }
          delete: {
            args: Prisma.SnapTldImportedDomainDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload>
          }
          update: {
            args: Prisma.SnapTldImportedDomainUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload>
          }
          deleteMany: {
            args: Prisma.SnapTldImportedDomainDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnapTldImportedDomainUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SnapTldImportedDomainUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload>[]
          }
          upsert: {
            args: Prisma.SnapTldImportedDomainUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldImportedDomainPayload>
          }
          aggregate: {
            args: Prisma.SnapTldImportedDomainAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnapTldImportedDomain>
          }
          groupBy: {
            args: Prisma.SnapTldImportedDomainGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnapTldImportedDomainGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnapTldImportedDomainCountArgs<ExtArgs>
            result: $Utils.Optional<SnapTldImportedDomainCountAggregateOutputType> | number
          }
        }
      }
      SnapTldDomainAnalysis: {
        payload: Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>
        fields: Prisma.SnapTldDomainAnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnapTldDomainAnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnapTldDomainAnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload>
          }
          findFirst: {
            args: Prisma.SnapTldDomainAnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnapTldDomainAnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload>
          }
          findMany: {
            args: Prisma.SnapTldDomainAnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload>[]
          }
          create: {
            args: Prisma.SnapTldDomainAnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload>
          }
          createMany: {
            args: Prisma.SnapTldDomainAnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnapTldDomainAnalysisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload>[]
          }
          delete: {
            args: Prisma.SnapTldDomainAnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload>
          }
          update: {
            args: Prisma.SnapTldDomainAnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload>
          }
          deleteMany: {
            args: Prisma.SnapTldDomainAnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnapTldDomainAnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SnapTldDomainAnalysisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload>[]
          }
          upsert: {
            args: Prisma.SnapTldDomainAnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapTldDomainAnalysisPayload>
          }
          aggregate: {
            args: Prisma.SnapTldDomainAnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnapTldDomainAnalysis>
          }
          groupBy: {
            args: Prisma.SnapTldDomainAnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnapTldDomainAnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnapTldDomainAnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<SnapTldDomainAnalysisCountAggregateOutputType> | number
          }
        }
      }
      DriveItem: {
        payload: Prisma.$DriveItemPayload<ExtArgs>
        fields: Prisma.DriveItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DriveItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DriveItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload>
          }
          findFirst: {
            args: Prisma.DriveItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DriveItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload>
          }
          findMany: {
            args: Prisma.DriveItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload>[]
          }
          create: {
            args: Prisma.DriveItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload>
          }
          createMany: {
            args: Prisma.DriveItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DriveItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload>[]
          }
          delete: {
            args: Prisma.DriveItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload>
          }
          update: {
            args: Prisma.DriveItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload>
          }
          deleteMany: {
            args: Prisma.DriveItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DriveItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DriveItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload>[]
          }
          upsert: {
            args: Prisma.DriveItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveItemPayload>
          }
          aggregate: {
            args: Prisma.DriveItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDriveItem>
          }
          groupBy: {
            args: Prisma.DriveItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<DriveItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.DriveItemCountArgs<ExtArgs>
            result: $Utils.Optional<DriveItemCountAggregateOutputType> | number
          }
        }
      }
      DriveActivity: {
        payload: Prisma.$DriveActivityPayload<ExtArgs>
        fields: Prisma.DriveActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DriveActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DriveActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload>
          }
          findFirst: {
            args: Prisma.DriveActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DriveActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload>
          }
          findMany: {
            args: Prisma.DriveActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload>[]
          }
          create: {
            args: Prisma.DriveActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload>
          }
          createMany: {
            args: Prisma.DriveActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DriveActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload>[]
          }
          delete: {
            args: Prisma.DriveActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload>
          }
          update: {
            args: Prisma.DriveActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload>
          }
          deleteMany: {
            args: Prisma.DriveActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DriveActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DriveActivityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload>[]
          }
          upsert: {
            args: Prisma.DriveActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveActivityPayload>
          }
          aggregate: {
            args: Prisma.DriveActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDriveActivity>
          }
          groupBy: {
            args: Prisma.DriveActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<DriveActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.DriveActivityCountArgs<ExtArgs>
            result: $Utils.Optional<DriveActivityCountAggregateOutputType> | number
          }
        }
      }
      BillingCompany: {
        payload: Prisma.$BillingCompanyPayload<ExtArgs>
        fields: Prisma.BillingCompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingCompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingCompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload>
          }
          findFirst: {
            args: Prisma.BillingCompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingCompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload>
          }
          findMany: {
            args: Prisma.BillingCompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload>[]
          }
          create: {
            args: Prisma.BillingCompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload>
          }
          createMany: {
            args: Prisma.BillingCompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingCompanyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload>[]
          }
          delete: {
            args: Prisma.BillingCompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload>
          }
          update: {
            args: Prisma.BillingCompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload>
          }
          deleteMany: {
            args: Prisma.BillingCompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingCompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BillingCompanyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload>[]
          }
          upsert: {
            args: Prisma.BillingCompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCompanyPayload>
          }
          aggregate: {
            args: Prisma.BillingCompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingCompany>
          }
          groupBy: {
            args: Prisma.BillingCompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingCompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingCompanyCountArgs<ExtArgs>
            result: $Utils.Optional<BillingCompanyCountAggregateOutputType> | number
          }
        }
      }
      BillingCustomer: {
        payload: Prisma.$BillingCustomerPayload<ExtArgs>
        fields: Prisma.BillingCustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingCustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingCustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          findFirst: {
            args: Prisma.BillingCustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingCustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          findMany: {
            args: Prisma.BillingCustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>[]
          }
          create: {
            args: Prisma.BillingCustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          createMany: {
            args: Prisma.BillingCustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingCustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>[]
          }
          delete: {
            args: Prisma.BillingCustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          update: {
            args: Prisma.BillingCustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          deleteMany: {
            args: Prisma.BillingCustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingCustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BillingCustomerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>[]
          }
          upsert: {
            args: Prisma.BillingCustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          aggregate: {
            args: Prisma.BillingCustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingCustomer>
          }
          groupBy: {
            args: Prisma.BillingCustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingCustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingCustomerCountArgs<ExtArgs>
            result: $Utils.Optional<BillingCustomerCountAggregateOutputType> | number
          }
        }
      }
      BillingInvoice: {
        payload: Prisma.$BillingInvoicePayload<ExtArgs>
        fields: Prisma.BillingInvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingInvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingInvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          findFirst: {
            args: Prisma.BillingInvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingInvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          findMany: {
            args: Prisma.BillingInvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>[]
          }
          create: {
            args: Prisma.BillingInvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          createMany: {
            args: Prisma.BillingInvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingInvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>[]
          }
          delete: {
            args: Prisma.BillingInvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          update: {
            args: Prisma.BillingInvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          deleteMany: {
            args: Prisma.BillingInvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingInvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BillingInvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>[]
          }
          upsert: {
            args: Prisma.BillingInvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          aggregate: {
            args: Prisma.BillingInvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingInvoice>
          }
          groupBy: {
            args: Prisma.BillingInvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingInvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingInvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<BillingInvoiceCountAggregateOutputType> | number
          }
        }
      }
      BillingInvoiceLine: {
        payload: Prisma.$BillingInvoiceLinePayload<ExtArgs>
        fields: Prisma.BillingInvoiceLineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingInvoiceLineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingInvoiceLineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload>
          }
          findFirst: {
            args: Prisma.BillingInvoiceLineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingInvoiceLineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload>
          }
          findMany: {
            args: Prisma.BillingInvoiceLineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload>[]
          }
          create: {
            args: Prisma.BillingInvoiceLineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload>
          }
          createMany: {
            args: Prisma.BillingInvoiceLineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingInvoiceLineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload>[]
          }
          delete: {
            args: Prisma.BillingInvoiceLineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload>
          }
          update: {
            args: Prisma.BillingInvoiceLineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload>
          }
          deleteMany: {
            args: Prisma.BillingInvoiceLineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingInvoiceLineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BillingInvoiceLineUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload>[]
          }
          upsert: {
            args: Prisma.BillingInvoiceLineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoiceLinePayload>
          }
          aggregate: {
            args: Prisma.BillingInvoiceLineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingInvoiceLine>
          }
          groupBy: {
            args: Prisma.BillingInvoiceLineGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingInvoiceLineGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingInvoiceLineCountArgs<ExtArgs>
            result: $Utils.Optional<BillingInvoiceLineCountAggregateOutputType> | number
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
      SubscriptionPricePoint: {
        payload: Prisma.$SubscriptionPricePointPayload<ExtArgs>
        fields: Prisma.SubscriptionPricePointFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionPricePointFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionPricePointFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionPricePointFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionPricePointFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload>
          }
          findMany: {
            args: Prisma.SubscriptionPricePointFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload>[]
          }
          create: {
            args: Prisma.SubscriptionPricePointCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload>
          }
          createMany: {
            args: Prisma.SubscriptionPricePointCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionPricePointCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionPricePointDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload>
          }
          update: {
            args: Prisma.SubscriptionPricePointUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionPricePointDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionPricePointUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionPricePointUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionPricePointUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPricePointPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionPricePointAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscriptionPricePoint>
          }
          groupBy: {
            args: Prisma.SubscriptionPricePointGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPricePointGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionPricePointCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPricePointCountAggregateOutputType> | number
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
     * Read more in our [docs](https://pris.ly/d/logging).
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
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    snapTldState?: SnapTldStateOmit
    snapTldFeedOverride?: SnapTldFeedOverrideOmit
    snapTldReport?: SnapTldReportOmit
    snapTldImportedDomain?: SnapTldImportedDomainOmit
    snapTldDomainAnalysis?: SnapTldDomainAnalysisOmit
    driveItem?: DriveItemOmit
    driveActivity?: DriveActivityOmit
    billingCompany?: BillingCompanyOmit
    billingCustomer?: BillingCustomerOmit
    billingInvoice?: BillingInvoiceOmit
    billingInvoiceLine?: BillingInvoiceLineOmit
    subscription?: SubscriptionOmit
    subscriptionPricePoint?: SubscriptionPricePointOmit
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
   * Count Type DriveItemCountOutputType
   */

  export type DriveItemCountOutputType = {
    children: number
    activities: number
  }

  export type DriveItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | DriveItemCountOutputTypeCountChildrenArgs
    activities?: boolean | DriveItemCountOutputTypeCountActivitiesArgs
  }

  // Custom InputTypes
  /**
   * DriveItemCountOutputType without action
   */
  export type DriveItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItemCountOutputType
     */
    select?: DriveItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DriveItemCountOutputType without action
   */
  export type DriveItemCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriveItemWhereInput
  }

  /**
   * DriveItemCountOutputType without action
   */
  export type DriveItemCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriveActivityWhereInput
  }


  /**
   * Count Type BillingCompanyCountOutputType
   */

  export type BillingCompanyCountOutputType = {
    invoices: number
  }

  export type BillingCompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | BillingCompanyCountOutputTypeCountInvoicesArgs
  }

  // Custom InputTypes
  /**
   * BillingCompanyCountOutputType without action
   */
  export type BillingCompanyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompanyCountOutputType
     */
    select?: BillingCompanyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BillingCompanyCountOutputType without action
   */
  export type BillingCompanyCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
  }


  /**
   * Count Type BillingCustomerCountOutputType
   */

  export type BillingCustomerCountOutputType = {
    invoices: number
  }

  export type BillingCustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | BillingCustomerCountOutputTypeCountInvoicesArgs
  }

  // Custom InputTypes
  /**
   * BillingCustomerCountOutputType without action
   */
  export type BillingCustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomerCountOutputType
     */
    select?: BillingCustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BillingCustomerCountOutputType without action
   */
  export type BillingCustomerCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
  }


  /**
   * Count Type BillingInvoiceCountOutputType
   */

  export type BillingInvoiceCountOutputType = {
    lines: number
  }

  export type BillingInvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lines?: boolean | BillingInvoiceCountOutputTypeCountLinesArgs
  }

  // Custom InputTypes
  /**
   * BillingInvoiceCountOutputType without action
   */
  export type BillingInvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceCountOutputType
     */
    select?: BillingInvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BillingInvoiceCountOutputType without action
   */
  export type BillingInvoiceCountOutputTypeCountLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceLineWhereInput
  }


  /**
   * Count Type SubscriptionCountOutputType
   */

  export type SubscriptionCountOutputType = {
    priceHistory: number
  }

  export type SubscriptionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    priceHistory?: boolean | SubscriptionCountOutputTypeCountPriceHistoryArgs
  }

  // Custom InputTypes
  /**
   * SubscriptionCountOutputType without action
   */
  export type SubscriptionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionCountOutputType
     */
    select?: SubscriptionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubscriptionCountOutputType without action
   */
  export type SubscriptionCountOutputTypeCountPriceHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPricePointWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SnapTldState
   */

  export type AggregateSnapTldState = {
    _count: SnapTldStateCountAggregateOutputType | null
    _min: SnapTldStateMinAggregateOutputType | null
    _max: SnapTldStateMaxAggregateOutputType | null
  }

  export type SnapTldStateMinAggregateOutputType = {
    id: string | null
    watchlistJson: string | null
    reviewedJson: string | null
    hiddenJson: string | null
    notesJson: string | null
    activeWeightsYaml: string | null
    settingsJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapTldStateMaxAggregateOutputType = {
    id: string | null
    watchlistJson: string | null
    reviewedJson: string | null
    hiddenJson: string | null
    notesJson: string | null
    activeWeightsYaml: string | null
    settingsJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapTldStateCountAggregateOutputType = {
    id: number
    watchlistJson: number
    reviewedJson: number
    hiddenJson: number
    notesJson: number
    activeWeightsYaml: number
    settingsJson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SnapTldStateMinAggregateInputType = {
    id?: true
    watchlistJson?: true
    reviewedJson?: true
    hiddenJson?: true
    notesJson?: true
    activeWeightsYaml?: true
    settingsJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapTldStateMaxAggregateInputType = {
    id?: true
    watchlistJson?: true
    reviewedJson?: true
    hiddenJson?: true
    notesJson?: true
    activeWeightsYaml?: true
    settingsJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapTldStateCountAggregateInputType = {
    id?: true
    watchlistJson?: true
    reviewedJson?: true
    hiddenJson?: true
    notesJson?: true
    activeWeightsYaml?: true
    settingsJson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SnapTldStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapTldState to aggregate.
     */
    where?: SnapTldStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldStates to fetch.
     */
    orderBy?: SnapTldStateOrderByWithRelationInput | SnapTldStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnapTldStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SnapTldStates
    **/
    _count?: true | SnapTldStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnapTldStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnapTldStateMaxAggregateInputType
  }

  export type GetSnapTldStateAggregateType<T extends SnapTldStateAggregateArgs> = {
        [P in keyof T & keyof AggregateSnapTldState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnapTldState[P]>
      : GetScalarType<T[P], AggregateSnapTldState[P]>
  }




  export type SnapTldStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapTldStateWhereInput
    orderBy?: SnapTldStateOrderByWithAggregationInput | SnapTldStateOrderByWithAggregationInput[]
    by: SnapTldStateScalarFieldEnum[] | SnapTldStateScalarFieldEnum
    having?: SnapTldStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnapTldStateCountAggregateInputType | true
    _min?: SnapTldStateMinAggregateInputType
    _max?: SnapTldStateMaxAggregateInputType
  }

  export type SnapTldStateGroupByOutputType = {
    id: string
    watchlistJson: string
    reviewedJson: string
    hiddenJson: string
    notesJson: string
    activeWeightsYaml: string
    settingsJson: string
    createdAt: Date
    updatedAt: Date
    _count: SnapTldStateCountAggregateOutputType | null
    _min: SnapTldStateMinAggregateOutputType | null
    _max: SnapTldStateMaxAggregateOutputType | null
  }

  type GetSnapTldStateGroupByPayload<T extends SnapTldStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnapTldStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnapTldStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnapTldStateGroupByOutputType[P]>
            : GetScalarType<T[P], SnapTldStateGroupByOutputType[P]>
        }
      >
    >


  export type SnapTldStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    watchlistJson?: boolean
    reviewedJson?: boolean
    hiddenJson?: boolean
    notesJson?: boolean
    activeWeightsYaml?: boolean
    settingsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldState"]>

  export type SnapTldStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    watchlistJson?: boolean
    reviewedJson?: boolean
    hiddenJson?: boolean
    notesJson?: boolean
    activeWeightsYaml?: boolean
    settingsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldState"]>

  export type SnapTldStateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    watchlistJson?: boolean
    reviewedJson?: boolean
    hiddenJson?: boolean
    notesJson?: boolean
    activeWeightsYaml?: boolean
    settingsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldState"]>

  export type SnapTldStateSelectScalar = {
    id?: boolean
    watchlistJson?: boolean
    reviewedJson?: boolean
    hiddenJson?: boolean
    notesJson?: boolean
    activeWeightsYaml?: boolean
    settingsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SnapTldStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "watchlistJson" | "reviewedJson" | "hiddenJson" | "notesJson" | "activeWeightsYaml" | "settingsJson" | "createdAt" | "updatedAt", ExtArgs["result"]["snapTldState"]>

  export type $SnapTldStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SnapTldState"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      watchlistJson: string
      reviewedJson: string
      hiddenJson: string
      notesJson: string
      activeWeightsYaml: string
      settingsJson: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["snapTldState"]>
    composites: {}
  }

  type SnapTldStateGetPayload<S extends boolean | null | undefined | SnapTldStateDefaultArgs> = $Result.GetResult<Prisma.$SnapTldStatePayload, S>

  type SnapTldStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SnapTldStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SnapTldStateCountAggregateInputType | true
    }

  export interface SnapTldStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SnapTldState'], meta: { name: 'SnapTldState' } }
    /**
     * Find zero or one SnapTldState that matches the filter.
     * @param {SnapTldStateFindUniqueArgs} args - Arguments to find a SnapTldState
     * @example
     * // Get one SnapTldState
     * const snapTldState = await prisma.snapTldState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnapTldStateFindUniqueArgs>(args: SelectSubset<T, SnapTldStateFindUniqueArgs<ExtArgs>>): Prisma__SnapTldStateClient<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SnapTldState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SnapTldStateFindUniqueOrThrowArgs} args - Arguments to find a SnapTldState
     * @example
     * // Get one SnapTldState
     * const snapTldState = await prisma.snapTldState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnapTldStateFindUniqueOrThrowArgs>(args: SelectSubset<T, SnapTldStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnapTldStateClient<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SnapTldState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldStateFindFirstArgs} args - Arguments to find a SnapTldState
     * @example
     * // Get one SnapTldState
     * const snapTldState = await prisma.snapTldState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnapTldStateFindFirstArgs>(args?: SelectSubset<T, SnapTldStateFindFirstArgs<ExtArgs>>): Prisma__SnapTldStateClient<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SnapTldState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldStateFindFirstOrThrowArgs} args - Arguments to find a SnapTldState
     * @example
     * // Get one SnapTldState
     * const snapTldState = await prisma.snapTldState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnapTldStateFindFirstOrThrowArgs>(args?: SelectSubset<T, SnapTldStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnapTldStateClient<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SnapTldStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SnapTldStates
     * const snapTldStates = await prisma.snapTldState.findMany()
     * 
     * // Get first 10 SnapTldStates
     * const snapTldStates = await prisma.snapTldState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const snapTldStateWithIdOnly = await prisma.snapTldState.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SnapTldStateFindManyArgs>(args?: SelectSubset<T, SnapTldStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SnapTldState.
     * @param {SnapTldStateCreateArgs} args - Arguments to create a SnapTldState.
     * @example
     * // Create one SnapTldState
     * const SnapTldState = await prisma.snapTldState.create({
     *   data: {
     *     // ... data to create a SnapTldState
     *   }
     * })
     * 
     */
    create<T extends SnapTldStateCreateArgs>(args: SelectSubset<T, SnapTldStateCreateArgs<ExtArgs>>): Prisma__SnapTldStateClient<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SnapTldStates.
     * @param {SnapTldStateCreateManyArgs} args - Arguments to create many SnapTldStates.
     * @example
     * // Create many SnapTldStates
     * const snapTldState = await prisma.snapTldState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnapTldStateCreateManyArgs>(args?: SelectSubset<T, SnapTldStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SnapTldStates and returns the data saved in the database.
     * @param {SnapTldStateCreateManyAndReturnArgs} args - Arguments to create many SnapTldStates.
     * @example
     * // Create many SnapTldStates
     * const snapTldState = await prisma.snapTldState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SnapTldStates and only return the `id`
     * const snapTldStateWithIdOnly = await prisma.snapTldState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnapTldStateCreateManyAndReturnArgs>(args?: SelectSubset<T, SnapTldStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SnapTldState.
     * @param {SnapTldStateDeleteArgs} args - Arguments to delete one SnapTldState.
     * @example
     * // Delete one SnapTldState
     * const SnapTldState = await prisma.snapTldState.delete({
     *   where: {
     *     // ... filter to delete one SnapTldState
     *   }
     * })
     * 
     */
    delete<T extends SnapTldStateDeleteArgs>(args: SelectSubset<T, SnapTldStateDeleteArgs<ExtArgs>>): Prisma__SnapTldStateClient<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SnapTldState.
     * @param {SnapTldStateUpdateArgs} args - Arguments to update one SnapTldState.
     * @example
     * // Update one SnapTldState
     * const snapTldState = await prisma.snapTldState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnapTldStateUpdateArgs>(args: SelectSubset<T, SnapTldStateUpdateArgs<ExtArgs>>): Prisma__SnapTldStateClient<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SnapTldStates.
     * @param {SnapTldStateDeleteManyArgs} args - Arguments to filter SnapTldStates to delete.
     * @example
     * // Delete a few SnapTldStates
     * const { count } = await prisma.snapTldState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnapTldStateDeleteManyArgs>(args?: SelectSubset<T, SnapTldStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapTldStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SnapTldStates
     * const snapTldState = await prisma.snapTldState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnapTldStateUpdateManyArgs>(args: SelectSubset<T, SnapTldStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapTldStates and returns the data updated in the database.
     * @param {SnapTldStateUpdateManyAndReturnArgs} args - Arguments to update many SnapTldStates.
     * @example
     * // Update many SnapTldStates
     * const snapTldState = await prisma.snapTldState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SnapTldStates and only return the `id`
     * const snapTldStateWithIdOnly = await prisma.snapTldState.updateManyAndReturn({
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
    updateManyAndReturn<T extends SnapTldStateUpdateManyAndReturnArgs>(args: SelectSubset<T, SnapTldStateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SnapTldState.
     * @param {SnapTldStateUpsertArgs} args - Arguments to update or create a SnapTldState.
     * @example
     * // Update or create a SnapTldState
     * const snapTldState = await prisma.snapTldState.upsert({
     *   create: {
     *     // ... data to create a SnapTldState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SnapTldState we want to update
     *   }
     * })
     */
    upsert<T extends SnapTldStateUpsertArgs>(args: SelectSubset<T, SnapTldStateUpsertArgs<ExtArgs>>): Prisma__SnapTldStateClient<$Result.GetResult<Prisma.$SnapTldStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SnapTldStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldStateCountArgs} args - Arguments to filter SnapTldStates to count.
     * @example
     * // Count the number of SnapTldStates
     * const count = await prisma.snapTldState.count({
     *   where: {
     *     // ... the filter for the SnapTldStates we want to count
     *   }
     * })
    **/
    count<T extends SnapTldStateCountArgs>(
      args?: Subset<T, SnapTldStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnapTldStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SnapTldState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SnapTldStateAggregateArgs>(args: Subset<T, SnapTldStateAggregateArgs>): Prisma.PrismaPromise<GetSnapTldStateAggregateType<T>>

    /**
     * Group by SnapTldState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldStateGroupByArgs} args - Group by arguments.
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
      T extends SnapTldStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnapTldStateGroupByArgs['orderBy'] }
        : { orderBy?: SnapTldStateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SnapTldStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnapTldStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SnapTldState model
   */
  readonly fields: SnapTldStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SnapTldState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnapTldStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SnapTldState model
   */
  interface SnapTldStateFieldRefs {
    readonly id: FieldRef<"SnapTldState", 'String'>
    readonly watchlistJson: FieldRef<"SnapTldState", 'String'>
    readonly reviewedJson: FieldRef<"SnapTldState", 'String'>
    readonly hiddenJson: FieldRef<"SnapTldState", 'String'>
    readonly notesJson: FieldRef<"SnapTldState", 'String'>
    readonly activeWeightsYaml: FieldRef<"SnapTldState", 'String'>
    readonly settingsJson: FieldRef<"SnapTldState", 'String'>
    readonly createdAt: FieldRef<"SnapTldState", 'DateTime'>
    readonly updatedAt: FieldRef<"SnapTldState", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SnapTldState findUnique
   */
  export type SnapTldStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldState to fetch.
     */
    where: SnapTldStateWhereUniqueInput
  }

  /**
   * SnapTldState findUniqueOrThrow
   */
  export type SnapTldStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldState to fetch.
     */
    where: SnapTldStateWhereUniqueInput
  }

  /**
   * SnapTldState findFirst
   */
  export type SnapTldStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldState to fetch.
     */
    where?: SnapTldStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldStates to fetch.
     */
    orderBy?: SnapTldStateOrderByWithRelationInput | SnapTldStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapTldStates.
     */
    cursor?: SnapTldStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldStates.
     */
    distinct?: SnapTldStateScalarFieldEnum | SnapTldStateScalarFieldEnum[]
  }

  /**
   * SnapTldState findFirstOrThrow
   */
  export type SnapTldStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldState to fetch.
     */
    where?: SnapTldStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldStates to fetch.
     */
    orderBy?: SnapTldStateOrderByWithRelationInput | SnapTldStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapTldStates.
     */
    cursor?: SnapTldStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldStates.
     */
    distinct?: SnapTldStateScalarFieldEnum | SnapTldStateScalarFieldEnum[]
  }

  /**
   * SnapTldState findMany
   */
  export type SnapTldStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldStates to fetch.
     */
    where?: SnapTldStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldStates to fetch.
     */
    orderBy?: SnapTldStateOrderByWithRelationInput | SnapTldStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SnapTldStates.
     */
    cursor?: SnapTldStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldStates.
     */
    distinct?: SnapTldStateScalarFieldEnum | SnapTldStateScalarFieldEnum[]
  }

  /**
   * SnapTldState create
   */
  export type SnapTldStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * The data needed to create a SnapTldState.
     */
    data: XOR<SnapTldStateCreateInput, SnapTldStateUncheckedCreateInput>
  }

  /**
   * SnapTldState createMany
   */
  export type SnapTldStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SnapTldStates.
     */
    data: SnapTldStateCreateManyInput | SnapTldStateCreateManyInput[]
  }

  /**
   * SnapTldState createManyAndReturn
   */
  export type SnapTldStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * The data used to create many SnapTldStates.
     */
    data: SnapTldStateCreateManyInput | SnapTldStateCreateManyInput[]
  }

  /**
   * SnapTldState update
   */
  export type SnapTldStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * The data needed to update a SnapTldState.
     */
    data: XOR<SnapTldStateUpdateInput, SnapTldStateUncheckedUpdateInput>
    /**
     * Choose, which SnapTldState to update.
     */
    where: SnapTldStateWhereUniqueInput
  }

  /**
   * SnapTldState updateMany
   */
  export type SnapTldStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SnapTldStates.
     */
    data: XOR<SnapTldStateUpdateManyMutationInput, SnapTldStateUncheckedUpdateManyInput>
    /**
     * Filter which SnapTldStates to update
     */
    where?: SnapTldStateWhereInput
    /**
     * Limit how many SnapTldStates to update.
     */
    limit?: number
  }

  /**
   * SnapTldState updateManyAndReturn
   */
  export type SnapTldStateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * The data used to update SnapTldStates.
     */
    data: XOR<SnapTldStateUpdateManyMutationInput, SnapTldStateUncheckedUpdateManyInput>
    /**
     * Filter which SnapTldStates to update
     */
    where?: SnapTldStateWhereInput
    /**
     * Limit how many SnapTldStates to update.
     */
    limit?: number
  }

  /**
   * SnapTldState upsert
   */
  export type SnapTldStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * The filter to search for the SnapTldState to update in case it exists.
     */
    where: SnapTldStateWhereUniqueInput
    /**
     * In case the SnapTldState found by the `where` argument doesn't exist, create a new SnapTldState with this data.
     */
    create: XOR<SnapTldStateCreateInput, SnapTldStateUncheckedCreateInput>
    /**
     * In case the SnapTldState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnapTldStateUpdateInput, SnapTldStateUncheckedUpdateInput>
  }

  /**
   * SnapTldState delete
   */
  export type SnapTldStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
    /**
     * Filter which SnapTldState to delete.
     */
    where: SnapTldStateWhereUniqueInput
  }

  /**
   * SnapTldState deleteMany
   */
  export type SnapTldStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapTldStates to delete
     */
    where?: SnapTldStateWhereInput
    /**
     * Limit how many SnapTldStates to delete.
     */
    limit?: number
  }

  /**
   * SnapTldState without action
   */
  export type SnapTldStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldState
     */
    select?: SnapTldStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldState
     */
    omit?: SnapTldStateOmit<ExtArgs> | null
  }


  /**
   * Model SnapTldFeedOverride
   */

  export type AggregateSnapTldFeedOverride = {
    _count: SnapTldFeedOverrideCountAggregateOutputType | null
    _min: SnapTldFeedOverrideMinAggregateOutputType | null
    _max: SnapTldFeedOverrideMaxAggregateOutputType | null
  }

  export type SnapTldFeedOverrideMinAggregateOutputType = {
    feedId: string | null
    status: string | null
    scheduleJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapTldFeedOverrideMaxAggregateOutputType = {
    feedId: string | null
    status: string | null
    scheduleJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapTldFeedOverrideCountAggregateOutputType = {
    feedId: number
    status: number
    scheduleJson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SnapTldFeedOverrideMinAggregateInputType = {
    feedId?: true
    status?: true
    scheduleJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapTldFeedOverrideMaxAggregateInputType = {
    feedId?: true
    status?: true
    scheduleJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapTldFeedOverrideCountAggregateInputType = {
    feedId?: true
    status?: true
    scheduleJson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SnapTldFeedOverrideAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapTldFeedOverride to aggregate.
     */
    where?: SnapTldFeedOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldFeedOverrides to fetch.
     */
    orderBy?: SnapTldFeedOverrideOrderByWithRelationInput | SnapTldFeedOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnapTldFeedOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldFeedOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldFeedOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SnapTldFeedOverrides
    **/
    _count?: true | SnapTldFeedOverrideCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnapTldFeedOverrideMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnapTldFeedOverrideMaxAggregateInputType
  }

  export type GetSnapTldFeedOverrideAggregateType<T extends SnapTldFeedOverrideAggregateArgs> = {
        [P in keyof T & keyof AggregateSnapTldFeedOverride]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnapTldFeedOverride[P]>
      : GetScalarType<T[P], AggregateSnapTldFeedOverride[P]>
  }




  export type SnapTldFeedOverrideGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapTldFeedOverrideWhereInput
    orderBy?: SnapTldFeedOverrideOrderByWithAggregationInput | SnapTldFeedOverrideOrderByWithAggregationInput[]
    by: SnapTldFeedOverrideScalarFieldEnum[] | SnapTldFeedOverrideScalarFieldEnum
    having?: SnapTldFeedOverrideScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnapTldFeedOverrideCountAggregateInputType | true
    _min?: SnapTldFeedOverrideMinAggregateInputType
    _max?: SnapTldFeedOverrideMaxAggregateInputType
  }

  export type SnapTldFeedOverrideGroupByOutputType = {
    feedId: string
    status: string | null
    scheduleJson: string | null
    createdAt: Date
    updatedAt: Date
    _count: SnapTldFeedOverrideCountAggregateOutputType | null
    _min: SnapTldFeedOverrideMinAggregateOutputType | null
    _max: SnapTldFeedOverrideMaxAggregateOutputType | null
  }

  type GetSnapTldFeedOverrideGroupByPayload<T extends SnapTldFeedOverrideGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnapTldFeedOverrideGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnapTldFeedOverrideGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnapTldFeedOverrideGroupByOutputType[P]>
            : GetScalarType<T[P], SnapTldFeedOverrideGroupByOutputType[P]>
        }
      >
    >


  export type SnapTldFeedOverrideSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    feedId?: boolean
    status?: boolean
    scheduleJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldFeedOverride"]>

  export type SnapTldFeedOverrideSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    feedId?: boolean
    status?: boolean
    scheduleJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldFeedOverride"]>

  export type SnapTldFeedOverrideSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    feedId?: boolean
    status?: boolean
    scheduleJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldFeedOverride"]>

  export type SnapTldFeedOverrideSelectScalar = {
    feedId?: boolean
    status?: boolean
    scheduleJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SnapTldFeedOverrideOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"feedId" | "status" | "scheduleJson" | "createdAt" | "updatedAt", ExtArgs["result"]["snapTldFeedOverride"]>

  export type $SnapTldFeedOverridePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SnapTldFeedOverride"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      feedId: string
      status: string | null
      scheduleJson: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["snapTldFeedOverride"]>
    composites: {}
  }

  type SnapTldFeedOverrideGetPayload<S extends boolean | null | undefined | SnapTldFeedOverrideDefaultArgs> = $Result.GetResult<Prisma.$SnapTldFeedOverridePayload, S>

  type SnapTldFeedOverrideCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SnapTldFeedOverrideFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SnapTldFeedOverrideCountAggregateInputType | true
    }

  export interface SnapTldFeedOverrideDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SnapTldFeedOverride'], meta: { name: 'SnapTldFeedOverride' } }
    /**
     * Find zero or one SnapTldFeedOverride that matches the filter.
     * @param {SnapTldFeedOverrideFindUniqueArgs} args - Arguments to find a SnapTldFeedOverride
     * @example
     * // Get one SnapTldFeedOverride
     * const snapTldFeedOverride = await prisma.snapTldFeedOverride.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnapTldFeedOverrideFindUniqueArgs>(args: SelectSubset<T, SnapTldFeedOverrideFindUniqueArgs<ExtArgs>>): Prisma__SnapTldFeedOverrideClient<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SnapTldFeedOverride that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SnapTldFeedOverrideFindUniqueOrThrowArgs} args - Arguments to find a SnapTldFeedOverride
     * @example
     * // Get one SnapTldFeedOverride
     * const snapTldFeedOverride = await prisma.snapTldFeedOverride.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnapTldFeedOverrideFindUniqueOrThrowArgs>(args: SelectSubset<T, SnapTldFeedOverrideFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnapTldFeedOverrideClient<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SnapTldFeedOverride that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldFeedOverrideFindFirstArgs} args - Arguments to find a SnapTldFeedOverride
     * @example
     * // Get one SnapTldFeedOverride
     * const snapTldFeedOverride = await prisma.snapTldFeedOverride.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnapTldFeedOverrideFindFirstArgs>(args?: SelectSubset<T, SnapTldFeedOverrideFindFirstArgs<ExtArgs>>): Prisma__SnapTldFeedOverrideClient<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SnapTldFeedOverride that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldFeedOverrideFindFirstOrThrowArgs} args - Arguments to find a SnapTldFeedOverride
     * @example
     * // Get one SnapTldFeedOverride
     * const snapTldFeedOverride = await prisma.snapTldFeedOverride.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnapTldFeedOverrideFindFirstOrThrowArgs>(args?: SelectSubset<T, SnapTldFeedOverrideFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnapTldFeedOverrideClient<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SnapTldFeedOverrides that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldFeedOverrideFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SnapTldFeedOverrides
     * const snapTldFeedOverrides = await prisma.snapTldFeedOverride.findMany()
     * 
     * // Get first 10 SnapTldFeedOverrides
     * const snapTldFeedOverrides = await prisma.snapTldFeedOverride.findMany({ take: 10 })
     * 
     * // Only select the `feedId`
     * const snapTldFeedOverrideWithFeedIdOnly = await prisma.snapTldFeedOverride.findMany({ select: { feedId: true } })
     * 
     */
    findMany<T extends SnapTldFeedOverrideFindManyArgs>(args?: SelectSubset<T, SnapTldFeedOverrideFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SnapTldFeedOverride.
     * @param {SnapTldFeedOverrideCreateArgs} args - Arguments to create a SnapTldFeedOverride.
     * @example
     * // Create one SnapTldFeedOverride
     * const SnapTldFeedOverride = await prisma.snapTldFeedOverride.create({
     *   data: {
     *     // ... data to create a SnapTldFeedOverride
     *   }
     * })
     * 
     */
    create<T extends SnapTldFeedOverrideCreateArgs>(args: SelectSubset<T, SnapTldFeedOverrideCreateArgs<ExtArgs>>): Prisma__SnapTldFeedOverrideClient<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SnapTldFeedOverrides.
     * @param {SnapTldFeedOverrideCreateManyArgs} args - Arguments to create many SnapTldFeedOverrides.
     * @example
     * // Create many SnapTldFeedOverrides
     * const snapTldFeedOverride = await prisma.snapTldFeedOverride.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnapTldFeedOverrideCreateManyArgs>(args?: SelectSubset<T, SnapTldFeedOverrideCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SnapTldFeedOverrides and returns the data saved in the database.
     * @param {SnapTldFeedOverrideCreateManyAndReturnArgs} args - Arguments to create many SnapTldFeedOverrides.
     * @example
     * // Create many SnapTldFeedOverrides
     * const snapTldFeedOverride = await prisma.snapTldFeedOverride.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SnapTldFeedOverrides and only return the `feedId`
     * const snapTldFeedOverrideWithFeedIdOnly = await prisma.snapTldFeedOverride.createManyAndReturn({
     *   select: { feedId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnapTldFeedOverrideCreateManyAndReturnArgs>(args?: SelectSubset<T, SnapTldFeedOverrideCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SnapTldFeedOverride.
     * @param {SnapTldFeedOverrideDeleteArgs} args - Arguments to delete one SnapTldFeedOverride.
     * @example
     * // Delete one SnapTldFeedOverride
     * const SnapTldFeedOverride = await prisma.snapTldFeedOverride.delete({
     *   where: {
     *     // ... filter to delete one SnapTldFeedOverride
     *   }
     * })
     * 
     */
    delete<T extends SnapTldFeedOverrideDeleteArgs>(args: SelectSubset<T, SnapTldFeedOverrideDeleteArgs<ExtArgs>>): Prisma__SnapTldFeedOverrideClient<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SnapTldFeedOverride.
     * @param {SnapTldFeedOverrideUpdateArgs} args - Arguments to update one SnapTldFeedOverride.
     * @example
     * // Update one SnapTldFeedOverride
     * const snapTldFeedOverride = await prisma.snapTldFeedOverride.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnapTldFeedOverrideUpdateArgs>(args: SelectSubset<T, SnapTldFeedOverrideUpdateArgs<ExtArgs>>): Prisma__SnapTldFeedOverrideClient<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SnapTldFeedOverrides.
     * @param {SnapTldFeedOverrideDeleteManyArgs} args - Arguments to filter SnapTldFeedOverrides to delete.
     * @example
     * // Delete a few SnapTldFeedOverrides
     * const { count } = await prisma.snapTldFeedOverride.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnapTldFeedOverrideDeleteManyArgs>(args?: SelectSubset<T, SnapTldFeedOverrideDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapTldFeedOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldFeedOverrideUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SnapTldFeedOverrides
     * const snapTldFeedOverride = await prisma.snapTldFeedOverride.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnapTldFeedOverrideUpdateManyArgs>(args: SelectSubset<T, SnapTldFeedOverrideUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapTldFeedOverrides and returns the data updated in the database.
     * @param {SnapTldFeedOverrideUpdateManyAndReturnArgs} args - Arguments to update many SnapTldFeedOverrides.
     * @example
     * // Update many SnapTldFeedOverrides
     * const snapTldFeedOverride = await prisma.snapTldFeedOverride.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SnapTldFeedOverrides and only return the `feedId`
     * const snapTldFeedOverrideWithFeedIdOnly = await prisma.snapTldFeedOverride.updateManyAndReturn({
     *   select: { feedId: true },
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
    updateManyAndReturn<T extends SnapTldFeedOverrideUpdateManyAndReturnArgs>(args: SelectSubset<T, SnapTldFeedOverrideUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SnapTldFeedOverride.
     * @param {SnapTldFeedOverrideUpsertArgs} args - Arguments to update or create a SnapTldFeedOverride.
     * @example
     * // Update or create a SnapTldFeedOverride
     * const snapTldFeedOverride = await prisma.snapTldFeedOverride.upsert({
     *   create: {
     *     // ... data to create a SnapTldFeedOverride
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SnapTldFeedOverride we want to update
     *   }
     * })
     */
    upsert<T extends SnapTldFeedOverrideUpsertArgs>(args: SelectSubset<T, SnapTldFeedOverrideUpsertArgs<ExtArgs>>): Prisma__SnapTldFeedOverrideClient<$Result.GetResult<Prisma.$SnapTldFeedOverridePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SnapTldFeedOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldFeedOverrideCountArgs} args - Arguments to filter SnapTldFeedOverrides to count.
     * @example
     * // Count the number of SnapTldFeedOverrides
     * const count = await prisma.snapTldFeedOverride.count({
     *   where: {
     *     // ... the filter for the SnapTldFeedOverrides we want to count
     *   }
     * })
    **/
    count<T extends SnapTldFeedOverrideCountArgs>(
      args?: Subset<T, SnapTldFeedOverrideCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnapTldFeedOverrideCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SnapTldFeedOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldFeedOverrideAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SnapTldFeedOverrideAggregateArgs>(args: Subset<T, SnapTldFeedOverrideAggregateArgs>): Prisma.PrismaPromise<GetSnapTldFeedOverrideAggregateType<T>>

    /**
     * Group by SnapTldFeedOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldFeedOverrideGroupByArgs} args - Group by arguments.
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
      T extends SnapTldFeedOverrideGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnapTldFeedOverrideGroupByArgs['orderBy'] }
        : { orderBy?: SnapTldFeedOverrideGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SnapTldFeedOverrideGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnapTldFeedOverrideGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SnapTldFeedOverride model
   */
  readonly fields: SnapTldFeedOverrideFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SnapTldFeedOverride.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnapTldFeedOverrideClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SnapTldFeedOverride model
   */
  interface SnapTldFeedOverrideFieldRefs {
    readonly feedId: FieldRef<"SnapTldFeedOverride", 'String'>
    readonly status: FieldRef<"SnapTldFeedOverride", 'String'>
    readonly scheduleJson: FieldRef<"SnapTldFeedOverride", 'String'>
    readonly createdAt: FieldRef<"SnapTldFeedOverride", 'DateTime'>
    readonly updatedAt: FieldRef<"SnapTldFeedOverride", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SnapTldFeedOverride findUnique
   */
  export type SnapTldFeedOverrideFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldFeedOverride to fetch.
     */
    where: SnapTldFeedOverrideWhereUniqueInput
  }

  /**
   * SnapTldFeedOverride findUniqueOrThrow
   */
  export type SnapTldFeedOverrideFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldFeedOverride to fetch.
     */
    where: SnapTldFeedOverrideWhereUniqueInput
  }

  /**
   * SnapTldFeedOverride findFirst
   */
  export type SnapTldFeedOverrideFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldFeedOverride to fetch.
     */
    where?: SnapTldFeedOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldFeedOverrides to fetch.
     */
    orderBy?: SnapTldFeedOverrideOrderByWithRelationInput | SnapTldFeedOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapTldFeedOverrides.
     */
    cursor?: SnapTldFeedOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldFeedOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldFeedOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldFeedOverrides.
     */
    distinct?: SnapTldFeedOverrideScalarFieldEnum | SnapTldFeedOverrideScalarFieldEnum[]
  }

  /**
   * SnapTldFeedOverride findFirstOrThrow
   */
  export type SnapTldFeedOverrideFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldFeedOverride to fetch.
     */
    where?: SnapTldFeedOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldFeedOverrides to fetch.
     */
    orderBy?: SnapTldFeedOverrideOrderByWithRelationInput | SnapTldFeedOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapTldFeedOverrides.
     */
    cursor?: SnapTldFeedOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldFeedOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldFeedOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldFeedOverrides.
     */
    distinct?: SnapTldFeedOverrideScalarFieldEnum | SnapTldFeedOverrideScalarFieldEnum[]
  }

  /**
   * SnapTldFeedOverride findMany
   */
  export type SnapTldFeedOverrideFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldFeedOverrides to fetch.
     */
    where?: SnapTldFeedOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldFeedOverrides to fetch.
     */
    orderBy?: SnapTldFeedOverrideOrderByWithRelationInput | SnapTldFeedOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SnapTldFeedOverrides.
     */
    cursor?: SnapTldFeedOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldFeedOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldFeedOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldFeedOverrides.
     */
    distinct?: SnapTldFeedOverrideScalarFieldEnum | SnapTldFeedOverrideScalarFieldEnum[]
  }

  /**
   * SnapTldFeedOverride create
   */
  export type SnapTldFeedOverrideCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * The data needed to create a SnapTldFeedOverride.
     */
    data: XOR<SnapTldFeedOverrideCreateInput, SnapTldFeedOverrideUncheckedCreateInput>
  }

  /**
   * SnapTldFeedOverride createMany
   */
  export type SnapTldFeedOverrideCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SnapTldFeedOverrides.
     */
    data: SnapTldFeedOverrideCreateManyInput | SnapTldFeedOverrideCreateManyInput[]
  }

  /**
   * SnapTldFeedOverride createManyAndReturn
   */
  export type SnapTldFeedOverrideCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * The data used to create many SnapTldFeedOverrides.
     */
    data: SnapTldFeedOverrideCreateManyInput | SnapTldFeedOverrideCreateManyInput[]
  }

  /**
   * SnapTldFeedOverride update
   */
  export type SnapTldFeedOverrideUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * The data needed to update a SnapTldFeedOverride.
     */
    data: XOR<SnapTldFeedOverrideUpdateInput, SnapTldFeedOverrideUncheckedUpdateInput>
    /**
     * Choose, which SnapTldFeedOverride to update.
     */
    where: SnapTldFeedOverrideWhereUniqueInput
  }

  /**
   * SnapTldFeedOverride updateMany
   */
  export type SnapTldFeedOverrideUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SnapTldFeedOverrides.
     */
    data: XOR<SnapTldFeedOverrideUpdateManyMutationInput, SnapTldFeedOverrideUncheckedUpdateManyInput>
    /**
     * Filter which SnapTldFeedOverrides to update
     */
    where?: SnapTldFeedOverrideWhereInput
    /**
     * Limit how many SnapTldFeedOverrides to update.
     */
    limit?: number
  }

  /**
   * SnapTldFeedOverride updateManyAndReturn
   */
  export type SnapTldFeedOverrideUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * The data used to update SnapTldFeedOverrides.
     */
    data: XOR<SnapTldFeedOverrideUpdateManyMutationInput, SnapTldFeedOverrideUncheckedUpdateManyInput>
    /**
     * Filter which SnapTldFeedOverrides to update
     */
    where?: SnapTldFeedOverrideWhereInput
    /**
     * Limit how many SnapTldFeedOverrides to update.
     */
    limit?: number
  }

  /**
   * SnapTldFeedOverride upsert
   */
  export type SnapTldFeedOverrideUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * The filter to search for the SnapTldFeedOverride to update in case it exists.
     */
    where: SnapTldFeedOverrideWhereUniqueInput
    /**
     * In case the SnapTldFeedOverride found by the `where` argument doesn't exist, create a new SnapTldFeedOverride with this data.
     */
    create: XOR<SnapTldFeedOverrideCreateInput, SnapTldFeedOverrideUncheckedCreateInput>
    /**
     * In case the SnapTldFeedOverride was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnapTldFeedOverrideUpdateInput, SnapTldFeedOverrideUncheckedUpdateInput>
  }

  /**
   * SnapTldFeedOverride delete
   */
  export type SnapTldFeedOverrideDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
    /**
     * Filter which SnapTldFeedOverride to delete.
     */
    where: SnapTldFeedOverrideWhereUniqueInput
  }

  /**
   * SnapTldFeedOverride deleteMany
   */
  export type SnapTldFeedOverrideDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapTldFeedOverrides to delete
     */
    where?: SnapTldFeedOverrideWhereInput
    /**
     * Limit how many SnapTldFeedOverrides to delete.
     */
    limit?: number
  }

  /**
   * SnapTldFeedOverride without action
   */
  export type SnapTldFeedOverrideDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldFeedOverride
     */
    select?: SnapTldFeedOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldFeedOverride
     */
    omit?: SnapTldFeedOverrideOmit<ExtArgs> | null
  }


  /**
   * Model SnapTldReport
   */

  export type AggregateSnapTldReport = {
    _count: SnapTldReportCountAggregateOutputType | null
    _avg: SnapTldReportAvgAggregateOutputType | null
    _sum: SnapTldReportSumAggregateOutputType | null
    _min: SnapTldReportMinAggregateOutputType | null
    _max: SnapTldReportMaxAggregateOutputType | null
  }

  export type SnapTldReportAvgAggregateOutputType = {
    domains: number | null
  }

  export type SnapTldReportSumAggregateOutputType = {
    domains: number | null
  }

  export type SnapTldReportMinAggregateOutputType = {
    id: string | null
    title: string | null
    generatedAt: Date | null
    domains: number | null
    highlight: string | null
    format: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapTldReportMaxAggregateOutputType = {
    id: string | null
    title: string | null
    generatedAt: Date | null
    domains: number | null
    highlight: string | null
    format: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapTldReportCountAggregateOutputType = {
    id: number
    title: number
    generatedAt: number
    domains: number
    highlight: number
    format: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SnapTldReportAvgAggregateInputType = {
    domains?: true
  }

  export type SnapTldReportSumAggregateInputType = {
    domains?: true
  }

  export type SnapTldReportMinAggregateInputType = {
    id?: true
    title?: true
    generatedAt?: true
    domains?: true
    highlight?: true
    format?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapTldReportMaxAggregateInputType = {
    id?: true
    title?: true
    generatedAt?: true
    domains?: true
    highlight?: true
    format?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapTldReportCountAggregateInputType = {
    id?: true
    title?: true
    generatedAt?: true
    domains?: true
    highlight?: true
    format?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SnapTldReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapTldReport to aggregate.
     */
    where?: SnapTldReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldReports to fetch.
     */
    orderBy?: SnapTldReportOrderByWithRelationInput | SnapTldReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnapTldReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SnapTldReports
    **/
    _count?: true | SnapTldReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SnapTldReportAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SnapTldReportSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnapTldReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnapTldReportMaxAggregateInputType
  }

  export type GetSnapTldReportAggregateType<T extends SnapTldReportAggregateArgs> = {
        [P in keyof T & keyof AggregateSnapTldReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnapTldReport[P]>
      : GetScalarType<T[P], AggregateSnapTldReport[P]>
  }




  export type SnapTldReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapTldReportWhereInput
    orderBy?: SnapTldReportOrderByWithAggregationInput | SnapTldReportOrderByWithAggregationInput[]
    by: SnapTldReportScalarFieldEnum[] | SnapTldReportScalarFieldEnum
    having?: SnapTldReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnapTldReportCountAggregateInputType | true
    _avg?: SnapTldReportAvgAggregateInputType
    _sum?: SnapTldReportSumAggregateInputType
    _min?: SnapTldReportMinAggregateInputType
    _max?: SnapTldReportMaxAggregateInputType
  }

  export type SnapTldReportGroupByOutputType = {
    id: string
    title: string
    generatedAt: Date
    domains: number
    highlight: string
    format: string
    createdAt: Date
    updatedAt: Date
    _count: SnapTldReportCountAggregateOutputType | null
    _avg: SnapTldReportAvgAggregateOutputType | null
    _sum: SnapTldReportSumAggregateOutputType | null
    _min: SnapTldReportMinAggregateOutputType | null
    _max: SnapTldReportMaxAggregateOutputType | null
  }

  type GetSnapTldReportGroupByPayload<T extends SnapTldReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnapTldReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnapTldReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnapTldReportGroupByOutputType[P]>
            : GetScalarType<T[P], SnapTldReportGroupByOutputType[P]>
        }
      >
    >


  export type SnapTldReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    generatedAt?: boolean
    domains?: boolean
    highlight?: boolean
    format?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldReport"]>

  export type SnapTldReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    generatedAt?: boolean
    domains?: boolean
    highlight?: boolean
    format?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldReport"]>

  export type SnapTldReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    generatedAt?: boolean
    domains?: boolean
    highlight?: boolean
    format?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldReport"]>

  export type SnapTldReportSelectScalar = {
    id?: boolean
    title?: boolean
    generatedAt?: boolean
    domains?: boolean
    highlight?: boolean
    format?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SnapTldReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "generatedAt" | "domains" | "highlight" | "format" | "createdAt" | "updatedAt", ExtArgs["result"]["snapTldReport"]>

  export type $SnapTldReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SnapTldReport"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      generatedAt: Date
      domains: number
      highlight: string
      format: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["snapTldReport"]>
    composites: {}
  }

  type SnapTldReportGetPayload<S extends boolean | null | undefined | SnapTldReportDefaultArgs> = $Result.GetResult<Prisma.$SnapTldReportPayload, S>

  type SnapTldReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SnapTldReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SnapTldReportCountAggregateInputType | true
    }

  export interface SnapTldReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SnapTldReport'], meta: { name: 'SnapTldReport' } }
    /**
     * Find zero or one SnapTldReport that matches the filter.
     * @param {SnapTldReportFindUniqueArgs} args - Arguments to find a SnapTldReport
     * @example
     * // Get one SnapTldReport
     * const snapTldReport = await prisma.snapTldReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnapTldReportFindUniqueArgs>(args: SelectSubset<T, SnapTldReportFindUniqueArgs<ExtArgs>>): Prisma__SnapTldReportClient<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SnapTldReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SnapTldReportFindUniqueOrThrowArgs} args - Arguments to find a SnapTldReport
     * @example
     * // Get one SnapTldReport
     * const snapTldReport = await prisma.snapTldReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnapTldReportFindUniqueOrThrowArgs>(args: SelectSubset<T, SnapTldReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnapTldReportClient<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SnapTldReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldReportFindFirstArgs} args - Arguments to find a SnapTldReport
     * @example
     * // Get one SnapTldReport
     * const snapTldReport = await prisma.snapTldReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnapTldReportFindFirstArgs>(args?: SelectSubset<T, SnapTldReportFindFirstArgs<ExtArgs>>): Prisma__SnapTldReportClient<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SnapTldReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldReportFindFirstOrThrowArgs} args - Arguments to find a SnapTldReport
     * @example
     * // Get one SnapTldReport
     * const snapTldReport = await prisma.snapTldReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnapTldReportFindFirstOrThrowArgs>(args?: SelectSubset<T, SnapTldReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnapTldReportClient<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SnapTldReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SnapTldReports
     * const snapTldReports = await prisma.snapTldReport.findMany()
     * 
     * // Get first 10 SnapTldReports
     * const snapTldReports = await prisma.snapTldReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const snapTldReportWithIdOnly = await prisma.snapTldReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SnapTldReportFindManyArgs>(args?: SelectSubset<T, SnapTldReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SnapTldReport.
     * @param {SnapTldReportCreateArgs} args - Arguments to create a SnapTldReport.
     * @example
     * // Create one SnapTldReport
     * const SnapTldReport = await prisma.snapTldReport.create({
     *   data: {
     *     // ... data to create a SnapTldReport
     *   }
     * })
     * 
     */
    create<T extends SnapTldReportCreateArgs>(args: SelectSubset<T, SnapTldReportCreateArgs<ExtArgs>>): Prisma__SnapTldReportClient<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SnapTldReports.
     * @param {SnapTldReportCreateManyArgs} args - Arguments to create many SnapTldReports.
     * @example
     * // Create many SnapTldReports
     * const snapTldReport = await prisma.snapTldReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnapTldReportCreateManyArgs>(args?: SelectSubset<T, SnapTldReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SnapTldReports and returns the data saved in the database.
     * @param {SnapTldReportCreateManyAndReturnArgs} args - Arguments to create many SnapTldReports.
     * @example
     * // Create many SnapTldReports
     * const snapTldReport = await prisma.snapTldReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SnapTldReports and only return the `id`
     * const snapTldReportWithIdOnly = await prisma.snapTldReport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnapTldReportCreateManyAndReturnArgs>(args?: SelectSubset<T, SnapTldReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SnapTldReport.
     * @param {SnapTldReportDeleteArgs} args - Arguments to delete one SnapTldReport.
     * @example
     * // Delete one SnapTldReport
     * const SnapTldReport = await prisma.snapTldReport.delete({
     *   where: {
     *     // ... filter to delete one SnapTldReport
     *   }
     * })
     * 
     */
    delete<T extends SnapTldReportDeleteArgs>(args: SelectSubset<T, SnapTldReportDeleteArgs<ExtArgs>>): Prisma__SnapTldReportClient<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SnapTldReport.
     * @param {SnapTldReportUpdateArgs} args - Arguments to update one SnapTldReport.
     * @example
     * // Update one SnapTldReport
     * const snapTldReport = await prisma.snapTldReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnapTldReportUpdateArgs>(args: SelectSubset<T, SnapTldReportUpdateArgs<ExtArgs>>): Prisma__SnapTldReportClient<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SnapTldReports.
     * @param {SnapTldReportDeleteManyArgs} args - Arguments to filter SnapTldReports to delete.
     * @example
     * // Delete a few SnapTldReports
     * const { count } = await prisma.snapTldReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnapTldReportDeleteManyArgs>(args?: SelectSubset<T, SnapTldReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapTldReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SnapTldReports
     * const snapTldReport = await prisma.snapTldReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnapTldReportUpdateManyArgs>(args: SelectSubset<T, SnapTldReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapTldReports and returns the data updated in the database.
     * @param {SnapTldReportUpdateManyAndReturnArgs} args - Arguments to update many SnapTldReports.
     * @example
     * // Update many SnapTldReports
     * const snapTldReport = await prisma.snapTldReport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SnapTldReports and only return the `id`
     * const snapTldReportWithIdOnly = await prisma.snapTldReport.updateManyAndReturn({
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
    updateManyAndReturn<T extends SnapTldReportUpdateManyAndReturnArgs>(args: SelectSubset<T, SnapTldReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SnapTldReport.
     * @param {SnapTldReportUpsertArgs} args - Arguments to update or create a SnapTldReport.
     * @example
     * // Update or create a SnapTldReport
     * const snapTldReport = await prisma.snapTldReport.upsert({
     *   create: {
     *     // ... data to create a SnapTldReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SnapTldReport we want to update
     *   }
     * })
     */
    upsert<T extends SnapTldReportUpsertArgs>(args: SelectSubset<T, SnapTldReportUpsertArgs<ExtArgs>>): Prisma__SnapTldReportClient<$Result.GetResult<Prisma.$SnapTldReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SnapTldReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldReportCountArgs} args - Arguments to filter SnapTldReports to count.
     * @example
     * // Count the number of SnapTldReports
     * const count = await prisma.snapTldReport.count({
     *   where: {
     *     // ... the filter for the SnapTldReports we want to count
     *   }
     * })
    **/
    count<T extends SnapTldReportCountArgs>(
      args?: Subset<T, SnapTldReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnapTldReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SnapTldReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SnapTldReportAggregateArgs>(args: Subset<T, SnapTldReportAggregateArgs>): Prisma.PrismaPromise<GetSnapTldReportAggregateType<T>>

    /**
     * Group by SnapTldReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldReportGroupByArgs} args - Group by arguments.
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
      T extends SnapTldReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnapTldReportGroupByArgs['orderBy'] }
        : { orderBy?: SnapTldReportGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SnapTldReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnapTldReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SnapTldReport model
   */
  readonly fields: SnapTldReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SnapTldReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnapTldReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SnapTldReport model
   */
  interface SnapTldReportFieldRefs {
    readonly id: FieldRef<"SnapTldReport", 'String'>
    readonly title: FieldRef<"SnapTldReport", 'String'>
    readonly generatedAt: FieldRef<"SnapTldReport", 'DateTime'>
    readonly domains: FieldRef<"SnapTldReport", 'Int'>
    readonly highlight: FieldRef<"SnapTldReport", 'String'>
    readonly format: FieldRef<"SnapTldReport", 'String'>
    readonly createdAt: FieldRef<"SnapTldReport", 'DateTime'>
    readonly updatedAt: FieldRef<"SnapTldReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SnapTldReport findUnique
   */
  export type SnapTldReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldReport to fetch.
     */
    where: SnapTldReportWhereUniqueInput
  }

  /**
   * SnapTldReport findUniqueOrThrow
   */
  export type SnapTldReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldReport to fetch.
     */
    where: SnapTldReportWhereUniqueInput
  }

  /**
   * SnapTldReport findFirst
   */
  export type SnapTldReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldReport to fetch.
     */
    where?: SnapTldReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldReports to fetch.
     */
    orderBy?: SnapTldReportOrderByWithRelationInput | SnapTldReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapTldReports.
     */
    cursor?: SnapTldReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldReports.
     */
    distinct?: SnapTldReportScalarFieldEnum | SnapTldReportScalarFieldEnum[]
  }

  /**
   * SnapTldReport findFirstOrThrow
   */
  export type SnapTldReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldReport to fetch.
     */
    where?: SnapTldReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldReports to fetch.
     */
    orderBy?: SnapTldReportOrderByWithRelationInput | SnapTldReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapTldReports.
     */
    cursor?: SnapTldReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldReports.
     */
    distinct?: SnapTldReportScalarFieldEnum | SnapTldReportScalarFieldEnum[]
  }

  /**
   * SnapTldReport findMany
   */
  export type SnapTldReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldReports to fetch.
     */
    where?: SnapTldReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldReports to fetch.
     */
    orderBy?: SnapTldReportOrderByWithRelationInput | SnapTldReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SnapTldReports.
     */
    cursor?: SnapTldReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldReports.
     */
    distinct?: SnapTldReportScalarFieldEnum | SnapTldReportScalarFieldEnum[]
  }

  /**
   * SnapTldReport create
   */
  export type SnapTldReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * The data needed to create a SnapTldReport.
     */
    data: XOR<SnapTldReportCreateInput, SnapTldReportUncheckedCreateInput>
  }

  /**
   * SnapTldReport createMany
   */
  export type SnapTldReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SnapTldReports.
     */
    data: SnapTldReportCreateManyInput | SnapTldReportCreateManyInput[]
  }

  /**
   * SnapTldReport createManyAndReturn
   */
  export type SnapTldReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * The data used to create many SnapTldReports.
     */
    data: SnapTldReportCreateManyInput | SnapTldReportCreateManyInput[]
  }

  /**
   * SnapTldReport update
   */
  export type SnapTldReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * The data needed to update a SnapTldReport.
     */
    data: XOR<SnapTldReportUpdateInput, SnapTldReportUncheckedUpdateInput>
    /**
     * Choose, which SnapTldReport to update.
     */
    where: SnapTldReportWhereUniqueInput
  }

  /**
   * SnapTldReport updateMany
   */
  export type SnapTldReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SnapTldReports.
     */
    data: XOR<SnapTldReportUpdateManyMutationInput, SnapTldReportUncheckedUpdateManyInput>
    /**
     * Filter which SnapTldReports to update
     */
    where?: SnapTldReportWhereInput
    /**
     * Limit how many SnapTldReports to update.
     */
    limit?: number
  }

  /**
   * SnapTldReport updateManyAndReturn
   */
  export type SnapTldReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * The data used to update SnapTldReports.
     */
    data: XOR<SnapTldReportUpdateManyMutationInput, SnapTldReportUncheckedUpdateManyInput>
    /**
     * Filter which SnapTldReports to update
     */
    where?: SnapTldReportWhereInput
    /**
     * Limit how many SnapTldReports to update.
     */
    limit?: number
  }

  /**
   * SnapTldReport upsert
   */
  export type SnapTldReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * The filter to search for the SnapTldReport to update in case it exists.
     */
    where: SnapTldReportWhereUniqueInput
    /**
     * In case the SnapTldReport found by the `where` argument doesn't exist, create a new SnapTldReport with this data.
     */
    create: XOR<SnapTldReportCreateInput, SnapTldReportUncheckedCreateInput>
    /**
     * In case the SnapTldReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnapTldReportUpdateInput, SnapTldReportUncheckedUpdateInput>
  }

  /**
   * SnapTldReport delete
   */
  export type SnapTldReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
    /**
     * Filter which SnapTldReport to delete.
     */
    where: SnapTldReportWhereUniqueInput
  }

  /**
   * SnapTldReport deleteMany
   */
  export type SnapTldReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapTldReports to delete
     */
    where?: SnapTldReportWhereInput
    /**
     * Limit how many SnapTldReports to delete.
     */
    limit?: number
  }

  /**
   * SnapTldReport without action
   */
  export type SnapTldReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldReport
     */
    select?: SnapTldReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldReport
     */
    omit?: SnapTldReportOmit<ExtArgs> | null
  }


  /**
   * Model SnapTldImportedDomain
   */

  export type AggregateSnapTldImportedDomain = {
    _count: SnapTldImportedDomainCountAggregateOutputType | null
    _avg: SnapTldImportedDomainAvgAggregateOutputType | null
    _sum: SnapTldImportedDomainSumAggregateOutputType | null
    _min: SnapTldImportedDomainMinAggregateOutputType | null
    _max: SnapTldImportedDomainMaxAggregateOutputType | null
  }

  export type SnapTldImportedDomainAvgAggregateOutputType = {
    totalScore: number | null
    estimatedValueMin: number | null
    estimatedValueMax: number | null
  }

  export type SnapTldImportedDomainSumAggregateOutputType = {
    totalScore: number | null
    estimatedValueMin: number | null
    estimatedValueMax: number | null
  }

  export type SnapTldImportedDomainMinAggregateOutputType = {
    slug: string | null
    domain: string | null
    tld: string | null
    source: string | null
    sourceLabel: string | null
    importedAt: Date | null
    importedBy: string | null
    batchId: string | null
    status: string | null
    expiresAt: string | null
    totalScore: number | null
    verdict: string | null
    estimatedValueMin: number | null
    estimatedValueMax: number | null
    estimatedValueCurrency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapTldImportedDomainMaxAggregateOutputType = {
    slug: string | null
    domain: string | null
    tld: string | null
    source: string | null
    sourceLabel: string | null
    importedAt: Date | null
    importedBy: string | null
    batchId: string | null
    status: string | null
    expiresAt: string | null
    totalScore: number | null
    verdict: string | null
    estimatedValueMin: number | null
    estimatedValueMax: number | null
    estimatedValueCurrency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapTldImportedDomainCountAggregateOutputType = {
    slug: number
    domain: number
    tld: number
    source: number
    sourceLabel: number
    importedAt: number
    importedBy: number
    batchId: number
    status: number
    expiresAt: number
    totalScore: number
    verdict: number
    estimatedValueMin: number
    estimatedValueMax: number
    estimatedValueCurrency: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SnapTldImportedDomainAvgAggregateInputType = {
    totalScore?: true
    estimatedValueMin?: true
    estimatedValueMax?: true
  }

  export type SnapTldImportedDomainSumAggregateInputType = {
    totalScore?: true
    estimatedValueMin?: true
    estimatedValueMax?: true
  }

  export type SnapTldImportedDomainMinAggregateInputType = {
    slug?: true
    domain?: true
    tld?: true
    source?: true
    sourceLabel?: true
    importedAt?: true
    importedBy?: true
    batchId?: true
    status?: true
    expiresAt?: true
    totalScore?: true
    verdict?: true
    estimatedValueMin?: true
    estimatedValueMax?: true
    estimatedValueCurrency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapTldImportedDomainMaxAggregateInputType = {
    slug?: true
    domain?: true
    tld?: true
    source?: true
    sourceLabel?: true
    importedAt?: true
    importedBy?: true
    batchId?: true
    status?: true
    expiresAt?: true
    totalScore?: true
    verdict?: true
    estimatedValueMin?: true
    estimatedValueMax?: true
    estimatedValueCurrency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapTldImportedDomainCountAggregateInputType = {
    slug?: true
    domain?: true
    tld?: true
    source?: true
    sourceLabel?: true
    importedAt?: true
    importedBy?: true
    batchId?: true
    status?: true
    expiresAt?: true
    totalScore?: true
    verdict?: true
    estimatedValueMin?: true
    estimatedValueMax?: true
    estimatedValueCurrency?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SnapTldImportedDomainAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapTldImportedDomain to aggregate.
     */
    where?: SnapTldImportedDomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldImportedDomains to fetch.
     */
    orderBy?: SnapTldImportedDomainOrderByWithRelationInput | SnapTldImportedDomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnapTldImportedDomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldImportedDomains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldImportedDomains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SnapTldImportedDomains
    **/
    _count?: true | SnapTldImportedDomainCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SnapTldImportedDomainAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SnapTldImportedDomainSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnapTldImportedDomainMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnapTldImportedDomainMaxAggregateInputType
  }

  export type GetSnapTldImportedDomainAggregateType<T extends SnapTldImportedDomainAggregateArgs> = {
        [P in keyof T & keyof AggregateSnapTldImportedDomain]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnapTldImportedDomain[P]>
      : GetScalarType<T[P], AggregateSnapTldImportedDomain[P]>
  }




  export type SnapTldImportedDomainGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapTldImportedDomainWhereInput
    orderBy?: SnapTldImportedDomainOrderByWithAggregationInput | SnapTldImportedDomainOrderByWithAggregationInput[]
    by: SnapTldImportedDomainScalarFieldEnum[] | SnapTldImportedDomainScalarFieldEnum
    having?: SnapTldImportedDomainScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnapTldImportedDomainCountAggregateInputType | true
    _avg?: SnapTldImportedDomainAvgAggregateInputType
    _sum?: SnapTldImportedDomainSumAggregateInputType
    _min?: SnapTldImportedDomainMinAggregateInputType
    _max?: SnapTldImportedDomainMaxAggregateInputType
  }

  export type SnapTldImportedDomainGroupByOutputType = {
    slug: string
    domain: string
    tld: string
    source: string
    sourceLabel: string
    importedAt: Date
    importedBy: string
    batchId: string
    status: string
    expiresAt: string
    totalScore: number
    verdict: string
    estimatedValueMin: number
    estimatedValueMax: number
    estimatedValueCurrency: string
    createdAt: Date
    updatedAt: Date
    _count: SnapTldImportedDomainCountAggregateOutputType | null
    _avg: SnapTldImportedDomainAvgAggregateOutputType | null
    _sum: SnapTldImportedDomainSumAggregateOutputType | null
    _min: SnapTldImportedDomainMinAggregateOutputType | null
    _max: SnapTldImportedDomainMaxAggregateOutputType | null
  }

  type GetSnapTldImportedDomainGroupByPayload<T extends SnapTldImportedDomainGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnapTldImportedDomainGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnapTldImportedDomainGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnapTldImportedDomainGroupByOutputType[P]>
            : GetScalarType<T[P], SnapTldImportedDomainGroupByOutputType[P]>
        }
      >
    >


  export type SnapTldImportedDomainSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    domain?: boolean
    tld?: boolean
    source?: boolean
    sourceLabel?: boolean
    importedAt?: boolean
    importedBy?: boolean
    batchId?: boolean
    status?: boolean
    expiresAt?: boolean
    totalScore?: boolean
    verdict?: boolean
    estimatedValueMin?: boolean
    estimatedValueMax?: boolean
    estimatedValueCurrency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldImportedDomain"]>

  export type SnapTldImportedDomainSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    domain?: boolean
    tld?: boolean
    source?: boolean
    sourceLabel?: boolean
    importedAt?: boolean
    importedBy?: boolean
    batchId?: boolean
    status?: boolean
    expiresAt?: boolean
    totalScore?: boolean
    verdict?: boolean
    estimatedValueMin?: boolean
    estimatedValueMax?: boolean
    estimatedValueCurrency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldImportedDomain"]>

  export type SnapTldImportedDomainSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    domain?: boolean
    tld?: boolean
    source?: boolean
    sourceLabel?: boolean
    importedAt?: boolean
    importedBy?: boolean
    batchId?: boolean
    status?: boolean
    expiresAt?: boolean
    totalScore?: boolean
    verdict?: boolean
    estimatedValueMin?: boolean
    estimatedValueMax?: boolean
    estimatedValueCurrency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldImportedDomain"]>

  export type SnapTldImportedDomainSelectScalar = {
    slug?: boolean
    domain?: boolean
    tld?: boolean
    source?: boolean
    sourceLabel?: boolean
    importedAt?: boolean
    importedBy?: boolean
    batchId?: boolean
    status?: boolean
    expiresAt?: boolean
    totalScore?: boolean
    verdict?: boolean
    estimatedValueMin?: boolean
    estimatedValueMax?: boolean
    estimatedValueCurrency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SnapTldImportedDomainOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"slug" | "domain" | "tld" | "source" | "sourceLabel" | "importedAt" | "importedBy" | "batchId" | "status" | "expiresAt" | "totalScore" | "verdict" | "estimatedValueMin" | "estimatedValueMax" | "estimatedValueCurrency" | "createdAt" | "updatedAt", ExtArgs["result"]["snapTldImportedDomain"]>

  export type $SnapTldImportedDomainPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SnapTldImportedDomain"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      slug: string
      domain: string
      tld: string
      source: string
      sourceLabel: string
      importedAt: Date
      importedBy: string
      batchId: string
      status: string
      expiresAt: string
      totalScore: number
      verdict: string
      estimatedValueMin: number
      estimatedValueMax: number
      estimatedValueCurrency: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["snapTldImportedDomain"]>
    composites: {}
  }

  type SnapTldImportedDomainGetPayload<S extends boolean | null | undefined | SnapTldImportedDomainDefaultArgs> = $Result.GetResult<Prisma.$SnapTldImportedDomainPayload, S>

  type SnapTldImportedDomainCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SnapTldImportedDomainFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SnapTldImportedDomainCountAggregateInputType | true
    }

  export interface SnapTldImportedDomainDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SnapTldImportedDomain'], meta: { name: 'SnapTldImportedDomain' } }
    /**
     * Find zero or one SnapTldImportedDomain that matches the filter.
     * @param {SnapTldImportedDomainFindUniqueArgs} args - Arguments to find a SnapTldImportedDomain
     * @example
     * // Get one SnapTldImportedDomain
     * const snapTldImportedDomain = await prisma.snapTldImportedDomain.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnapTldImportedDomainFindUniqueArgs>(args: SelectSubset<T, SnapTldImportedDomainFindUniqueArgs<ExtArgs>>): Prisma__SnapTldImportedDomainClient<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SnapTldImportedDomain that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SnapTldImportedDomainFindUniqueOrThrowArgs} args - Arguments to find a SnapTldImportedDomain
     * @example
     * // Get one SnapTldImportedDomain
     * const snapTldImportedDomain = await prisma.snapTldImportedDomain.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnapTldImportedDomainFindUniqueOrThrowArgs>(args: SelectSubset<T, SnapTldImportedDomainFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnapTldImportedDomainClient<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SnapTldImportedDomain that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldImportedDomainFindFirstArgs} args - Arguments to find a SnapTldImportedDomain
     * @example
     * // Get one SnapTldImportedDomain
     * const snapTldImportedDomain = await prisma.snapTldImportedDomain.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnapTldImportedDomainFindFirstArgs>(args?: SelectSubset<T, SnapTldImportedDomainFindFirstArgs<ExtArgs>>): Prisma__SnapTldImportedDomainClient<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SnapTldImportedDomain that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldImportedDomainFindFirstOrThrowArgs} args - Arguments to find a SnapTldImportedDomain
     * @example
     * // Get one SnapTldImportedDomain
     * const snapTldImportedDomain = await prisma.snapTldImportedDomain.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnapTldImportedDomainFindFirstOrThrowArgs>(args?: SelectSubset<T, SnapTldImportedDomainFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnapTldImportedDomainClient<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SnapTldImportedDomains that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldImportedDomainFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SnapTldImportedDomains
     * const snapTldImportedDomains = await prisma.snapTldImportedDomain.findMany()
     * 
     * // Get first 10 SnapTldImportedDomains
     * const snapTldImportedDomains = await prisma.snapTldImportedDomain.findMany({ take: 10 })
     * 
     * // Only select the `slug`
     * const snapTldImportedDomainWithSlugOnly = await prisma.snapTldImportedDomain.findMany({ select: { slug: true } })
     * 
     */
    findMany<T extends SnapTldImportedDomainFindManyArgs>(args?: SelectSubset<T, SnapTldImportedDomainFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SnapTldImportedDomain.
     * @param {SnapTldImportedDomainCreateArgs} args - Arguments to create a SnapTldImportedDomain.
     * @example
     * // Create one SnapTldImportedDomain
     * const SnapTldImportedDomain = await prisma.snapTldImportedDomain.create({
     *   data: {
     *     // ... data to create a SnapTldImportedDomain
     *   }
     * })
     * 
     */
    create<T extends SnapTldImportedDomainCreateArgs>(args: SelectSubset<T, SnapTldImportedDomainCreateArgs<ExtArgs>>): Prisma__SnapTldImportedDomainClient<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SnapTldImportedDomains.
     * @param {SnapTldImportedDomainCreateManyArgs} args - Arguments to create many SnapTldImportedDomains.
     * @example
     * // Create many SnapTldImportedDomains
     * const snapTldImportedDomain = await prisma.snapTldImportedDomain.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnapTldImportedDomainCreateManyArgs>(args?: SelectSubset<T, SnapTldImportedDomainCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SnapTldImportedDomains and returns the data saved in the database.
     * @param {SnapTldImportedDomainCreateManyAndReturnArgs} args - Arguments to create many SnapTldImportedDomains.
     * @example
     * // Create many SnapTldImportedDomains
     * const snapTldImportedDomain = await prisma.snapTldImportedDomain.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SnapTldImportedDomains and only return the `slug`
     * const snapTldImportedDomainWithSlugOnly = await prisma.snapTldImportedDomain.createManyAndReturn({
     *   select: { slug: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnapTldImportedDomainCreateManyAndReturnArgs>(args?: SelectSubset<T, SnapTldImportedDomainCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SnapTldImportedDomain.
     * @param {SnapTldImportedDomainDeleteArgs} args - Arguments to delete one SnapTldImportedDomain.
     * @example
     * // Delete one SnapTldImportedDomain
     * const SnapTldImportedDomain = await prisma.snapTldImportedDomain.delete({
     *   where: {
     *     // ... filter to delete one SnapTldImportedDomain
     *   }
     * })
     * 
     */
    delete<T extends SnapTldImportedDomainDeleteArgs>(args: SelectSubset<T, SnapTldImportedDomainDeleteArgs<ExtArgs>>): Prisma__SnapTldImportedDomainClient<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SnapTldImportedDomain.
     * @param {SnapTldImportedDomainUpdateArgs} args - Arguments to update one SnapTldImportedDomain.
     * @example
     * // Update one SnapTldImportedDomain
     * const snapTldImportedDomain = await prisma.snapTldImportedDomain.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnapTldImportedDomainUpdateArgs>(args: SelectSubset<T, SnapTldImportedDomainUpdateArgs<ExtArgs>>): Prisma__SnapTldImportedDomainClient<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SnapTldImportedDomains.
     * @param {SnapTldImportedDomainDeleteManyArgs} args - Arguments to filter SnapTldImportedDomains to delete.
     * @example
     * // Delete a few SnapTldImportedDomains
     * const { count } = await prisma.snapTldImportedDomain.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnapTldImportedDomainDeleteManyArgs>(args?: SelectSubset<T, SnapTldImportedDomainDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapTldImportedDomains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldImportedDomainUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SnapTldImportedDomains
     * const snapTldImportedDomain = await prisma.snapTldImportedDomain.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnapTldImportedDomainUpdateManyArgs>(args: SelectSubset<T, SnapTldImportedDomainUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapTldImportedDomains and returns the data updated in the database.
     * @param {SnapTldImportedDomainUpdateManyAndReturnArgs} args - Arguments to update many SnapTldImportedDomains.
     * @example
     * // Update many SnapTldImportedDomains
     * const snapTldImportedDomain = await prisma.snapTldImportedDomain.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SnapTldImportedDomains and only return the `slug`
     * const snapTldImportedDomainWithSlugOnly = await prisma.snapTldImportedDomain.updateManyAndReturn({
     *   select: { slug: true },
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
    updateManyAndReturn<T extends SnapTldImportedDomainUpdateManyAndReturnArgs>(args: SelectSubset<T, SnapTldImportedDomainUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SnapTldImportedDomain.
     * @param {SnapTldImportedDomainUpsertArgs} args - Arguments to update or create a SnapTldImportedDomain.
     * @example
     * // Update or create a SnapTldImportedDomain
     * const snapTldImportedDomain = await prisma.snapTldImportedDomain.upsert({
     *   create: {
     *     // ... data to create a SnapTldImportedDomain
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SnapTldImportedDomain we want to update
     *   }
     * })
     */
    upsert<T extends SnapTldImportedDomainUpsertArgs>(args: SelectSubset<T, SnapTldImportedDomainUpsertArgs<ExtArgs>>): Prisma__SnapTldImportedDomainClient<$Result.GetResult<Prisma.$SnapTldImportedDomainPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SnapTldImportedDomains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldImportedDomainCountArgs} args - Arguments to filter SnapTldImportedDomains to count.
     * @example
     * // Count the number of SnapTldImportedDomains
     * const count = await prisma.snapTldImportedDomain.count({
     *   where: {
     *     // ... the filter for the SnapTldImportedDomains we want to count
     *   }
     * })
    **/
    count<T extends SnapTldImportedDomainCountArgs>(
      args?: Subset<T, SnapTldImportedDomainCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnapTldImportedDomainCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SnapTldImportedDomain.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldImportedDomainAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SnapTldImportedDomainAggregateArgs>(args: Subset<T, SnapTldImportedDomainAggregateArgs>): Prisma.PrismaPromise<GetSnapTldImportedDomainAggregateType<T>>

    /**
     * Group by SnapTldImportedDomain.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldImportedDomainGroupByArgs} args - Group by arguments.
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
      T extends SnapTldImportedDomainGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnapTldImportedDomainGroupByArgs['orderBy'] }
        : { orderBy?: SnapTldImportedDomainGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SnapTldImportedDomainGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnapTldImportedDomainGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SnapTldImportedDomain model
   */
  readonly fields: SnapTldImportedDomainFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SnapTldImportedDomain.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnapTldImportedDomainClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SnapTldImportedDomain model
   */
  interface SnapTldImportedDomainFieldRefs {
    readonly slug: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly domain: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly tld: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly source: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly sourceLabel: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly importedAt: FieldRef<"SnapTldImportedDomain", 'DateTime'>
    readonly importedBy: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly batchId: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly status: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly expiresAt: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly totalScore: FieldRef<"SnapTldImportedDomain", 'Int'>
    readonly verdict: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly estimatedValueMin: FieldRef<"SnapTldImportedDomain", 'Int'>
    readonly estimatedValueMax: FieldRef<"SnapTldImportedDomain", 'Int'>
    readonly estimatedValueCurrency: FieldRef<"SnapTldImportedDomain", 'String'>
    readonly createdAt: FieldRef<"SnapTldImportedDomain", 'DateTime'>
    readonly updatedAt: FieldRef<"SnapTldImportedDomain", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SnapTldImportedDomain findUnique
   */
  export type SnapTldImportedDomainFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldImportedDomain to fetch.
     */
    where: SnapTldImportedDomainWhereUniqueInput
  }

  /**
   * SnapTldImportedDomain findUniqueOrThrow
   */
  export type SnapTldImportedDomainFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldImportedDomain to fetch.
     */
    where: SnapTldImportedDomainWhereUniqueInput
  }

  /**
   * SnapTldImportedDomain findFirst
   */
  export type SnapTldImportedDomainFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldImportedDomain to fetch.
     */
    where?: SnapTldImportedDomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldImportedDomains to fetch.
     */
    orderBy?: SnapTldImportedDomainOrderByWithRelationInput | SnapTldImportedDomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapTldImportedDomains.
     */
    cursor?: SnapTldImportedDomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldImportedDomains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldImportedDomains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldImportedDomains.
     */
    distinct?: SnapTldImportedDomainScalarFieldEnum | SnapTldImportedDomainScalarFieldEnum[]
  }

  /**
   * SnapTldImportedDomain findFirstOrThrow
   */
  export type SnapTldImportedDomainFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldImportedDomain to fetch.
     */
    where?: SnapTldImportedDomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldImportedDomains to fetch.
     */
    orderBy?: SnapTldImportedDomainOrderByWithRelationInput | SnapTldImportedDomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapTldImportedDomains.
     */
    cursor?: SnapTldImportedDomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldImportedDomains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldImportedDomains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldImportedDomains.
     */
    distinct?: SnapTldImportedDomainScalarFieldEnum | SnapTldImportedDomainScalarFieldEnum[]
  }

  /**
   * SnapTldImportedDomain findMany
   */
  export type SnapTldImportedDomainFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldImportedDomains to fetch.
     */
    where?: SnapTldImportedDomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldImportedDomains to fetch.
     */
    orderBy?: SnapTldImportedDomainOrderByWithRelationInput | SnapTldImportedDomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SnapTldImportedDomains.
     */
    cursor?: SnapTldImportedDomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldImportedDomains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldImportedDomains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldImportedDomains.
     */
    distinct?: SnapTldImportedDomainScalarFieldEnum | SnapTldImportedDomainScalarFieldEnum[]
  }

  /**
   * SnapTldImportedDomain create
   */
  export type SnapTldImportedDomainCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * The data needed to create a SnapTldImportedDomain.
     */
    data: XOR<SnapTldImportedDomainCreateInput, SnapTldImportedDomainUncheckedCreateInput>
  }

  /**
   * SnapTldImportedDomain createMany
   */
  export type SnapTldImportedDomainCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SnapTldImportedDomains.
     */
    data: SnapTldImportedDomainCreateManyInput | SnapTldImportedDomainCreateManyInput[]
  }

  /**
   * SnapTldImportedDomain createManyAndReturn
   */
  export type SnapTldImportedDomainCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * The data used to create many SnapTldImportedDomains.
     */
    data: SnapTldImportedDomainCreateManyInput | SnapTldImportedDomainCreateManyInput[]
  }

  /**
   * SnapTldImportedDomain update
   */
  export type SnapTldImportedDomainUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * The data needed to update a SnapTldImportedDomain.
     */
    data: XOR<SnapTldImportedDomainUpdateInput, SnapTldImportedDomainUncheckedUpdateInput>
    /**
     * Choose, which SnapTldImportedDomain to update.
     */
    where: SnapTldImportedDomainWhereUniqueInput
  }

  /**
   * SnapTldImportedDomain updateMany
   */
  export type SnapTldImportedDomainUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SnapTldImportedDomains.
     */
    data: XOR<SnapTldImportedDomainUpdateManyMutationInput, SnapTldImportedDomainUncheckedUpdateManyInput>
    /**
     * Filter which SnapTldImportedDomains to update
     */
    where?: SnapTldImportedDomainWhereInput
    /**
     * Limit how many SnapTldImportedDomains to update.
     */
    limit?: number
  }

  /**
   * SnapTldImportedDomain updateManyAndReturn
   */
  export type SnapTldImportedDomainUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * The data used to update SnapTldImportedDomains.
     */
    data: XOR<SnapTldImportedDomainUpdateManyMutationInput, SnapTldImportedDomainUncheckedUpdateManyInput>
    /**
     * Filter which SnapTldImportedDomains to update
     */
    where?: SnapTldImportedDomainWhereInput
    /**
     * Limit how many SnapTldImportedDomains to update.
     */
    limit?: number
  }

  /**
   * SnapTldImportedDomain upsert
   */
  export type SnapTldImportedDomainUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * The filter to search for the SnapTldImportedDomain to update in case it exists.
     */
    where: SnapTldImportedDomainWhereUniqueInput
    /**
     * In case the SnapTldImportedDomain found by the `where` argument doesn't exist, create a new SnapTldImportedDomain with this data.
     */
    create: XOR<SnapTldImportedDomainCreateInput, SnapTldImportedDomainUncheckedCreateInput>
    /**
     * In case the SnapTldImportedDomain was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnapTldImportedDomainUpdateInput, SnapTldImportedDomainUncheckedUpdateInput>
  }

  /**
   * SnapTldImportedDomain delete
   */
  export type SnapTldImportedDomainDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
    /**
     * Filter which SnapTldImportedDomain to delete.
     */
    where: SnapTldImportedDomainWhereUniqueInput
  }

  /**
   * SnapTldImportedDomain deleteMany
   */
  export type SnapTldImportedDomainDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapTldImportedDomains to delete
     */
    where?: SnapTldImportedDomainWhereInput
    /**
     * Limit how many SnapTldImportedDomains to delete.
     */
    limit?: number
  }

  /**
   * SnapTldImportedDomain without action
   */
  export type SnapTldImportedDomainDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldImportedDomain
     */
    select?: SnapTldImportedDomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldImportedDomain
     */
    omit?: SnapTldImportedDomainOmit<ExtArgs> | null
  }


  /**
   * Model SnapTldDomainAnalysis
   */

  export type AggregateSnapTldDomainAnalysis = {
    _count: SnapTldDomainAnalysisCountAggregateOutputType | null
    _avg: SnapTldDomainAnalysisAvgAggregateOutputType | null
    _sum: SnapTldDomainAnalysisSumAggregateOutputType | null
    _min: SnapTldDomainAnalysisMinAggregateOutputType | null
    _max: SnapTldDomainAnalysisMaxAggregateOutputType | null
  }

  export type SnapTldDomainAnalysisAvgAggregateOutputType = {
    totalScore: number | null
    estimatedValueMin: number | null
    estimatedValueMax: number | null
  }

  export type SnapTldDomainAnalysisSumAggregateOutputType = {
    totalScore: number | null
    estimatedValueMin: number | null
    estimatedValueMax: number | null
  }

  export type SnapTldDomainAnalysisMinAggregateOutputType = {
    slug: string | null
    domain: string | null
    tld: string | null
    source: string | null
    fetchedAt: Date | null
    expiresAt: string | null
    totalScore: number | null
    verdict: string | null
    status: string | null
    aiSummary: string | null
    estimatedValueMin: number | null
    estimatedValueMax: number | null
    estimatedValueCurrency: string | null
    categoriesJson: string | null
    seoJson: string | null
    waybackJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapTldDomainAnalysisMaxAggregateOutputType = {
    slug: string | null
    domain: string | null
    tld: string | null
    source: string | null
    fetchedAt: Date | null
    expiresAt: string | null
    totalScore: number | null
    verdict: string | null
    status: string | null
    aiSummary: string | null
    estimatedValueMin: number | null
    estimatedValueMax: number | null
    estimatedValueCurrency: string | null
    categoriesJson: string | null
    seoJson: string | null
    waybackJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapTldDomainAnalysisCountAggregateOutputType = {
    slug: number
    domain: number
    tld: number
    source: number
    fetchedAt: number
    expiresAt: number
    totalScore: number
    verdict: number
    status: number
    aiSummary: number
    estimatedValueMin: number
    estimatedValueMax: number
    estimatedValueCurrency: number
    categoriesJson: number
    seoJson: number
    waybackJson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SnapTldDomainAnalysisAvgAggregateInputType = {
    totalScore?: true
    estimatedValueMin?: true
    estimatedValueMax?: true
  }

  export type SnapTldDomainAnalysisSumAggregateInputType = {
    totalScore?: true
    estimatedValueMin?: true
    estimatedValueMax?: true
  }

  export type SnapTldDomainAnalysisMinAggregateInputType = {
    slug?: true
    domain?: true
    tld?: true
    source?: true
    fetchedAt?: true
    expiresAt?: true
    totalScore?: true
    verdict?: true
    status?: true
    aiSummary?: true
    estimatedValueMin?: true
    estimatedValueMax?: true
    estimatedValueCurrency?: true
    categoriesJson?: true
    seoJson?: true
    waybackJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapTldDomainAnalysisMaxAggregateInputType = {
    slug?: true
    domain?: true
    tld?: true
    source?: true
    fetchedAt?: true
    expiresAt?: true
    totalScore?: true
    verdict?: true
    status?: true
    aiSummary?: true
    estimatedValueMin?: true
    estimatedValueMax?: true
    estimatedValueCurrency?: true
    categoriesJson?: true
    seoJson?: true
    waybackJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapTldDomainAnalysisCountAggregateInputType = {
    slug?: true
    domain?: true
    tld?: true
    source?: true
    fetchedAt?: true
    expiresAt?: true
    totalScore?: true
    verdict?: true
    status?: true
    aiSummary?: true
    estimatedValueMin?: true
    estimatedValueMax?: true
    estimatedValueCurrency?: true
    categoriesJson?: true
    seoJson?: true
    waybackJson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SnapTldDomainAnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapTldDomainAnalysis to aggregate.
     */
    where?: SnapTldDomainAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldDomainAnalyses to fetch.
     */
    orderBy?: SnapTldDomainAnalysisOrderByWithRelationInput | SnapTldDomainAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnapTldDomainAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldDomainAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldDomainAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SnapTldDomainAnalyses
    **/
    _count?: true | SnapTldDomainAnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SnapTldDomainAnalysisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SnapTldDomainAnalysisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnapTldDomainAnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnapTldDomainAnalysisMaxAggregateInputType
  }

  export type GetSnapTldDomainAnalysisAggregateType<T extends SnapTldDomainAnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregateSnapTldDomainAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnapTldDomainAnalysis[P]>
      : GetScalarType<T[P], AggregateSnapTldDomainAnalysis[P]>
  }




  export type SnapTldDomainAnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapTldDomainAnalysisWhereInput
    orderBy?: SnapTldDomainAnalysisOrderByWithAggregationInput | SnapTldDomainAnalysisOrderByWithAggregationInput[]
    by: SnapTldDomainAnalysisScalarFieldEnum[] | SnapTldDomainAnalysisScalarFieldEnum
    having?: SnapTldDomainAnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnapTldDomainAnalysisCountAggregateInputType | true
    _avg?: SnapTldDomainAnalysisAvgAggregateInputType
    _sum?: SnapTldDomainAnalysisSumAggregateInputType
    _min?: SnapTldDomainAnalysisMinAggregateInputType
    _max?: SnapTldDomainAnalysisMaxAggregateInputType
  }

  export type SnapTldDomainAnalysisGroupByOutputType = {
    slug: string
    domain: string
    tld: string
    source: string
    fetchedAt: Date
    expiresAt: string
    totalScore: number
    verdict: string
    status: string
    aiSummary: string
    estimatedValueMin: number
    estimatedValueMax: number
    estimatedValueCurrency: string
    categoriesJson: string
    seoJson: string
    waybackJson: string
    createdAt: Date
    updatedAt: Date
    _count: SnapTldDomainAnalysisCountAggregateOutputType | null
    _avg: SnapTldDomainAnalysisAvgAggregateOutputType | null
    _sum: SnapTldDomainAnalysisSumAggregateOutputType | null
    _min: SnapTldDomainAnalysisMinAggregateOutputType | null
    _max: SnapTldDomainAnalysisMaxAggregateOutputType | null
  }

  type GetSnapTldDomainAnalysisGroupByPayload<T extends SnapTldDomainAnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnapTldDomainAnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnapTldDomainAnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnapTldDomainAnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], SnapTldDomainAnalysisGroupByOutputType[P]>
        }
      >
    >


  export type SnapTldDomainAnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    domain?: boolean
    tld?: boolean
    source?: boolean
    fetchedAt?: boolean
    expiresAt?: boolean
    totalScore?: boolean
    verdict?: boolean
    status?: boolean
    aiSummary?: boolean
    estimatedValueMin?: boolean
    estimatedValueMax?: boolean
    estimatedValueCurrency?: boolean
    categoriesJson?: boolean
    seoJson?: boolean
    waybackJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldDomainAnalysis"]>

  export type SnapTldDomainAnalysisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    domain?: boolean
    tld?: boolean
    source?: boolean
    fetchedAt?: boolean
    expiresAt?: boolean
    totalScore?: boolean
    verdict?: boolean
    status?: boolean
    aiSummary?: boolean
    estimatedValueMin?: boolean
    estimatedValueMax?: boolean
    estimatedValueCurrency?: boolean
    categoriesJson?: boolean
    seoJson?: boolean
    waybackJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldDomainAnalysis"]>

  export type SnapTldDomainAnalysisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    domain?: boolean
    tld?: boolean
    source?: boolean
    fetchedAt?: boolean
    expiresAt?: boolean
    totalScore?: boolean
    verdict?: boolean
    status?: boolean
    aiSummary?: boolean
    estimatedValueMin?: boolean
    estimatedValueMax?: boolean
    estimatedValueCurrency?: boolean
    categoriesJson?: boolean
    seoJson?: boolean
    waybackJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["snapTldDomainAnalysis"]>

  export type SnapTldDomainAnalysisSelectScalar = {
    slug?: boolean
    domain?: boolean
    tld?: boolean
    source?: boolean
    fetchedAt?: boolean
    expiresAt?: boolean
    totalScore?: boolean
    verdict?: boolean
    status?: boolean
    aiSummary?: boolean
    estimatedValueMin?: boolean
    estimatedValueMax?: boolean
    estimatedValueCurrency?: boolean
    categoriesJson?: boolean
    seoJson?: boolean
    waybackJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SnapTldDomainAnalysisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"slug" | "domain" | "tld" | "source" | "fetchedAt" | "expiresAt" | "totalScore" | "verdict" | "status" | "aiSummary" | "estimatedValueMin" | "estimatedValueMax" | "estimatedValueCurrency" | "categoriesJson" | "seoJson" | "waybackJson" | "createdAt" | "updatedAt", ExtArgs["result"]["snapTldDomainAnalysis"]>

  export type $SnapTldDomainAnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SnapTldDomainAnalysis"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      slug: string
      domain: string
      tld: string
      source: string
      fetchedAt: Date
      expiresAt: string
      totalScore: number
      verdict: string
      status: string
      aiSummary: string
      estimatedValueMin: number
      estimatedValueMax: number
      estimatedValueCurrency: string
      categoriesJson: string
      seoJson: string
      waybackJson: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["snapTldDomainAnalysis"]>
    composites: {}
  }

  type SnapTldDomainAnalysisGetPayload<S extends boolean | null | undefined | SnapTldDomainAnalysisDefaultArgs> = $Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload, S>

  type SnapTldDomainAnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SnapTldDomainAnalysisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SnapTldDomainAnalysisCountAggregateInputType | true
    }

  export interface SnapTldDomainAnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SnapTldDomainAnalysis'], meta: { name: 'SnapTldDomainAnalysis' } }
    /**
     * Find zero or one SnapTldDomainAnalysis that matches the filter.
     * @param {SnapTldDomainAnalysisFindUniqueArgs} args - Arguments to find a SnapTldDomainAnalysis
     * @example
     * // Get one SnapTldDomainAnalysis
     * const snapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnapTldDomainAnalysisFindUniqueArgs>(args: SelectSubset<T, SnapTldDomainAnalysisFindUniqueArgs<ExtArgs>>): Prisma__SnapTldDomainAnalysisClient<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SnapTldDomainAnalysis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SnapTldDomainAnalysisFindUniqueOrThrowArgs} args - Arguments to find a SnapTldDomainAnalysis
     * @example
     * // Get one SnapTldDomainAnalysis
     * const snapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnapTldDomainAnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, SnapTldDomainAnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnapTldDomainAnalysisClient<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SnapTldDomainAnalysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldDomainAnalysisFindFirstArgs} args - Arguments to find a SnapTldDomainAnalysis
     * @example
     * // Get one SnapTldDomainAnalysis
     * const snapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnapTldDomainAnalysisFindFirstArgs>(args?: SelectSubset<T, SnapTldDomainAnalysisFindFirstArgs<ExtArgs>>): Prisma__SnapTldDomainAnalysisClient<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SnapTldDomainAnalysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldDomainAnalysisFindFirstOrThrowArgs} args - Arguments to find a SnapTldDomainAnalysis
     * @example
     * // Get one SnapTldDomainAnalysis
     * const snapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnapTldDomainAnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, SnapTldDomainAnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnapTldDomainAnalysisClient<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SnapTldDomainAnalyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldDomainAnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SnapTldDomainAnalyses
     * const snapTldDomainAnalyses = await prisma.snapTldDomainAnalysis.findMany()
     * 
     * // Get first 10 SnapTldDomainAnalyses
     * const snapTldDomainAnalyses = await prisma.snapTldDomainAnalysis.findMany({ take: 10 })
     * 
     * // Only select the `slug`
     * const snapTldDomainAnalysisWithSlugOnly = await prisma.snapTldDomainAnalysis.findMany({ select: { slug: true } })
     * 
     */
    findMany<T extends SnapTldDomainAnalysisFindManyArgs>(args?: SelectSubset<T, SnapTldDomainAnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SnapTldDomainAnalysis.
     * @param {SnapTldDomainAnalysisCreateArgs} args - Arguments to create a SnapTldDomainAnalysis.
     * @example
     * // Create one SnapTldDomainAnalysis
     * const SnapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.create({
     *   data: {
     *     // ... data to create a SnapTldDomainAnalysis
     *   }
     * })
     * 
     */
    create<T extends SnapTldDomainAnalysisCreateArgs>(args: SelectSubset<T, SnapTldDomainAnalysisCreateArgs<ExtArgs>>): Prisma__SnapTldDomainAnalysisClient<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SnapTldDomainAnalyses.
     * @param {SnapTldDomainAnalysisCreateManyArgs} args - Arguments to create many SnapTldDomainAnalyses.
     * @example
     * // Create many SnapTldDomainAnalyses
     * const snapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnapTldDomainAnalysisCreateManyArgs>(args?: SelectSubset<T, SnapTldDomainAnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SnapTldDomainAnalyses and returns the data saved in the database.
     * @param {SnapTldDomainAnalysisCreateManyAndReturnArgs} args - Arguments to create many SnapTldDomainAnalyses.
     * @example
     * // Create many SnapTldDomainAnalyses
     * const snapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SnapTldDomainAnalyses and only return the `slug`
     * const snapTldDomainAnalysisWithSlugOnly = await prisma.snapTldDomainAnalysis.createManyAndReturn({
     *   select: { slug: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnapTldDomainAnalysisCreateManyAndReturnArgs>(args?: SelectSubset<T, SnapTldDomainAnalysisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SnapTldDomainAnalysis.
     * @param {SnapTldDomainAnalysisDeleteArgs} args - Arguments to delete one SnapTldDomainAnalysis.
     * @example
     * // Delete one SnapTldDomainAnalysis
     * const SnapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.delete({
     *   where: {
     *     // ... filter to delete one SnapTldDomainAnalysis
     *   }
     * })
     * 
     */
    delete<T extends SnapTldDomainAnalysisDeleteArgs>(args: SelectSubset<T, SnapTldDomainAnalysisDeleteArgs<ExtArgs>>): Prisma__SnapTldDomainAnalysisClient<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SnapTldDomainAnalysis.
     * @param {SnapTldDomainAnalysisUpdateArgs} args - Arguments to update one SnapTldDomainAnalysis.
     * @example
     * // Update one SnapTldDomainAnalysis
     * const snapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnapTldDomainAnalysisUpdateArgs>(args: SelectSubset<T, SnapTldDomainAnalysisUpdateArgs<ExtArgs>>): Prisma__SnapTldDomainAnalysisClient<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SnapTldDomainAnalyses.
     * @param {SnapTldDomainAnalysisDeleteManyArgs} args - Arguments to filter SnapTldDomainAnalyses to delete.
     * @example
     * // Delete a few SnapTldDomainAnalyses
     * const { count } = await prisma.snapTldDomainAnalysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnapTldDomainAnalysisDeleteManyArgs>(args?: SelectSubset<T, SnapTldDomainAnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapTldDomainAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldDomainAnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SnapTldDomainAnalyses
     * const snapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnapTldDomainAnalysisUpdateManyArgs>(args: SelectSubset<T, SnapTldDomainAnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapTldDomainAnalyses and returns the data updated in the database.
     * @param {SnapTldDomainAnalysisUpdateManyAndReturnArgs} args - Arguments to update many SnapTldDomainAnalyses.
     * @example
     * // Update many SnapTldDomainAnalyses
     * const snapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SnapTldDomainAnalyses and only return the `slug`
     * const snapTldDomainAnalysisWithSlugOnly = await prisma.snapTldDomainAnalysis.updateManyAndReturn({
     *   select: { slug: true },
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
    updateManyAndReturn<T extends SnapTldDomainAnalysisUpdateManyAndReturnArgs>(args: SelectSubset<T, SnapTldDomainAnalysisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SnapTldDomainAnalysis.
     * @param {SnapTldDomainAnalysisUpsertArgs} args - Arguments to update or create a SnapTldDomainAnalysis.
     * @example
     * // Update or create a SnapTldDomainAnalysis
     * const snapTldDomainAnalysis = await prisma.snapTldDomainAnalysis.upsert({
     *   create: {
     *     // ... data to create a SnapTldDomainAnalysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SnapTldDomainAnalysis we want to update
     *   }
     * })
     */
    upsert<T extends SnapTldDomainAnalysisUpsertArgs>(args: SelectSubset<T, SnapTldDomainAnalysisUpsertArgs<ExtArgs>>): Prisma__SnapTldDomainAnalysisClient<$Result.GetResult<Prisma.$SnapTldDomainAnalysisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SnapTldDomainAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldDomainAnalysisCountArgs} args - Arguments to filter SnapTldDomainAnalyses to count.
     * @example
     * // Count the number of SnapTldDomainAnalyses
     * const count = await prisma.snapTldDomainAnalysis.count({
     *   where: {
     *     // ... the filter for the SnapTldDomainAnalyses we want to count
     *   }
     * })
    **/
    count<T extends SnapTldDomainAnalysisCountArgs>(
      args?: Subset<T, SnapTldDomainAnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnapTldDomainAnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SnapTldDomainAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldDomainAnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SnapTldDomainAnalysisAggregateArgs>(args: Subset<T, SnapTldDomainAnalysisAggregateArgs>): Prisma.PrismaPromise<GetSnapTldDomainAnalysisAggregateType<T>>

    /**
     * Group by SnapTldDomainAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapTldDomainAnalysisGroupByArgs} args - Group by arguments.
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
      T extends SnapTldDomainAnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnapTldDomainAnalysisGroupByArgs['orderBy'] }
        : { orderBy?: SnapTldDomainAnalysisGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SnapTldDomainAnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnapTldDomainAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SnapTldDomainAnalysis model
   */
  readonly fields: SnapTldDomainAnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SnapTldDomainAnalysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnapTldDomainAnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SnapTldDomainAnalysis model
   */
  interface SnapTldDomainAnalysisFieldRefs {
    readonly slug: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly domain: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly tld: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly source: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly fetchedAt: FieldRef<"SnapTldDomainAnalysis", 'DateTime'>
    readonly expiresAt: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly totalScore: FieldRef<"SnapTldDomainAnalysis", 'Int'>
    readonly verdict: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly status: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly aiSummary: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly estimatedValueMin: FieldRef<"SnapTldDomainAnalysis", 'Int'>
    readonly estimatedValueMax: FieldRef<"SnapTldDomainAnalysis", 'Int'>
    readonly estimatedValueCurrency: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly categoriesJson: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly seoJson: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly waybackJson: FieldRef<"SnapTldDomainAnalysis", 'String'>
    readonly createdAt: FieldRef<"SnapTldDomainAnalysis", 'DateTime'>
    readonly updatedAt: FieldRef<"SnapTldDomainAnalysis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SnapTldDomainAnalysis findUnique
   */
  export type SnapTldDomainAnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldDomainAnalysis to fetch.
     */
    where: SnapTldDomainAnalysisWhereUniqueInput
  }

  /**
   * SnapTldDomainAnalysis findUniqueOrThrow
   */
  export type SnapTldDomainAnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldDomainAnalysis to fetch.
     */
    where: SnapTldDomainAnalysisWhereUniqueInput
  }

  /**
   * SnapTldDomainAnalysis findFirst
   */
  export type SnapTldDomainAnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldDomainAnalysis to fetch.
     */
    where?: SnapTldDomainAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldDomainAnalyses to fetch.
     */
    orderBy?: SnapTldDomainAnalysisOrderByWithRelationInput | SnapTldDomainAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapTldDomainAnalyses.
     */
    cursor?: SnapTldDomainAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldDomainAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldDomainAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldDomainAnalyses.
     */
    distinct?: SnapTldDomainAnalysisScalarFieldEnum | SnapTldDomainAnalysisScalarFieldEnum[]
  }

  /**
   * SnapTldDomainAnalysis findFirstOrThrow
   */
  export type SnapTldDomainAnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldDomainAnalysis to fetch.
     */
    where?: SnapTldDomainAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldDomainAnalyses to fetch.
     */
    orderBy?: SnapTldDomainAnalysisOrderByWithRelationInput | SnapTldDomainAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapTldDomainAnalyses.
     */
    cursor?: SnapTldDomainAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldDomainAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldDomainAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldDomainAnalyses.
     */
    distinct?: SnapTldDomainAnalysisScalarFieldEnum | SnapTldDomainAnalysisScalarFieldEnum[]
  }

  /**
   * SnapTldDomainAnalysis findMany
   */
  export type SnapTldDomainAnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * Filter, which SnapTldDomainAnalyses to fetch.
     */
    where?: SnapTldDomainAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapTldDomainAnalyses to fetch.
     */
    orderBy?: SnapTldDomainAnalysisOrderByWithRelationInput | SnapTldDomainAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SnapTldDomainAnalyses.
     */
    cursor?: SnapTldDomainAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapTldDomainAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapTldDomainAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapTldDomainAnalyses.
     */
    distinct?: SnapTldDomainAnalysisScalarFieldEnum | SnapTldDomainAnalysisScalarFieldEnum[]
  }

  /**
   * SnapTldDomainAnalysis create
   */
  export type SnapTldDomainAnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * The data needed to create a SnapTldDomainAnalysis.
     */
    data: XOR<SnapTldDomainAnalysisCreateInput, SnapTldDomainAnalysisUncheckedCreateInput>
  }

  /**
   * SnapTldDomainAnalysis createMany
   */
  export type SnapTldDomainAnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SnapTldDomainAnalyses.
     */
    data: SnapTldDomainAnalysisCreateManyInput | SnapTldDomainAnalysisCreateManyInput[]
  }

  /**
   * SnapTldDomainAnalysis createManyAndReturn
   */
  export type SnapTldDomainAnalysisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * The data used to create many SnapTldDomainAnalyses.
     */
    data: SnapTldDomainAnalysisCreateManyInput | SnapTldDomainAnalysisCreateManyInput[]
  }

  /**
   * SnapTldDomainAnalysis update
   */
  export type SnapTldDomainAnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * The data needed to update a SnapTldDomainAnalysis.
     */
    data: XOR<SnapTldDomainAnalysisUpdateInput, SnapTldDomainAnalysisUncheckedUpdateInput>
    /**
     * Choose, which SnapTldDomainAnalysis to update.
     */
    where: SnapTldDomainAnalysisWhereUniqueInput
  }

  /**
   * SnapTldDomainAnalysis updateMany
   */
  export type SnapTldDomainAnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SnapTldDomainAnalyses.
     */
    data: XOR<SnapTldDomainAnalysisUpdateManyMutationInput, SnapTldDomainAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which SnapTldDomainAnalyses to update
     */
    where?: SnapTldDomainAnalysisWhereInput
    /**
     * Limit how many SnapTldDomainAnalyses to update.
     */
    limit?: number
  }

  /**
   * SnapTldDomainAnalysis updateManyAndReturn
   */
  export type SnapTldDomainAnalysisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * The data used to update SnapTldDomainAnalyses.
     */
    data: XOR<SnapTldDomainAnalysisUpdateManyMutationInput, SnapTldDomainAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which SnapTldDomainAnalyses to update
     */
    where?: SnapTldDomainAnalysisWhereInput
    /**
     * Limit how many SnapTldDomainAnalyses to update.
     */
    limit?: number
  }

  /**
   * SnapTldDomainAnalysis upsert
   */
  export type SnapTldDomainAnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * The filter to search for the SnapTldDomainAnalysis to update in case it exists.
     */
    where: SnapTldDomainAnalysisWhereUniqueInput
    /**
     * In case the SnapTldDomainAnalysis found by the `where` argument doesn't exist, create a new SnapTldDomainAnalysis with this data.
     */
    create: XOR<SnapTldDomainAnalysisCreateInput, SnapTldDomainAnalysisUncheckedCreateInput>
    /**
     * In case the SnapTldDomainAnalysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnapTldDomainAnalysisUpdateInput, SnapTldDomainAnalysisUncheckedUpdateInput>
  }

  /**
   * SnapTldDomainAnalysis delete
   */
  export type SnapTldDomainAnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
    /**
     * Filter which SnapTldDomainAnalysis to delete.
     */
    where: SnapTldDomainAnalysisWhereUniqueInput
  }

  /**
   * SnapTldDomainAnalysis deleteMany
   */
  export type SnapTldDomainAnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapTldDomainAnalyses to delete
     */
    where?: SnapTldDomainAnalysisWhereInput
    /**
     * Limit how many SnapTldDomainAnalyses to delete.
     */
    limit?: number
  }

  /**
   * SnapTldDomainAnalysis without action
   */
  export type SnapTldDomainAnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapTldDomainAnalysis
     */
    select?: SnapTldDomainAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SnapTldDomainAnalysis
     */
    omit?: SnapTldDomainAnalysisOmit<ExtArgs> | null
  }


  /**
   * Model DriveItem
   */

  export type AggregateDriveItem = {
    _count: DriveItemCountAggregateOutputType | null
    _avg: DriveItemAvgAggregateOutputType | null
    _sum: DriveItemSumAggregateOutputType | null
    _min: DriveItemMinAggregateOutputType | null
    _max: DriveItemMaxAggregateOutputType | null
  }

  export type DriveItemAvgAggregateOutputType = {
    sizeBytes: number | null
  }

  export type DriveItemSumAggregateOutputType = {
    sizeBytes: number | null
  }

  export type DriveItemMinAggregateOutputType = {
    id: string | null
    name: string | null
    kind: string | null
    mimeType: string | null
    extension: string | null
    sizeBytes: number | null
    parentId: string | null
    pathJson: string | null
    ownerId: string | null
    ownerName: string | null
    ownerInitials: string | null
    isFavorite: boolean | null
    isDeleted: boolean | null
    storageKey: string | null
    previewType: string | null
    previewUrl: string | null
    previewContent: string | null
    previewLanguage: string | null
    previewAccent: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DriveItemMaxAggregateOutputType = {
    id: string | null
    name: string | null
    kind: string | null
    mimeType: string | null
    extension: string | null
    sizeBytes: number | null
    parentId: string | null
    pathJson: string | null
    ownerId: string | null
    ownerName: string | null
    ownerInitials: string | null
    isFavorite: boolean | null
    isDeleted: boolean | null
    storageKey: string | null
    previewType: string | null
    previewUrl: string | null
    previewContent: string | null
    previewLanguage: string | null
    previewAccent: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DriveItemCountAggregateOutputType = {
    id: number
    name: number
    kind: number
    mimeType: number
    extension: number
    sizeBytes: number
    parentId: number
    pathJson: number
    ownerId: number
    ownerName: number
    ownerInitials: number
    isFavorite: number
    isDeleted: number
    storageKey: number
    previewType: number
    previewUrl: number
    previewContent: number
    previewLanguage: number
    previewAccent: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DriveItemAvgAggregateInputType = {
    sizeBytes?: true
  }

  export type DriveItemSumAggregateInputType = {
    sizeBytes?: true
  }

  export type DriveItemMinAggregateInputType = {
    id?: true
    name?: true
    kind?: true
    mimeType?: true
    extension?: true
    sizeBytes?: true
    parentId?: true
    pathJson?: true
    ownerId?: true
    ownerName?: true
    ownerInitials?: true
    isFavorite?: true
    isDeleted?: true
    storageKey?: true
    previewType?: true
    previewUrl?: true
    previewContent?: true
    previewLanguage?: true
    previewAccent?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DriveItemMaxAggregateInputType = {
    id?: true
    name?: true
    kind?: true
    mimeType?: true
    extension?: true
    sizeBytes?: true
    parentId?: true
    pathJson?: true
    ownerId?: true
    ownerName?: true
    ownerInitials?: true
    isFavorite?: true
    isDeleted?: true
    storageKey?: true
    previewType?: true
    previewUrl?: true
    previewContent?: true
    previewLanguage?: true
    previewAccent?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DriveItemCountAggregateInputType = {
    id?: true
    name?: true
    kind?: true
    mimeType?: true
    extension?: true
    sizeBytes?: true
    parentId?: true
    pathJson?: true
    ownerId?: true
    ownerName?: true
    ownerInitials?: true
    isFavorite?: true
    isDeleted?: true
    storageKey?: true
    previewType?: true
    previewUrl?: true
    previewContent?: true
    previewLanguage?: true
    previewAccent?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DriveItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DriveItem to aggregate.
     */
    where?: DriveItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveItems to fetch.
     */
    orderBy?: DriveItemOrderByWithRelationInput | DriveItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DriveItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DriveItems
    **/
    _count?: true | DriveItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DriveItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DriveItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DriveItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DriveItemMaxAggregateInputType
  }

  export type GetDriveItemAggregateType<T extends DriveItemAggregateArgs> = {
        [P in keyof T & keyof AggregateDriveItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDriveItem[P]>
      : GetScalarType<T[P], AggregateDriveItem[P]>
  }




  export type DriveItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriveItemWhereInput
    orderBy?: DriveItemOrderByWithAggregationInput | DriveItemOrderByWithAggregationInput[]
    by: DriveItemScalarFieldEnum[] | DriveItemScalarFieldEnum
    having?: DriveItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DriveItemCountAggregateInputType | true
    _avg?: DriveItemAvgAggregateInputType
    _sum?: DriveItemSumAggregateInputType
    _min?: DriveItemMinAggregateInputType
    _max?: DriveItemMaxAggregateInputType
  }

  export type DriveItemGroupByOutputType = {
    id: string
    name: string
    kind: string
    mimeType: string | null
    extension: string | null
    sizeBytes: number
    parentId: string | null
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite: boolean
    isDeleted: boolean
    storageKey: string | null
    previewType: string
    previewUrl: string | null
    previewContent: string | null
    previewLanguage: string | null
    previewAccent: string
    createdAt: Date
    updatedAt: Date
    _count: DriveItemCountAggregateOutputType | null
    _avg: DriveItemAvgAggregateOutputType | null
    _sum: DriveItemSumAggregateOutputType | null
    _min: DriveItemMinAggregateOutputType | null
    _max: DriveItemMaxAggregateOutputType | null
  }

  type GetDriveItemGroupByPayload<T extends DriveItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DriveItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DriveItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DriveItemGroupByOutputType[P]>
            : GetScalarType<T[P], DriveItemGroupByOutputType[P]>
        }
      >
    >


  export type DriveItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    kind?: boolean
    mimeType?: boolean
    extension?: boolean
    sizeBytes?: boolean
    parentId?: boolean
    pathJson?: boolean
    ownerId?: boolean
    ownerName?: boolean
    ownerInitials?: boolean
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: boolean
    previewType?: boolean
    previewUrl?: boolean
    previewContent?: boolean
    previewLanguage?: boolean
    previewAccent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | DriveItem$parentArgs<ExtArgs>
    children?: boolean | DriveItem$childrenArgs<ExtArgs>
    activities?: boolean | DriveItem$activitiesArgs<ExtArgs>
    _count?: boolean | DriveItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driveItem"]>

  export type DriveItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    kind?: boolean
    mimeType?: boolean
    extension?: boolean
    sizeBytes?: boolean
    parentId?: boolean
    pathJson?: boolean
    ownerId?: boolean
    ownerName?: boolean
    ownerInitials?: boolean
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: boolean
    previewType?: boolean
    previewUrl?: boolean
    previewContent?: boolean
    previewLanguage?: boolean
    previewAccent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | DriveItem$parentArgs<ExtArgs>
  }, ExtArgs["result"]["driveItem"]>

  export type DriveItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    kind?: boolean
    mimeType?: boolean
    extension?: boolean
    sizeBytes?: boolean
    parentId?: boolean
    pathJson?: boolean
    ownerId?: boolean
    ownerName?: boolean
    ownerInitials?: boolean
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: boolean
    previewType?: boolean
    previewUrl?: boolean
    previewContent?: boolean
    previewLanguage?: boolean
    previewAccent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | DriveItem$parentArgs<ExtArgs>
  }, ExtArgs["result"]["driveItem"]>

  export type DriveItemSelectScalar = {
    id?: boolean
    name?: boolean
    kind?: boolean
    mimeType?: boolean
    extension?: boolean
    sizeBytes?: boolean
    parentId?: boolean
    pathJson?: boolean
    ownerId?: boolean
    ownerName?: boolean
    ownerInitials?: boolean
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: boolean
    previewType?: boolean
    previewUrl?: boolean
    previewContent?: boolean
    previewLanguage?: boolean
    previewAccent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DriveItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "kind" | "mimeType" | "extension" | "sizeBytes" | "parentId" | "pathJson" | "ownerId" | "ownerName" | "ownerInitials" | "isFavorite" | "isDeleted" | "storageKey" | "previewType" | "previewUrl" | "previewContent" | "previewLanguage" | "previewAccent" | "createdAt" | "updatedAt", ExtArgs["result"]["driveItem"]>
  export type DriveItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | DriveItem$parentArgs<ExtArgs>
    children?: boolean | DriveItem$childrenArgs<ExtArgs>
    activities?: boolean | DriveItem$activitiesArgs<ExtArgs>
    _count?: boolean | DriveItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DriveItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | DriveItem$parentArgs<ExtArgs>
  }
  export type DriveItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | DriveItem$parentArgs<ExtArgs>
  }

  export type $DriveItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DriveItem"
    objects: {
      parent: Prisma.$DriveItemPayload<ExtArgs> | null
      children: Prisma.$DriveItemPayload<ExtArgs>[]
      activities: Prisma.$DriveActivityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      kind: string
      mimeType: string | null
      extension: string | null
      sizeBytes: number
      parentId: string | null
      pathJson: string
      ownerId: string
      ownerName: string
      ownerInitials: string
      isFavorite: boolean
      isDeleted: boolean
      storageKey: string | null
      previewType: string
      previewUrl: string | null
      previewContent: string | null
      previewLanguage: string | null
      previewAccent: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["driveItem"]>
    composites: {}
  }

  type DriveItemGetPayload<S extends boolean | null | undefined | DriveItemDefaultArgs> = $Result.GetResult<Prisma.$DriveItemPayload, S>

  type DriveItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DriveItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DriveItemCountAggregateInputType | true
    }

  export interface DriveItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DriveItem'], meta: { name: 'DriveItem' } }
    /**
     * Find zero or one DriveItem that matches the filter.
     * @param {DriveItemFindUniqueArgs} args - Arguments to find a DriveItem
     * @example
     * // Get one DriveItem
     * const driveItem = await prisma.driveItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DriveItemFindUniqueArgs>(args: SelectSubset<T, DriveItemFindUniqueArgs<ExtArgs>>): Prisma__DriveItemClient<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DriveItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DriveItemFindUniqueOrThrowArgs} args - Arguments to find a DriveItem
     * @example
     * // Get one DriveItem
     * const driveItem = await prisma.driveItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DriveItemFindUniqueOrThrowArgs>(args: SelectSubset<T, DriveItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DriveItemClient<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DriveItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveItemFindFirstArgs} args - Arguments to find a DriveItem
     * @example
     * // Get one DriveItem
     * const driveItem = await prisma.driveItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DriveItemFindFirstArgs>(args?: SelectSubset<T, DriveItemFindFirstArgs<ExtArgs>>): Prisma__DriveItemClient<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DriveItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveItemFindFirstOrThrowArgs} args - Arguments to find a DriveItem
     * @example
     * // Get one DriveItem
     * const driveItem = await prisma.driveItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DriveItemFindFirstOrThrowArgs>(args?: SelectSubset<T, DriveItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__DriveItemClient<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DriveItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DriveItems
     * const driveItems = await prisma.driveItem.findMany()
     * 
     * // Get first 10 DriveItems
     * const driveItems = await prisma.driveItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const driveItemWithIdOnly = await prisma.driveItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DriveItemFindManyArgs>(args?: SelectSubset<T, DriveItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DriveItem.
     * @param {DriveItemCreateArgs} args - Arguments to create a DriveItem.
     * @example
     * // Create one DriveItem
     * const DriveItem = await prisma.driveItem.create({
     *   data: {
     *     // ... data to create a DriveItem
     *   }
     * })
     * 
     */
    create<T extends DriveItemCreateArgs>(args: SelectSubset<T, DriveItemCreateArgs<ExtArgs>>): Prisma__DriveItemClient<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DriveItems.
     * @param {DriveItemCreateManyArgs} args - Arguments to create many DriveItems.
     * @example
     * // Create many DriveItems
     * const driveItem = await prisma.driveItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DriveItemCreateManyArgs>(args?: SelectSubset<T, DriveItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DriveItems and returns the data saved in the database.
     * @param {DriveItemCreateManyAndReturnArgs} args - Arguments to create many DriveItems.
     * @example
     * // Create many DriveItems
     * const driveItem = await prisma.driveItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DriveItems and only return the `id`
     * const driveItemWithIdOnly = await prisma.driveItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DriveItemCreateManyAndReturnArgs>(args?: SelectSubset<T, DriveItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DriveItem.
     * @param {DriveItemDeleteArgs} args - Arguments to delete one DriveItem.
     * @example
     * // Delete one DriveItem
     * const DriveItem = await prisma.driveItem.delete({
     *   where: {
     *     // ... filter to delete one DriveItem
     *   }
     * })
     * 
     */
    delete<T extends DriveItemDeleteArgs>(args: SelectSubset<T, DriveItemDeleteArgs<ExtArgs>>): Prisma__DriveItemClient<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DriveItem.
     * @param {DriveItemUpdateArgs} args - Arguments to update one DriveItem.
     * @example
     * // Update one DriveItem
     * const driveItem = await prisma.driveItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DriveItemUpdateArgs>(args: SelectSubset<T, DriveItemUpdateArgs<ExtArgs>>): Prisma__DriveItemClient<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DriveItems.
     * @param {DriveItemDeleteManyArgs} args - Arguments to filter DriveItems to delete.
     * @example
     * // Delete a few DriveItems
     * const { count } = await prisma.driveItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DriveItemDeleteManyArgs>(args?: SelectSubset<T, DriveItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DriveItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DriveItems
     * const driveItem = await prisma.driveItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DriveItemUpdateManyArgs>(args: SelectSubset<T, DriveItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DriveItems and returns the data updated in the database.
     * @param {DriveItemUpdateManyAndReturnArgs} args - Arguments to update many DriveItems.
     * @example
     * // Update many DriveItems
     * const driveItem = await prisma.driveItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DriveItems and only return the `id`
     * const driveItemWithIdOnly = await prisma.driveItem.updateManyAndReturn({
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
    updateManyAndReturn<T extends DriveItemUpdateManyAndReturnArgs>(args: SelectSubset<T, DriveItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DriveItem.
     * @param {DriveItemUpsertArgs} args - Arguments to update or create a DriveItem.
     * @example
     * // Update or create a DriveItem
     * const driveItem = await prisma.driveItem.upsert({
     *   create: {
     *     // ... data to create a DriveItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DriveItem we want to update
     *   }
     * })
     */
    upsert<T extends DriveItemUpsertArgs>(args: SelectSubset<T, DriveItemUpsertArgs<ExtArgs>>): Prisma__DriveItemClient<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DriveItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveItemCountArgs} args - Arguments to filter DriveItems to count.
     * @example
     * // Count the number of DriveItems
     * const count = await prisma.driveItem.count({
     *   where: {
     *     // ... the filter for the DriveItems we want to count
     *   }
     * })
    **/
    count<T extends DriveItemCountArgs>(
      args?: Subset<T, DriveItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DriveItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DriveItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DriveItemAggregateArgs>(args: Subset<T, DriveItemAggregateArgs>): Prisma.PrismaPromise<GetDriveItemAggregateType<T>>

    /**
     * Group by DriveItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveItemGroupByArgs} args - Group by arguments.
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
      T extends DriveItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DriveItemGroupByArgs['orderBy'] }
        : { orderBy?: DriveItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DriveItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDriveItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DriveItem model
   */
  readonly fields: DriveItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DriveItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DriveItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends DriveItem$parentArgs<ExtArgs> = {}>(args?: Subset<T, DriveItem$parentArgs<ExtArgs>>): Prisma__DriveItemClient<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    children<T extends DriveItem$childrenArgs<ExtArgs> = {}>(args?: Subset<T, DriveItem$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    activities<T extends DriveItem$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, DriveItem$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the DriveItem model
   */
  interface DriveItemFieldRefs {
    readonly id: FieldRef<"DriveItem", 'String'>
    readonly name: FieldRef<"DriveItem", 'String'>
    readonly kind: FieldRef<"DriveItem", 'String'>
    readonly mimeType: FieldRef<"DriveItem", 'String'>
    readonly extension: FieldRef<"DriveItem", 'String'>
    readonly sizeBytes: FieldRef<"DriveItem", 'Int'>
    readonly parentId: FieldRef<"DriveItem", 'String'>
    readonly pathJson: FieldRef<"DriveItem", 'String'>
    readonly ownerId: FieldRef<"DriveItem", 'String'>
    readonly ownerName: FieldRef<"DriveItem", 'String'>
    readonly ownerInitials: FieldRef<"DriveItem", 'String'>
    readonly isFavorite: FieldRef<"DriveItem", 'Boolean'>
    readonly isDeleted: FieldRef<"DriveItem", 'Boolean'>
    readonly storageKey: FieldRef<"DriveItem", 'String'>
    readonly previewType: FieldRef<"DriveItem", 'String'>
    readonly previewUrl: FieldRef<"DriveItem", 'String'>
    readonly previewContent: FieldRef<"DriveItem", 'String'>
    readonly previewLanguage: FieldRef<"DriveItem", 'String'>
    readonly previewAccent: FieldRef<"DriveItem", 'String'>
    readonly createdAt: FieldRef<"DriveItem", 'DateTime'>
    readonly updatedAt: FieldRef<"DriveItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DriveItem findUnique
   */
  export type DriveItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    /**
     * Filter, which DriveItem to fetch.
     */
    where: DriveItemWhereUniqueInput
  }

  /**
   * DriveItem findUniqueOrThrow
   */
  export type DriveItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    /**
     * Filter, which DriveItem to fetch.
     */
    where: DriveItemWhereUniqueInput
  }

  /**
   * DriveItem findFirst
   */
  export type DriveItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    /**
     * Filter, which DriveItem to fetch.
     */
    where?: DriveItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveItems to fetch.
     */
    orderBy?: DriveItemOrderByWithRelationInput | DriveItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DriveItems.
     */
    cursor?: DriveItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriveItems.
     */
    distinct?: DriveItemScalarFieldEnum | DriveItemScalarFieldEnum[]
  }

  /**
   * DriveItem findFirstOrThrow
   */
  export type DriveItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    /**
     * Filter, which DriveItem to fetch.
     */
    where?: DriveItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveItems to fetch.
     */
    orderBy?: DriveItemOrderByWithRelationInput | DriveItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DriveItems.
     */
    cursor?: DriveItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriveItems.
     */
    distinct?: DriveItemScalarFieldEnum | DriveItemScalarFieldEnum[]
  }

  /**
   * DriveItem findMany
   */
  export type DriveItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    /**
     * Filter, which DriveItems to fetch.
     */
    where?: DriveItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveItems to fetch.
     */
    orderBy?: DriveItemOrderByWithRelationInput | DriveItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DriveItems.
     */
    cursor?: DriveItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriveItems.
     */
    distinct?: DriveItemScalarFieldEnum | DriveItemScalarFieldEnum[]
  }

  /**
   * DriveItem create
   */
  export type DriveItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    /**
     * The data needed to create a DriveItem.
     */
    data: XOR<DriveItemCreateInput, DriveItemUncheckedCreateInput>
  }

  /**
   * DriveItem createMany
   */
  export type DriveItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DriveItems.
     */
    data: DriveItemCreateManyInput | DriveItemCreateManyInput[]
  }

  /**
   * DriveItem createManyAndReturn
   */
  export type DriveItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * The data used to create many DriveItems.
     */
    data: DriveItemCreateManyInput | DriveItemCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DriveItem update
   */
  export type DriveItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    /**
     * The data needed to update a DriveItem.
     */
    data: XOR<DriveItemUpdateInput, DriveItemUncheckedUpdateInput>
    /**
     * Choose, which DriveItem to update.
     */
    where: DriveItemWhereUniqueInput
  }

  /**
   * DriveItem updateMany
   */
  export type DriveItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DriveItems.
     */
    data: XOR<DriveItemUpdateManyMutationInput, DriveItemUncheckedUpdateManyInput>
    /**
     * Filter which DriveItems to update
     */
    where?: DriveItemWhereInput
    /**
     * Limit how many DriveItems to update.
     */
    limit?: number
  }

  /**
   * DriveItem updateManyAndReturn
   */
  export type DriveItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * The data used to update DriveItems.
     */
    data: XOR<DriveItemUpdateManyMutationInput, DriveItemUncheckedUpdateManyInput>
    /**
     * Filter which DriveItems to update
     */
    where?: DriveItemWhereInput
    /**
     * Limit how many DriveItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DriveItem upsert
   */
  export type DriveItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    /**
     * The filter to search for the DriveItem to update in case it exists.
     */
    where: DriveItemWhereUniqueInput
    /**
     * In case the DriveItem found by the `where` argument doesn't exist, create a new DriveItem with this data.
     */
    create: XOR<DriveItemCreateInput, DriveItemUncheckedCreateInput>
    /**
     * In case the DriveItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DriveItemUpdateInput, DriveItemUncheckedUpdateInput>
  }

  /**
   * DriveItem delete
   */
  export type DriveItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    /**
     * Filter which DriveItem to delete.
     */
    where: DriveItemWhereUniqueInput
  }

  /**
   * DriveItem deleteMany
   */
  export type DriveItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DriveItems to delete
     */
    where?: DriveItemWhereInput
    /**
     * Limit how many DriveItems to delete.
     */
    limit?: number
  }

  /**
   * DriveItem.parent
   */
  export type DriveItem$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    where?: DriveItemWhereInput
  }

  /**
   * DriveItem.children
   */
  export type DriveItem$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
    where?: DriveItemWhereInput
    orderBy?: DriveItemOrderByWithRelationInput | DriveItemOrderByWithRelationInput[]
    cursor?: DriveItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DriveItemScalarFieldEnum | DriveItemScalarFieldEnum[]
  }

  /**
   * DriveItem.activities
   */
  export type DriveItem$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
    where?: DriveActivityWhereInput
    orderBy?: DriveActivityOrderByWithRelationInput | DriveActivityOrderByWithRelationInput[]
    cursor?: DriveActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DriveActivityScalarFieldEnum | DriveActivityScalarFieldEnum[]
  }

  /**
   * DriveItem without action
   */
  export type DriveItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveItem
     */
    select?: DriveItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveItem
     */
    omit?: DriveItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveItemInclude<ExtArgs> | null
  }


  /**
   * Model DriveActivity
   */

  export type AggregateDriveActivity = {
    _count: DriveActivityCountAggregateOutputType | null
    _min: DriveActivityMinAggregateOutputType | null
    _max: DriveActivityMaxAggregateOutputType | null
  }

  export type DriveActivityMinAggregateOutputType = {
    id: string | null
    itemId: string | null
    actor: string | null
    action: string | null
    createdAt: Date | null
  }

  export type DriveActivityMaxAggregateOutputType = {
    id: string | null
    itemId: string | null
    actor: string | null
    action: string | null
    createdAt: Date | null
  }

  export type DriveActivityCountAggregateOutputType = {
    id: number
    itemId: number
    actor: number
    action: number
    createdAt: number
    _all: number
  }


  export type DriveActivityMinAggregateInputType = {
    id?: true
    itemId?: true
    actor?: true
    action?: true
    createdAt?: true
  }

  export type DriveActivityMaxAggregateInputType = {
    id?: true
    itemId?: true
    actor?: true
    action?: true
    createdAt?: true
  }

  export type DriveActivityCountAggregateInputType = {
    id?: true
    itemId?: true
    actor?: true
    action?: true
    createdAt?: true
    _all?: true
  }

  export type DriveActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DriveActivity to aggregate.
     */
    where?: DriveActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveActivities to fetch.
     */
    orderBy?: DriveActivityOrderByWithRelationInput | DriveActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DriveActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DriveActivities
    **/
    _count?: true | DriveActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DriveActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DriveActivityMaxAggregateInputType
  }

  export type GetDriveActivityAggregateType<T extends DriveActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateDriveActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDriveActivity[P]>
      : GetScalarType<T[P], AggregateDriveActivity[P]>
  }




  export type DriveActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriveActivityWhereInput
    orderBy?: DriveActivityOrderByWithAggregationInput | DriveActivityOrderByWithAggregationInput[]
    by: DriveActivityScalarFieldEnum[] | DriveActivityScalarFieldEnum
    having?: DriveActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DriveActivityCountAggregateInputType | true
    _min?: DriveActivityMinAggregateInputType
    _max?: DriveActivityMaxAggregateInputType
  }

  export type DriveActivityGroupByOutputType = {
    id: string
    itemId: string
    actor: string
    action: string
    createdAt: Date
    _count: DriveActivityCountAggregateOutputType | null
    _min: DriveActivityMinAggregateOutputType | null
    _max: DriveActivityMaxAggregateOutputType | null
  }

  type GetDriveActivityGroupByPayload<T extends DriveActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DriveActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DriveActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DriveActivityGroupByOutputType[P]>
            : GetScalarType<T[P], DriveActivityGroupByOutputType[P]>
        }
      >
    >


  export type DriveActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemId?: boolean
    actor?: boolean
    action?: boolean
    createdAt?: boolean
    item?: boolean | DriveItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driveActivity"]>

  export type DriveActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemId?: boolean
    actor?: boolean
    action?: boolean
    createdAt?: boolean
    item?: boolean | DriveItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driveActivity"]>

  export type DriveActivitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemId?: boolean
    actor?: boolean
    action?: boolean
    createdAt?: boolean
    item?: boolean | DriveItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driveActivity"]>

  export type DriveActivitySelectScalar = {
    id?: boolean
    itemId?: boolean
    actor?: boolean
    action?: boolean
    createdAt?: boolean
  }

  export type DriveActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "itemId" | "actor" | "action" | "createdAt", ExtArgs["result"]["driveActivity"]>
  export type DriveActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item?: boolean | DriveItemDefaultArgs<ExtArgs>
  }
  export type DriveActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item?: boolean | DriveItemDefaultArgs<ExtArgs>
  }
  export type DriveActivityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item?: boolean | DriveItemDefaultArgs<ExtArgs>
  }

  export type $DriveActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DriveActivity"
    objects: {
      item: Prisma.$DriveItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      itemId: string
      actor: string
      action: string
      createdAt: Date
    }, ExtArgs["result"]["driveActivity"]>
    composites: {}
  }

  type DriveActivityGetPayload<S extends boolean | null | undefined | DriveActivityDefaultArgs> = $Result.GetResult<Prisma.$DriveActivityPayload, S>

  type DriveActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DriveActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DriveActivityCountAggregateInputType | true
    }

  export interface DriveActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DriveActivity'], meta: { name: 'DriveActivity' } }
    /**
     * Find zero or one DriveActivity that matches the filter.
     * @param {DriveActivityFindUniqueArgs} args - Arguments to find a DriveActivity
     * @example
     * // Get one DriveActivity
     * const driveActivity = await prisma.driveActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DriveActivityFindUniqueArgs>(args: SelectSubset<T, DriveActivityFindUniqueArgs<ExtArgs>>): Prisma__DriveActivityClient<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DriveActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DriveActivityFindUniqueOrThrowArgs} args - Arguments to find a DriveActivity
     * @example
     * // Get one DriveActivity
     * const driveActivity = await prisma.driveActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DriveActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, DriveActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DriveActivityClient<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DriveActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveActivityFindFirstArgs} args - Arguments to find a DriveActivity
     * @example
     * // Get one DriveActivity
     * const driveActivity = await prisma.driveActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DriveActivityFindFirstArgs>(args?: SelectSubset<T, DriveActivityFindFirstArgs<ExtArgs>>): Prisma__DriveActivityClient<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DriveActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveActivityFindFirstOrThrowArgs} args - Arguments to find a DriveActivity
     * @example
     * // Get one DriveActivity
     * const driveActivity = await prisma.driveActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DriveActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, DriveActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__DriveActivityClient<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DriveActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DriveActivities
     * const driveActivities = await prisma.driveActivity.findMany()
     * 
     * // Get first 10 DriveActivities
     * const driveActivities = await prisma.driveActivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const driveActivityWithIdOnly = await prisma.driveActivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DriveActivityFindManyArgs>(args?: SelectSubset<T, DriveActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DriveActivity.
     * @param {DriveActivityCreateArgs} args - Arguments to create a DriveActivity.
     * @example
     * // Create one DriveActivity
     * const DriveActivity = await prisma.driveActivity.create({
     *   data: {
     *     // ... data to create a DriveActivity
     *   }
     * })
     * 
     */
    create<T extends DriveActivityCreateArgs>(args: SelectSubset<T, DriveActivityCreateArgs<ExtArgs>>): Prisma__DriveActivityClient<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DriveActivities.
     * @param {DriveActivityCreateManyArgs} args - Arguments to create many DriveActivities.
     * @example
     * // Create many DriveActivities
     * const driveActivity = await prisma.driveActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DriveActivityCreateManyArgs>(args?: SelectSubset<T, DriveActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DriveActivities and returns the data saved in the database.
     * @param {DriveActivityCreateManyAndReturnArgs} args - Arguments to create many DriveActivities.
     * @example
     * // Create many DriveActivities
     * const driveActivity = await prisma.driveActivity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DriveActivities and only return the `id`
     * const driveActivityWithIdOnly = await prisma.driveActivity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DriveActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, DriveActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DriveActivity.
     * @param {DriveActivityDeleteArgs} args - Arguments to delete one DriveActivity.
     * @example
     * // Delete one DriveActivity
     * const DriveActivity = await prisma.driveActivity.delete({
     *   where: {
     *     // ... filter to delete one DriveActivity
     *   }
     * })
     * 
     */
    delete<T extends DriveActivityDeleteArgs>(args: SelectSubset<T, DriveActivityDeleteArgs<ExtArgs>>): Prisma__DriveActivityClient<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DriveActivity.
     * @param {DriveActivityUpdateArgs} args - Arguments to update one DriveActivity.
     * @example
     * // Update one DriveActivity
     * const driveActivity = await prisma.driveActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DriveActivityUpdateArgs>(args: SelectSubset<T, DriveActivityUpdateArgs<ExtArgs>>): Prisma__DriveActivityClient<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DriveActivities.
     * @param {DriveActivityDeleteManyArgs} args - Arguments to filter DriveActivities to delete.
     * @example
     * // Delete a few DriveActivities
     * const { count } = await prisma.driveActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DriveActivityDeleteManyArgs>(args?: SelectSubset<T, DriveActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DriveActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DriveActivities
     * const driveActivity = await prisma.driveActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DriveActivityUpdateManyArgs>(args: SelectSubset<T, DriveActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DriveActivities and returns the data updated in the database.
     * @param {DriveActivityUpdateManyAndReturnArgs} args - Arguments to update many DriveActivities.
     * @example
     * // Update many DriveActivities
     * const driveActivity = await prisma.driveActivity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DriveActivities and only return the `id`
     * const driveActivityWithIdOnly = await prisma.driveActivity.updateManyAndReturn({
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
    updateManyAndReturn<T extends DriveActivityUpdateManyAndReturnArgs>(args: SelectSubset<T, DriveActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DriveActivity.
     * @param {DriveActivityUpsertArgs} args - Arguments to update or create a DriveActivity.
     * @example
     * // Update or create a DriveActivity
     * const driveActivity = await prisma.driveActivity.upsert({
     *   create: {
     *     // ... data to create a DriveActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DriveActivity we want to update
     *   }
     * })
     */
    upsert<T extends DriveActivityUpsertArgs>(args: SelectSubset<T, DriveActivityUpsertArgs<ExtArgs>>): Prisma__DriveActivityClient<$Result.GetResult<Prisma.$DriveActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DriveActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveActivityCountArgs} args - Arguments to filter DriveActivities to count.
     * @example
     * // Count the number of DriveActivities
     * const count = await prisma.driveActivity.count({
     *   where: {
     *     // ... the filter for the DriveActivities we want to count
     *   }
     * })
    **/
    count<T extends DriveActivityCountArgs>(
      args?: Subset<T, DriveActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DriveActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DriveActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DriveActivityAggregateArgs>(args: Subset<T, DriveActivityAggregateArgs>): Prisma.PrismaPromise<GetDriveActivityAggregateType<T>>

    /**
     * Group by DriveActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveActivityGroupByArgs} args - Group by arguments.
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
      T extends DriveActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DriveActivityGroupByArgs['orderBy'] }
        : { orderBy?: DriveActivityGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DriveActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDriveActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DriveActivity model
   */
  readonly fields: DriveActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DriveActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DriveActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    item<T extends DriveItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DriveItemDefaultArgs<ExtArgs>>): Prisma__DriveItemClient<$Result.GetResult<Prisma.$DriveItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DriveActivity model
   */
  interface DriveActivityFieldRefs {
    readonly id: FieldRef<"DriveActivity", 'String'>
    readonly itemId: FieldRef<"DriveActivity", 'String'>
    readonly actor: FieldRef<"DriveActivity", 'String'>
    readonly action: FieldRef<"DriveActivity", 'String'>
    readonly createdAt: FieldRef<"DriveActivity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DriveActivity findUnique
   */
  export type DriveActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
    /**
     * Filter, which DriveActivity to fetch.
     */
    where: DriveActivityWhereUniqueInput
  }

  /**
   * DriveActivity findUniqueOrThrow
   */
  export type DriveActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
    /**
     * Filter, which DriveActivity to fetch.
     */
    where: DriveActivityWhereUniqueInput
  }

  /**
   * DriveActivity findFirst
   */
  export type DriveActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
    /**
     * Filter, which DriveActivity to fetch.
     */
    where?: DriveActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveActivities to fetch.
     */
    orderBy?: DriveActivityOrderByWithRelationInput | DriveActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DriveActivities.
     */
    cursor?: DriveActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriveActivities.
     */
    distinct?: DriveActivityScalarFieldEnum | DriveActivityScalarFieldEnum[]
  }

  /**
   * DriveActivity findFirstOrThrow
   */
  export type DriveActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
    /**
     * Filter, which DriveActivity to fetch.
     */
    where?: DriveActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveActivities to fetch.
     */
    orderBy?: DriveActivityOrderByWithRelationInput | DriveActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DriveActivities.
     */
    cursor?: DriveActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriveActivities.
     */
    distinct?: DriveActivityScalarFieldEnum | DriveActivityScalarFieldEnum[]
  }

  /**
   * DriveActivity findMany
   */
  export type DriveActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
    /**
     * Filter, which DriveActivities to fetch.
     */
    where?: DriveActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveActivities to fetch.
     */
    orderBy?: DriveActivityOrderByWithRelationInput | DriveActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DriveActivities.
     */
    cursor?: DriveActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriveActivities.
     */
    distinct?: DriveActivityScalarFieldEnum | DriveActivityScalarFieldEnum[]
  }

  /**
   * DriveActivity create
   */
  export type DriveActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a DriveActivity.
     */
    data: XOR<DriveActivityCreateInput, DriveActivityUncheckedCreateInput>
  }

  /**
   * DriveActivity createMany
   */
  export type DriveActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DriveActivities.
     */
    data: DriveActivityCreateManyInput | DriveActivityCreateManyInput[]
  }

  /**
   * DriveActivity createManyAndReturn
   */
  export type DriveActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * The data used to create many DriveActivities.
     */
    data: DriveActivityCreateManyInput | DriveActivityCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DriveActivity update
   */
  export type DriveActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a DriveActivity.
     */
    data: XOR<DriveActivityUpdateInput, DriveActivityUncheckedUpdateInput>
    /**
     * Choose, which DriveActivity to update.
     */
    where: DriveActivityWhereUniqueInput
  }

  /**
   * DriveActivity updateMany
   */
  export type DriveActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DriveActivities.
     */
    data: XOR<DriveActivityUpdateManyMutationInput, DriveActivityUncheckedUpdateManyInput>
    /**
     * Filter which DriveActivities to update
     */
    where?: DriveActivityWhereInput
    /**
     * Limit how many DriveActivities to update.
     */
    limit?: number
  }

  /**
   * DriveActivity updateManyAndReturn
   */
  export type DriveActivityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * The data used to update DriveActivities.
     */
    data: XOR<DriveActivityUpdateManyMutationInput, DriveActivityUncheckedUpdateManyInput>
    /**
     * Filter which DriveActivities to update
     */
    where?: DriveActivityWhereInput
    /**
     * Limit how many DriveActivities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DriveActivity upsert
   */
  export type DriveActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the DriveActivity to update in case it exists.
     */
    where: DriveActivityWhereUniqueInput
    /**
     * In case the DriveActivity found by the `where` argument doesn't exist, create a new DriveActivity with this data.
     */
    create: XOR<DriveActivityCreateInput, DriveActivityUncheckedCreateInput>
    /**
     * In case the DriveActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DriveActivityUpdateInput, DriveActivityUncheckedUpdateInput>
  }

  /**
   * DriveActivity delete
   */
  export type DriveActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
    /**
     * Filter which DriveActivity to delete.
     */
    where: DriveActivityWhereUniqueInput
  }

  /**
   * DriveActivity deleteMany
   */
  export type DriveActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DriveActivities to delete
     */
    where?: DriveActivityWhereInput
    /**
     * Limit how many DriveActivities to delete.
     */
    limit?: number
  }

  /**
   * DriveActivity without action
   */
  export type DriveActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveActivity
     */
    select?: DriveActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveActivity
     */
    omit?: DriveActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveActivityInclude<ExtArgs> | null
  }


  /**
   * Model BillingCompany
   */

  export type AggregateBillingCompany = {
    _count: BillingCompanyCountAggregateOutputType | null
    _min: BillingCompanyMinAggregateOutputType | null
    _max: BillingCompanyMaxAggregateOutputType | null
  }

  export type BillingCompanyMinAggregateOutputType = {
    id: string | null
    name: string | null
    orgNumber: string | null
    vatNumber: string | null
    email: string | null
    phone: string | null
    address: string | null
    postalCode: string | null
    city: string | null
    bank: string | null
    iban: string | null
    bankgiro: string | null
    logoDataUrl: string | null
    fSkatt: boolean | null
    isDefault: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingCompanyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    orgNumber: string | null
    vatNumber: string | null
    email: string | null
    phone: string | null
    address: string | null
    postalCode: string | null
    city: string | null
    bank: string | null
    iban: string | null
    bankgiro: string | null
    logoDataUrl: string | null
    fSkatt: boolean | null
    isDefault: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingCompanyCountAggregateOutputType = {
    id: number
    name: number
    orgNumber: number
    vatNumber: number
    email: number
    phone: number
    address: number
    postalCode: number
    city: number
    bank: number
    iban: number
    bankgiro: number
    logoDataUrl: number
    fSkatt: number
    isDefault: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BillingCompanyMinAggregateInputType = {
    id?: true
    name?: true
    orgNumber?: true
    vatNumber?: true
    email?: true
    phone?: true
    address?: true
    postalCode?: true
    city?: true
    bank?: true
    iban?: true
    bankgiro?: true
    logoDataUrl?: true
    fSkatt?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingCompanyMaxAggregateInputType = {
    id?: true
    name?: true
    orgNumber?: true
    vatNumber?: true
    email?: true
    phone?: true
    address?: true
    postalCode?: true
    city?: true
    bank?: true
    iban?: true
    bankgiro?: true
    logoDataUrl?: true
    fSkatt?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingCompanyCountAggregateInputType = {
    id?: true
    name?: true
    orgNumber?: true
    vatNumber?: true
    email?: true
    phone?: true
    address?: true
    postalCode?: true
    city?: true
    bank?: true
    iban?: true
    bankgiro?: true
    logoDataUrl?: true
    fSkatt?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BillingCompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingCompany to aggregate.
     */
    where?: BillingCompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCompanies to fetch.
     */
    orderBy?: BillingCompanyOrderByWithRelationInput | BillingCompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingCompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCompanies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingCompanies
    **/
    _count?: true | BillingCompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingCompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingCompanyMaxAggregateInputType
  }

  export type GetBillingCompanyAggregateType<T extends BillingCompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingCompany[P]>
      : GetScalarType<T[P], AggregateBillingCompany[P]>
  }




  export type BillingCompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingCompanyWhereInput
    orderBy?: BillingCompanyOrderByWithAggregationInput | BillingCompanyOrderByWithAggregationInput[]
    by: BillingCompanyScalarFieldEnum[] | BillingCompanyScalarFieldEnum
    having?: BillingCompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingCompanyCountAggregateInputType | true
    _min?: BillingCompanyMinAggregateInputType
    _max?: BillingCompanyMaxAggregateInputType
  }

  export type BillingCompanyGroupByOutputType = {
    id: string
    name: string
    orgNumber: string | null
    vatNumber: string | null
    email: string | null
    phone: string | null
    address: string | null
    postalCode: string | null
    city: string | null
    bank: string | null
    iban: string | null
    bankgiro: string | null
    logoDataUrl: string | null
    fSkatt: boolean
    isDefault: boolean
    createdAt: Date
    updatedAt: Date
    _count: BillingCompanyCountAggregateOutputType | null
    _min: BillingCompanyMinAggregateOutputType | null
    _max: BillingCompanyMaxAggregateOutputType | null
  }

  type GetBillingCompanyGroupByPayload<T extends BillingCompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingCompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingCompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingCompanyGroupByOutputType[P]>
            : GetScalarType<T[P], BillingCompanyGroupByOutputType[P]>
        }
      >
    >


  export type BillingCompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    orgNumber?: boolean
    vatNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    postalCode?: boolean
    city?: boolean
    bank?: boolean
    iban?: boolean
    bankgiro?: boolean
    logoDataUrl?: boolean
    fSkatt?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoices?: boolean | BillingCompany$invoicesArgs<ExtArgs>
    _count?: boolean | BillingCompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingCompany"]>

  export type BillingCompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    orgNumber?: boolean
    vatNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    postalCode?: boolean
    city?: boolean
    bank?: boolean
    iban?: boolean
    bankgiro?: boolean
    logoDataUrl?: boolean
    fSkatt?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["billingCompany"]>

  export type BillingCompanySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    orgNumber?: boolean
    vatNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    postalCode?: boolean
    city?: boolean
    bank?: boolean
    iban?: boolean
    bankgiro?: boolean
    logoDataUrl?: boolean
    fSkatt?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["billingCompany"]>

  export type BillingCompanySelectScalar = {
    id?: boolean
    name?: boolean
    orgNumber?: boolean
    vatNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    postalCode?: boolean
    city?: boolean
    bank?: boolean
    iban?: boolean
    bankgiro?: boolean
    logoDataUrl?: boolean
    fSkatt?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BillingCompanyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "orgNumber" | "vatNumber" | "email" | "phone" | "address" | "postalCode" | "city" | "bank" | "iban" | "bankgiro" | "logoDataUrl" | "fSkatt" | "isDefault" | "createdAt" | "updatedAt", ExtArgs["result"]["billingCompany"]>
  export type BillingCompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | BillingCompany$invoicesArgs<ExtArgs>
    _count?: boolean | BillingCompanyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BillingCompanyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BillingCompanyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BillingCompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingCompany"
    objects: {
      invoices: Prisma.$BillingInvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      orgNumber: string | null
      vatNumber: string | null
      email: string | null
      phone: string | null
      address: string | null
      postalCode: string | null
      city: string | null
      bank: string | null
      iban: string | null
      bankgiro: string | null
      logoDataUrl: string | null
      fSkatt: boolean
      isDefault: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["billingCompany"]>
    composites: {}
  }

  type BillingCompanyGetPayload<S extends boolean | null | undefined | BillingCompanyDefaultArgs> = $Result.GetResult<Prisma.$BillingCompanyPayload, S>

  type BillingCompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BillingCompanyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BillingCompanyCountAggregateInputType | true
    }

  export interface BillingCompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingCompany'], meta: { name: 'BillingCompany' } }
    /**
     * Find zero or one BillingCompany that matches the filter.
     * @param {BillingCompanyFindUniqueArgs} args - Arguments to find a BillingCompany
     * @example
     * // Get one BillingCompany
     * const billingCompany = await prisma.billingCompany.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingCompanyFindUniqueArgs>(args: SelectSubset<T, BillingCompanyFindUniqueArgs<ExtArgs>>): Prisma__BillingCompanyClient<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BillingCompany that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BillingCompanyFindUniqueOrThrowArgs} args - Arguments to find a BillingCompany
     * @example
     * // Get one BillingCompany
     * const billingCompany = await prisma.billingCompany.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingCompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingCompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingCompanyClient<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingCompany that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCompanyFindFirstArgs} args - Arguments to find a BillingCompany
     * @example
     * // Get one BillingCompany
     * const billingCompany = await prisma.billingCompany.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingCompanyFindFirstArgs>(args?: SelectSubset<T, BillingCompanyFindFirstArgs<ExtArgs>>): Prisma__BillingCompanyClient<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingCompany that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCompanyFindFirstOrThrowArgs} args - Arguments to find a BillingCompany
     * @example
     * // Get one BillingCompany
     * const billingCompany = await prisma.billingCompany.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingCompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingCompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingCompanyClient<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BillingCompanies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingCompanies
     * const billingCompanies = await prisma.billingCompany.findMany()
     * 
     * // Get first 10 BillingCompanies
     * const billingCompanies = await prisma.billingCompany.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingCompanyWithIdOnly = await prisma.billingCompany.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingCompanyFindManyArgs>(args?: SelectSubset<T, BillingCompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BillingCompany.
     * @param {BillingCompanyCreateArgs} args - Arguments to create a BillingCompany.
     * @example
     * // Create one BillingCompany
     * const BillingCompany = await prisma.billingCompany.create({
     *   data: {
     *     // ... data to create a BillingCompany
     *   }
     * })
     * 
     */
    create<T extends BillingCompanyCreateArgs>(args: SelectSubset<T, BillingCompanyCreateArgs<ExtArgs>>): Prisma__BillingCompanyClient<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BillingCompanies.
     * @param {BillingCompanyCreateManyArgs} args - Arguments to create many BillingCompanies.
     * @example
     * // Create many BillingCompanies
     * const billingCompany = await prisma.billingCompany.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingCompanyCreateManyArgs>(args?: SelectSubset<T, BillingCompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingCompanies and returns the data saved in the database.
     * @param {BillingCompanyCreateManyAndReturnArgs} args - Arguments to create many BillingCompanies.
     * @example
     * // Create many BillingCompanies
     * const billingCompany = await prisma.billingCompany.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingCompanies and only return the `id`
     * const billingCompanyWithIdOnly = await prisma.billingCompany.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingCompanyCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingCompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BillingCompany.
     * @param {BillingCompanyDeleteArgs} args - Arguments to delete one BillingCompany.
     * @example
     * // Delete one BillingCompany
     * const BillingCompany = await prisma.billingCompany.delete({
     *   where: {
     *     // ... filter to delete one BillingCompany
     *   }
     * })
     * 
     */
    delete<T extends BillingCompanyDeleteArgs>(args: SelectSubset<T, BillingCompanyDeleteArgs<ExtArgs>>): Prisma__BillingCompanyClient<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BillingCompany.
     * @param {BillingCompanyUpdateArgs} args - Arguments to update one BillingCompany.
     * @example
     * // Update one BillingCompany
     * const billingCompany = await prisma.billingCompany.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingCompanyUpdateArgs>(args: SelectSubset<T, BillingCompanyUpdateArgs<ExtArgs>>): Prisma__BillingCompanyClient<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BillingCompanies.
     * @param {BillingCompanyDeleteManyArgs} args - Arguments to filter BillingCompanies to delete.
     * @example
     * // Delete a few BillingCompanies
     * const { count } = await prisma.billingCompany.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingCompanyDeleteManyArgs>(args?: SelectSubset<T, BillingCompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingCompanies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingCompanies
     * const billingCompany = await prisma.billingCompany.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingCompanyUpdateManyArgs>(args: SelectSubset<T, BillingCompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingCompanies and returns the data updated in the database.
     * @param {BillingCompanyUpdateManyAndReturnArgs} args - Arguments to update many BillingCompanies.
     * @example
     * // Update many BillingCompanies
     * const billingCompany = await prisma.billingCompany.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BillingCompanies and only return the `id`
     * const billingCompanyWithIdOnly = await prisma.billingCompany.updateManyAndReturn({
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
    updateManyAndReturn<T extends BillingCompanyUpdateManyAndReturnArgs>(args: SelectSubset<T, BillingCompanyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BillingCompany.
     * @param {BillingCompanyUpsertArgs} args - Arguments to update or create a BillingCompany.
     * @example
     * // Update or create a BillingCompany
     * const billingCompany = await prisma.billingCompany.upsert({
     *   create: {
     *     // ... data to create a BillingCompany
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingCompany we want to update
     *   }
     * })
     */
    upsert<T extends BillingCompanyUpsertArgs>(args: SelectSubset<T, BillingCompanyUpsertArgs<ExtArgs>>): Prisma__BillingCompanyClient<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BillingCompanies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCompanyCountArgs} args - Arguments to filter BillingCompanies to count.
     * @example
     * // Count the number of BillingCompanies
     * const count = await prisma.billingCompany.count({
     *   where: {
     *     // ... the filter for the BillingCompanies we want to count
     *   }
     * })
    **/
    count<T extends BillingCompanyCountArgs>(
      args?: Subset<T, BillingCompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingCompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingCompany.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BillingCompanyAggregateArgs>(args: Subset<T, BillingCompanyAggregateArgs>): Prisma.PrismaPromise<GetBillingCompanyAggregateType<T>>

    /**
     * Group by BillingCompany.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCompanyGroupByArgs} args - Group by arguments.
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
      T extends BillingCompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingCompanyGroupByArgs['orderBy'] }
        : { orderBy?: BillingCompanyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BillingCompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingCompany model
   */
  readonly fields: BillingCompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingCompany.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingCompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoices<T extends BillingCompany$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, BillingCompany$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the BillingCompany model
   */
  interface BillingCompanyFieldRefs {
    readonly id: FieldRef<"BillingCompany", 'String'>
    readonly name: FieldRef<"BillingCompany", 'String'>
    readonly orgNumber: FieldRef<"BillingCompany", 'String'>
    readonly vatNumber: FieldRef<"BillingCompany", 'String'>
    readonly email: FieldRef<"BillingCompany", 'String'>
    readonly phone: FieldRef<"BillingCompany", 'String'>
    readonly address: FieldRef<"BillingCompany", 'String'>
    readonly postalCode: FieldRef<"BillingCompany", 'String'>
    readonly city: FieldRef<"BillingCompany", 'String'>
    readonly bank: FieldRef<"BillingCompany", 'String'>
    readonly iban: FieldRef<"BillingCompany", 'String'>
    readonly bankgiro: FieldRef<"BillingCompany", 'String'>
    readonly logoDataUrl: FieldRef<"BillingCompany", 'String'>
    readonly fSkatt: FieldRef<"BillingCompany", 'Boolean'>
    readonly isDefault: FieldRef<"BillingCompany", 'Boolean'>
    readonly createdAt: FieldRef<"BillingCompany", 'DateTime'>
    readonly updatedAt: FieldRef<"BillingCompany", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingCompany findUnique
   */
  export type BillingCompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCompanyInclude<ExtArgs> | null
    /**
     * Filter, which BillingCompany to fetch.
     */
    where: BillingCompanyWhereUniqueInput
  }

  /**
   * BillingCompany findUniqueOrThrow
   */
  export type BillingCompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCompanyInclude<ExtArgs> | null
    /**
     * Filter, which BillingCompany to fetch.
     */
    where: BillingCompanyWhereUniqueInput
  }

  /**
   * BillingCompany findFirst
   */
  export type BillingCompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCompanyInclude<ExtArgs> | null
    /**
     * Filter, which BillingCompany to fetch.
     */
    where?: BillingCompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCompanies to fetch.
     */
    orderBy?: BillingCompanyOrderByWithRelationInput | BillingCompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingCompanies.
     */
    cursor?: BillingCompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCompanies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingCompanies.
     */
    distinct?: BillingCompanyScalarFieldEnum | BillingCompanyScalarFieldEnum[]
  }

  /**
   * BillingCompany findFirstOrThrow
   */
  export type BillingCompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCompanyInclude<ExtArgs> | null
    /**
     * Filter, which BillingCompany to fetch.
     */
    where?: BillingCompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCompanies to fetch.
     */
    orderBy?: BillingCompanyOrderByWithRelationInput | BillingCompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingCompanies.
     */
    cursor?: BillingCompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCompanies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingCompanies.
     */
    distinct?: BillingCompanyScalarFieldEnum | BillingCompanyScalarFieldEnum[]
  }

  /**
   * BillingCompany findMany
   */
  export type BillingCompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCompanyInclude<ExtArgs> | null
    /**
     * Filter, which BillingCompanies to fetch.
     */
    where?: BillingCompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCompanies to fetch.
     */
    orderBy?: BillingCompanyOrderByWithRelationInput | BillingCompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingCompanies.
     */
    cursor?: BillingCompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCompanies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingCompanies.
     */
    distinct?: BillingCompanyScalarFieldEnum | BillingCompanyScalarFieldEnum[]
  }

  /**
   * BillingCompany create
   */
  export type BillingCompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingCompany.
     */
    data: XOR<BillingCompanyCreateInput, BillingCompanyUncheckedCreateInput>
  }

  /**
   * BillingCompany createMany
   */
  export type BillingCompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingCompanies.
     */
    data: BillingCompanyCreateManyInput | BillingCompanyCreateManyInput[]
  }

  /**
   * BillingCompany createManyAndReturn
   */
  export type BillingCompanyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * The data used to create many BillingCompanies.
     */
    data: BillingCompanyCreateManyInput | BillingCompanyCreateManyInput[]
  }

  /**
   * BillingCompany update
   */
  export type BillingCompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingCompany.
     */
    data: XOR<BillingCompanyUpdateInput, BillingCompanyUncheckedUpdateInput>
    /**
     * Choose, which BillingCompany to update.
     */
    where: BillingCompanyWhereUniqueInput
  }

  /**
   * BillingCompany updateMany
   */
  export type BillingCompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingCompanies.
     */
    data: XOR<BillingCompanyUpdateManyMutationInput, BillingCompanyUncheckedUpdateManyInput>
    /**
     * Filter which BillingCompanies to update
     */
    where?: BillingCompanyWhereInput
    /**
     * Limit how many BillingCompanies to update.
     */
    limit?: number
  }

  /**
   * BillingCompany updateManyAndReturn
   */
  export type BillingCompanyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * The data used to update BillingCompanies.
     */
    data: XOR<BillingCompanyUpdateManyMutationInput, BillingCompanyUncheckedUpdateManyInput>
    /**
     * Filter which BillingCompanies to update
     */
    where?: BillingCompanyWhereInput
    /**
     * Limit how many BillingCompanies to update.
     */
    limit?: number
  }

  /**
   * BillingCompany upsert
   */
  export type BillingCompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingCompany to update in case it exists.
     */
    where: BillingCompanyWhereUniqueInput
    /**
     * In case the BillingCompany found by the `where` argument doesn't exist, create a new BillingCompany with this data.
     */
    create: XOR<BillingCompanyCreateInput, BillingCompanyUncheckedCreateInput>
    /**
     * In case the BillingCompany was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingCompanyUpdateInput, BillingCompanyUncheckedUpdateInput>
  }

  /**
   * BillingCompany delete
   */
  export type BillingCompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCompanyInclude<ExtArgs> | null
    /**
     * Filter which BillingCompany to delete.
     */
    where: BillingCompanyWhereUniqueInput
  }

  /**
   * BillingCompany deleteMany
   */
  export type BillingCompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingCompanies to delete
     */
    where?: BillingCompanyWhereInput
    /**
     * Limit how many BillingCompanies to delete.
     */
    limit?: number
  }

  /**
   * BillingCompany.invoices
   */
  export type BillingCompany$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    cursor?: BillingInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingCompany without action
   */
  export type BillingCompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCompany
     */
    select?: BillingCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCompany
     */
    omit?: BillingCompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCompanyInclude<ExtArgs> | null
  }


  /**
   * Model BillingCustomer
   */

  export type AggregateBillingCustomer = {
    _count: BillingCustomerCountAggregateOutputType | null
    _min: BillingCustomerMinAggregateOutputType | null
    _max: BillingCustomerMaxAggregateOutputType | null
  }

  export type BillingCustomerMinAggregateOutputType = {
    id: string | null
    name: string | null
    orgNumber: string | null
    email: string | null
    phone: string | null
    address: string | null
    postalCode: string | null
    city: string | null
    contactPerson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingCustomerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    orgNumber: string | null
    email: string | null
    phone: string | null
    address: string | null
    postalCode: string | null
    city: string | null
    contactPerson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingCustomerCountAggregateOutputType = {
    id: number
    name: number
    orgNumber: number
    email: number
    phone: number
    address: number
    postalCode: number
    city: number
    contactPerson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BillingCustomerMinAggregateInputType = {
    id?: true
    name?: true
    orgNumber?: true
    email?: true
    phone?: true
    address?: true
    postalCode?: true
    city?: true
    contactPerson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingCustomerMaxAggregateInputType = {
    id?: true
    name?: true
    orgNumber?: true
    email?: true
    phone?: true
    address?: true
    postalCode?: true
    city?: true
    contactPerson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingCustomerCountAggregateInputType = {
    id?: true
    name?: true
    orgNumber?: true
    email?: true
    phone?: true
    address?: true
    postalCode?: true
    city?: true
    contactPerson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BillingCustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingCustomer to aggregate.
     */
    where?: BillingCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCustomers to fetch.
     */
    orderBy?: BillingCustomerOrderByWithRelationInput | BillingCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingCustomers
    **/
    _count?: true | BillingCustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingCustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingCustomerMaxAggregateInputType
  }

  export type GetBillingCustomerAggregateType<T extends BillingCustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingCustomer[P]>
      : GetScalarType<T[P], AggregateBillingCustomer[P]>
  }




  export type BillingCustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingCustomerWhereInput
    orderBy?: BillingCustomerOrderByWithAggregationInput | BillingCustomerOrderByWithAggregationInput[]
    by: BillingCustomerScalarFieldEnum[] | BillingCustomerScalarFieldEnum
    having?: BillingCustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingCustomerCountAggregateInputType | true
    _min?: BillingCustomerMinAggregateInputType
    _max?: BillingCustomerMaxAggregateInputType
  }

  export type BillingCustomerGroupByOutputType = {
    id: string
    name: string
    orgNumber: string | null
    email: string | null
    phone: string | null
    address: string | null
    postalCode: string | null
    city: string | null
    contactPerson: string | null
    createdAt: Date
    updatedAt: Date
    _count: BillingCustomerCountAggregateOutputType | null
    _min: BillingCustomerMinAggregateOutputType | null
    _max: BillingCustomerMaxAggregateOutputType | null
  }

  type GetBillingCustomerGroupByPayload<T extends BillingCustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingCustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingCustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingCustomerGroupByOutputType[P]>
            : GetScalarType<T[P], BillingCustomerGroupByOutputType[P]>
        }
      >
    >


  export type BillingCustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    orgNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    postalCode?: boolean
    city?: boolean
    contactPerson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoices?: boolean | BillingCustomer$invoicesArgs<ExtArgs>
    _count?: boolean | BillingCustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingCustomer"]>

  export type BillingCustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    orgNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    postalCode?: boolean
    city?: boolean
    contactPerson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["billingCustomer"]>

  export type BillingCustomerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    orgNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    postalCode?: boolean
    city?: boolean
    contactPerson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["billingCustomer"]>

  export type BillingCustomerSelectScalar = {
    id?: boolean
    name?: boolean
    orgNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    postalCode?: boolean
    city?: boolean
    contactPerson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BillingCustomerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "orgNumber" | "email" | "phone" | "address" | "postalCode" | "city" | "contactPerson" | "createdAt" | "updatedAt", ExtArgs["result"]["billingCustomer"]>
  export type BillingCustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | BillingCustomer$invoicesArgs<ExtArgs>
    _count?: boolean | BillingCustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BillingCustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BillingCustomerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BillingCustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingCustomer"
    objects: {
      invoices: Prisma.$BillingInvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      orgNumber: string | null
      email: string | null
      phone: string | null
      address: string | null
      postalCode: string | null
      city: string | null
      contactPerson: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["billingCustomer"]>
    composites: {}
  }

  type BillingCustomerGetPayload<S extends boolean | null | undefined | BillingCustomerDefaultArgs> = $Result.GetResult<Prisma.$BillingCustomerPayload, S>

  type BillingCustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BillingCustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BillingCustomerCountAggregateInputType | true
    }

  export interface BillingCustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingCustomer'], meta: { name: 'BillingCustomer' } }
    /**
     * Find zero or one BillingCustomer that matches the filter.
     * @param {BillingCustomerFindUniqueArgs} args - Arguments to find a BillingCustomer
     * @example
     * // Get one BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingCustomerFindUniqueArgs>(args: SelectSubset<T, BillingCustomerFindUniqueArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BillingCustomer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BillingCustomerFindUniqueOrThrowArgs} args - Arguments to find a BillingCustomer
     * @example
     * // Get one BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingCustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingCustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingCustomer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerFindFirstArgs} args - Arguments to find a BillingCustomer
     * @example
     * // Get one BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingCustomerFindFirstArgs>(args?: SelectSubset<T, BillingCustomerFindFirstArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingCustomer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerFindFirstOrThrowArgs} args - Arguments to find a BillingCustomer
     * @example
     * // Get one BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingCustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingCustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BillingCustomers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingCustomers
     * const billingCustomers = await prisma.billingCustomer.findMany()
     * 
     * // Get first 10 BillingCustomers
     * const billingCustomers = await prisma.billingCustomer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingCustomerWithIdOnly = await prisma.billingCustomer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingCustomerFindManyArgs>(args?: SelectSubset<T, BillingCustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BillingCustomer.
     * @param {BillingCustomerCreateArgs} args - Arguments to create a BillingCustomer.
     * @example
     * // Create one BillingCustomer
     * const BillingCustomer = await prisma.billingCustomer.create({
     *   data: {
     *     // ... data to create a BillingCustomer
     *   }
     * })
     * 
     */
    create<T extends BillingCustomerCreateArgs>(args: SelectSubset<T, BillingCustomerCreateArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BillingCustomers.
     * @param {BillingCustomerCreateManyArgs} args - Arguments to create many BillingCustomers.
     * @example
     * // Create many BillingCustomers
     * const billingCustomer = await prisma.billingCustomer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingCustomerCreateManyArgs>(args?: SelectSubset<T, BillingCustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingCustomers and returns the data saved in the database.
     * @param {BillingCustomerCreateManyAndReturnArgs} args - Arguments to create many BillingCustomers.
     * @example
     * // Create many BillingCustomers
     * const billingCustomer = await prisma.billingCustomer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingCustomers and only return the `id`
     * const billingCustomerWithIdOnly = await prisma.billingCustomer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingCustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingCustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BillingCustomer.
     * @param {BillingCustomerDeleteArgs} args - Arguments to delete one BillingCustomer.
     * @example
     * // Delete one BillingCustomer
     * const BillingCustomer = await prisma.billingCustomer.delete({
     *   where: {
     *     // ... filter to delete one BillingCustomer
     *   }
     * })
     * 
     */
    delete<T extends BillingCustomerDeleteArgs>(args: SelectSubset<T, BillingCustomerDeleteArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BillingCustomer.
     * @param {BillingCustomerUpdateArgs} args - Arguments to update one BillingCustomer.
     * @example
     * // Update one BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingCustomerUpdateArgs>(args: SelectSubset<T, BillingCustomerUpdateArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BillingCustomers.
     * @param {BillingCustomerDeleteManyArgs} args - Arguments to filter BillingCustomers to delete.
     * @example
     * // Delete a few BillingCustomers
     * const { count } = await prisma.billingCustomer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingCustomerDeleteManyArgs>(args?: SelectSubset<T, BillingCustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingCustomers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingCustomers
     * const billingCustomer = await prisma.billingCustomer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingCustomerUpdateManyArgs>(args: SelectSubset<T, BillingCustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingCustomers and returns the data updated in the database.
     * @param {BillingCustomerUpdateManyAndReturnArgs} args - Arguments to update many BillingCustomers.
     * @example
     * // Update many BillingCustomers
     * const billingCustomer = await prisma.billingCustomer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BillingCustomers and only return the `id`
     * const billingCustomerWithIdOnly = await prisma.billingCustomer.updateManyAndReturn({
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
    updateManyAndReturn<T extends BillingCustomerUpdateManyAndReturnArgs>(args: SelectSubset<T, BillingCustomerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BillingCustomer.
     * @param {BillingCustomerUpsertArgs} args - Arguments to update or create a BillingCustomer.
     * @example
     * // Update or create a BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.upsert({
     *   create: {
     *     // ... data to create a BillingCustomer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingCustomer we want to update
     *   }
     * })
     */
    upsert<T extends BillingCustomerUpsertArgs>(args: SelectSubset<T, BillingCustomerUpsertArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BillingCustomers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerCountArgs} args - Arguments to filter BillingCustomers to count.
     * @example
     * // Count the number of BillingCustomers
     * const count = await prisma.billingCustomer.count({
     *   where: {
     *     // ... the filter for the BillingCustomers we want to count
     *   }
     * })
    **/
    count<T extends BillingCustomerCountArgs>(
      args?: Subset<T, BillingCustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingCustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingCustomer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BillingCustomerAggregateArgs>(args: Subset<T, BillingCustomerAggregateArgs>): Prisma.PrismaPromise<GetBillingCustomerAggregateType<T>>

    /**
     * Group by BillingCustomer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerGroupByArgs} args - Group by arguments.
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
      T extends BillingCustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingCustomerGroupByArgs['orderBy'] }
        : { orderBy?: BillingCustomerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BillingCustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingCustomer model
   */
  readonly fields: BillingCustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingCustomer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingCustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoices<T extends BillingCustomer$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, BillingCustomer$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the BillingCustomer model
   */
  interface BillingCustomerFieldRefs {
    readonly id: FieldRef<"BillingCustomer", 'String'>
    readonly name: FieldRef<"BillingCustomer", 'String'>
    readonly orgNumber: FieldRef<"BillingCustomer", 'String'>
    readonly email: FieldRef<"BillingCustomer", 'String'>
    readonly phone: FieldRef<"BillingCustomer", 'String'>
    readonly address: FieldRef<"BillingCustomer", 'String'>
    readonly postalCode: FieldRef<"BillingCustomer", 'String'>
    readonly city: FieldRef<"BillingCustomer", 'String'>
    readonly contactPerson: FieldRef<"BillingCustomer", 'String'>
    readonly createdAt: FieldRef<"BillingCustomer", 'DateTime'>
    readonly updatedAt: FieldRef<"BillingCustomer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingCustomer findUnique
   */
  export type BillingCustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter, which BillingCustomer to fetch.
     */
    where: BillingCustomerWhereUniqueInput
  }

  /**
   * BillingCustomer findUniqueOrThrow
   */
  export type BillingCustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter, which BillingCustomer to fetch.
     */
    where: BillingCustomerWhereUniqueInput
  }

  /**
   * BillingCustomer findFirst
   */
  export type BillingCustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter, which BillingCustomer to fetch.
     */
    where?: BillingCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCustomers to fetch.
     */
    orderBy?: BillingCustomerOrderByWithRelationInput | BillingCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingCustomers.
     */
    cursor?: BillingCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingCustomers.
     */
    distinct?: BillingCustomerScalarFieldEnum | BillingCustomerScalarFieldEnum[]
  }

  /**
   * BillingCustomer findFirstOrThrow
   */
  export type BillingCustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter, which BillingCustomer to fetch.
     */
    where?: BillingCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCustomers to fetch.
     */
    orderBy?: BillingCustomerOrderByWithRelationInput | BillingCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingCustomers.
     */
    cursor?: BillingCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingCustomers.
     */
    distinct?: BillingCustomerScalarFieldEnum | BillingCustomerScalarFieldEnum[]
  }

  /**
   * BillingCustomer findMany
   */
  export type BillingCustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter, which BillingCustomers to fetch.
     */
    where?: BillingCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCustomers to fetch.
     */
    orderBy?: BillingCustomerOrderByWithRelationInput | BillingCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingCustomers.
     */
    cursor?: BillingCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingCustomers.
     */
    distinct?: BillingCustomerScalarFieldEnum | BillingCustomerScalarFieldEnum[]
  }

  /**
   * BillingCustomer create
   */
  export type BillingCustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingCustomer.
     */
    data: XOR<BillingCustomerCreateInput, BillingCustomerUncheckedCreateInput>
  }

  /**
   * BillingCustomer createMany
   */
  export type BillingCustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingCustomers.
     */
    data: BillingCustomerCreateManyInput | BillingCustomerCreateManyInput[]
  }

  /**
   * BillingCustomer createManyAndReturn
   */
  export type BillingCustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * The data used to create many BillingCustomers.
     */
    data: BillingCustomerCreateManyInput | BillingCustomerCreateManyInput[]
  }

  /**
   * BillingCustomer update
   */
  export type BillingCustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingCustomer.
     */
    data: XOR<BillingCustomerUpdateInput, BillingCustomerUncheckedUpdateInput>
    /**
     * Choose, which BillingCustomer to update.
     */
    where: BillingCustomerWhereUniqueInput
  }

  /**
   * BillingCustomer updateMany
   */
  export type BillingCustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingCustomers.
     */
    data: XOR<BillingCustomerUpdateManyMutationInput, BillingCustomerUncheckedUpdateManyInput>
    /**
     * Filter which BillingCustomers to update
     */
    where?: BillingCustomerWhereInput
    /**
     * Limit how many BillingCustomers to update.
     */
    limit?: number
  }

  /**
   * BillingCustomer updateManyAndReturn
   */
  export type BillingCustomerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * The data used to update BillingCustomers.
     */
    data: XOR<BillingCustomerUpdateManyMutationInput, BillingCustomerUncheckedUpdateManyInput>
    /**
     * Filter which BillingCustomers to update
     */
    where?: BillingCustomerWhereInput
    /**
     * Limit how many BillingCustomers to update.
     */
    limit?: number
  }

  /**
   * BillingCustomer upsert
   */
  export type BillingCustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingCustomer to update in case it exists.
     */
    where: BillingCustomerWhereUniqueInput
    /**
     * In case the BillingCustomer found by the `where` argument doesn't exist, create a new BillingCustomer with this data.
     */
    create: XOR<BillingCustomerCreateInput, BillingCustomerUncheckedCreateInput>
    /**
     * In case the BillingCustomer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingCustomerUpdateInput, BillingCustomerUncheckedUpdateInput>
  }

  /**
   * BillingCustomer delete
   */
  export type BillingCustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter which BillingCustomer to delete.
     */
    where: BillingCustomerWhereUniqueInput
  }

  /**
   * BillingCustomer deleteMany
   */
  export type BillingCustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingCustomers to delete
     */
    where?: BillingCustomerWhereInput
    /**
     * Limit how many BillingCustomers to delete.
     */
    limit?: number
  }

  /**
   * BillingCustomer.invoices
   */
  export type BillingCustomer$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    cursor?: BillingInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingCustomer without action
   */
  export type BillingCustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
  }


  /**
   * Model BillingInvoice
   */

  export type AggregateBillingInvoice = {
    _count: BillingInvoiceCountAggregateOutputType | null
    _avg: BillingInvoiceAvgAggregateOutputType | null
    _sum: BillingInvoiceSumAggregateOutputType | null
    _min: BillingInvoiceMinAggregateOutputType | null
    _max: BillingInvoiceMaxAggregateOutputType | null
  }

  export type BillingInvoiceAvgAggregateOutputType = {
    vatRate: number | null
    paymentTermsDays: number | null
  }

  export type BillingInvoiceSumAggregateOutputType = {
    vatRate: number | null
    paymentTermsDays: number | null
  }

  export type BillingInvoiceMinAggregateOutputType = {
    id: string | null
    companyId: string | null
    customerId: string | null
    customerName: string | null
    customerOrgNumber: string | null
    customerEmail: string | null
    customerPhone: string | null
    customerAddress: string | null
    customerPostalCode: string | null
    customerCity: string | null
    customerContactPerson: string | null
    status: string | null
    vatRate: number | null
    currency: string | null
    dueDate: string | null
    issuedDate: string | null
    paidDate: string | null
    paymentTermsDays: number | null
    notes: string | null
    theirReference: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingInvoiceMaxAggregateOutputType = {
    id: string | null
    companyId: string | null
    customerId: string | null
    customerName: string | null
    customerOrgNumber: string | null
    customerEmail: string | null
    customerPhone: string | null
    customerAddress: string | null
    customerPostalCode: string | null
    customerCity: string | null
    customerContactPerson: string | null
    status: string | null
    vatRate: number | null
    currency: string | null
    dueDate: string | null
    issuedDate: string | null
    paidDate: string | null
    paymentTermsDays: number | null
    notes: string | null
    theirReference: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingInvoiceCountAggregateOutputType = {
    id: number
    companyId: number
    customerId: number
    customerName: number
    customerOrgNumber: number
    customerEmail: number
    customerPhone: number
    customerAddress: number
    customerPostalCode: number
    customerCity: number
    customerContactPerson: number
    status: number
    vatRate: number
    currency: number
    dueDate: number
    issuedDate: number
    paidDate: number
    paymentTermsDays: number
    notes: number
    theirReference: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BillingInvoiceAvgAggregateInputType = {
    vatRate?: true
    paymentTermsDays?: true
  }

  export type BillingInvoiceSumAggregateInputType = {
    vatRate?: true
    paymentTermsDays?: true
  }

  export type BillingInvoiceMinAggregateInputType = {
    id?: true
    companyId?: true
    customerId?: true
    customerName?: true
    customerOrgNumber?: true
    customerEmail?: true
    customerPhone?: true
    customerAddress?: true
    customerPostalCode?: true
    customerCity?: true
    customerContactPerson?: true
    status?: true
    vatRate?: true
    currency?: true
    dueDate?: true
    issuedDate?: true
    paidDate?: true
    paymentTermsDays?: true
    notes?: true
    theirReference?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingInvoiceMaxAggregateInputType = {
    id?: true
    companyId?: true
    customerId?: true
    customerName?: true
    customerOrgNumber?: true
    customerEmail?: true
    customerPhone?: true
    customerAddress?: true
    customerPostalCode?: true
    customerCity?: true
    customerContactPerson?: true
    status?: true
    vatRate?: true
    currency?: true
    dueDate?: true
    issuedDate?: true
    paidDate?: true
    paymentTermsDays?: true
    notes?: true
    theirReference?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingInvoiceCountAggregateInputType = {
    id?: true
    companyId?: true
    customerId?: true
    customerName?: true
    customerOrgNumber?: true
    customerEmail?: true
    customerPhone?: true
    customerAddress?: true
    customerPostalCode?: true
    customerCity?: true
    customerContactPerson?: true
    status?: true
    vatRate?: true
    currency?: true
    dueDate?: true
    issuedDate?: true
    paidDate?: true
    paymentTermsDays?: true
    notes?: true
    theirReference?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BillingInvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingInvoice to aggregate.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingInvoices
    **/
    _count?: true | BillingInvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BillingInvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BillingInvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingInvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingInvoiceMaxAggregateInputType
  }

  export type GetBillingInvoiceAggregateType<T extends BillingInvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingInvoice[P]>
      : GetScalarType<T[P], AggregateBillingInvoice[P]>
  }




  export type BillingInvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithAggregationInput | BillingInvoiceOrderByWithAggregationInput[]
    by: BillingInvoiceScalarFieldEnum[] | BillingInvoiceScalarFieldEnum
    having?: BillingInvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingInvoiceCountAggregateInputType | true
    _avg?: BillingInvoiceAvgAggregateInputType
    _sum?: BillingInvoiceSumAggregateInputType
    _min?: BillingInvoiceMinAggregateInputType
    _max?: BillingInvoiceMaxAggregateInputType
  }

  export type BillingInvoiceGroupByOutputType = {
    id: string
    companyId: string
    customerId: string | null
    customerName: string
    customerOrgNumber: string | null
    customerEmail: string | null
    customerPhone: string | null
    customerAddress: string | null
    customerPostalCode: string | null
    customerCity: string | null
    customerContactPerson: string | null
    status: string
    vatRate: number
    currency: string
    dueDate: string
    issuedDate: string
    paidDate: string | null
    paymentTermsDays: number | null
    notes: string | null
    theirReference: string | null
    createdAt: Date
    updatedAt: Date
    _count: BillingInvoiceCountAggregateOutputType | null
    _avg: BillingInvoiceAvgAggregateOutputType | null
    _sum: BillingInvoiceSumAggregateOutputType | null
    _min: BillingInvoiceMinAggregateOutputType | null
    _max: BillingInvoiceMaxAggregateOutputType | null
  }

  type GetBillingInvoiceGroupByPayload<T extends BillingInvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingInvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingInvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingInvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], BillingInvoiceGroupByOutputType[P]>
        }
      >
    >


  export type BillingInvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    customerId?: boolean
    customerName?: boolean
    customerOrgNumber?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    customerAddress?: boolean
    customerPostalCode?: boolean
    customerCity?: boolean
    customerContactPerson?: boolean
    status?: boolean
    vatRate?: boolean
    currency?: boolean
    dueDate?: boolean
    issuedDate?: boolean
    paidDate?: boolean
    paymentTermsDays?: boolean
    notes?: boolean
    theirReference?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | BillingCompanyDefaultArgs<ExtArgs>
    customer?: boolean | BillingInvoice$customerArgs<ExtArgs>
    lines?: boolean | BillingInvoice$linesArgs<ExtArgs>
    _count?: boolean | BillingInvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingInvoice"]>

  export type BillingInvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    customerId?: boolean
    customerName?: boolean
    customerOrgNumber?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    customerAddress?: boolean
    customerPostalCode?: boolean
    customerCity?: boolean
    customerContactPerson?: boolean
    status?: boolean
    vatRate?: boolean
    currency?: boolean
    dueDate?: boolean
    issuedDate?: boolean
    paidDate?: boolean
    paymentTermsDays?: boolean
    notes?: boolean
    theirReference?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | BillingCompanyDefaultArgs<ExtArgs>
    customer?: boolean | BillingInvoice$customerArgs<ExtArgs>
  }, ExtArgs["result"]["billingInvoice"]>

  export type BillingInvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    customerId?: boolean
    customerName?: boolean
    customerOrgNumber?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    customerAddress?: boolean
    customerPostalCode?: boolean
    customerCity?: boolean
    customerContactPerson?: boolean
    status?: boolean
    vatRate?: boolean
    currency?: boolean
    dueDate?: boolean
    issuedDate?: boolean
    paidDate?: boolean
    paymentTermsDays?: boolean
    notes?: boolean
    theirReference?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | BillingCompanyDefaultArgs<ExtArgs>
    customer?: boolean | BillingInvoice$customerArgs<ExtArgs>
  }, ExtArgs["result"]["billingInvoice"]>

  export type BillingInvoiceSelectScalar = {
    id?: boolean
    companyId?: boolean
    customerId?: boolean
    customerName?: boolean
    customerOrgNumber?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    customerAddress?: boolean
    customerPostalCode?: boolean
    customerCity?: boolean
    customerContactPerson?: boolean
    status?: boolean
    vatRate?: boolean
    currency?: boolean
    dueDate?: boolean
    issuedDate?: boolean
    paidDate?: boolean
    paymentTermsDays?: boolean
    notes?: boolean
    theirReference?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BillingInvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "companyId" | "customerId" | "customerName" | "customerOrgNumber" | "customerEmail" | "customerPhone" | "customerAddress" | "customerPostalCode" | "customerCity" | "customerContactPerson" | "status" | "vatRate" | "currency" | "dueDate" | "issuedDate" | "paidDate" | "paymentTermsDays" | "notes" | "theirReference" | "createdAt" | "updatedAt", ExtArgs["result"]["billingInvoice"]>
  export type BillingInvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | BillingCompanyDefaultArgs<ExtArgs>
    customer?: boolean | BillingInvoice$customerArgs<ExtArgs>
    lines?: boolean | BillingInvoice$linesArgs<ExtArgs>
    _count?: boolean | BillingInvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BillingInvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | BillingCompanyDefaultArgs<ExtArgs>
    customer?: boolean | BillingInvoice$customerArgs<ExtArgs>
  }
  export type BillingInvoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | BillingCompanyDefaultArgs<ExtArgs>
    customer?: boolean | BillingInvoice$customerArgs<ExtArgs>
  }

  export type $BillingInvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingInvoice"
    objects: {
      company: Prisma.$BillingCompanyPayload<ExtArgs>
      customer: Prisma.$BillingCustomerPayload<ExtArgs> | null
      lines: Prisma.$BillingInvoiceLinePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyId: string
      customerId: string | null
      customerName: string
      customerOrgNumber: string | null
      customerEmail: string | null
      customerPhone: string | null
      customerAddress: string | null
      customerPostalCode: string | null
      customerCity: string | null
      customerContactPerson: string | null
      status: string
      vatRate: number
      currency: string
      dueDate: string
      issuedDate: string
      paidDate: string | null
      paymentTermsDays: number | null
      notes: string | null
      theirReference: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["billingInvoice"]>
    composites: {}
  }

  type BillingInvoiceGetPayload<S extends boolean | null | undefined | BillingInvoiceDefaultArgs> = $Result.GetResult<Prisma.$BillingInvoicePayload, S>

  type BillingInvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BillingInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BillingInvoiceCountAggregateInputType | true
    }

  export interface BillingInvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingInvoice'], meta: { name: 'BillingInvoice' } }
    /**
     * Find zero or one BillingInvoice that matches the filter.
     * @param {BillingInvoiceFindUniqueArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingInvoiceFindUniqueArgs>(args: SelectSubset<T, BillingInvoiceFindUniqueArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BillingInvoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BillingInvoiceFindUniqueOrThrowArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingInvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingInvoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindFirstArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingInvoiceFindFirstArgs>(args?: SelectSubset<T, BillingInvoiceFindFirstArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingInvoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindFirstOrThrowArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingInvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BillingInvoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingInvoices
     * const billingInvoices = await prisma.billingInvoice.findMany()
     * 
     * // Get first 10 BillingInvoices
     * const billingInvoices = await prisma.billingInvoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingInvoiceWithIdOnly = await prisma.billingInvoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingInvoiceFindManyArgs>(args?: SelectSubset<T, BillingInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BillingInvoice.
     * @param {BillingInvoiceCreateArgs} args - Arguments to create a BillingInvoice.
     * @example
     * // Create one BillingInvoice
     * const BillingInvoice = await prisma.billingInvoice.create({
     *   data: {
     *     // ... data to create a BillingInvoice
     *   }
     * })
     * 
     */
    create<T extends BillingInvoiceCreateArgs>(args: SelectSubset<T, BillingInvoiceCreateArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BillingInvoices.
     * @param {BillingInvoiceCreateManyArgs} args - Arguments to create many BillingInvoices.
     * @example
     * // Create many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingInvoiceCreateManyArgs>(args?: SelectSubset<T, BillingInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingInvoices and returns the data saved in the database.
     * @param {BillingInvoiceCreateManyAndReturnArgs} args - Arguments to create many BillingInvoices.
     * @example
     * // Create many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingInvoices and only return the `id`
     * const billingInvoiceWithIdOnly = await prisma.billingInvoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingInvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingInvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BillingInvoice.
     * @param {BillingInvoiceDeleteArgs} args - Arguments to delete one BillingInvoice.
     * @example
     * // Delete one BillingInvoice
     * const BillingInvoice = await prisma.billingInvoice.delete({
     *   where: {
     *     // ... filter to delete one BillingInvoice
     *   }
     * })
     * 
     */
    delete<T extends BillingInvoiceDeleteArgs>(args: SelectSubset<T, BillingInvoiceDeleteArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BillingInvoice.
     * @param {BillingInvoiceUpdateArgs} args - Arguments to update one BillingInvoice.
     * @example
     * // Update one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingInvoiceUpdateArgs>(args: SelectSubset<T, BillingInvoiceUpdateArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BillingInvoices.
     * @param {BillingInvoiceDeleteManyArgs} args - Arguments to filter BillingInvoices to delete.
     * @example
     * // Delete a few BillingInvoices
     * const { count } = await prisma.billingInvoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingInvoiceDeleteManyArgs>(args?: SelectSubset<T, BillingInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingInvoiceUpdateManyArgs>(args: SelectSubset<T, BillingInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingInvoices and returns the data updated in the database.
     * @param {BillingInvoiceUpdateManyAndReturnArgs} args - Arguments to update many BillingInvoices.
     * @example
     * // Update many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BillingInvoices and only return the `id`
     * const billingInvoiceWithIdOnly = await prisma.billingInvoice.updateManyAndReturn({
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
    updateManyAndReturn<T extends BillingInvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, BillingInvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BillingInvoice.
     * @param {BillingInvoiceUpsertArgs} args - Arguments to update or create a BillingInvoice.
     * @example
     * // Update or create a BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.upsert({
     *   create: {
     *     // ... data to create a BillingInvoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingInvoice we want to update
     *   }
     * })
     */
    upsert<T extends BillingInvoiceUpsertArgs>(args: SelectSubset<T, BillingInvoiceUpsertArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BillingInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceCountArgs} args - Arguments to filter BillingInvoices to count.
     * @example
     * // Count the number of BillingInvoices
     * const count = await prisma.billingInvoice.count({
     *   where: {
     *     // ... the filter for the BillingInvoices we want to count
     *   }
     * })
    **/
    count<T extends BillingInvoiceCountArgs>(
      args?: Subset<T, BillingInvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingInvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BillingInvoiceAggregateArgs>(args: Subset<T, BillingInvoiceAggregateArgs>): Prisma.PrismaPromise<GetBillingInvoiceAggregateType<T>>

    /**
     * Group by BillingInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceGroupByArgs} args - Group by arguments.
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
      T extends BillingInvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingInvoiceGroupByArgs['orderBy'] }
        : { orderBy?: BillingInvoiceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BillingInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingInvoice model
   */
  readonly fields: BillingInvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingInvoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingInvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends BillingCompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BillingCompanyDefaultArgs<ExtArgs>>): Prisma__BillingCompanyClient<$Result.GetResult<Prisma.$BillingCompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    customer<T extends BillingInvoice$customerArgs<ExtArgs> = {}>(args?: Subset<T, BillingInvoice$customerArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    lines<T extends BillingInvoice$linesArgs<ExtArgs> = {}>(args?: Subset<T, BillingInvoice$linesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the BillingInvoice model
   */
  interface BillingInvoiceFieldRefs {
    readonly id: FieldRef<"BillingInvoice", 'String'>
    readonly companyId: FieldRef<"BillingInvoice", 'String'>
    readonly customerId: FieldRef<"BillingInvoice", 'String'>
    readonly customerName: FieldRef<"BillingInvoice", 'String'>
    readonly customerOrgNumber: FieldRef<"BillingInvoice", 'String'>
    readonly customerEmail: FieldRef<"BillingInvoice", 'String'>
    readonly customerPhone: FieldRef<"BillingInvoice", 'String'>
    readonly customerAddress: FieldRef<"BillingInvoice", 'String'>
    readonly customerPostalCode: FieldRef<"BillingInvoice", 'String'>
    readonly customerCity: FieldRef<"BillingInvoice", 'String'>
    readonly customerContactPerson: FieldRef<"BillingInvoice", 'String'>
    readonly status: FieldRef<"BillingInvoice", 'String'>
    readonly vatRate: FieldRef<"BillingInvoice", 'Float'>
    readonly currency: FieldRef<"BillingInvoice", 'String'>
    readonly dueDate: FieldRef<"BillingInvoice", 'String'>
    readonly issuedDate: FieldRef<"BillingInvoice", 'String'>
    readonly paidDate: FieldRef<"BillingInvoice", 'String'>
    readonly paymentTermsDays: FieldRef<"BillingInvoice", 'Int'>
    readonly notes: FieldRef<"BillingInvoice", 'String'>
    readonly theirReference: FieldRef<"BillingInvoice", 'String'>
    readonly createdAt: FieldRef<"BillingInvoice", 'DateTime'>
    readonly updatedAt: FieldRef<"BillingInvoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingInvoice findUnique
   */
  export type BillingInvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice findUniqueOrThrow
   */
  export type BillingInvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice findFirst
   */
  export type BillingInvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoices.
     */
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice findFirstOrThrow
   */
  export type BillingInvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoices.
     */
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice findMany
   */
  export type BillingInvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoices to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoices.
     */
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice create
   */
  export type BillingInvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingInvoice.
     */
    data: XOR<BillingInvoiceCreateInput, BillingInvoiceUncheckedCreateInput>
  }

  /**
   * BillingInvoice createMany
   */
  export type BillingInvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingInvoices.
     */
    data: BillingInvoiceCreateManyInput | BillingInvoiceCreateManyInput[]
  }

  /**
   * BillingInvoice createManyAndReturn
   */
  export type BillingInvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many BillingInvoices.
     */
    data: BillingInvoiceCreateManyInput | BillingInvoiceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingInvoice update
   */
  export type BillingInvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingInvoice.
     */
    data: XOR<BillingInvoiceUpdateInput, BillingInvoiceUncheckedUpdateInput>
    /**
     * Choose, which BillingInvoice to update.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice updateMany
   */
  export type BillingInvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingInvoices.
     */
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which BillingInvoices to update
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to update.
     */
    limit?: number
  }

  /**
   * BillingInvoice updateManyAndReturn
   */
  export type BillingInvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * The data used to update BillingInvoices.
     */
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which BillingInvoices to update
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingInvoice upsert
   */
  export type BillingInvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingInvoice to update in case it exists.
     */
    where: BillingInvoiceWhereUniqueInput
    /**
     * In case the BillingInvoice found by the `where` argument doesn't exist, create a new BillingInvoice with this data.
     */
    create: XOR<BillingInvoiceCreateInput, BillingInvoiceUncheckedCreateInput>
    /**
     * In case the BillingInvoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingInvoiceUpdateInput, BillingInvoiceUncheckedUpdateInput>
  }

  /**
   * BillingInvoice delete
   */
  export type BillingInvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter which BillingInvoice to delete.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice deleteMany
   */
  export type BillingInvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingInvoices to delete
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to delete.
     */
    limit?: number
  }

  /**
   * BillingInvoice.customer
   */
  export type BillingInvoice$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingCustomer
     */
    omit?: BillingCustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    where?: BillingCustomerWhereInput
  }

  /**
   * BillingInvoice.lines
   */
  export type BillingInvoice$linesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
    where?: BillingInvoiceLineWhereInput
    orderBy?: BillingInvoiceLineOrderByWithRelationInput | BillingInvoiceLineOrderByWithRelationInput[]
    cursor?: BillingInvoiceLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingInvoiceLineScalarFieldEnum | BillingInvoiceLineScalarFieldEnum[]
  }

  /**
   * BillingInvoice without action
   */
  export type BillingInvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
  }


  /**
   * Model BillingInvoiceLine
   */

  export type AggregateBillingInvoiceLine = {
    _count: BillingInvoiceLineCountAggregateOutputType | null
    _avg: BillingInvoiceLineAvgAggregateOutputType | null
    _sum: BillingInvoiceLineSumAggregateOutputType | null
    _min: BillingInvoiceLineMinAggregateOutputType | null
    _max: BillingInvoiceLineMaxAggregateOutputType | null
  }

  export type BillingInvoiceLineAvgAggregateOutputType = {
    position: number | null
    quantity: number | null
    unitPriceOre: number | null
  }

  export type BillingInvoiceLineSumAggregateOutputType = {
    position: number | null
    quantity: number | null
    unitPriceOre: number | null
  }

  export type BillingInvoiceLineMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    position: number | null
    description: string | null
    quantity: number | null
    unit: string | null
    unitPriceOre: number | null
    articleNumber: string | null
  }

  export type BillingInvoiceLineMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    position: number | null
    description: string | null
    quantity: number | null
    unit: string | null
    unitPriceOre: number | null
    articleNumber: string | null
  }

  export type BillingInvoiceLineCountAggregateOutputType = {
    id: number
    invoiceId: number
    position: number
    description: number
    quantity: number
    unit: number
    unitPriceOre: number
    articleNumber: number
    _all: number
  }


  export type BillingInvoiceLineAvgAggregateInputType = {
    position?: true
    quantity?: true
    unitPriceOre?: true
  }

  export type BillingInvoiceLineSumAggregateInputType = {
    position?: true
    quantity?: true
    unitPriceOre?: true
  }

  export type BillingInvoiceLineMinAggregateInputType = {
    id?: true
    invoiceId?: true
    position?: true
    description?: true
    quantity?: true
    unit?: true
    unitPriceOre?: true
    articleNumber?: true
  }

  export type BillingInvoiceLineMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    position?: true
    description?: true
    quantity?: true
    unit?: true
    unitPriceOre?: true
    articleNumber?: true
  }

  export type BillingInvoiceLineCountAggregateInputType = {
    id?: true
    invoiceId?: true
    position?: true
    description?: true
    quantity?: true
    unit?: true
    unitPriceOre?: true
    articleNumber?: true
    _all?: true
  }

  export type BillingInvoiceLineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingInvoiceLine to aggregate.
     */
    where?: BillingInvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoiceLines to fetch.
     */
    orderBy?: BillingInvoiceLineOrderByWithRelationInput | BillingInvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingInvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoiceLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingInvoiceLines
    **/
    _count?: true | BillingInvoiceLineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BillingInvoiceLineAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BillingInvoiceLineSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingInvoiceLineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingInvoiceLineMaxAggregateInputType
  }

  export type GetBillingInvoiceLineAggregateType<T extends BillingInvoiceLineAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingInvoiceLine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingInvoiceLine[P]>
      : GetScalarType<T[P], AggregateBillingInvoiceLine[P]>
  }




  export type BillingInvoiceLineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceLineWhereInput
    orderBy?: BillingInvoiceLineOrderByWithAggregationInput | BillingInvoiceLineOrderByWithAggregationInput[]
    by: BillingInvoiceLineScalarFieldEnum[] | BillingInvoiceLineScalarFieldEnum
    having?: BillingInvoiceLineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingInvoiceLineCountAggregateInputType | true
    _avg?: BillingInvoiceLineAvgAggregateInputType
    _sum?: BillingInvoiceLineSumAggregateInputType
    _min?: BillingInvoiceLineMinAggregateInputType
    _max?: BillingInvoiceLineMaxAggregateInputType
  }

  export type BillingInvoiceLineGroupByOutputType = {
    id: string
    invoiceId: string
    position: number
    description: string
    quantity: number
    unit: string | null
    unitPriceOre: number
    articleNumber: string | null
    _count: BillingInvoiceLineCountAggregateOutputType | null
    _avg: BillingInvoiceLineAvgAggregateOutputType | null
    _sum: BillingInvoiceLineSumAggregateOutputType | null
    _min: BillingInvoiceLineMinAggregateOutputType | null
    _max: BillingInvoiceLineMaxAggregateOutputType | null
  }

  type GetBillingInvoiceLineGroupByPayload<T extends BillingInvoiceLineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingInvoiceLineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingInvoiceLineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingInvoiceLineGroupByOutputType[P]>
            : GetScalarType<T[P], BillingInvoiceLineGroupByOutputType[P]>
        }
      >
    >


  export type BillingInvoiceLineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    position?: boolean
    description?: boolean
    quantity?: boolean
    unit?: boolean
    unitPriceOre?: boolean
    articleNumber?: boolean
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingInvoiceLine"]>

  export type BillingInvoiceLineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    position?: boolean
    description?: boolean
    quantity?: boolean
    unit?: boolean
    unitPriceOre?: boolean
    articleNumber?: boolean
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingInvoiceLine"]>

  export type BillingInvoiceLineSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    position?: boolean
    description?: boolean
    quantity?: boolean
    unit?: boolean
    unitPriceOre?: boolean
    articleNumber?: boolean
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingInvoiceLine"]>

  export type BillingInvoiceLineSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    position?: boolean
    description?: boolean
    quantity?: boolean
    unit?: boolean
    unitPriceOre?: boolean
    articleNumber?: boolean
  }

  export type BillingInvoiceLineOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceId" | "position" | "description" | "quantity" | "unit" | "unitPriceOre" | "articleNumber", ExtArgs["result"]["billingInvoiceLine"]>
  export type BillingInvoiceLineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
  }
  export type BillingInvoiceLineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
  }
  export type BillingInvoiceLineIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
  }

  export type $BillingInvoiceLinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingInvoiceLine"
    objects: {
      invoice: Prisma.$BillingInvoicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      position: number
      description: string
      quantity: number
      unit: string | null
      unitPriceOre: number
      articleNumber: string | null
    }, ExtArgs["result"]["billingInvoiceLine"]>
    composites: {}
  }

  type BillingInvoiceLineGetPayload<S extends boolean | null | undefined | BillingInvoiceLineDefaultArgs> = $Result.GetResult<Prisma.$BillingInvoiceLinePayload, S>

  type BillingInvoiceLineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BillingInvoiceLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BillingInvoiceLineCountAggregateInputType | true
    }

  export interface BillingInvoiceLineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingInvoiceLine'], meta: { name: 'BillingInvoiceLine' } }
    /**
     * Find zero or one BillingInvoiceLine that matches the filter.
     * @param {BillingInvoiceLineFindUniqueArgs} args - Arguments to find a BillingInvoiceLine
     * @example
     * // Get one BillingInvoiceLine
     * const billingInvoiceLine = await prisma.billingInvoiceLine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingInvoiceLineFindUniqueArgs>(args: SelectSubset<T, BillingInvoiceLineFindUniqueArgs<ExtArgs>>): Prisma__BillingInvoiceLineClient<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BillingInvoiceLine that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BillingInvoiceLineFindUniqueOrThrowArgs} args - Arguments to find a BillingInvoiceLine
     * @example
     * // Get one BillingInvoiceLine
     * const billingInvoiceLine = await prisma.billingInvoiceLine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingInvoiceLineFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingInvoiceLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingInvoiceLineClient<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingInvoiceLine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceLineFindFirstArgs} args - Arguments to find a BillingInvoiceLine
     * @example
     * // Get one BillingInvoiceLine
     * const billingInvoiceLine = await prisma.billingInvoiceLine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingInvoiceLineFindFirstArgs>(args?: SelectSubset<T, BillingInvoiceLineFindFirstArgs<ExtArgs>>): Prisma__BillingInvoiceLineClient<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingInvoiceLine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceLineFindFirstOrThrowArgs} args - Arguments to find a BillingInvoiceLine
     * @example
     * // Get one BillingInvoiceLine
     * const billingInvoiceLine = await prisma.billingInvoiceLine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingInvoiceLineFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingInvoiceLineFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingInvoiceLineClient<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BillingInvoiceLines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceLineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingInvoiceLines
     * const billingInvoiceLines = await prisma.billingInvoiceLine.findMany()
     * 
     * // Get first 10 BillingInvoiceLines
     * const billingInvoiceLines = await prisma.billingInvoiceLine.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingInvoiceLineWithIdOnly = await prisma.billingInvoiceLine.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingInvoiceLineFindManyArgs>(args?: SelectSubset<T, BillingInvoiceLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BillingInvoiceLine.
     * @param {BillingInvoiceLineCreateArgs} args - Arguments to create a BillingInvoiceLine.
     * @example
     * // Create one BillingInvoiceLine
     * const BillingInvoiceLine = await prisma.billingInvoiceLine.create({
     *   data: {
     *     // ... data to create a BillingInvoiceLine
     *   }
     * })
     * 
     */
    create<T extends BillingInvoiceLineCreateArgs>(args: SelectSubset<T, BillingInvoiceLineCreateArgs<ExtArgs>>): Prisma__BillingInvoiceLineClient<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BillingInvoiceLines.
     * @param {BillingInvoiceLineCreateManyArgs} args - Arguments to create many BillingInvoiceLines.
     * @example
     * // Create many BillingInvoiceLines
     * const billingInvoiceLine = await prisma.billingInvoiceLine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingInvoiceLineCreateManyArgs>(args?: SelectSubset<T, BillingInvoiceLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingInvoiceLines and returns the data saved in the database.
     * @param {BillingInvoiceLineCreateManyAndReturnArgs} args - Arguments to create many BillingInvoiceLines.
     * @example
     * // Create many BillingInvoiceLines
     * const billingInvoiceLine = await prisma.billingInvoiceLine.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingInvoiceLines and only return the `id`
     * const billingInvoiceLineWithIdOnly = await prisma.billingInvoiceLine.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingInvoiceLineCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingInvoiceLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BillingInvoiceLine.
     * @param {BillingInvoiceLineDeleteArgs} args - Arguments to delete one BillingInvoiceLine.
     * @example
     * // Delete one BillingInvoiceLine
     * const BillingInvoiceLine = await prisma.billingInvoiceLine.delete({
     *   where: {
     *     // ... filter to delete one BillingInvoiceLine
     *   }
     * })
     * 
     */
    delete<T extends BillingInvoiceLineDeleteArgs>(args: SelectSubset<T, BillingInvoiceLineDeleteArgs<ExtArgs>>): Prisma__BillingInvoiceLineClient<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BillingInvoiceLine.
     * @param {BillingInvoiceLineUpdateArgs} args - Arguments to update one BillingInvoiceLine.
     * @example
     * // Update one BillingInvoiceLine
     * const billingInvoiceLine = await prisma.billingInvoiceLine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingInvoiceLineUpdateArgs>(args: SelectSubset<T, BillingInvoiceLineUpdateArgs<ExtArgs>>): Prisma__BillingInvoiceLineClient<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BillingInvoiceLines.
     * @param {BillingInvoiceLineDeleteManyArgs} args - Arguments to filter BillingInvoiceLines to delete.
     * @example
     * // Delete a few BillingInvoiceLines
     * const { count } = await prisma.billingInvoiceLine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingInvoiceLineDeleteManyArgs>(args?: SelectSubset<T, BillingInvoiceLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingInvoiceLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceLineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingInvoiceLines
     * const billingInvoiceLine = await prisma.billingInvoiceLine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingInvoiceLineUpdateManyArgs>(args: SelectSubset<T, BillingInvoiceLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingInvoiceLines and returns the data updated in the database.
     * @param {BillingInvoiceLineUpdateManyAndReturnArgs} args - Arguments to update many BillingInvoiceLines.
     * @example
     * // Update many BillingInvoiceLines
     * const billingInvoiceLine = await prisma.billingInvoiceLine.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BillingInvoiceLines and only return the `id`
     * const billingInvoiceLineWithIdOnly = await prisma.billingInvoiceLine.updateManyAndReturn({
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
    updateManyAndReturn<T extends BillingInvoiceLineUpdateManyAndReturnArgs>(args: SelectSubset<T, BillingInvoiceLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BillingInvoiceLine.
     * @param {BillingInvoiceLineUpsertArgs} args - Arguments to update or create a BillingInvoiceLine.
     * @example
     * // Update or create a BillingInvoiceLine
     * const billingInvoiceLine = await prisma.billingInvoiceLine.upsert({
     *   create: {
     *     // ... data to create a BillingInvoiceLine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingInvoiceLine we want to update
     *   }
     * })
     */
    upsert<T extends BillingInvoiceLineUpsertArgs>(args: SelectSubset<T, BillingInvoiceLineUpsertArgs<ExtArgs>>): Prisma__BillingInvoiceLineClient<$Result.GetResult<Prisma.$BillingInvoiceLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BillingInvoiceLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceLineCountArgs} args - Arguments to filter BillingInvoiceLines to count.
     * @example
     * // Count the number of BillingInvoiceLines
     * const count = await prisma.billingInvoiceLine.count({
     *   where: {
     *     // ... the filter for the BillingInvoiceLines we want to count
     *   }
     * })
    **/
    count<T extends BillingInvoiceLineCountArgs>(
      args?: Subset<T, BillingInvoiceLineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingInvoiceLineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingInvoiceLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceLineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BillingInvoiceLineAggregateArgs>(args: Subset<T, BillingInvoiceLineAggregateArgs>): Prisma.PrismaPromise<GetBillingInvoiceLineAggregateType<T>>

    /**
     * Group by BillingInvoiceLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceLineGroupByArgs} args - Group by arguments.
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
      T extends BillingInvoiceLineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingInvoiceLineGroupByArgs['orderBy'] }
        : { orderBy?: BillingInvoiceLineGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BillingInvoiceLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingInvoiceLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingInvoiceLine model
   */
  readonly fields: BillingInvoiceLineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingInvoiceLine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingInvoiceLineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends BillingInvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BillingInvoiceDefaultArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the BillingInvoiceLine model
   */
  interface BillingInvoiceLineFieldRefs {
    readonly id: FieldRef<"BillingInvoiceLine", 'String'>
    readonly invoiceId: FieldRef<"BillingInvoiceLine", 'String'>
    readonly position: FieldRef<"BillingInvoiceLine", 'Int'>
    readonly description: FieldRef<"BillingInvoiceLine", 'String'>
    readonly quantity: FieldRef<"BillingInvoiceLine", 'Float'>
    readonly unit: FieldRef<"BillingInvoiceLine", 'String'>
    readonly unitPriceOre: FieldRef<"BillingInvoiceLine", 'Int'>
    readonly articleNumber: FieldRef<"BillingInvoiceLine", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BillingInvoiceLine findUnique
   */
  export type BillingInvoiceLineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoiceLine to fetch.
     */
    where: BillingInvoiceLineWhereUniqueInput
  }

  /**
   * BillingInvoiceLine findUniqueOrThrow
   */
  export type BillingInvoiceLineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoiceLine to fetch.
     */
    where: BillingInvoiceLineWhereUniqueInput
  }

  /**
   * BillingInvoiceLine findFirst
   */
  export type BillingInvoiceLineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoiceLine to fetch.
     */
    where?: BillingInvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoiceLines to fetch.
     */
    orderBy?: BillingInvoiceLineOrderByWithRelationInput | BillingInvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingInvoiceLines.
     */
    cursor?: BillingInvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoiceLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoiceLines.
     */
    distinct?: BillingInvoiceLineScalarFieldEnum | BillingInvoiceLineScalarFieldEnum[]
  }

  /**
   * BillingInvoiceLine findFirstOrThrow
   */
  export type BillingInvoiceLineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoiceLine to fetch.
     */
    where?: BillingInvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoiceLines to fetch.
     */
    orderBy?: BillingInvoiceLineOrderByWithRelationInput | BillingInvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingInvoiceLines.
     */
    cursor?: BillingInvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoiceLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoiceLines.
     */
    distinct?: BillingInvoiceLineScalarFieldEnum | BillingInvoiceLineScalarFieldEnum[]
  }

  /**
   * BillingInvoiceLine findMany
   */
  export type BillingInvoiceLineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoiceLines to fetch.
     */
    where?: BillingInvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoiceLines to fetch.
     */
    orderBy?: BillingInvoiceLineOrderByWithRelationInput | BillingInvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingInvoiceLines.
     */
    cursor?: BillingInvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoiceLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoiceLines.
     */
    distinct?: BillingInvoiceLineScalarFieldEnum | BillingInvoiceLineScalarFieldEnum[]
  }

  /**
   * BillingInvoiceLine create
   */
  export type BillingInvoiceLineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingInvoiceLine.
     */
    data: XOR<BillingInvoiceLineCreateInput, BillingInvoiceLineUncheckedCreateInput>
  }

  /**
   * BillingInvoiceLine createMany
   */
  export type BillingInvoiceLineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingInvoiceLines.
     */
    data: BillingInvoiceLineCreateManyInput | BillingInvoiceLineCreateManyInput[]
  }

  /**
   * BillingInvoiceLine createManyAndReturn
   */
  export type BillingInvoiceLineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * The data used to create many BillingInvoiceLines.
     */
    data: BillingInvoiceLineCreateManyInput | BillingInvoiceLineCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingInvoiceLine update
   */
  export type BillingInvoiceLineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingInvoiceLine.
     */
    data: XOR<BillingInvoiceLineUpdateInput, BillingInvoiceLineUncheckedUpdateInput>
    /**
     * Choose, which BillingInvoiceLine to update.
     */
    where: BillingInvoiceLineWhereUniqueInput
  }

  /**
   * BillingInvoiceLine updateMany
   */
  export type BillingInvoiceLineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingInvoiceLines.
     */
    data: XOR<BillingInvoiceLineUpdateManyMutationInput, BillingInvoiceLineUncheckedUpdateManyInput>
    /**
     * Filter which BillingInvoiceLines to update
     */
    where?: BillingInvoiceLineWhereInput
    /**
     * Limit how many BillingInvoiceLines to update.
     */
    limit?: number
  }

  /**
   * BillingInvoiceLine updateManyAndReturn
   */
  export type BillingInvoiceLineUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * The data used to update BillingInvoiceLines.
     */
    data: XOR<BillingInvoiceLineUpdateManyMutationInput, BillingInvoiceLineUncheckedUpdateManyInput>
    /**
     * Filter which BillingInvoiceLines to update
     */
    where?: BillingInvoiceLineWhereInput
    /**
     * Limit how many BillingInvoiceLines to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingInvoiceLine upsert
   */
  export type BillingInvoiceLineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingInvoiceLine to update in case it exists.
     */
    where: BillingInvoiceLineWhereUniqueInput
    /**
     * In case the BillingInvoiceLine found by the `where` argument doesn't exist, create a new BillingInvoiceLine with this data.
     */
    create: XOR<BillingInvoiceLineCreateInput, BillingInvoiceLineUncheckedCreateInput>
    /**
     * In case the BillingInvoiceLine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingInvoiceLineUpdateInput, BillingInvoiceLineUncheckedUpdateInput>
  }

  /**
   * BillingInvoiceLine delete
   */
  export type BillingInvoiceLineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
    /**
     * Filter which BillingInvoiceLine to delete.
     */
    where: BillingInvoiceLineWhereUniqueInput
  }

  /**
   * BillingInvoiceLine deleteMany
   */
  export type BillingInvoiceLineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingInvoiceLines to delete
     */
    where?: BillingInvoiceLineWhereInput
    /**
     * Limit how many BillingInvoiceLines to delete.
     */
    limit?: number
  }

  /**
   * BillingInvoiceLine without action
   */
  export type BillingInvoiceLineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceLine
     */
    select?: BillingInvoiceLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoiceLine
     */
    omit?: BillingInvoiceLineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceLineInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _avg: SubscriptionAvgAggregateOutputType | null
    _sum: SubscriptionSumAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionAvgAggregateOutputType = {
    amountSEK: number | null
    reminderDaysBefore: number | null
  }

  export type SubscriptionSumAggregateOutputType = {
    amountSEK: number | null
    reminderDaysBefore: number | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    status: string | null
    amountSEK: number | null
    billingCycle: string | null
    startedAt: string | null
    nextRenewal: string | null
    cancelledAt: string | null
    website: string | null
    notes: string | null
    owner: string | null
    businessExpense: boolean | null
    reminderDaysBefore: number | null
    archived: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    status: string | null
    amountSEK: number | null
    billingCycle: string | null
    startedAt: string | null
    nextRenewal: string | null
    cancelledAt: string | null
    website: string | null
    notes: string | null
    owner: string | null
    businessExpense: boolean | null
    reminderDaysBefore: number | null
    archived: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    name: number
    description: number
    category: number
    status: number
    amountSEK: number
    billingCycle: number
    startedAt: number
    nextRenewal: number
    cancelledAt: number
    website: number
    notes: number
    owner: number
    businessExpense: number
    reminderDaysBefore: number
    archived: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubscriptionAvgAggregateInputType = {
    amountSEK?: true
    reminderDaysBefore?: true
  }

  export type SubscriptionSumAggregateInputType = {
    amountSEK?: true
    reminderDaysBefore?: true
  }

  export type SubscriptionMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    status?: true
    amountSEK?: true
    billingCycle?: true
    startedAt?: true
    nextRenewal?: true
    cancelledAt?: true
    website?: true
    notes?: true
    owner?: true
    businessExpense?: true
    reminderDaysBefore?: true
    archived?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    status?: true
    amountSEK?: true
    billingCycle?: true
    startedAt?: true
    nextRenewal?: true
    cancelledAt?: true
    website?: true
    notes?: true
    owner?: true
    businessExpense?: true
    reminderDaysBefore?: true
    archived?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    status?: true
    amountSEK?: true
    billingCycle?: true
    startedAt?: true
    nextRenewal?: true
    cancelledAt?: true
    website?: true
    notes?: true
    owner?: true
    businessExpense?: true
    reminderDaysBefore?: true
    archived?: true
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
     * Select which fields to average
    **/
    _avg?: SubscriptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionSumAggregateInputType
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
    _avg?: SubscriptionAvgAggregateInputType
    _sum?: SubscriptionSumAggregateInputType
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    name: string
    description: string
    category: string
    status: string
    amountSEK: number
    billingCycle: string
    startedAt: string
    nextRenewal: string
    cancelledAt: string | null
    website: string | null
    notes: string | null
    owner: string | null
    businessExpense: boolean
    reminderDaysBefore: number | null
    archived: boolean
    createdAt: Date
    updatedAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _avg: SubscriptionAvgAggregateOutputType | null
    _sum: SubscriptionSumAggregateOutputType | null
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
    name?: boolean
    description?: boolean
    category?: boolean
    status?: boolean
    amountSEK?: boolean
    billingCycle?: boolean
    startedAt?: boolean
    nextRenewal?: boolean
    cancelledAt?: boolean
    website?: boolean
    notes?: boolean
    owner?: boolean
    businessExpense?: boolean
    reminderDaysBefore?: boolean
    archived?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    priceHistory?: boolean | Subscription$priceHistoryArgs<ExtArgs>
    _count?: boolean | SubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    status?: boolean
    amountSEK?: boolean
    billingCycle?: boolean
    startedAt?: boolean
    nextRenewal?: boolean
    cancelledAt?: boolean
    website?: boolean
    notes?: boolean
    owner?: boolean
    businessExpense?: boolean
    reminderDaysBefore?: boolean
    archived?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    status?: boolean
    amountSEK?: boolean
    billingCycle?: boolean
    startedAt?: boolean
    nextRenewal?: boolean
    cancelledAt?: boolean
    website?: boolean
    notes?: boolean
    owner?: boolean
    businessExpense?: boolean
    reminderDaysBefore?: boolean
    archived?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    status?: boolean
    amountSEK?: boolean
    billingCycle?: boolean
    startedAt?: boolean
    nextRenewal?: boolean
    cancelledAt?: boolean
    website?: boolean
    notes?: boolean
    owner?: boolean
    businessExpense?: boolean
    reminderDaysBefore?: boolean
    archived?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "category" | "status" | "amountSEK" | "billingCycle" | "startedAt" | "nextRenewal" | "cancelledAt" | "website" | "notes" | "owner" | "businessExpense" | "reminderDaysBefore" | "archived" | "createdAt" | "updatedAt", ExtArgs["result"]["subscription"]>
  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    priceHistory?: boolean | Subscription$priceHistoryArgs<ExtArgs>
    _count?: boolean | SubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      priceHistory: Prisma.$SubscriptionPricePointPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      category: string
      status: string
      amountSEK: number
      billingCycle: string
      startedAt: string
      nextRenewal: string
      cancelledAt: string | null
      website: string | null
      notes: string | null
      owner: string | null
      businessExpense: boolean
      reminderDaysBefore: number | null
      archived: boolean
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
    priceHistory<T extends Subscription$priceHistoryArgs<ExtArgs> = {}>(args?: Subset<T, Subscription$priceHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly name: FieldRef<"Subscription", 'String'>
    readonly description: FieldRef<"Subscription", 'String'>
    readonly category: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly amountSEK: FieldRef<"Subscription", 'Int'>
    readonly billingCycle: FieldRef<"Subscription", 'String'>
    readonly startedAt: FieldRef<"Subscription", 'String'>
    readonly nextRenewal: FieldRef<"Subscription", 'String'>
    readonly cancelledAt: FieldRef<"Subscription", 'String'>
    readonly website: FieldRef<"Subscription", 'String'>
    readonly notes: FieldRef<"Subscription", 'String'>
    readonly owner: FieldRef<"Subscription", 'String'>
    readonly businessExpense: FieldRef<"Subscription", 'Boolean'>
    readonly reminderDaysBefore: FieldRef<"Subscription", 'Int'>
    readonly archived: FieldRef<"Subscription", 'Boolean'>
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
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
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
   * Subscription.priceHistory
   */
  export type Subscription$priceHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
    where?: SubscriptionPricePointWhereInput
    orderBy?: SubscriptionPricePointOrderByWithRelationInput | SubscriptionPricePointOrderByWithRelationInput[]
    cursor?: SubscriptionPricePointWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionPricePointScalarFieldEnum | SubscriptionPricePointScalarFieldEnum[]
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
   * Model SubscriptionPricePoint
   */

  export type AggregateSubscriptionPricePoint = {
    _count: SubscriptionPricePointCountAggregateOutputType | null
    _avg: SubscriptionPricePointAvgAggregateOutputType | null
    _sum: SubscriptionPricePointSumAggregateOutputType | null
    _min: SubscriptionPricePointMinAggregateOutputType | null
    _max: SubscriptionPricePointMaxAggregateOutputType | null
  }

  export type SubscriptionPricePointAvgAggregateOutputType = {
    amountSEK: number | null
  }

  export type SubscriptionPricePointSumAggregateOutputType = {
    amountSEK: number | null
  }

  export type SubscriptionPricePointMinAggregateOutputType = {
    id: string | null
    subscriptionId: string | null
    date: string | null
    amountSEK: number | null
    createdAt: Date | null
  }

  export type SubscriptionPricePointMaxAggregateOutputType = {
    id: string | null
    subscriptionId: string | null
    date: string | null
    amountSEK: number | null
    createdAt: Date | null
  }

  export type SubscriptionPricePointCountAggregateOutputType = {
    id: number
    subscriptionId: number
    date: number
    amountSEK: number
    createdAt: number
    _all: number
  }


  export type SubscriptionPricePointAvgAggregateInputType = {
    amountSEK?: true
  }

  export type SubscriptionPricePointSumAggregateInputType = {
    amountSEK?: true
  }

  export type SubscriptionPricePointMinAggregateInputType = {
    id?: true
    subscriptionId?: true
    date?: true
    amountSEK?: true
    createdAt?: true
  }

  export type SubscriptionPricePointMaxAggregateInputType = {
    id?: true
    subscriptionId?: true
    date?: true
    amountSEK?: true
    createdAt?: true
  }

  export type SubscriptionPricePointCountAggregateInputType = {
    id?: true
    subscriptionId?: true
    date?: true
    amountSEK?: true
    createdAt?: true
    _all?: true
  }

  export type SubscriptionPricePointAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPricePoint to aggregate.
     */
    where?: SubscriptionPricePointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPricePoints to fetch.
     */
    orderBy?: SubscriptionPricePointOrderByWithRelationInput | SubscriptionPricePointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionPricePointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPricePoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPricePoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubscriptionPricePoints
    **/
    _count?: true | SubscriptionPricePointCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionPricePointAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionPricePointSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionPricePointMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionPricePointMaxAggregateInputType
  }

  export type GetSubscriptionPricePointAggregateType<T extends SubscriptionPricePointAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptionPricePoint]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionPricePoint[P]>
      : GetScalarType<T[P], AggregateSubscriptionPricePoint[P]>
  }




  export type SubscriptionPricePointGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPricePointWhereInput
    orderBy?: SubscriptionPricePointOrderByWithAggregationInput | SubscriptionPricePointOrderByWithAggregationInput[]
    by: SubscriptionPricePointScalarFieldEnum[] | SubscriptionPricePointScalarFieldEnum
    having?: SubscriptionPricePointScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionPricePointCountAggregateInputType | true
    _avg?: SubscriptionPricePointAvgAggregateInputType
    _sum?: SubscriptionPricePointSumAggregateInputType
    _min?: SubscriptionPricePointMinAggregateInputType
    _max?: SubscriptionPricePointMaxAggregateInputType
  }

  export type SubscriptionPricePointGroupByOutputType = {
    id: string
    subscriptionId: string
    date: string
    amountSEK: number
    createdAt: Date
    _count: SubscriptionPricePointCountAggregateOutputType | null
    _avg: SubscriptionPricePointAvgAggregateOutputType | null
    _sum: SubscriptionPricePointSumAggregateOutputType | null
    _min: SubscriptionPricePointMinAggregateOutputType | null
    _max: SubscriptionPricePointMaxAggregateOutputType | null
  }

  type GetSubscriptionPricePointGroupByPayload<T extends SubscriptionPricePointGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionPricePointGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionPricePointGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionPricePointGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionPricePointGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionPricePointSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subscriptionId?: boolean
    date?: boolean
    amountSEK?: boolean
    createdAt?: boolean
    subscription?: boolean | SubscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPricePoint"]>

  export type SubscriptionPricePointSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subscriptionId?: boolean
    date?: boolean
    amountSEK?: boolean
    createdAt?: boolean
    subscription?: boolean | SubscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPricePoint"]>

  export type SubscriptionPricePointSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subscriptionId?: boolean
    date?: boolean
    amountSEK?: boolean
    createdAt?: boolean
    subscription?: boolean | SubscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPricePoint"]>

  export type SubscriptionPricePointSelectScalar = {
    id?: boolean
    subscriptionId?: boolean
    date?: boolean
    amountSEK?: boolean
    createdAt?: boolean
  }

  export type SubscriptionPricePointOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "subscriptionId" | "date" | "amountSEK" | "createdAt", ExtArgs["result"]["subscriptionPricePoint"]>
  export type SubscriptionPricePointInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscription?: boolean | SubscriptionDefaultArgs<ExtArgs>
  }
  export type SubscriptionPricePointIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscription?: boolean | SubscriptionDefaultArgs<ExtArgs>
  }
  export type SubscriptionPricePointIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscription?: boolean | SubscriptionDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPricePointPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubscriptionPricePoint"
    objects: {
      subscription: Prisma.$SubscriptionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      subscriptionId: string
      date: string
      amountSEK: number
      createdAt: Date
    }, ExtArgs["result"]["subscriptionPricePoint"]>
    composites: {}
  }

  type SubscriptionPricePointGetPayload<S extends boolean | null | undefined | SubscriptionPricePointDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPricePointPayload, S>

  type SubscriptionPricePointCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionPricePointFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionPricePointCountAggregateInputType | true
    }

  export interface SubscriptionPricePointDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionPricePoint'], meta: { name: 'SubscriptionPricePoint' } }
    /**
     * Find zero or one SubscriptionPricePoint that matches the filter.
     * @param {SubscriptionPricePointFindUniqueArgs} args - Arguments to find a SubscriptionPricePoint
     * @example
     * // Get one SubscriptionPricePoint
     * const subscriptionPricePoint = await prisma.subscriptionPricePoint.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionPricePointFindUniqueArgs>(args: SelectSubset<T, SubscriptionPricePointFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionPricePointClient<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubscriptionPricePoint that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionPricePointFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionPricePoint
     * @example
     * // Get one SubscriptionPricePoint
     * const subscriptionPricePoint = await prisma.subscriptionPricePoint.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionPricePointFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionPricePointFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPricePointClient<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPricePoint that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPricePointFindFirstArgs} args - Arguments to find a SubscriptionPricePoint
     * @example
     * // Get one SubscriptionPricePoint
     * const subscriptionPricePoint = await prisma.subscriptionPricePoint.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionPricePointFindFirstArgs>(args?: SelectSubset<T, SubscriptionPricePointFindFirstArgs<ExtArgs>>): Prisma__SubscriptionPricePointClient<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPricePoint that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPricePointFindFirstOrThrowArgs} args - Arguments to find a SubscriptionPricePoint
     * @example
     * // Get one SubscriptionPricePoint
     * const subscriptionPricePoint = await prisma.subscriptionPricePoint.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionPricePointFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionPricePointFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPricePointClient<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubscriptionPricePoints that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPricePointFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionPricePoints
     * const subscriptionPricePoints = await prisma.subscriptionPricePoint.findMany()
     * 
     * // Get first 10 SubscriptionPricePoints
     * const subscriptionPricePoints = await prisma.subscriptionPricePoint.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionPricePointWithIdOnly = await prisma.subscriptionPricePoint.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionPricePointFindManyArgs>(args?: SelectSubset<T, SubscriptionPricePointFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubscriptionPricePoint.
     * @param {SubscriptionPricePointCreateArgs} args - Arguments to create a SubscriptionPricePoint.
     * @example
     * // Create one SubscriptionPricePoint
     * const SubscriptionPricePoint = await prisma.subscriptionPricePoint.create({
     *   data: {
     *     // ... data to create a SubscriptionPricePoint
     *   }
     * })
     * 
     */
    create<T extends SubscriptionPricePointCreateArgs>(args: SelectSubset<T, SubscriptionPricePointCreateArgs<ExtArgs>>): Prisma__SubscriptionPricePointClient<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubscriptionPricePoints.
     * @param {SubscriptionPricePointCreateManyArgs} args - Arguments to create many SubscriptionPricePoints.
     * @example
     * // Create many SubscriptionPricePoints
     * const subscriptionPricePoint = await prisma.subscriptionPricePoint.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionPricePointCreateManyArgs>(args?: SelectSubset<T, SubscriptionPricePointCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubscriptionPricePoints and returns the data saved in the database.
     * @param {SubscriptionPricePointCreateManyAndReturnArgs} args - Arguments to create many SubscriptionPricePoints.
     * @example
     * // Create many SubscriptionPricePoints
     * const subscriptionPricePoint = await prisma.subscriptionPricePoint.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubscriptionPricePoints and only return the `id`
     * const subscriptionPricePointWithIdOnly = await prisma.subscriptionPricePoint.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionPricePointCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionPricePointCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubscriptionPricePoint.
     * @param {SubscriptionPricePointDeleteArgs} args - Arguments to delete one SubscriptionPricePoint.
     * @example
     * // Delete one SubscriptionPricePoint
     * const SubscriptionPricePoint = await prisma.subscriptionPricePoint.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionPricePoint
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionPricePointDeleteArgs>(args: SelectSubset<T, SubscriptionPricePointDeleteArgs<ExtArgs>>): Prisma__SubscriptionPricePointClient<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubscriptionPricePoint.
     * @param {SubscriptionPricePointUpdateArgs} args - Arguments to update one SubscriptionPricePoint.
     * @example
     * // Update one SubscriptionPricePoint
     * const subscriptionPricePoint = await prisma.subscriptionPricePoint.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionPricePointUpdateArgs>(args: SelectSubset<T, SubscriptionPricePointUpdateArgs<ExtArgs>>): Prisma__SubscriptionPricePointClient<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubscriptionPricePoints.
     * @param {SubscriptionPricePointDeleteManyArgs} args - Arguments to filter SubscriptionPricePoints to delete.
     * @example
     * // Delete a few SubscriptionPricePoints
     * const { count } = await prisma.subscriptionPricePoint.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionPricePointDeleteManyArgs>(args?: SelectSubset<T, SubscriptionPricePointDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPricePoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPricePointUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionPricePoints
     * const subscriptionPricePoint = await prisma.subscriptionPricePoint.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionPricePointUpdateManyArgs>(args: SelectSubset<T, SubscriptionPricePointUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPricePoints and returns the data updated in the database.
     * @param {SubscriptionPricePointUpdateManyAndReturnArgs} args - Arguments to update many SubscriptionPricePoints.
     * @example
     * // Update many SubscriptionPricePoints
     * const subscriptionPricePoint = await prisma.subscriptionPricePoint.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubscriptionPricePoints and only return the `id`
     * const subscriptionPricePointWithIdOnly = await prisma.subscriptionPricePoint.updateManyAndReturn({
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
    updateManyAndReturn<T extends SubscriptionPricePointUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionPricePointUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubscriptionPricePoint.
     * @param {SubscriptionPricePointUpsertArgs} args - Arguments to update or create a SubscriptionPricePoint.
     * @example
     * // Update or create a SubscriptionPricePoint
     * const subscriptionPricePoint = await prisma.subscriptionPricePoint.upsert({
     *   create: {
     *     // ... data to create a SubscriptionPricePoint
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionPricePoint we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionPricePointUpsertArgs>(args: SelectSubset<T, SubscriptionPricePointUpsertArgs<ExtArgs>>): Prisma__SubscriptionPricePointClient<$Result.GetResult<Prisma.$SubscriptionPricePointPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubscriptionPricePoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPricePointCountArgs} args - Arguments to filter SubscriptionPricePoints to count.
     * @example
     * // Count the number of SubscriptionPricePoints
     * const count = await prisma.subscriptionPricePoint.count({
     *   where: {
     *     // ... the filter for the SubscriptionPricePoints we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionPricePointCountArgs>(
      args?: Subset<T, SubscriptionPricePointCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionPricePointCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubscriptionPricePoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPricePointAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SubscriptionPricePointAggregateArgs>(args: Subset<T, SubscriptionPricePointAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionPricePointAggregateType<T>>

    /**
     * Group by SubscriptionPricePoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPricePointGroupByArgs} args - Group by arguments.
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
      T extends SubscriptionPricePointGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionPricePointGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionPricePointGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SubscriptionPricePointGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionPricePointGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubscriptionPricePoint model
   */
  readonly fields: SubscriptionPricePointFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionPricePoint.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionPricePointClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscription<T extends SubscriptionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionDefaultArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the SubscriptionPricePoint model
   */
  interface SubscriptionPricePointFieldRefs {
    readonly id: FieldRef<"SubscriptionPricePoint", 'String'>
    readonly subscriptionId: FieldRef<"SubscriptionPricePoint", 'String'>
    readonly date: FieldRef<"SubscriptionPricePoint", 'String'>
    readonly amountSEK: FieldRef<"SubscriptionPricePoint", 'Int'>
    readonly createdAt: FieldRef<"SubscriptionPricePoint", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubscriptionPricePoint findUnique
   */
  export type SubscriptionPricePointFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPricePoint to fetch.
     */
    where: SubscriptionPricePointWhereUniqueInput
  }

  /**
   * SubscriptionPricePoint findUniqueOrThrow
   */
  export type SubscriptionPricePointFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPricePoint to fetch.
     */
    where: SubscriptionPricePointWhereUniqueInput
  }

  /**
   * SubscriptionPricePoint findFirst
   */
  export type SubscriptionPricePointFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPricePoint to fetch.
     */
    where?: SubscriptionPricePointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPricePoints to fetch.
     */
    orderBy?: SubscriptionPricePointOrderByWithRelationInput | SubscriptionPricePointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPricePoints.
     */
    cursor?: SubscriptionPricePointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPricePoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPricePoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPricePoints.
     */
    distinct?: SubscriptionPricePointScalarFieldEnum | SubscriptionPricePointScalarFieldEnum[]
  }

  /**
   * SubscriptionPricePoint findFirstOrThrow
   */
  export type SubscriptionPricePointFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPricePoint to fetch.
     */
    where?: SubscriptionPricePointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPricePoints to fetch.
     */
    orderBy?: SubscriptionPricePointOrderByWithRelationInput | SubscriptionPricePointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPricePoints.
     */
    cursor?: SubscriptionPricePointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPricePoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPricePoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPricePoints.
     */
    distinct?: SubscriptionPricePointScalarFieldEnum | SubscriptionPricePointScalarFieldEnum[]
  }

  /**
   * SubscriptionPricePoint findMany
   */
  export type SubscriptionPricePointFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPricePoints to fetch.
     */
    where?: SubscriptionPricePointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPricePoints to fetch.
     */
    orderBy?: SubscriptionPricePointOrderByWithRelationInput | SubscriptionPricePointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubscriptionPricePoints.
     */
    cursor?: SubscriptionPricePointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPricePoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPricePoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPricePoints.
     */
    distinct?: SubscriptionPricePointScalarFieldEnum | SubscriptionPricePointScalarFieldEnum[]
  }

  /**
   * SubscriptionPricePoint create
   */
  export type SubscriptionPricePointCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
    /**
     * The data needed to create a SubscriptionPricePoint.
     */
    data: XOR<SubscriptionPricePointCreateInput, SubscriptionPricePointUncheckedCreateInput>
  }

  /**
   * SubscriptionPricePoint createMany
   */
  export type SubscriptionPricePointCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionPricePoints.
     */
    data: SubscriptionPricePointCreateManyInput | SubscriptionPricePointCreateManyInput[]
  }

  /**
   * SubscriptionPricePoint createManyAndReturn
   */
  export type SubscriptionPricePointCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * The data used to create many SubscriptionPricePoints.
     */
    data: SubscriptionPricePointCreateManyInput | SubscriptionPricePointCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubscriptionPricePoint update
   */
  export type SubscriptionPricePointUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
    /**
     * The data needed to update a SubscriptionPricePoint.
     */
    data: XOR<SubscriptionPricePointUpdateInput, SubscriptionPricePointUncheckedUpdateInput>
    /**
     * Choose, which SubscriptionPricePoint to update.
     */
    where: SubscriptionPricePointWhereUniqueInput
  }

  /**
   * SubscriptionPricePoint updateMany
   */
  export type SubscriptionPricePointUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionPricePoints.
     */
    data: XOR<SubscriptionPricePointUpdateManyMutationInput, SubscriptionPricePointUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPricePoints to update
     */
    where?: SubscriptionPricePointWhereInput
    /**
     * Limit how many SubscriptionPricePoints to update.
     */
    limit?: number
  }

  /**
   * SubscriptionPricePoint updateManyAndReturn
   */
  export type SubscriptionPricePointUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * The data used to update SubscriptionPricePoints.
     */
    data: XOR<SubscriptionPricePointUpdateManyMutationInput, SubscriptionPricePointUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPricePoints to update
     */
    where?: SubscriptionPricePointWhereInput
    /**
     * Limit how many SubscriptionPricePoints to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubscriptionPricePoint upsert
   */
  export type SubscriptionPricePointUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
    /**
     * The filter to search for the SubscriptionPricePoint to update in case it exists.
     */
    where: SubscriptionPricePointWhereUniqueInput
    /**
     * In case the SubscriptionPricePoint found by the `where` argument doesn't exist, create a new SubscriptionPricePoint with this data.
     */
    create: XOR<SubscriptionPricePointCreateInput, SubscriptionPricePointUncheckedCreateInput>
    /**
     * In case the SubscriptionPricePoint was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionPricePointUpdateInput, SubscriptionPricePointUncheckedUpdateInput>
  }

  /**
   * SubscriptionPricePoint delete
   */
  export type SubscriptionPricePointDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
    /**
     * Filter which SubscriptionPricePoint to delete.
     */
    where: SubscriptionPricePointWhereUniqueInput
  }

  /**
   * SubscriptionPricePoint deleteMany
   */
  export type SubscriptionPricePointDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPricePoints to delete
     */
    where?: SubscriptionPricePointWhereInput
    /**
     * Limit how many SubscriptionPricePoints to delete.
     */
    limit?: number
  }

  /**
   * SubscriptionPricePoint without action
   */
  export type SubscriptionPricePointDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPricePoint
     */
    select?: SubscriptionPricePointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPricePoint
     */
    omit?: SubscriptionPricePointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPricePointInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SnapTldStateScalarFieldEnum: {
    id: 'id',
    watchlistJson: 'watchlistJson',
    reviewedJson: 'reviewedJson',
    hiddenJson: 'hiddenJson',
    notesJson: 'notesJson',
    activeWeightsYaml: 'activeWeightsYaml',
    settingsJson: 'settingsJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SnapTldStateScalarFieldEnum = (typeof SnapTldStateScalarFieldEnum)[keyof typeof SnapTldStateScalarFieldEnum]


  export const SnapTldFeedOverrideScalarFieldEnum: {
    feedId: 'feedId',
    status: 'status',
    scheduleJson: 'scheduleJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SnapTldFeedOverrideScalarFieldEnum = (typeof SnapTldFeedOverrideScalarFieldEnum)[keyof typeof SnapTldFeedOverrideScalarFieldEnum]


  export const SnapTldReportScalarFieldEnum: {
    id: 'id',
    title: 'title',
    generatedAt: 'generatedAt',
    domains: 'domains',
    highlight: 'highlight',
    format: 'format',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SnapTldReportScalarFieldEnum = (typeof SnapTldReportScalarFieldEnum)[keyof typeof SnapTldReportScalarFieldEnum]


  export const SnapTldImportedDomainScalarFieldEnum: {
    slug: 'slug',
    domain: 'domain',
    tld: 'tld',
    source: 'source',
    sourceLabel: 'sourceLabel',
    importedAt: 'importedAt',
    importedBy: 'importedBy',
    batchId: 'batchId',
    status: 'status',
    expiresAt: 'expiresAt',
    totalScore: 'totalScore',
    verdict: 'verdict',
    estimatedValueMin: 'estimatedValueMin',
    estimatedValueMax: 'estimatedValueMax',
    estimatedValueCurrency: 'estimatedValueCurrency',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SnapTldImportedDomainScalarFieldEnum = (typeof SnapTldImportedDomainScalarFieldEnum)[keyof typeof SnapTldImportedDomainScalarFieldEnum]


  export const SnapTldDomainAnalysisScalarFieldEnum: {
    slug: 'slug',
    domain: 'domain',
    tld: 'tld',
    source: 'source',
    fetchedAt: 'fetchedAt',
    expiresAt: 'expiresAt',
    totalScore: 'totalScore',
    verdict: 'verdict',
    status: 'status',
    aiSummary: 'aiSummary',
    estimatedValueMin: 'estimatedValueMin',
    estimatedValueMax: 'estimatedValueMax',
    estimatedValueCurrency: 'estimatedValueCurrency',
    categoriesJson: 'categoriesJson',
    seoJson: 'seoJson',
    waybackJson: 'waybackJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SnapTldDomainAnalysisScalarFieldEnum = (typeof SnapTldDomainAnalysisScalarFieldEnum)[keyof typeof SnapTldDomainAnalysisScalarFieldEnum]


  export const DriveItemScalarFieldEnum: {
    id: 'id',
    name: 'name',
    kind: 'kind',
    mimeType: 'mimeType',
    extension: 'extension',
    sizeBytes: 'sizeBytes',
    parentId: 'parentId',
    pathJson: 'pathJson',
    ownerId: 'ownerId',
    ownerName: 'ownerName',
    ownerInitials: 'ownerInitials',
    isFavorite: 'isFavorite',
    isDeleted: 'isDeleted',
    storageKey: 'storageKey',
    previewType: 'previewType',
    previewUrl: 'previewUrl',
    previewContent: 'previewContent',
    previewLanguage: 'previewLanguage',
    previewAccent: 'previewAccent',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DriveItemScalarFieldEnum = (typeof DriveItemScalarFieldEnum)[keyof typeof DriveItemScalarFieldEnum]


  export const DriveActivityScalarFieldEnum: {
    id: 'id',
    itemId: 'itemId',
    actor: 'actor',
    action: 'action',
    createdAt: 'createdAt'
  };

  export type DriveActivityScalarFieldEnum = (typeof DriveActivityScalarFieldEnum)[keyof typeof DriveActivityScalarFieldEnum]


  export const BillingCompanyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    orgNumber: 'orgNumber',
    vatNumber: 'vatNumber',
    email: 'email',
    phone: 'phone',
    address: 'address',
    postalCode: 'postalCode',
    city: 'city',
    bank: 'bank',
    iban: 'iban',
    bankgiro: 'bankgiro',
    logoDataUrl: 'logoDataUrl',
    fSkatt: 'fSkatt',
    isDefault: 'isDefault',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BillingCompanyScalarFieldEnum = (typeof BillingCompanyScalarFieldEnum)[keyof typeof BillingCompanyScalarFieldEnum]


  export const BillingCustomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    orgNumber: 'orgNumber',
    email: 'email',
    phone: 'phone',
    address: 'address',
    postalCode: 'postalCode',
    city: 'city',
    contactPerson: 'contactPerson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BillingCustomerScalarFieldEnum = (typeof BillingCustomerScalarFieldEnum)[keyof typeof BillingCustomerScalarFieldEnum]


  export const BillingInvoiceScalarFieldEnum: {
    id: 'id',
    companyId: 'companyId',
    customerId: 'customerId',
    customerName: 'customerName',
    customerOrgNumber: 'customerOrgNumber',
    customerEmail: 'customerEmail',
    customerPhone: 'customerPhone',
    customerAddress: 'customerAddress',
    customerPostalCode: 'customerPostalCode',
    customerCity: 'customerCity',
    customerContactPerson: 'customerContactPerson',
    status: 'status',
    vatRate: 'vatRate',
    currency: 'currency',
    dueDate: 'dueDate',
    issuedDate: 'issuedDate',
    paidDate: 'paidDate',
    paymentTermsDays: 'paymentTermsDays',
    notes: 'notes',
    theirReference: 'theirReference',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BillingInvoiceScalarFieldEnum = (typeof BillingInvoiceScalarFieldEnum)[keyof typeof BillingInvoiceScalarFieldEnum]


  export const BillingInvoiceLineScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    position: 'position',
    description: 'description',
    quantity: 'quantity',
    unit: 'unit',
    unitPriceOre: 'unitPriceOre',
    articleNumber: 'articleNumber'
  };

  export type BillingInvoiceLineScalarFieldEnum = (typeof BillingInvoiceLineScalarFieldEnum)[keyof typeof BillingInvoiceLineScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    category: 'category',
    status: 'status',
    amountSEK: 'amountSEK',
    billingCycle: 'billingCycle',
    startedAt: 'startedAt',
    nextRenewal: 'nextRenewal',
    cancelledAt: 'cancelledAt',
    website: 'website',
    notes: 'notes',
    owner: 'owner',
    businessExpense: 'businessExpense',
    reminderDaysBefore: 'reminderDaysBefore',
    archived: 'archived',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const SubscriptionPricePointScalarFieldEnum: {
    id: 'id',
    subscriptionId: 'subscriptionId',
    date: 'date',
    amountSEK: 'amountSEK',
    createdAt: 'createdAt'
  };

  export type SubscriptionPricePointScalarFieldEnum = (typeof SubscriptionPricePointScalarFieldEnum)[keyof typeof SubscriptionPricePointScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type SnapTldStateWhereInput = {
    AND?: SnapTldStateWhereInput | SnapTldStateWhereInput[]
    OR?: SnapTldStateWhereInput[]
    NOT?: SnapTldStateWhereInput | SnapTldStateWhereInput[]
    id?: StringFilter<"SnapTldState"> | string
    watchlistJson?: StringFilter<"SnapTldState"> | string
    reviewedJson?: StringFilter<"SnapTldState"> | string
    hiddenJson?: StringFilter<"SnapTldState"> | string
    notesJson?: StringFilter<"SnapTldState"> | string
    activeWeightsYaml?: StringFilter<"SnapTldState"> | string
    settingsJson?: StringFilter<"SnapTldState"> | string
    createdAt?: DateTimeFilter<"SnapTldState"> | Date | string
    updatedAt?: DateTimeFilter<"SnapTldState"> | Date | string
  }

  export type SnapTldStateOrderByWithRelationInput = {
    id?: SortOrder
    watchlistJson?: SortOrder
    reviewedJson?: SortOrder
    hiddenJson?: SortOrder
    notesJson?: SortOrder
    activeWeightsYaml?: SortOrder
    settingsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldStateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SnapTldStateWhereInput | SnapTldStateWhereInput[]
    OR?: SnapTldStateWhereInput[]
    NOT?: SnapTldStateWhereInput | SnapTldStateWhereInput[]
    watchlistJson?: StringFilter<"SnapTldState"> | string
    reviewedJson?: StringFilter<"SnapTldState"> | string
    hiddenJson?: StringFilter<"SnapTldState"> | string
    notesJson?: StringFilter<"SnapTldState"> | string
    activeWeightsYaml?: StringFilter<"SnapTldState"> | string
    settingsJson?: StringFilter<"SnapTldState"> | string
    createdAt?: DateTimeFilter<"SnapTldState"> | Date | string
    updatedAt?: DateTimeFilter<"SnapTldState"> | Date | string
  }, "id">

  export type SnapTldStateOrderByWithAggregationInput = {
    id?: SortOrder
    watchlistJson?: SortOrder
    reviewedJson?: SortOrder
    hiddenJson?: SortOrder
    notesJson?: SortOrder
    activeWeightsYaml?: SortOrder
    settingsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SnapTldStateCountOrderByAggregateInput
    _max?: SnapTldStateMaxOrderByAggregateInput
    _min?: SnapTldStateMinOrderByAggregateInput
  }

  export type SnapTldStateScalarWhereWithAggregatesInput = {
    AND?: SnapTldStateScalarWhereWithAggregatesInput | SnapTldStateScalarWhereWithAggregatesInput[]
    OR?: SnapTldStateScalarWhereWithAggregatesInput[]
    NOT?: SnapTldStateScalarWhereWithAggregatesInput | SnapTldStateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SnapTldState"> | string
    watchlistJson?: StringWithAggregatesFilter<"SnapTldState"> | string
    reviewedJson?: StringWithAggregatesFilter<"SnapTldState"> | string
    hiddenJson?: StringWithAggregatesFilter<"SnapTldState"> | string
    notesJson?: StringWithAggregatesFilter<"SnapTldState"> | string
    activeWeightsYaml?: StringWithAggregatesFilter<"SnapTldState"> | string
    settingsJson?: StringWithAggregatesFilter<"SnapTldState"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SnapTldState"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SnapTldState"> | Date | string
  }

  export type SnapTldFeedOverrideWhereInput = {
    AND?: SnapTldFeedOverrideWhereInput | SnapTldFeedOverrideWhereInput[]
    OR?: SnapTldFeedOverrideWhereInput[]
    NOT?: SnapTldFeedOverrideWhereInput | SnapTldFeedOverrideWhereInput[]
    feedId?: StringFilter<"SnapTldFeedOverride"> | string
    status?: StringNullableFilter<"SnapTldFeedOverride"> | string | null
    scheduleJson?: StringNullableFilter<"SnapTldFeedOverride"> | string | null
    createdAt?: DateTimeFilter<"SnapTldFeedOverride"> | Date | string
    updatedAt?: DateTimeFilter<"SnapTldFeedOverride"> | Date | string
  }

  export type SnapTldFeedOverrideOrderByWithRelationInput = {
    feedId?: SortOrder
    status?: SortOrderInput | SortOrder
    scheduleJson?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldFeedOverrideWhereUniqueInput = Prisma.AtLeast<{
    feedId?: string
    AND?: SnapTldFeedOverrideWhereInput | SnapTldFeedOverrideWhereInput[]
    OR?: SnapTldFeedOverrideWhereInput[]
    NOT?: SnapTldFeedOverrideWhereInput | SnapTldFeedOverrideWhereInput[]
    status?: StringNullableFilter<"SnapTldFeedOverride"> | string | null
    scheduleJson?: StringNullableFilter<"SnapTldFeedOverride"> | string | null
    createdAt?: DateTimeFilter<"SnapTldFeedOverride"> | Date | string
    updatedAt?: DateTimeFilter<"SnapTldFeedOverride"> | Date | string
  }, "feedId">

  export type SnapTldFeedOverrideOrderByWithAggregationInput = {
    feedId?: SortOrder
    status?: SortOrderInput | SortOrder
    scheduleJson?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SnapTldFeedOverrideCountOrderByAggregateInput
    _max?: SnapTldFeedOverrideMaxOrderByAggregateInput
    _min?: SnapTldFeedOverrideMinOrderByAggregateInput
  }

  export type SnapTldFeedOverrideScalarWhereWithAggregatesInput = {
    AND?: SnapTldFeedOverrideScalarWhereWithAggregatesInput | SnapTldFeedOverrideScalarWhereWithAggregatesInput[]
    OR?: SnapTldFeedOverrideScalarWhereWithAggregatesInput[]
    NOT?: SnapTldFeedOverrideScalarWhereWithAggregatesInput | SnapTldFeedOverrideScalarWhereWithAggregatesInput[]
    feedId?: StringWithAggregatesFilter<"SnapTldFeedOverride"> | string
    status?: StringNullableWithAggregatesFilter<"SnapTldFeedOverride"> | string | null
    scheduleJson?: StringNullableWithAggregatesFilter<"SnapTldFeedOverride"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SnapTldFeedOverride"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SnapTldFeedOverride"> | Date | string
  }

  export type SnapTldReportWhereInput = {
    AND?: SnapTldReportWhereInput | SnapTldReportWhereInput[]
    OR?: SnapTldReportWhereInput[]
    NOT?: SnapTldReportWhereInput | SnapTldReportWhereInput[]
    id?: StringFilter<"SnapTldReport"> | string
    title?: StringFilter<"SnapTldReport"> | string
    generatedAt?: DateTimeFilter<"SnapTldReport"> | Date | string
    domains?: IntFilter<"SnapTldReport"> | number
    highlight?: StringFilter<"SnapTldReport"> | string
    format?: StringFilter<"SnapTldReport"> | string
    createdAt?: DateTimeFilter<"SnapTldReport"> | Date | string
    updatedAt?: DateTimeFilter<"SnapTldReport"> | Date | string
  }

  export type SnapTldReportOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    generatedAt?: SortOrder
    domains?: SortOrder
    highlight?: SortOrder
    format?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SnapTldReportWhereInput | SnapTldReportWhereInput[]
    OR?: SnapTldReportWhereInput[]
    NOT?: SnapTldReportWhereInput | SnapTldReportWhereInput[]
    title?: StringFilter<"SnapTldReport"> | string
    generatedAt?: DateTimeFilter<"SnapTldReport"> | Date | string
    domains?: IntFilter<"SnapTldReport"> | number
    highlight?: StringFilter<"SnapTldReport"> | string
    format?: StringFilter<"SnapTldReport"> | string
    createdAt?: DateTimeFilter<"SnapTldReport"> | Date | string
    updatedAt?: DateTimeFilter<"SnapTldReport"> | Date | string
  }, "id">

  export type SnapTldReportOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    generatedAt?: SortOrder
    domains?: SortOrder
    highlight?: SortOrder
    format?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SnapTldReportCountOrderByAggregateInput
    _avg?: SnapTldReportAvgOrderByAggregateInput
    _max?: SnapTldReportMaxOrderByAggregateInput
    _min?: SnapTldReportMinOrderByAggregateInput
    _sum?: SnapTldReportSumOrderByAggregateInput
  }

  export type SnapTldReportScalarWhereWithAggregatesInput = {
    AND?: SnapTldReportScalarWhereWithAggregatesInput | SnapTldReportScalarWhereWithAggregatesInput[]
    OR?: SnapTldReportScalarWhereWithAggregatesInput[]
    NOT?: SnapTldReportScalarWhereWithAggregatesInput | SnapTldReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SnapTldReport"> | string
    title?: StringWithAggregatesFilter<"SnapTldReport"> | string
    generatedAt?: DateTimeWithAggregatesFilter<"SnapTldReport"> | Date | string
    domains?: IntWithAggregatesFilter<"SnapTldReport"> | number
    highlight?: StringWithAggregatesFilter<"SnapTldReport"> | string
    format?: StringWithAggregatesFilter<"SnapTldReport"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SnapTldReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SnapTldReport"> | Date | string
  }

  export type SnapTldImportedDomainWhereInput = {
    AND?: SnapTldImportedDomainWhereInput | SnapTldImportedDomainWhereInput[]
    OR?: SnapTldImportedDomainWhereInput[]
    NOT?: SnapTldImportedDomainWhereInput | SnapTldImportedDomainWhereInput[]
    slug?: StringFilter<"SnapTldImportedDomain"> | string
    domain?: StringFilter<"SnapTldImportedDomain"> | string
    tld?: StringFilter<"SnapTldImportedDomain"> | string
    source?: StringFilter<"SnapTldImportedDomain"> | string
    sourceLabel?: StringFilter<"SnapTldImportedDomain"> | string
    importedAt?: DateTimeFilter<"SnapTldImportedDomain"> | Date | string
    importedBy?: StringFilter<"SnapTldImportedDomain"> | string
    batchId?: StringFilter<"SnapTldImportedDomain"> | string
    status?: StringFilter<"SnapTldImportedDomain"> | string
    expiresAt?: StringFilter<"SnapTldImportedDomain"> | string
    totalScore?: IntFilter<"SnapTldImportedDomain"> | number
    verdict?: StringFilter<"SnapTldImportedDomain"> | string
    estimatedValueMin?: IntFilter<"SnapTldImportedDomain"> | number
    estimatedValueMax?: IntFilter<"SnapTldImportedDomain"> | number
    estimatedValueCurrency?: StringFilter<"SnapTldImportedDomain"> | string
    createdAt?: DateTimeFilter<"SnapTldImportedDomain"> | Date | string
    updatedAt?: DateTimeFilter<"SnapTldImportedDomain"> | Date | string
  }

  export type SnapTldImportedDomainOrderByWithRelationInput = {
    slug?: SortOrder
    domain?: SortOrder
    tld?: SortOrder
    source?: SortOrder
    sourceLabel?: SortOrder
    importedAt?: SortOrder
    importedBy?: SortOrder
    batchId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    totalScore?: SortOrder
    verdict?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
    estimatedValueCurrency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldImportedDomainWhereUniqueInput = Prisma.AtLeast<{
    slug?: string
    AND?: SnapTldImportedDomainWhereInput | SnapTldImportedDomainWhereInput[]
    OR?: SnapTldImportedDomainWhereInput[]
    NOT?: SnapTldImportedDomainWhereInput | SnapTldImportedDomainWhereInput[]
    domain?: StringFilter<"SnapTldImportedDomain"> | string
    tld?: StringFilter<"SnapTldImportedDomain"> | string
    source?: StringFilter<"SnapTldImportedDomain"> | string
    sourceLabel?: StringFilter<"SnapTldImportedDomain"> | string
    importedAt?: DateTimeFilter<"SnapTldImportedDomain"> | Date | string
    importedBy?: StringFilter<"SnapTldImportedDomain"> | string
    batchId?: StringFilter<"SnapTldImportedDomain"> | string
    status?: StringFilter<"SnapTldImportedDomain"> | string
    expiresAt?: StringFilter<"SnapTldImportedDomain"> | string
    totalScore?: IntFilter<"SnapTldImportedDomain"> | number
    verdict?: StringFilter<"SnapTldImportedDomain"> | string
    estimatedValueMin?: IntFilter<"SnapTldImportedDomain"> | number
    estimatedValueMax?: IntFilter<"SnapTldImportedDomain"> | number
    estimatedValueCurrency?: StringFilter<"SnapTldImportedDomain"> | string
    createdAt?: DateTimeFilter<"SnapTldImportedDomain"> | Date | string
    updatedAt?: DateTimeFilter<"SnapTldImportedDomain"> | Date | string
  }, "slug">

  export type SnapTldImportedDomainOrderByWithAggregationInput = {
    slug?: SortOrder
    domain?: SortOrder
    tld?: SortOrder
    source?: SortOrder
    sourceLabel?: SortOrder
    importedAt?: SortOrder
    importedBy?: SortOrder
    batchId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    totalScore?: SortOrder
    verdict?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
    estimatedValueCurrency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SnapTldImportedDomainCountOrderByAggregateInput
    _avg?: SnapTldImportedDomainAvgOrderByAggregateInput
    _max?: SnapTldImportedDomainMaxOrderByAggregateInput
    _min?: SnapTldImportedDomainMinOrderByAggregateInput
    _sum?: SnapTldImportedDomainSumOrderByAggregateInput
  }

  export type SnapTldImportedDomainScalarWhereWithAggregatesInput = {
    AND?: SnapTldImportedDomainScalarWhereWithAggregatesInput | SnapTldImportedDomainScalarWhereWithAggregatesInput[]
    OR?: SnapTldImportedDomainScalarWhereWithAggregatesInput[]
    NOT?: SnapTldImportedDomainScalarWhereWithAggregatesInput | SnapTldImportedDomainScalarWhereWithAggregatesInput[]
    slug?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    domain?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    tld?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    source?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    sourceLabel?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    importedAt?: DateTimeWithAggregatesFilter<"SnapTldImportedDomain"> | Date | string
    importedBy?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    batchId?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    status?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    expiresAt?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    totalScore?: IntWithAggregatesFilter<"SnapTldImportedDomain"> | number
    verdict?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    estimatedValueMin?: IntWithAggregatesFilter<"SnapTldImportedDomain"> | number
    estimatedValueMax?: IntWithAggregatesFilter<"SnapTldImportedDomain"> | number
    estimatedValueCurrency?: StringWithAggregatesFilter<"SnapTldImportedDomain"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SnapTldImportedDomain"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SnapTldImportedDomain"> | Date | string
  }

  export type SnapTldDomainAnalysisWhereInput = {
    AND?: SnapTldDomainAnalysisWhereInput | SnapTldDomainAnalysisWhereInput[]
    OR?: SnapTldDomainAnalysisWhereInput[]
    NOT?: SnapTldDomainAnalysisWhereInput | SnapTldDomainAnalysisWhereInput[]
    slug?: StringFilter<"SnapTldDomainAnalysis"> | string
    domain?: StringFilter<"SnapTldDomainAnalysis"> | string
    tld?: StringFilter<"SnapTldDomainAnalysis"> | string
    source?: StringFilter<"SnapTldDomainAnalysis"> | string
    fetchedAt?: DateTimeFilter<"SnapTldDomainAnalysis"> | Date | string
    expiresAt?: StringFilter<"SnapTldDomainAnalysis"> | string
    totalScore?: IntFilter<"SnapTldDomainAnalysis"> | number
    verdict?: StringFilter<"SnapTldDomainAnalysis"> | string
    status?: StringFilter<"SnapTldDomainAnalysis"> | string
    aiSummary?: StringFilter<"SnapTldDomainAnalysis"> | string
    estimatedValueMin?: IntFilter<"SnapTldDomainAnalysis"> | number
    estimatedValueMax?: IntFilter<"SnapTldDomainAnalysis"> | number
    estimatedValueCurrency?: StringFilter<"SnapTldDomainAnalysis"> | string
    categoriesJson?: StringFilter<"SnapTldDomainAnalysis"> | string
    seoJson?: StringFilter<"SnapTldDomainAnalysis"> | string
    waybackJson?: StringFilter<"SnapTldDomainAnalysis"> | string
    createdAt?: DateTimeFilter<"SnapTldDomainAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"SnapTldDomainAnalysis"> | Date | string
  }

  export type SnapTldDomainAnalysisOrderByWithRelationInput = {
    slug?: SortOrder
    domain?: SortOrder
    tld?: SortOrder
    source?: SortOrder
    fetchedAt?: SortOrder
    expiresAt?: SortOrder
    totalScore?: SortOrder
    verdict?: SortOrder
    status?: SortOrder
    aiSummary?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
    estimatedValueCurrency?: SortOrder
    categoriesJson?: SortOrder
    seoJson?: SortOrder
    waybackJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldDomainAnalysisWhereUniqueInput = Prisma.AtLeast<{
    slug?: string
    AND?: SnapTldDomainAnalysisWhereInput | SnapTldDomainAnalysisWhereInput[]
    OR?: SnapTldDomainAnalysisWhereInput[]
    NOT?: SnapTldDomainAnalysisWhereInput | SnapTldDomainAnalysisWhereInput[]
    domain?: StringFilter<"SnapTldDomainAnalysis"> | string
    tld?: StringFilter<"SnapTldDomainAnalysis"> | string
    source?: StringFilter<"SnapTldDomainAnalysis"> | string
    fetchedAt?: DateTimeFilter<"SnapTldDomainAnalysis"> | Date | string
    expiresAt?: StringFilter<"SnapTldDomainAnalysis"> | string
    totalScore?: IntFilter<"SnapTldDomainAnalysis"> | number
    verdict?: StringFilter<"SnapTldDomainAnalysis"> | string
    status?: StringFilter<"SnapTldDomainAnalysis"> | string
    aiSummary?: StringFilter<"SnapTldDomainAnalysis"> | string
    estimatedValueMin?: IntFilter<"SnapTldDomainAnalysis"> | number
    estimatedValueMax?: IntFilter<"SnapTldDomainAnalysis"> | number
    estimatedValueCurrency?: StringFilter<"SnapTldDomainAnalysis"> | string
    categoriesJson?: StringFilter<"SnapTldDomainAnalysis"> | string
    seoJson?: StringFilter<"SnapTldDomainAnalysis"> | string
    waybackJson?: StringFilter<"SnapTldDomainAnalysis"> | string
    createdAt?: DateTimeFilter<"SnapTldDomainAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"SnapTldDomainAnalysis"> | Date | string
  }, "slug">

  export type SnapTldDomainAnalysisOrderByWithAggregationInput = {
    slug?: SortOrder
    domain?: SortOrder
    tld?: SortOrder
    source?: SortOrder
    fetchedAt?: SortOrder
    expiresAt?: SortOrder
    totalScore?: SortOrder
    verdict?: SortOrder
    status?: SortOrder
    aiSummary?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
    estimatedValueCurrency?: SortOrder
    categoriesJson?: SortOrder
    seoJson?: SortOrder
    waybackJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SnapTldDomainAnalysisCountOrderByAggregateInput
    _avg?: SnapTldDomainAnalysisAvgOrderByAggregateInput
    _max?: SnapTldDomainAnalysisMaxOrderByAggregateInput
    _min?: SnapTldDomainAnalysisMinOrderByAggregateInput
    _sum?: SnapTldDomainAnalysisSumOrderByAggregateInput
  }

  export type SnapTldDomainAnalysisScalarWhereWithAggregatesInput = {
    AND?: SnapTldDomainAnalysisScalarWhereWithAggregatesInput | SnapTldDomainAnalysisScalarWhereWithAggregatesInput[]
    OR?: SnapTldDomainAnalysisScalarWhereWithAggregatesInput[]
    NOT?: SnapTldDomainAnalysisScalarWhereWithAggregatesInput | SnapTldDomainAnalysisScalarWhereWithAggregatesInput[]
    slug?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    domain?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    tld?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    source?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    fetchedAt?: DateTimeWithAggregatesFilter<"SnapTldDomainAnalysis"> | Date | string
    expiresAt?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    totalScore?: IntWithAggregatesFilter<"SnapTldDomainAnalysis"> | number
    verdict?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    status?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    aiSummary?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    estimatedValueMin?: IntWithAggregatesFilter<"SnapTldDomainAnalysis"> | number
    estimatedValueMax?: IntWithAggregatesFilter<"SnapTldDomainAnalysis"> | number
    estimatedValueCurrency?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    categoriesJson?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    seoJson?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    waybackJson?: StringWithAggregatesFilter<"SnapTldDomainAnalysis"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SnapTldDomainAnalysis"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SnapTldDomainAnalysis"> | Date | string
  }

  export type DriveItemWhereInput = {
    AND?: DriveItemWhereInput | DriveItemWhereInput[]
    OR?: DriveItemWhereInput[]
    NOT?: DriveItemWhereInput | DriveItemWhereInput[]
    id?: StringFilter<"DriveItem"> | string
    name?: StringFilter<"DriveItem"> | string
    kind?: StringFilter<"DriveItem"> | string
    mimeType?: StringNullableFilter<"DriveItem"> | string | null
    extension?: StringNullableFilter<"DriveItem"> | string | null
    sizeBytes?: IntFilter<"DriveItem"> | number
    parentId?: StringNullableFilter<"DriveItem"> | string | null
    pathJson?: StringFilter<"DriveItem"> | string
    ownerId?: StringFilter<"DriveItem"> | string
    ownerName?: StringFilter<"DriveItem"> | string
    ownerInitials?: StringFilter<"DriveItem"> | string
    isFavorite?: BoolFilter<"DriveItem"> | boolean
    isDeleted?: BoolFilter<"DriveItem"> | boolean
    storageKey?: StringNullableFilter<"DriveItem"> | string | null
    previewType?: StringFilter<"DriveItem"> | string
    previewUrl?: StringNullableFilter<"DriveItem"> | string | null
    previewContent?: StringNullableFilter<"DriveItem"> | string | null
    previewLanguage?: StringNullableFilter<"DriveItem"> | string | null
    previewAccent?: StringFilter<"DriveItem"> | string
    createdAt?: DateTimeFilter<"DriveItem"> | Date | string
    updatedAt?: DateTimeFilter<"DriveItem"> | Date | string
    parent?: XOR<DriveItemNullableScalarRelationFilter, DriveItemWhereInput> | null
    children?: DriveItemListRelationFilter
    activities?: DriveActivityListRelationFilter
  }

  export type DriveItemOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    mimeType?: SortOrderInput | SortOrder
    extension?: SortOrderInput | SortOrder
    sizeBytes?: SortOrder
    parentId?: SortOrderInput | SortOrder
    pathJson?: SortOrder
    ownerId?: SortOrder
    ownerName?: SortOrder
    ownerInitials?: SortOrder
    isFavorite?: SortOrder
    isDeleted?: SortOrder
    storageKey?: SortOrderInput | SortOrder
    previewType?: SortOrder
    previewUrl?: SortOrderInput | SortOrder
    previewContent?: SortOrderInput | SortOrder
    previewLanguage?: SortOrderInput | SortOrder
    previewAccent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parent?: DriveItemOrderByWithRelationInput
    children?: DriveItemOrderByRelationAggregateInput
    activities?: DriveActivityOrderByRelationAggregateInput
  }

  export type DriveItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DriveItemWhereInput | DriveItemWhereInput[]
    OR?: DriveItemWhereInput[]
    NOT?: DriveItemWhereInput | DriveItemWhereInput[]
    name?: StringFilter<"DriveItem"> | string
    kind?: StringFilter<"DriveItem"> | string
    mimeType?: StringNullableFilter<"DriveItem"> | string | null
    extension?: StringNullableFilter<"DriveItem"> | string | null
    sizeBytes?: IntFilter<"DriveItem"> | number
    parentId?: StringNullableFilter<"DriveItem"> | string | null
    pathJson?: StringFilter<"DriveItem"> | string
    ownerId?: StringFilter<"DriveItem"> | string
    ownerName?: StringFilter<"DriveItem"> | string
    ownerInitials?: StringFilter<"DriveItem"> | string
    isFavorite?: BoolFilter<"DriveItem"> | boolean
    isDeleted?: BoolFilter<"DriveItem"> | boolean
    storageKey?: StringNullableFilter<"DriveItem"> | string | null
    previewType?: StringFilter<"DriveItem"> | string
    previewUrl?: StringNullableFilter<"DriveItem"> | string | null
    previewContent?: StringNullableFilter<"DriveItem"> | string | null
    previewLanguage?: StringNullableFilter<"DriveItem"> | string | null
    previewAccent?: StringFilter<"DriveItem"> | string
    createdAt?: DateTimeFilter<"DriveItem"> | Date | string
    updatedAt?: DateTimeFilter<"DriveItem"> | Date | string
    parent?: XOR<DriveItemNullableScalarRelationFilter, DriveItemWhereInput> | null
    children?: DriveItemListRelationFilter
    activities?: DriveActivityListRelationFilter
  }, "id">

  export type DriveItemOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    mimeType?: SortOrderInput | SortOrder
    extension?: SortOrderInput | SortOrder
    sizeBytes?: SortOrder
    parentId?: SortOrderInput | SortOrder
    pathJson?: SortOrder
    ownerId?: SortOrder
    ownerName?: SortOrder
    ownerInitials?: SortOrder
    isFavorite?: SortOrder
    isDeleted?: SortOrder
    storageKey?: SortOrderInput | SortOrder
    previewType?: SortOrder
    previewUrl?: SortOrderInput | SortOrder
    previewContent?: SortOrderInput | SortOrder
    previewLanguage?: SortOrderInput | SortOrder
    previewAccent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DriveItemCountOrderByAggregateInput
    _avg?: DriveItemAvgOrderByAggregateInput
    _max?: DriveItemMaxOrderByAggregateInput
    _min?: DriveItemMinOrderByAggregateInput
    _sum?: DriveItemSumOrderByAggregateInput
  }

  export type DriveItemScalarWhereWithAggregatesInput = {
    AND?: DriveItemScalarWhereWithAggregatesInput | DriveItemScalarWhereWithAggregatesInput[]
    OR?: DriveItemScalarWhereWithAggregatesInput[]
    NOT?: DriveItemScalarWhereWithAggregatesInput | DriveItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DriveItem"> | string
    name?: StringWithAggregatesFilter<"DriveItem"> | string
    kind?: StringWithAggregatesFilter<"DriveItem"> | string
    mimeType?: StringNullableWithAggregatesFilter<"DriveItem"> | string | null
    extension?: StringNullableWithAggregatesFilter<"DriveItem"> | string | null
    sizeBytes?: IntWithAggregatesFilter<"DriveItem"> | number
    parentId?: StringNullableWithAggregatesFilter<"DriveItem"> | string | null
    pathJson?: StringWithAggregatesFilter<"DriveItem"> | string
    ownerId?: StringWithAggregatesFilter<"DriveItem"> | string
    ownerName?: StringWithAggregatesFilter<"DriveItem"> | string
    ownerInitials?: StringWithAggregatesFilter<"DriveItem"> | string
    isFavorite?: BoolWithAggregatesFilter<"DriveItem"> | boolean
    isDeleted?: BoolWithAggregatesFilter<"DriveItem"> | boolean
    storageKey?: StringNullableWithAggregatesFilter<"DriveItem"> | string | null
    previewType?: StringWithAggregatesFilter<"DriveItem"> | string
    previewUrl?: StringNullableWithAggregatesFilter<"DriveItem"> | string | null
    previewContent?: StringNullableWithAggregatesFilter<"DriveItem"> | string | null
    previewLanguage?: StringNullableWithAggregatesFilter<"DriveItem"> | string | null
    previewAccent?: StringWithAggregatesFilter<"DriveItem"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DriveItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DriveItem"> | Date | string
  }

  export type DriveActivityWhereInput = {
    AND?: DriveActivityWhereInput | DriveActivityWhereInput[]
    OR?: DriveActivityWhereInput[]
    NOT?: DriveActivityWhereInput | DriveActivityWhereInput[]
    id?: StringFilter<"DriveActivity"> | string
    itemId?: StringFilter<"DriveActivity"> | string
    actor?: StringFilter<"DriveActivity"> | string
    action?: StringFilter<"DriveActivity"> | string
    createdAt?: DateTimeFilter<"DriveActivity"> | Date | string
    item?: XOR<DriveItemScalarRelationFilter, DriveItemWhereInput>
  }

  export type DriveActivityOrderByWithRelationInput = {
    id?: SortOrder
    itemId?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
    item?: DriveItemOrderByWithRelationInput
  }

  export type DriveActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DriveActivityWhereInput | DriveActivityWhereInput[]
    OR?: DriveActivityWhereInput[]
    NOT?: DriveActivityWhereInput | DriveActivityWhereInput[]
    itemId?: StringFilter<"DriveActivity"> | string
    actor?: StringFilter<"DriveActivity"> | string
    action?: StringFilter<"DriveActivity"> | string
    createdAt?: DateTimeFilter<"DriveActivity"> | Date | string
    item?: XOR<DriveItemScalarRelationFilter, DriveItemWhereInput>
  }, "id">

  export type DriveActivityOrderByWithAggregationInput = {
    id?: SortOrder
    itemId?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
    _count?: DriveActivityCountOrderByAggregateInput
    _max?: DriveActivityMaxOrderByAggregateInput
    _min?: DriveActivityMinOrderByAggregateInput
  }

  export type DriveActivityScalarWhereWithAggregatesInput = {
    AND?: DriveActivityScalarWhereWithAggregatesInput | DriveActivityScalarWhereWithAggregatesInput[]
    OR?: DriveActivityScalarWhereWithAggregatesInput[]
    NOT?: DriveActivityScalarWhereWithAggregatesInput | DriveActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DriveActivity"> | string
    itemId?: StringWithAggregatesFilter<"DriveActivity"> | string
    actor?: StringWithAggregatesFilter<"DriveActivity"> | string
    action?: StringWithAggregatesFilter<"DriveActivity"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DriveActivity"> | Date | string
  }

  export type BillingCompanyWhereInput = {
    AND?: BillingCompanyWhereInput | BillingCompanyWhereInput[]
    OR?: BillingCompanyWhereInput[]
    NOT?: BillingCompanyWhereInput | BillingCompanyWhereInput[]
    id?: StringFilter<"BillingCompany"> | string
    name?: StringFilter<"BillingCompany"> | string
    orgNumber?: StringNullableFilter<"BillingCompany"> | string | null
    vatNumber?: StringNullableFilter<"BillingCompany"> | string | null
    email?: StringNullableFilter<"BillingCompany"> | string | null
    phone?: StringNullableFilter<"BillingCompany"> | string | null
    address?: StringNullableFilter<"BillingCompany"> | string | null
    postalCode?: StringNullableFilter<"BillingCompany"> | string | null
    city?: StringNullableFilter<"BillingCompany"> | string | null
    bank?: StringNullableFilter<"BillingCompany"> | string | null
    iban?: StringNullableFilter<"BillingCompany"> | string | null
    bankgiro?: StringNullableFilter<"BillingCompany"> | string | null
    logoDataUrl?: StringNullableFilter<"BillingCompany"> | string | null
    fSkatt?: BoolFilter<"BillingCompany"> | boolean
    isDefault?: BoolFilter<"BillingCompany"> | boolean
    createdAt?: DateTimeFilter<"BillingCompany"> | Date | string
    updatedAt?: DateTimeFilter<"BillingCompany"> | Date | string
    invoices?: BillingInvoiceListRelationFilter
  }

  export type BillingCompanyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    orgNumber?: SortOrderInput | SortOrder
    vatNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    bank?: SortOrderInput | SortOrder
    iban?: SortOrderInput | SortOrder
    bankgiro?: SortOrderInput | SortOrder
    logoDataUrl?: SortOrderInput | SortOrder
    fSkatt?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoices?: BillingInvoiceOrderByRelationAggregateInput
  }

  export type BillingCompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BillingCompanyWhereInput | BillingCompanyWhereInput[]
    OR?: BillingCompanyWhereInput[]
    NOT?: BillingCompanyWhereInput | BillingCompanyWhereInput[]
    name?: StringFilter<"BillingCompany"> | string
    orgNumber?: StringNullableFilter<"BillingCompany"> | string | null
    vatNumber?: StringNullableFilter<"BillingCompany"> | string | null
    email?: StringNullableFilter<"BillingCompany"> | string | null
    phone?: StringNullableFilter<"BillingCompany"> | string | null
    address?: StringNullableFilter<"BillingCompany"> | string | null
    postalCode?: StringNullableFilter<"BillingCompany"> | string | null
    city?: StringNullableFilter<"BillingCompany"> | string | null
    bank?: StringNullableFilter<"BillingCompany"> | string | null
    iban?: StringNullableFilter<"BillingCompany"> | string | null
    bankgiro?: StringNullableFilter<"BillingCompany"> | string | null
    logoDataUrl?: StringNullableFilter<"BillingCompany"> | string | null
    fSkatt?: BoolFilter<"BillingCompany"> | boolean
    isDefault?: BoolFilter<"BillingCompany"> | boolean
    createdAt?: DateTimeFilter<"BillingCompany"> | Date | string
    updatedAt?: DateTimeFilter<"BillingCompany"> | Date | string
    invoices?: BillingInvoiceListRelationFilter
  }, "id">

  export type BillingCompanyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    orgNumber?: SortOrderInput | SortOrder
    vatNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    bank?: SortOrderInput | SortOrder
    iban?: SortOrderInput | SortOrder
    bankgiro?: SortOrderInput | SortOrder
    logoDataUrl?: SortOrderInput | SortOrder
    fSkatt?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BillingCompanyCountOrderByAggregateInput
    _max?: BillingCompanyMaxOrderByAggregateInput
    _min?: BillingCompanyMinOrderByAggregateInput
  }

  export type BillingCompanyScalarWhereWithAggregatesInput = {
    AND?: BillingCompanyScalarWhereWithAggregatesInput | BillingCompanyScalarWhereWithAggregatesInput[]
    OR?: BillingCompanyScalarWhereWithAggregatesInput[]
    NOT?: BillingCompanyScalarWhereWithAggregatesInput | BillingCompanyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingCompany"> | string
    name?: StringWithAggregatesFilter<"BillingCompany"> | string
    orgNumber?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    vatNumber?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    email?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    phone?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    address?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    city?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    bank?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    iban?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    bankgiro?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    logoDataUrl?: StringNullableWithAggregatesFilter<"BillingCompany"> | string | null
    fSkatt?: BoolWithAggregatesFilter<"BillingCompany"> | boolean
    isDefault?: BoolWithAggregatesFilter<"BillingCompany"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"BillingCompany"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BillingCompany"> | Date | string
  }

  export type BillingCustomerWhereInput = {
    AND?: BillingCustomerWhereInput | BillingCustomerWhereInput[]
    OR?: BillingCustomerWhereInput[]
    NOT?: BillingCustomerWhereInput | BillingCustomerWhereInput[]
    id?: StringFilter<"BillingCustomer"> | string
    name?: StringFilter<"BillingCustomer"> | string
    orgNumber?: StringNullableFilter<"BillingCustomer"> | string | null
    email?: StringNullableFilter<"BillingCustomer"> | string | null
    phone?: StringNullableFilter<"BillingCustomer"> | string | null
    address?: StringNullableFilter<"BillingCustomer"> | string | null
    postalCode?: StringNullableFilter<"BillingCustomer"> | string | null
    city?: StringNullableFilter<"BillingCustomer"> | string | null
    contactPerson?: StringNullableFilter<"BillingCustomer"> | string | null
    createdAt?: DateTimeFilter<"BillingCustomer"> | Date | string
    updatedAt?: DateTimeFilter<"BillingCustomer"> | Date | string
    invoices?: BillingInvoiceListRelationFilter
  }

  export type BillingCustomerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    orgNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    contactPerson?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoices?: BillingInvoiceOrderByRelationAggregateInput
  }

  export type BillingCustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BillingCustomerWhereInput | BillingCustomerWhereInput[]
    OR?: BillingCustomerWhereInput[]
    NOT?: BillingCustomerWhereInput | BillingCustomerWhereInput[]
    name?: StringFilter<"BillingCustomer"> | string
    orgNumber?: StringNullableFilter<"BillingCustomer"> | string | null
    email?: StringNullableFilter<"BillingCustomer"> | string | null
    phone?: StringNullableFilter<"BillingCustomer"> | string | null
    address?: StringNullableFilter<"BillingCustomer"> | string | null
    postalCode?: StringNullableFilter<"BillingCustomer"> | string | null
    city?: StringNullableFilter<"BillingCustomer"> | string | null
    contactPerson?: StringNullableFilter<"BillingCustomer"> | string | null
    createdAt?: DateTimeFilter<"BillingCustomer"> | Date | string
    updatedAt?: DateTimeFilter<"BillingCustomer"> | Date | string
    invoices?: BillingInvoiceListRelationFilter
  }, "id">

  export type BillingCustomerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    orgNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    contactPerson?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BillingCustomerCountOrderByAggregateInput
    _max?: BillingCustomerMaxOrderByAggregateInput
    _min?: BillingCustomerMinOrderByAggregateInput
  }

  export type BillingCustomerScalarWhereWithAggregatesInput = {
    AND?: BillingCustomerScalarWhereWithAggregatesInput | BillingCustomerScalarWhereWithAggregatesInput[]
    OR?: BillingCustomerScalarWhereWithAggregatesInput[]
    NOT?: BillingCustomerScalarWhereWithAggregatesInput | BillingCustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingCustomer"> | string
    name?: StringWithAggregatesFilter<"BillingCustomer"> | string
    orgNumber?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    email?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    phone?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    address?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    city?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    contactPerson?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BillingCustomer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BillingCustomer"> | Date | string
  }

  export type BillingInvoiceWhereInput = {
    AND?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    OR?: BillingInvoiceWhereInput[]
    NOT?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    id?: StringFilter<"BillingInvoice"> | string
    companyId?: StringFilter<"BillingInvoice"> | string
    customerId?: StringNullableFilter<"BillingInvoice"> | string | null
    customerName?: StringFilter<"BillingInvoice"> | string
    customerOrgNumber?: StringNullableFilter<"BillingInvoice"> | string | null
    customerEmail?: StringNullableFilter<"BillingInvoice"> | string | null
    customerPhone?: StringNullableFilter<"BillingInvoice"> | string | null
    customerAddress?: StringNullableFilter<"BillingInvoice"> | string | null
    customerPostalCode?: StringNullableFilter<"BillingInvoice"> | string | null
    customerCity?: StringNullableFilter<"BillingInvoice"> | string | null
    customerContactPerson?: StringNullableFilter<"BillingInvoice"> | string | null
    status?: StringFilter<"BillingInvoice"> | string
    vatRate?: FloatFilter<"BillingInvoice"> | number
    currency?: StringFilter<"BillingInvoice"> | string
    dueDate?: StringFilter<"BillingInvoice"> | string
    issuedDate?: StringFilter<"BillingInvoice"> | string
    paidDate?: StringNullableFilter<"BillingInvoice"> | string | null
    paymentTermsDays?: IntNullableFilter<"BillingInvoice"> | number | null
    notes?: StringNullableFilter<"BillingInvoice"> | string | null
    theirReference?: StringNullableFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    company?: XOR<BillingCompanyScalarRelationFilter, BillingCompanyWhereInput>
    customer?: XOR<BillingCustomerNullableScalarRelationFilter, BillingCustomerWhereInput> | null
    lines?: BillingInvoiceLineListRelationFilter
  }

  export type BillingInvoiceOrderByWithRelationInput = {
    id?: SortOrder
    companyId?: SortOrder
    customerId?: SortOrderInput | SortOrder
    customerName?: SortOrder
    customerOrgNumber?: SortOrderInput | SortOrder
    customerEmail?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    customerAddress?: SortOrderInput | SortOrder
    customerPostalCode?: SortOrderInput | SortOrder
    customerCity?: SortOrderInput | SortOrder
    customerContactPerson?: SortOrderInput | SortOrder
    status?: SortOrder
    vatRate?: SortOrder
    currency?: SortOrder
    dueDate?: SortOrder
    issuedDate?: SortOrder
    paidDate?: SortOrderInput | SortOrder
    paymentTermsDays?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    theirReference?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    company?: BillingCompanyOrderByWithRelationInput
    customer?: BillingCustomerOrderByWithRelationInput
    lines?: BillingInvoiceLineOrderByRelationAggregateInput
  }

  export type BillingInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    OR?: BillingInvoiceWhereInput[]
    NOT?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    companyId?: StringFilter<"BillingInvoice"> | string
    customerId?: StringNullableFilter<"BillingInvoice"> | string | null
    customerName?: StringFilter<"BillingInvoice"> | string
    customerOrgNumber?: StringNullableFilter<"BillingInvoice"> | string | null
    customerEmail?: StringNullableFilter<"BillingInvoice"> | string | null
    customerPhone?: StringNullableFilter<"BillingInvoice"> | string | null
    customerAddress?: StringNullableFilter<"BillingInvoice"> | string | null
    customerPostalCode?: StringNullableFilter<"BillingInvoice"> | string | null
    customerCity?: StringNullableFilter<"BillingInvoice"> | string | null
    customerContactPerson?: StringNullableFilter<"BillingInvoice"> | string | null
    status?: StringFilter<"BillingInvoice"> | string
    vatRate?: FloatFilter<"BillingInvoice"> | number
    currency?: StringFilter<"BillingInvoice"> | string
    dueDate?: StringFilter<"BillingInvoice"> | string
    issuedDate?: StringFilter<"BillingInvoice"> | string
    paidDate?: StringNullableFilter<"BillingInvoice"> | string | null
    paymentTermsDays?: IntNullableFilter<"BillingInvoice"> | number | null
    notes?: StringNullableFilter<"BillingInvoice"> | string | null
    theirReference?: StringNullableFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    company?: XOR<BillingCompanyScalarRelationFilter, BillingCompanyWhereInput>
    customer?: XOR<BillingCustomerNullableScalarRelationFilter, BillingCustomerWhereInput> | null
    lines?: BillingInvoiceLineListRelationFilter
  }, "id">

  export type BillingInvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    companyId?: SortOrder
    customerId?: SortOrderInput | SortOrder
    customerName?: SortOrder
    customerOrgNumber?: SortOrderInput | SortOrder
    customerEmail?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    customerAddress?: SortOrderInput | SortOrder
    customerPostalCode?: SortOrderInput | SortOrder
    customerCity?: SortOrderInput | SortOrder
    customerContactPerson?: SortOrderInput | SortOrder
    status?: SortOrder
    vatRate?: SortOrder
    currency?: SortOrder
    dueDate?: SortOrder
    issuedDate?: SortOrder
    paidDate?: SortOrderInput | SortOrder
    paymentTermsDays?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    theirReference?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BillingInvoiceCountOrderByAggregateInput
    _avg?: BillingInvoiceAvgOrderByAggregateInput
    _max?: BillingInvoiceMaxOrderByAggregateInput
    _min?: BillingInvoiceMinOrderByAggregateInput
    _sum?: BillingInvoiceSumOrderByAggregateInput
  }

  export type BillingInvoiceScalarWhereWithAggregatesInput = {
    AND?: BillingInvoiceScalarWhereWithAggregatesInput | BillingInvoiceScalarWhereWithAggregatesInput[]
    OR?: BillingInvoiceScalarWhereWithAggregatesInput[]
    NOT?: BillingInvoiceScalarWhereWithAggregatesInput | BillingInvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingInvoice"> | string
    companyId?: StringWithAggregatesFilter<"BillingInvoice"> | string
    customerId?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    customerName?: StringWithAggregatesFilter<"BillingInvoice"> | string
    customerOrgNumber?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    customerEmail?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    customerPhone?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    customerAddress?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    customerPostalCode?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    customerCity?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    customerContactPerson?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    status?: StringWithAggregatesFilter<"BillingInvoice"> | string
    vatRate?: FloatWithAggregatesFilter<"BillingInvoice"> | number
    currency?: StringWithAggregatesFilter<"BillingInvoice"> | string
    dueDate?: StringWithAggregatesFilter<"BillingInvoice"> | string
    issuedDate?: StringWithAggregatesFilter<"BillingInvoice"> | string
    paidDate?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    paymentTermsDays?: IntNullableWithAggregatesFilter<"BillingInvoice"> | number | null
    notes?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    theirReference?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
  }

  export type BillingInvoiceLineWhereInput = {
    AND?: BillingInvoiceLineWhereInput | BillingInvoiceLineWhereInput[]
    OR?: BillingInvoiceLineWhereInput[]
    NOT?: BillingInvoiceLineWhereInput | BillingInvoiceLineWhereInput[]
    id?: StringFilter<"BillingInvoiceLine"> | string
    invoiceId?: StringFilter<"BillingInvoiceLine"> | string
    position?: IntFilter<"BillingInvoiceLine"> | number
    description?: StringFilter<"BillingInvoiceLine"> | string
    quantity?: FloatFilter<"BillingInvoiceLine"> | number
    unit?: StringNullableFilter<"BillingInvoiceLine"> | string | null
    unitPriceOre?: IntFilter<"BillingInvoiceLine"> | number
    articleNumber?: StringNullableFilter<"BillingInvoiceLine"> | string | null
    invoice?: XOR<BillingInvoiceScalarRelationFilter, BillingInvoiceWhereInput>
  }

  export type BillingInvoiceLineOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    position?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unit?: SortOrderInput | SortOrder
    unitPriceOre?: SortOrder
    articleNumber?: SortOrderInput | SortOrder
    invoice?: BillingInvoiceOrderByWithRelationInput
  }

  export type BillingInvoiceLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BillingInvoiceLineWhereInput | BillingInvoiceLineWhereInput[]
    OR?: BillingInvoiceLineWhereInput[]
    NOT?: BillingInvoiceLineWhereInput | BillingInvoiceLineWhereInput[]
    invoiceId?: StringFilter<"BillingInvoiceLine"> | string
    position?: IntFilter<"BillingInvoiceLine"> | number
    description?: StringFilter<"BillingInvoiceLine"> | string
    quantity?: FloatFilter<"BillingInvoiceLine"> | number
    unit?: StringNullableFilter<"BillingInvoiceLine"> | string | null
    unitPriceOre?: IntFilter<"BillingInvoiceLine"> | number
    articleNumber?: StringNullableFilter<"BillingInvoiceLine"> | string | null
    invoice?: XOR<BillingInvoiceScalarRelationFilter, BillingInvoiceWhereInput>
  }, "id">

  export type BillingInvoiceLineOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    position?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unit?: SortOrderInput | SortOrder
    unitPriceOre?: SortOrder
    articleNumber?: SortOrderInput | SortOrder
    _count?: BillingInvoiceLineCountOrderByAggregateInput
    _avg?: BillingInvoiceLineAvgOrderByAggregateInput
    _max?: BillingInvoiceLineMaxOrderByAggregateInput
    _min?: BillingInvoiceLineMinOrderByAggregateInput
    _sum?: BillingInvoiceLineSumOrderByAggregateInput
  }

  export type BillingInvoiceLineScalarWhereWithAggregatesInput = {
    AND?: BillingInvoiceLineScalarWhereWithAggregatesInput | BillingInvoiceLineScalarWhereWithAggregatesInput[]
    OR?: BillingInvoiceLineScalarWhereWithAggregatesInput[]
    NOT?: BillingInvoiceLineScalarWhereWithAggregatesInput | BillingInvoiceLineScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingInvoiceLine"> | string
    invoiceId?: StringWithAggregatesFilter<"BillingInvoiceLine"> | string
    position?: IntWithAggregatesFilter<"BillingInvoiceLine"> | number
    description?: StringWithAggregatesFilter<"BillingInvoiceLine"> | string
    quantity?: FloatWithAggregatesFilter<"BillingInvoiceLine"> | number
    unit?: StringNullableWithAggregatesFilter<"BillingInvoiceLine"> | string | null
    unitPriceOre?: IntWithAggregatesFilter<"BillingInvoiceLine"> | number
    articleNumber?: StringNullableWithAggregatesFilter<"BillingInvoiceLine"> | string | null
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    name?: StringFilter<"Subscription"> | string
    description?: StringFilter<"Subscription"> | string
    category?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    amountSEK?: IntFilter<"Subscription"> | number
    billingCycle?: StringFilter<"Subscription"> | string
    startedAt?: StringFilter<"Subscription"> | string
    nextRenewal?: StringFilter<"Subscription"> | string
    cancelledAt?: StringNullableFilter<"Subscription"> | string | null
    website?: StringNullableFilter<"Subscription"> | string | null
    notes?: StringNullableFilter<"Subscription"> | string | null
    owner?: StringNullableFilter<"Subscription"> | string | null
    businessExpense?: BoolFilter<"Subscription"> | boolean
    reminderDaysBefore?: IntNullableFilter<"Subscription"> | number | null
    archived?: BoolFilter<"Subscription"> | boolean
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    priceHistory?: SubscriptionPricePointListRelationFilter
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    amountSEK?: SortOrder
    billingCycle?: SortOrder
    startedAt?: SortOrder
    nextRenewal?: SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    owner?: SortOrderInput | SortOrder
    businessExpense?: SortOrder
    reminderDaysBefore?: SortOrderInput | SortOrder
    archived?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    priceHistory?: SubscriptionPricePointOrderByRelationAggregateInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    name?: StringFilter<"Subscription"> | string
    description?: StringFilter<"Subscription"> | string
    category?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    amountSEK?: IntFilter<"Subscription"> | number
    billingCycle?: StringFilter<"Subscription"> | string
    startedAt?: StringFilter<"Subscription"> | string
    nextRenewal?: StringFilter<"Subscription"> | string
    cancelledAt?: StringNullableFilter<"Subscription"> | string | null
    website?: StringNullableFilter<"Subscription"> | string | null
    notes?: StringNullableFilter<"Subscription"> | string | null
    owner?: StringNullableFilter<"Subscription"> | string | null
    businessExpense?: BoolFilter<"Subscription"> | boolean
    reminderDaysBefore?: IntNullableFilter<"Subscription"> | number | null
    archived?: BoolFilter<"Subscription"> | boolean
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    priceHistory?: SubscriptionPricePointListRelationFilter
  }, "id">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    amountSEK?: SortOrder
    billingCycle?: SortOrder
    startedAt?: SortOrder
    nextRenewal?: SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    owner?: SortOrderInput | SortOrder
    businessExpense?: SortOrder
    reminderDaysBefore?: SortOrderInput | SortOrder
    archived?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _avg?: SubscriptionAvgOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
    _sum?: SubscriptionSumOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    name?: StringWithAggregatesFilter<"Subscription"> | string
    description?: StringWithAggregatesFilter<"Subscription"> | string
    category?: StringWithAggregatesFilter<"Subscription"> | string
    status?: StringWithAggregatesFilter<"Subscription"> | string
    amountSEK?: IntWithAggregatesFilter<"Subscription"> | number
    billingCycle?: StringWithAggregatesFilter<"Subscription"> | string
    startedAt?: StringWithAggregatesFilter<"Subscription"> | string
    nextRenewal?: StringWithAggregatesFilter<"Subscription"> | string
    cancelledAt?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    website?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    owner?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    businessExpense?: BoolWithAggregatesFilter<"Subscription"> | boolean
    reminderDaysBefore?: IntNullableWithAggregatesFilter<"Subscription"> | number | null
    archived?: BoolWithAggregatesFilter<"Subscription"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type SubscriptionPricePointWhereInput = {
    AND?: SubscriptionPricePointWhereInput | SubscriptionPricePointWhereInput[]
    OR?: SubscriptionPricePointWhereInput[]
    NOT?: SubscriptionPricePointWhereInput | SubscriptionPricePointWhereInput[]
    id?: StringFilter<"SubscriptionPricePoint"> | string
    subscriptionId?: StringFilter<"SubscriptionPricePoint"> | string
    date?: StringFilter<"SubscriptionPricePoint"> | string
    amountSEK?: IntFilter<"SubscriptionPricePoint"> | number
    createdAt?: DateTimeFilter<"SubscriptionPricePoint"> | Date | string
    subscription?: XOR<SubscriptionScalarRelationFilter, SubscriptionWhereInput>
  }

  export type SubscriptionPricePointOrderByWithRelationInput = {
    id?: SortOrder
    subscriptionId?: SortOrder
    date?: SortOrder
    amountSEK?: SortOrder
    createdAt?: SortOrder
    subscription?: SubscriptionOrderByWithRelationInput
  }

  export type SubscriptionPricePointWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    subscriptionId_date?: SubscriptionPricePointSubscriptionIdDateCompoundUniqueInput
    AND?: SubscriptionPricePointWhereInput | SubscriptionPricePointWhereInput[]
    OR?: SubscriptionPricePointWhereInput[]
    NOT?: SubscriptionPricePointWhereInput | SubscriptionPricePointWhereInput[]
    subscriptionId?: StringFilter<"SubscriptionPricePoint"> | string
    date?: StringFilter<"SubscriptionPricePoint"> | string
    amountSEK?: IntFilter<"SubscriptionPricePoint"> | number
    createdAt?: DateTimeFilter<"SubscriptionPricePoint"> | Date | string
    subscription?: XOR<SubscriptionScalarRelationFilter, SubscriptionWhereInput>
  }, "id" | "subscriptionId_date">

  export type SubscriptionPricePointOrderByWithAggregationInput = {
    id?: SortOrder
    subscriptionId?: SortOrder
    date?: SortOrder
    amountSEK?: SortOrder
    createdAt?: SortOrder
    _count?: SubscriptionPricePointCountOrderByAggregateInput
    _avg?: SubscriptionPricePointAvgOrderByAggregateInput
    _max?: SubscriptionPricePointMaxOrderByAggregateInput
    _min?: SubscriptionPricePointMinOrderByAggregateInput
    _sum?: SubscriptionPricePointSumOrderByAggregateInput
  }

  export type SubscriptionPricePointScalarWhereWithAggregatesInput = {
    AND?: SubscriptionPricePointScalarWhereWithAggregatesInput | SubscriptionPricePointScalarWhereWithAggregatesInput[]
    OR?: SubscriptionPricePointScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionPricePointScalarWhereWithAggregatesInput | SubscriptionPricePointScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SubscriptionPricePoint"> | string
    subscriptionId?: StringWithAggregatesFilter<"SubscriptionPricePoint"> | string
    date?: StringWithAggregatesFilter<"SubscriptionPricePoint"> | string
    amountSEK?: IntWithAggregatesFilter<"SubscriptionPricePoint"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SubscriptionPricePoint"> | Date | string
  }

  export type SnapTldStateCreateInput = {
    id: string
    watchlistJson: string
    reviewedJson: string
    hiddenJson: string
    notesJson: string
    activeWeightsYaml: string
    settingsJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldStateUncheckedCreateInput = {
    id: string
    watchlistJson: string
    reviewedJson: string
    hiddenJson: string
    notesJson: string
    activeWeightsYaml: string
    settingsJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldStateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    watchlistJson?: StringFieldUpdateOperationsInput | string
    reviewedJson?: StringFieldUpdateOperationsInput | string
    hiddenJson?: StringFieldUpdateOperationsInput | string
    notesJson?: StringFieldUpdateOperationsInput | string
    activeWeightsYaml?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldStateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    watchlistJson?: StringFieldUpdateOperationsInput | string
    reviewedJson?: StringFieldUpdateOperationsInput | string
    hiddenJson?: StringFieldUpdateOperationsInput | string
    notesJson?: StringFieldUpdateOperationsInput | string
    activeWeightsYaml?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldStateCreateManyInput = {
    id: string
    watchlistJson: string
    reviewedJson: string
    hiddenJson: string
    notesJson: string
    activeWeightsYaml: string
    settingsJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldStateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    watchlistJson?: StringFieldUpdateOperationsInput | string
    reviewedJson?: StringFieldUpdateOperationsInput | string
    hiddenJson?: StringFieldUpdateOperationsInput | string
    notesJson?: StringFieldUpdateOperationsInput | string
    activeWeightsYaml?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldStateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    watchlistJson?: StringFieldUpdateOperationsInput | string
    reviewedJson?: StringFieldUpdateOperationsInput | string
    hiddenJson?: StringFieldUpdateOperationsInput | string
    notesJson?: StringFieldUpdateOperationsInput | string
    activeWeightsYaml?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldFeedOverrideCreateInput = {
    feedId: string
    status?: string | null
    scheduleJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldFeedOverrideUncheckedCreateInput = {
    feedId: string
    status?: string | null
    scheduleJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldFeedOverrideUpdateInput = {
    feedId?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldFeedOverrideUncheckedUpdateInput = {
    feedId?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldFeedOverrideCreateManyInput = {
    feedId: string
    status?: string | null
    scheduleJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldFeedOverrideUpdateManyMutationInput = {
    feedId?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldFeedOverrideUncheckedUpdateManyInput = {
    feedId?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldReportCreateInput = {
    id: string
    title: string
    generatedAt: Date | string
    domains: number
    highlight: string
    format: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldReportUncheckedCreateInput = {
    id: string
    title: string
    generatedAt: Date | string
    domains: number
    highlight: string
    format: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    domains?: IntFieldUpdateOperationsInput | number
    highlight?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    domains?: IntFieldUpdateOperationsInput | number
    highlight?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldReportCreateManyInput = {
    id: string
    title: string
    generatedAt: Date | string
    domains: number
    highlight: string
    format: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    domains?: IntFieldUpdateOperationsInput | number
    highlight?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    domains?: IntFieldUpdateOperationsInput | number
    highlight?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldImportedDomainCreateInput = {
    slug: string
    domain: string
    tld: string
    source: string
    sourceLabel: string
    importedAt: Date | string
    importedBy: string
    batchId: string
    status: string
    expiresAt: string
    totalScore: number
    verdict: string
    estimatedValueMin: number
    estimatedValueMax: number
    estimatedValueCurrency: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldImportedDomainUncheckedCreateInput = {
    slug: string
    domain: string
    tld: string
    source: string
    sourceLabel: string
    importedAt: Date | string
    importedBy: string
    batchId: string
    status: string
    expiresAt: string
    totalScore: number
    verdict: string
    estimatedValueMin: number
    estimatedValueMax: number
    estimatedValueCurrency: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldImportedDomainUpdateInput = {
    slug?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    tld?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    importedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importedBy?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    estimatedValueMin?: IntFieldUpdateOperationsInput | number
    estimatedValueMax?: IntFieldUpdateOperationsInput | number
    estimatedValueCurrency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldImportedDomainUncheckedUpdateInput = {
    slug?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    tld?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    importedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importedBy?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    estimatedValueMin?: IntFieldUpdateOperationsInput | number
    estimatedValueMax?: IntFieldUpdateOperationsInput | number
    estimatedValueCurrency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldImportedDomainCreateManyInput = {
    slug: string
    domain: string
    tld: string
    source: string
    sourceLabel: string
    importedAt: Date | string
    importedBy: string
    batchId: string
    status: string
    expiresAt: string
    totalScore: number
    verdict: string
    estimatedValueMin: number
    estimatedValueMax: number
    estimatedValueCurrency: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldImportedDomainUpdateManyMutationInput = {
    slug?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    tld?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    importedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importedBy?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    estimatedValueMin?: IntFieldUpdateOperationsInput | number
    estimatedValueMax?: IntFieldUpdateOperationsInput | number
    estimatedValueCurrency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldImportedDomainUncheckedUpdateManyInput = {
    slug?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    tld?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    importedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importedBy?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    estimatedValueMin?: IntFieldUpdateOperationsInput | number
    estimatedValueMax?: IntFieldUpdateOperationsInput | number
    estimatedValueCurrency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldDomainAnalysisCreateInput = {
    slug: string
    domain: string
    tld: string
    source: string
    fetchedAt: Date | string
    expiresAt: string
    totalScore: number
    verdict: string
    status: string
    aiSummary: string
    estimatedValueMin: number
    estimatedValueMax: number
    estimatedValueCurrency: string
    categoriesJson: string
    seoJson: string
    waybackJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldDomainAnalysisUncheckedCreateInput = {
    slug: string
    domain: string
    tld: string
    source: string
    fetchedAt: Date | string
    expiresAt: string
    totalScore: number
    verdict: string
    status: string
    aiSummary: string
    estimatedValueMin: number
    estimatedValueMax: number
    estimatedValueCurrency: string
    categoriesJson: string
    seoJson: string
    waybackJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldDomainAnalysisUpdateInput = {
    slug?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    tld?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    aiSummary?: StringFieldUpdateOperationsInput | string
    estimatedValueMin?: IntFieldUpdateOperationsInput | number
    estimatedValueMax?: IntFieldUpdateOperationsInput | number
    estimatedValueCurrency?: StringFieldUpdateOperationsInput | string
    categoriesJson?: StringFieldUpdateOperationsInput | string
    seoJson?: StringFieldUpdateOperationsInput | string
    waybackJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldDomainAnalysisUncheckedUpdateInput = {
    slug?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    tld?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    aiSummary?: StringFieldUpdateOperationsInput | string
    estimatedValueMin?: IntFieldUpdateOperationsInput | number
    estimatedValueMax?: IntFieldUpdateOperationsInput | number
    estimatedValueCurrency?: StringFieldUpdateOperationsInput | string
    categoriesJson?: StringFieldUpdateOperationsInput | string
    seoJson?: StringFieldUpdateOperationsInput | string
    waybackJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldDomainAnalysisCreateManyInput = {
    slug: string
    domain: string
    tld: string
    source: string
    fetchedAt: Date | string
    expiresAt: string
    totalScore: number
    verdict: string
    status: string
    aiSummary: string
    estimatedValueMin: number
    estimatedValueMax: number
    estimatedValueCurrency: string
    categoriesJson: string
    seoJson: string
    waybackJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapTldDomainAnalysisUpdateManyMutationInput = {
    slug?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    tld?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    aiSummary?: StringFieldUpdateOperationsInput | string
    estimatedValueMin?: IntFieldUpdateOperationsInput | number
    estimatedValueMax?: IntFieldUpdateOperationsInput | number
    estimatedValueCurrency?: StringFieldUpdateOperationsInput | string
    categoriesJson?: StringFieldUpdateOperationsInput | string
    seoJson?: StringFieldUpdateOperationsInput | string
    waybackJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapTldDomainAnalysisUncheckedUpdateManyInput = {
    slug?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    tld?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: StringFieldUpdateOperationsInput | string
    totalScore?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    aiSummary?: StringFieldUpdateOperationsInput | string
    estimatedValueMin?: IntFieldUpdateOperationsInput | number
    estimatedValueMax?: IntFieldUpdateOperationsInput | number
    estimatedValueCurrency?: StringFieldUpdateOperationsInput | string
    categoriesJson?: StringFieldUpdateOperationsInput | string
    seoJson?: StringFieldUpdateOperationsInput | string
    waybackJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveItemCreateInput = {
    id: string
    name: string
    kind: string
    mimeType?: string | null
    extension?: string | null
    sizeBytes?: number
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: string | null
    previewType: string
    previewUrl?: string | null
    previewContent?: string | null
    previewLanguage?: string | null
    previewAccent: string
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: DriveItemCreateNestedOneWithoutChildrenInput
    children?: DriveItemCreateNestedManyWithoutParentInput
    activities?: DriveActivityCreateNestedManyWithoutItemInput
  }

  export type DriveItemUncheckedCreateInput = {
    id: string
    name: string
    kind: string
    mimeType?: string | null
    extension?: string | null
    sizeBytes?: number
    parentId?: string | null
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: string | null
    previewType: string
    previewUrl?: string | null
    previewContent?: string | null
    previewLanguage?: string | null
    previewAccent: string
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: DriveItemUncheckedCreateNestedManyWithoutParentInput
    activities?: DriveActivityUncheckedCreateNestedManyWithoutItemInput
  }

  export type DriveItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: DriveItemUpdateOneWithoutChildrenNestedInput
    children?: DriveItemUpdateManyWithoutParentNestedInput
    activities?: DriveActivityUpdateManyWithoutItemNestedInput
  }

  export type DriveItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: DriveItemUncheckedUpdateManyWithoutParentNestedInput
    activities?: DriveActivityUncheckedUpdateManyWithoutItemNestedInput
  }

  export type DriveItemCreateManyInput = {
    id: string
    name: string
    kind: string
    mimeType?: string | null
    extension?: string | null
    sizeBytes?: number
    parentId?: string | null
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: string | null
    previewType: string
    previewUrl?: string | null
    previewContent?: string | null
    previewLanguage?: string | null
    previewAccent: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DriveItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveActivityCreateInput = {
    id: string
    actor: string
    action: string
    createdAt?: Date | string
    item: DriveItemCreateNestedOneWithoutActivitiesInput
  }

  export type DriveActivityUncheckedCreateInput = {
    id: string
    itemId: string
    actor: string
    action: string
    createdAt?: Date | string
  }

  export type DriveActivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item?: DriveItemUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type DriveActivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveActivityCreateManyInput = {
    id: string
    itemId: string
    actor: string
    action: string
    createdAt?: Date | string
  }

  export type DriveActivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveActivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCompanyCreateInput = {
    id: string
    name: string
    orgNumber?: string | null
    vatNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    postalCode?: string | null
    city?: string | null
    bank?: string | null
    iban?: string | null
    bankgiro?: string | null
    logoDataUrl?: string | null
    fSkatt?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: BillingInvoiceCreateNestedManyWithoutCompanyInput
  }

  export type BillingCompanyUncheckedCreateInput = {
    id: string
    name: string
    orgNumber?: string | null
    vatNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    postalCode?: string | null
    city?: string | null
    bank?: string | null
    iban?: string | null
    bankgiro?: string | null
    logoDataUrl?: string | null
    fSkatt?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: BillingInvoiceUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type BillingCompanyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    bank?: NullableStringFieldUpdateOperationsInput | string | null
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    bankgiro?: NullableStringFieldUpdateOperationsInput | string | null
    logoDataUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fSkatt?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: BillingInvoiceUpdateManyWithoutCompanyNestedInput
  }

  export type BillingCompanyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    bank?: NullableStringFieldUpdateOperationsInput | string | null
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    bankgiro?: NullableStringFieldUpdateOperationsInput | string | null
    logoDataUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fSkatt?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: BillingInvoiceUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type BillingCompanyCreateManyInput = {
    id: string
    name: string
    orgNumber?: string | null
    vatNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    postalCode?: string | null
    city?: string | null
    bank?: string | null
    iban?: string | null
    bankgiro?: string | null
    logoDataUrl?: string | null
    fSkatt?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingCompanyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    bank?: NullableStringFieldUpdateOperationsInput | string | null
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    bankgiro?: NullableStringFieldUpdateOperationsInput | string | null
    logoDataUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fSkatt?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCompanyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    bank?: NullableStringFieldUpdateOperationsInput | string | null
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    bankgiro?: NullableStringFieldUpdateOperationsInput | string | null
    logoDataUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fSkatt?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCustomerCreateInput = {
    id: string
    name: string
    orgNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    postalCode?: string | null
    city?: string | null
    contactPerson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: BillingInvoiceCreateNestedManyWithoutCustomerInput
  }

  export type BillingCustomerUncheckedCreateInput = {
    id: string
    name: string
    orgNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    postalCode?: string | null
    city?: string | null
    contactPerson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: BillingInvoiceUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type BillingCustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: BillingInvoiceUpdateManyWithoutCustomerNestedInput
  }

  export type BillingCustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: BillingInvoiceUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type BillingCustomerCreateManyInput = {
    id: string
    name: string
    orgNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    postalCode?: string | null
    city?: string | null
    contactPerson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingCustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceCreateInput = {
    id: string
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: BillingCompanyCreateNestedOneWithoutInvoicesInput
    customer?: BillingCustomerCreateNestedOneWithoutInvoicesInput
    lines?: BillingInvoiceLineCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceUncheckedCreateInput = {
    id: string
    companyId: string
    customerId?: string | null
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: BillingInvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: BillingCompanyUpdateOneRequiredWithoutInvoicesNestedInput
    customer?: BillingCustomerUpdateOneWithoutInvoicesNestedInput
    lines?: BillingInvoiceLineUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: BillingInvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceCreateManyInput = {
    id: string
    companyId: string
    customerId?: string | null
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingInvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceLineCreateInput = {
    id: string
    position: number
    description: string
    quantity: number
    unit?: string | null
    unitPriceOre: number
    articleNumber?: string | null
    invoice: BillingInvoiceCreateNestedOneWithoutLinesInput
  }

  export type BillingInvoiceLineUncheckedCreateInput = {
    id: string
    invoiceId: string
    position: number
    description: string
    quantity: number
    unit?: string | null
    unitPriceOre: number
    articleNumber?: string | null
  }

  export type BillingInvoiceLineUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    unitPriceOre?: IntFieldUpdateOperationsInput | number
    articleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoice?: BillingInvoiceUpdateOneRequiredWithoutLinesNestedInput
  }

  export type BillingInvoiceLineUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    unitPriceOre?: IntFieldUpdateOperationsInput | number
    articleNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingInvoiceLineCreateManyInput = {
    id: string
    invoiceId: string
    position: number
    description: string
    quantity: number
    unit?: string | null
    unitPriceOre: number
    articleNumber?: string | null
  }

  export type BillingInvoiceLineUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    unitPriceOre?: IntFieldUpdateOperationsInput | number
    articleNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingInvoiceLineUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    unitPriceOre?: IntFieldUpdateOperationsInput | number
    articleNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubscriptionCreateInput = {
    id: string
    name: string
    description?: string
    category: string
    status: string
    amountSEK: number
    billingCycle: string
    startedAt: string
    nextRenewal: string
    cancelledAt?: string | null
    website?: string | null
    notes?: string | null
    owner?: string | null
    businessExpense?: boolean
    reminderDaysBefore?: number | null
    archived?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    priceHistory?: SubscriptionPricePointCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id: string
    name: string
    description?: string
    category: string
    status: string
    amountSEK: number
    billingCycle: string
    startedAt: string
    nextRenewal: string
    cancelledAt?: string | null
    website?: string | null
    notes?: string | null
    owner?: string | null
    businessExpense?: boolean
    reminderDaysBefore?: number | null
    archived?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    priceHistory?: SubscriptionPricePointUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    billingCycle?: StringFieldUpdateOperationsInput | string
    startedAt?: StringFieldUpdateOperationsInput | string
    nextRenewal?: StringFieldUpdateOperationsInput | string
    cancelledAt?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    businessExpense?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: NullableIntFieldUpdateOperationsInput | number | null
    archived?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    priceHistory?: SubscriptionPricePointUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    billingCycle?: StringFieldUpdateOperationsInput | string
    startedAt?: StringFieldUpdateOperationsInput | string
    nextRenewal?: StringFieldUpdateOperationsInput | string
    cancelledAt?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    businessExpense?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: NullableIntFieldUpdateOperationsInput | number | null
    archived?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    priceHistory?: SubscriptionPricePointUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionCreateManyInput = {
    id: string
    name: string
    description?: string
    category: string
    status: string
    amountSEK: number
    billingCycle: string
    startedAt: string
    nextRenewal: string
    cancelledAt?: string | null
    website?: string | null
    notes?: string | null
    owner?: string | null
    businessExpense?: boolean
    reminderDaysBefore?: number | null
    archived?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    billingCycle?: StringFieldUpdateOperationsInput | string
    startedAt?: StringFieldUpdateOperationsInput | string
    nextRenewal?: StringFieldUpdateOperationsInput | string
    cancelledAt?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    businessExpense?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: NullableIntFieldUpdateOperationsInput | number | null
    archived?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    billingCycle?: StringFieldUpdateOperationsInput | string
    startedAt?: StringFieldUpdateOperationsInput | string
    nextRenewal?: StringFieldUpdateOperationsInput | string
    cancelledAt?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    businessExpense?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: NullableIntFieldUpdateOperationsInput | number | null
    archived?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPricePointCreateInput = {
    id: string
    date: string
    amountSEK: number
    createdAt?: Date | string
    subscription: SubscriptionCreateNestedOneWithoutPriceHistoryInput
  }

  export type SubscriptionPricePointUncheckedCreateInput = {
    id: string
    subscriptionId: string
    date: string
    amountSEK: number
    createdAt?: Date | string
  }

  export type SubscriptionPricePointUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: SubscriptionUpdateOneRequiredWithoutPriceHistoryNestedInput
  }

  export type SubscriptionPricePointUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPricePointCreateManyInput = {
    id: string
    subscriptionId: string
    date: string
    amountSEK: number
    createdAt?: Date | string
  }

  export type SubscriptionPricePointUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPricePointUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SnapTldStateCountOrderByAggregateInput = {
    id?: SortOrder
    watchlistJson?: SortOrder
    reviewedJson?: SortOrder
    hiddenJson?: SortOrder
    notesJson?: SortOrder
    activeWeightsYaml?: SortOrder
    settingsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldStateMaxOrderByAggregateInput = {
    id?: SortOrder
    watchlistJson?: SortOrder
    reviewedJson?: SortOrder
    hiddenJson?: SortOrder
    notesJson?: SortOrder
    activeWeightsYaml?: SortOrder
    settingsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldStateMinOrderByAggregateInput = {
    id?: SortOrder
    watchlistJson?: SortOrder
    reviewedJson?: SortOrder
    hiddenJson?: SortOrder
    notesJson?: SortOrder
    activeWeightsYaml?: SortOrder
    settingsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SnapTldFeedOverrideCountOrderByAggregateInput = {
    feedId?: SortOrder
    status?: SortOrder
    scheduleJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldFeedOverrideMaxOrderByAggregateInput = {
    feedId?: SortOrder
    status?: SortOrder
    scheduleJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldFeedOverrideMinOrderByAggregateInput = {
    feedId?: SortOrder
    status?: SortOrder
    scheduleJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SnapTldReportCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    generatedAt?: SortOrder
    domains?: SortOrder
    highlight?: SortOrder
    format?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldReportAvgOrderByAggregateInput = {
    domains?: SortOrder
  }

  export type SnapTldReportMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    generatedAt?: SortOrder
    domains?: SortOrder
    highlight?: SortOrder
    format?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldReportMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    generatedAt?: SortOrder
    domains?: SortOrder
    highlight?: SortOrder
    format?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldReportSumOrderByAggregateInput = {
    domains?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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

  export type SnapTldImportedDomainCountOrderByAggregateInput = {
    slug?: SortOrder
    domain?: SortOrder
    tld?: SortOrder
    source?: SortOrder
    sourceLabel?: SortOrder
    importedAt?: SortOrder
    importedBy?: SortOrder
    batchId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    totalScore?: SortOrder
    verdict?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
    estimatedValueCurrency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldImportedDomainAvgOrderByAggregateInput = {
    totalScore?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
  }

  export type SnapTldImportedDomainMaxOrderByAggregateInput = {
    slug?: SortOrder
    domain?: SortOrder
    tld?: SortOrder
    source?: SortOrder
    sourceLabel?: SortOrder
    importedAt?: SortOrder
    importedBy?: SortOrder
    batchId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    totalScore?: SortOrder
    verdict?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
    estimatedValueCurrency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldImportedDomainMinOrderByAggregateInput = {
    slug?: SortOrder
    domain?: SortOrder
    tld?: SortOrder
    source?: SortOrder
    sourceLabel?: SortOrder
    importedAt?: SortOrder
    importedBy?: SortOrder
    batchId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    totalScore?: SortOrder
    verdict?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
    estimatedValueCurrency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldImportedDomainSumOrderByAggregateInput = {
    totalScore?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
  }

  export type SnapTldDomainAnalysisCountOrderByAggregateInput = {
    slug?: SortOrder
    domain?: SortOrder
    tld?: SortOrder
    source?: SortOrder
    fetchedAt?: SortOrder
    expiresAt?: SortOrder
    totalScore?: SortOrder
    verdict?: SortOrder
    status?: SortOrder
    aiSummary?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
    estimatedValueCurrency?: SortOrder
    categoriesJson?: SortOrder
    seoJson?: SortOrder
    waybackJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldDomainAnalysisAvgOrderByAggregateInput = {
    totalScore?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
  }

  export type SnapTldDomainAnalysisMaxOrderByAggregateInput = {
    slug?: SortOrder
    domain?: SortOrder
    tld?: SortOrder
    source?: SortOrder
    fetchedAt?: SortOrder
    expiresAt?: SortOrder
    totalScore?: SortOrder
    verdict?: SortOrder
    status?: SortOrder
    aiSummary?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
    estimatedValueCurrency?: SortOrder
    categoriesJson?: SortOrder
    seoJson?: SortOrder
    waybackJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldDomainAnalysisMinOrderByAggregateInput = {
    slug?: SortOrder
    domain?: SortOrder
    tld?: SortOrder
    source?: SortOrder
    fetchedAt?: SortOrder
    expiresAt?: SortOrder
    totalScore?: SortOrder
    verdict?: SortOrder
    status?: SortOrder
    aiSummary?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
    estimatedValueCurrency?: SortOrder
    categoriesJson?: SortOrder
    seoJson?: SortOrder
    waybackJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapTldDomainAnalysisSumOrderByAggregateInput = {
    totalScore?: SortOrder
    estimatedValueMin?: SortOrder
    estimatedValueMax?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DriveItemNullableScalarRelationFilter = {
    is?: DriveItemWhereInput | null
    isNot?: DriveItemWhereInput | null
  }

  export type DriveItemListRelationFilter = {
    every?: DriveItemWhereInput
    some?: DriveItemWhereInput
    none?: DriveItemWhereInput
  }

  export type DriveActivityListRelationFilter = {
    every?: DriveActivityWhereInput
    some?: DriveActivityWhereInput
    none?: DriveActivityWhereInput
  }

  export type DriveItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DriveActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DriveItemCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    mimeType?: SortOrder
    extension?: SortOrder
    sizeBytes?: SortOrder
    parentId?: SortOrder
    pathJson?: SortOrder
    ownerId?: SortOrder
    ownerName?: SortOrder
    ownerInitials?: SortOrder
    isFavorite?: SortOrder
    isDeleted?: SortOrder
    storageKey?: SortOrder
    previewType?: SortOrder
    previewUrl?: SortOrder
    previewContent?: SortOrder
    previewLanguage?: SortOrder
    previewAccent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DriveItemAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type DriveItemMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    mimeType?: SortOrder
    extension?: SortOrder
    sizeBytes?: SortOrder
    parentId?: SortOrder
    pathJson?: SortOrder
    ownerId?: SortOrder
    ownerName?: SortOrder
    ownerInitials?: SortOrder
    isFavorite?: SortOrder
    isDeleted?: SortOrder
    storageKey?: SortOrder
    previewType?: SortOrder
    previewUrl?: SortOrder
    previewContent?: SortOrder
    previewLanguage?: SortOrder
    previewAccent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DriveItemMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    mimeType?: SortOrder
    extension?: SortOrder
    sizeBytes?: SortOrder
    parentId?: SortOrder
    pathJson?: SortOrder
    ownerId?: SortOrder
    ownerName?: SortOrder
    ownerInitials?: SortOrder
    isFavorite?: SortOrder
    isDeleted?: SortOrder
    storageKey?: SortOrder
    previewType?: SortOrder
    previewUrl?: SortOrder
    previewContent?: SortOrder
    previewLanguage?: SortOrder
    previewAccent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DriveItemSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DriveItemScalarRelationFilter = {
    is?: DriveItemWhereInput
    isNot?: DriveItemWhereInput
  }

  export type DriveActivityCountOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type DriveActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type DriveActivityMinOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingInvoiceListRelationFilter = {
    every?: BillingInvoiceWhereInput
    some?: BillingInvoiceWhereInput
    none?: BillingInvoiceWhereInput
  }

  export type BillingInvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BillingCompanyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    orgNumber?: SortOrder
    vatNumber?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    postalCode?: SortOrder
    city?: SortOrder
    bank?: SortOrder
    iban?: SortOrder
    bankgiro?: SortOrder
    logoDataUrl?: SortOrder
    fSkatt?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingCompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    orgNumber?: SortOrder
    vatNumber?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    postalCode?: SortOrder
    city?: SortOrder
    bank?: SortOrder
    iban?: SortOrder
    bankgiro?: SortOrder
    logoDataUrl?: SortOrder
    fSkatt?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingCompanyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    orgNumber?: SortOrder
    vatNumber?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    postalCode?: SortOrder
    city?: SortOrder
    bank?: SortOrder
    iban?: SortOrder
    bankgiro?: SortOrder
    logoDataUrl?: SortOrder
    fSkatt?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingCustomerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    orgNumber?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    postalCode?: SortOrder
    city?: SortOrder
    contactPerson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingCustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    orgNumber?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    postalCode?: SortOrder
    city?: SortOrder
    contactPerson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingCustomerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    orgNumber?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    postalCode?: SortOrder
    city?: SortOrder
    contactPerson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BillingCompanyScalarRelationFilter = {
    is?: BillingCompanyWhereInput
    isNot?: BillingCompanyWhereInput
  }

  export type BillingCustomerNullableScalarRelationFilter = {
    is?: BillingCustomerWhereInput | null
    isNot?: BillingCustomerWhereInput | null
  }

  export type BillingInvoiceLineListRelationFilter = {
    every?: BillingInvoiceLineWhereInput
    some?: BillingInvoiceLineWhereInput
    none?: BillingInvoiceLineWhereInput
  }

  export type BillingInvoiceLineOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BillingInvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    customerId?: SortOrder
    customerName?: SortOrder
    customerOrgNumber?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    customerAddress?: SortOrder
    customerPostalCode?: SortOrder
    customerCity?: SortOrder
    customerContactPerson?: SortOrder
    status?: SortOrder
    vatRate?: SortOrder
    currency?: SortOrder
    dueDate?: SortOrder
    issuedDate?: SortOrder
    paidDate?: SortOrder
    paymentTermsDays?: SortOrder
    notes?: SortOrder
    theirReference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingInvoiceAvgOrderByAggregateInput = {
    vatRate?: SortOrder
    paymentTermsDays?: SortOrder
  }

  export type BillingInvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    customerId?: SortOrder
    customerName?: SortOrder
    customerOrgNumber?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    customerAddress?: SortOrder
    customerPostalCode?: SortOrder
    customerCity?: SortOrder
    customerContactPerson?: SortOrder
    status?: SortOrder
    vatRate?: SortOrder
    currency?: SortOrder
    dueDate?: SortOrder
    issuedDate?: SortOrder
    paidDate?: SortOrder
    paymentTermsDays?: SortOrder
    notes?: SortOrder
    theirReference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingInvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    customerId?: SortOrder
    customerName?: SortOrder
    customerOrgNumber?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    customerAddress?: SortOrder
    customerPostalCode?: SortOrder
    customerCity?: SortOrder
    customerContactPerson?: SortOrder
    status?: SortOrder
    vatRate?: SortOrder
    currency?: SortOrder
    dueDate?: SortOrder
    issuedDate?: SortOrder
    paidDate?: SortOrder
    paymentTermsDays?: SortOrder
    notes?: SortOrder
    theirReference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingInvoiceSumOrderByAggregateInput = {
    vatRate?: SortOrder
    paymentTermsDays?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
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

  export type BillingInvoiceScalarRelationFilter = {
    is?: BillingInvoiceWhereInput
    isNot?: BillingInvoiceWhereInput
  }

  export type BillingInvoiceLineCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    position?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
    unitPriceOre?: SortOrder
    articleNumber?: SortOrder
  }

  export type BillingInvoiceLineAvgOrderByAggregateInput = {
    position?: SortOrder
    quantity?: SortOrder
    unitPriceOre?: SortOrder
  }

  export type BillingInvoiceLineMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    position?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
    unitPriceOre?: SortOrder
    articleNumber?: SortOrder
  }

  export type BillingInvoiceLineMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    position?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
    unitPriceOre?: SortOrder
    articleNumber?: SortOrder
  }

  export type BillingInvoiceLineSumOrderByAggregateInput = {
    position?: SortOrder
    quantity?: SortOrder
    unitPriceOre?: SortOrder
  }

  export type SubscriptionPricePointListRelationFilter = {
    every?: SubscriptionPricePointWhereInput
    some?: SubscriptionPricePointWhereInput
    none?: SubscriptionPricePointWhereInput
  }

  export type SubscriptionPricePointOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    amountSEK?: SortOrder
    billingCycle?: SortOrder
    startedAt?: SortOrder
    nextRenewal?: SortOrder
    cancelledAt?: SortOrder
    website?: SortOrder
    notes?: SortOrder
    owner?: SortOrder
    businessExpense?: SortOrder
    reminderDaysBefore?: SortOrder
    archived?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionAvgOrderByAggregateInput = {
    amountSEK?: SortOrder
    reminderDaysBefore?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    amountSEK?: SortOrder
    billingCycle?: SortOrder
    startedAt?: SortOrder
    nextRenewal?: SortOrder
    cancelledAt?: SortOrder
    website?: SortOrder
    notes?: SortOrder
    owner?: SortOrder
    businessExpense?: SortOrder
    reminderDaysBefore?: SortOrder
    archived?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    amountSEK?: SortOrder
    billingCycle?: SortOrder
    startedAt?: SortOrder
    nextRenewal?: SortOrder
    cancelledAt?: SortOrder
    website?: SortOrder
    notes?: SortOrder
    owner?: SortOrder
    businessExpense?: SortOrder
    reminderDaysBefore?: SortOrder
    archived?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionSumOrderByAggregateInput = {
    amountSEK?: SortOrder
    reminderDaysBefore?: SortOrder
  }

  export type SubscriptionScalarRelationFilter = {
    is?: SubscriptionWhereInput
    isNot?: SubscriptionWhereInput
  }

  export type SubscriptionPricePointSubscriptionIdDateCompoundUniqueInput = {
    subscriptionId: string
    date: string
  }

  export type SubscriptionPricePointCountOrderByAggregateInput = {
    id?: SortOrder
    subscriptionId?: SortOrder
    date?: SortOrder
    amountSEK?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionPricePointAvgOrderByAggregateInput = {
    amountSEK?: SortOrder
  }

  export type SubscriptionPricePointMaxOrderByAggregateInput = {
    id?: SortOrder
    subscriptionId?: SortOrder
    date?: SortOrder
    amountSEK?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionPricePointMinOrderByAggregateInput = {
    id?: SortOrder
    subscriptionId?: SortOrder
    date?: SortOrder
    amountSEK?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionPricePointSumOrderByAggregateInput = {
    amountSEK?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DriveItemCreateNestedOneWithoutChildrenInput = {
    create?: XOR<DriveItemCreateWithoutChildrenInput, DriveItemUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: DriveItemCreateOrConnectWithoutChildrenInput
    connect?: DriveItemWhereUniqueInput
  }

  export type DriveItemCreateNestedManyWithoutParentInput = {
    create?: XOR<DriveItemCreateWithoutParentInput, DriveItemUncheckedCreateWithoutParentInput> | DriveItemCreateWithoutParentInput[] | DriveItemUncheckedCreateWithoutParentInput[]
    connectOrCreate?: DriveItemCreateOrConnectWithoutParentInput | DriveItemCreateOrConnectWithoutParentInput[]
    createMany?: DriveItemCreateManyParentInputEnvelope
    connect?: DriveItemWhereUniqueInput | DriveItemWhereUniqueInput[]
  }

  export type DriveActivityCreateNestedManyWithoutItemInput = {
    create?: XOR<DriveActivityCreateWithoutItemInput, DriveActivityUncheckedCreateWithoutItemInput> | DriveActivityCreateWithoutItemInput[] | DriveActivityUncheckedCreateWithoutItemInput[]
    connectOrCreate?: DriveActivityCreateOrConnectWithoutItemInput | DriveActivityCreateOrConnectWithoutItemInput[]
    createMany?: DriveActivityCreateManyItemInputEnvelope
    connect?: DriveActivityWhereUniqueInput | DriveActivityWhereUniqueInput[]
  }

  export type DriveItemUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<DriveItemCreateWithoutParentInput, DriveItemUncheckedCreateWithoutParentInput> | DriveItemCreateWithoutParentInput[] | DriveItemUncheckedCreateWithoutParentInput[]
    connectOrCreate?: DriveItemCreateOrConnectWithoutParentInput | DriveItemCreateOrConnectWithoutParentInput[]
    createMany?: DriveItemCreateManyParentInputEnvelope
    connect?: DriveItemWhereUniqueInput | DriveItemWhereUniqueInput[]
  }

  export type DriveActivityUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<DriveActivityCreateWithoutItemInput, DriveActivityUncheckedCreateWithoutItemInput> | DriveActivityCreateWithoutItemInput[] | DriveActivityUncheckedCreateWithoutItemInput[]
    connectOrCreate?: DriveActivityCreateOrConnectWithoutItemInput | DriveActivityCreateOrConnectWithoutItemInput[]
    createMany?: DriveActivityCreateManyItemInputEnvelope
    connect?: DriveActivityWhereUniqueInput | DriveActivityWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DriveItemUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<DriveItemCreateWithoutChildrenInput, DriveItemUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: DriveItemCreateOrConnectWithoutChildrenInput
    upsert?: DriveItemUpsertWithoutChildrenInput
    disconnect?: DriveItemWhereInput | boolean
    delete?: DriveItemWhereInput | boolean
    connect?: DriveItemWhereUniqueInput
    update?: XOR<XOR<DriveItemUpdateToOneWithWhereWithoutChildrenInput, DriveItemUpdateWithoutChildrenInput>, DriveItemUncheckedUpdateWithoutChildrenInput>
  }

  export type DriveItemUpdateManyWithoutParentNestedInput = {
    create?: XOR<DriveItemCreateWithoutParentInput, DriveItemUncheckedCreateWithoutParentInput> | DriveItemCreateWithoutParentInput[] | DriveItemUncheckedCreateWithoutParentInput[]
    connectOrCreate?: DriveItemCreateOrConnectWithoutParentInput | DriveItemCreateOrConnectWithoutParentInput[]
    upsert?: DriveItemUpsertWithWhereUniqueWithoutParentInput | DriveItemUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: DriveItemCreateManyParentInputEnvelope
    set?: DriveItemWhereUniqueInput | DriveItemWhereUniqueInput[]
    disconnect?: DriveItemWhereUniqueInput | DriveItemWhereUniqueInput[]
    delete?: DriveItemWhereUniqueInput | DriveItemWhereUniqueInput[]
    connect?: DriveItemWhereUniqueInput | DriveItemWhereUniqueInput[]
    update?: DriveItemUpdateWithWhereUniqueWithoutParentInput | DriveItemUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: DriveItemUpdateManyWithWhereWithoutParentInput | DriveItemUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: DriveItemScalarWhereInput | DriveItemScalarWhereInput[]
  }

  export type DriveActivityUpdateManyWithoutItemNestedInput = {
    create?: XOR<DriveActivityCreateWithoutItemInput, DriveActivityUncheckedCreateWithoutItemInput> | DriveActivityCreateWithoutItemInput[] | DriveActivityUncheckedCreateWithoutItemInput[]
    connectOrCreate?: DriveActivityCreateOrConnectWithoutItemInput | DriveActivityCreateOrConnectWithoutItemInput[]
    upsert?: DriveActivityUpsertWithWhereUniqueWithoutItemInput | DriveActivityUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: DriveActivityCreateManyItemInputEnvelope
    set?: DriveActivityWhereUniqueInput | DriveActivityWhereUniqueInput[]
    disconnect?: DriveActivityWhereUniqueInput | DriveActivityWhereUniqueInput[]
    delete?: DriveActivityWhereUniqueInput | DriveActivityWhereUniqueInput[]
    connect?: DriveActivityWhereUniqueInput | DriveActivityWhereUniqueInput[]
    update?: DriveActivityUpdateWithWhereUniqueWithoutItemInput | DriveActivityUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: DriveActivityUpdateManyWithWhereWithoutItemInput | DriveActivityUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: DriveActivityScalarWhereInput | DriveActivityScalarWhereInput[]
  }

  export type DriveItemUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<DriveItemCreateWithoutParentInput, DriveItemUncheckedCreateWithoutParentInput> | DriveItemCreateWithoutParentInput[] | DriveItemUncheckedCreateWithoutParentInput[]
    connectOrCreate?: DriveItemCreateOrConnectWithoutParentInput | DriveItemCreateOrConnectWithoutParentInput[]
    upsert?: DriveItemUpsertWithWhereUniqueWithoutParentInput | DriveItemUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: DriveItemCreateManyParentInputEnvelope
    set?: DriveItemWhereUniqueInput | DriveItemWhereUniqueInput[]
    disconnect?: DriveItemWhereUniqueInput | DriveItemWhereUniqueInput[]
    delete?: DriveItemWhereUniqueInput | DriveItemWhereUniqueInput[]
    connect?: DriveItemWhereUniqueInput | DriveItemWhereUniqueInput[]
    update?: DriveItemUpdateWithWhereUniqueWithoutParentInput | DriveItemUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: DriveItemUpdateManyWithWhereWithoutParentInput | DriveItemUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: DriveItemScalarWhereInput | DriveItemScalarWhereInput[]
  }

  export type DriveActivityUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<DriveActivityCreateWithoutItemInput, DriveActivityUncheckedCreateWithoutItemInput> | DriveActivityCreateWithoutItemInput[] | DriveActivityUncheckedCreateWithoutItemInput[]
    connectOrCreate?: DriveActivityCreateOrConnectWithoutItemInput | DriveActivityCreateOrConnectWithoutItemInput[]
    upsert?: DriveActivityUpsertWithWhereUniqueWithoutItemInput | DriveActivityUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: DriveActivityCreateManyItemInputEnvelope
    set?: DriveActivityWhereUniqueInput | DriveActivityWhereUniqueInput[]
    disconnect?: DriveActivityWhereUniqueInput | DriveActivityWhereUniqueInput[]
    delete?: DriveActivityWhereUniqueInput | DriveActivityWhereUniqueInput[]
    connect?: DriveActivityWhereUniqueInput | DriveActivityWhereUniqueInput[]
    update?: DriveActivityUpdateWithWhereUniqueWithoutItemInput | DriveActivityUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: DriveActivityUpdateManyWithWhereWithoutItemInput | DriveActivityUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: DriveActivityScalarWhereInput | DriveActivityScalarWhereInput[]
  }

  export type DriveItemCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<DriveItemCreateWithoutActivitiesInput, DriveItemUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: DriveItemCreateOrConnectWithoutActivitiesInput
    connect?: DriveItemWhereUniqueInput
  }

  export type DriveItemUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<DriveItemCreateWithoutActivitiesInput, DriveItemUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: DriveItemCreateOrConnectWithoutActivitiesInput
    upsert?: DriveItemUpsertWithoutActivitiesInput
    connect?: DriveItemWhereUniqueInput
    update?: XOR<XOR<DriveItemUpdateToOneWithWhereWithoutActivitiesInput, DriveItemUpdateWithoutActivitiesInput>, DriveItemUncheckedUpdateWithoutActivitiesInput>
  }

  export type BillingInvoiceCreateNestedManyWithoutCompanyInput = {
    create?: XOR<BillingInvoiceCreateWithoutCompanyInput, BillingInvoiceUncheckedCreateWithoutCompanyInput> | BillingInvoiceCreateWithoutCompanyInput[] | BillingInvoiceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutCompanyInput | BillingInvoiceCreateOrConnectWithoutCompanyInput[]
    createMany?: BillingInvoiceCreateManyCompanyInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type BillingInvoiceUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<BillingInvoiceCreateWithoutCompanyInput, BillingInvoiceUncheckedCreateWithoutCompanyInput> | BillingInvoiceCreateWithoutCompanyInput[] | BillingInvoiceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutCompanyInput | BillingInvoiceCreateOrConnectWithoutCompanyInput[]
    createMany?: BillingInvoiceCreateManyCompanyInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type BillingInvoiceUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutCompanyInput, BillingInvoiceUncheckedCreateWithoutCompanyInput> | BillingInvoiceCreateWithoutCompanyInput[] | BillingInvoiceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutCompanyInput | BillingInvoiceCreateOrConnectWithoutCompanyInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutCompanyInput | BillingInvoiceUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: BillingInvoiceCreateManyCompanyInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutCompanyInput | BillingInvoiceUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutCompanyInput | BillingInvoiceUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutCompanyInput, BillingInvoiceUncheckedCreateWithoutCompanyInput> | BillingInvoiceCreateWithoutCompanyInput[] | BillingInvoiceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutCompanyInput | BillingInvoiceCreateOrConnectWithoutCompanyInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutCompanyInput | BillingInvoiceUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: BillingInvoiceCreateManyCompanyInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutCompanyInput | BillingInvoiceUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutCompanyInput | BillingInvoiceUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type BillingInvoiceCreateNestedManyWithoutCustomerInput = {
    create?: XOR<BillingInvoiceCreateWithoutCustomerInput, BillingInvoiceUncheckedCreateWithoutCustomerInput> | BillingInvoiceCreateWithoutCustomerInput[] | BillingInvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutCustomerInput | BillingInvoiceCreateOrConnectWithoutCustomerInput[]
    createMany?: BillingInvoiceCreateManyCustomerInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type BillingInvoiceUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<BillingInvoiceCreateWithoutCustomerInput, BillingInvoiceUncheckedCreateWithoutCustomerInput> | BillingInvoiceCreateWithoutCustomerInput[] | BillingInvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutCustomerInput | BillingInvoiceCreateOrConnectWithoutCustomerInput[]
    createMany?: BillingInvoiceCreateManyCustomerInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type BillingInvoiceUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutCustomerInput, BillingInvoiceUncheckedCreateWithoutCustomerInput> | BillingInvoiceCreateWithoutCustomerInput[] | BillingInvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutCustomerInput | BillingInvoiceCreateOrConnectWithoutCustomerInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutCustomerInput | BillingInvoiceUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: BillingInvoiceCreateManyCustomerInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutCustomerInput | BillingInvoiceUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutCustomerInput | BillingInvoiceUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutCustomerInput, BillingInvoiceUncheckedCreateWithoutCustomerInput> | BillingInvoiceCreateWithoutCustomerInput[] | BillingInvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutCustomerInput | BillingInvoiceCreateOrConnectWithoutCustomerInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutCustomerInput | BillingInvoiceUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: BillingInvoiceCreateManyCustomerInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutCustomerInput | BillingInvoiceUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutCustomerInput | BillingInvoiceUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type BillingCompanyCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<BillingCompanyCreateWithoutInvoicesInput, BillingCompanyUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: BillingCompanyCreateOrConnectWithoutInvoicesInput
    connect?: BillingCompanyWhereUniqueInput
  }

  export type BillingCustomerCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<BillingCustomerCreateWithoutInvoicesInput, BillingCustomerUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: BillingCustomerCreateOrConnectWithoutInvoicesInput
    connect?: BillingCustomerWhereUniqueInput
  }

  export type BillingInvoiceLineCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<BillingInvoiceLineCreateWithoutInvoiceInput, BillingInvoiceLineUncheckedCreateWithoutInvoiceInput> | BillingInvoiceLineCreateWithoutInvoiceInput[] | BillingInvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: BillingInvoiceLineCreateOrConnectWithoutInvoiceInput | BillingInvoiceLineCreateOrConnectWithoutInvoiceInput[]
    createMany?: BillingInvoiceLineCreateManyInvoiceInputEnvelope
    connect?: BillingInvoiceLineWhereUniqueInput | BillingInvoiceLineWhereUniqueInput[]
  }

  export type BillingInvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<BillingInvoiceLineCreateWithoutInvoiceInput, BillingInvoiceLineUncheckedCreateWithoutInvoiceInput> | BillingInvoiceLineCreateWithoutInvoiceInput[] | BillingInvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: BillingInvoiceLineCreateOrConnectWithoutInvoiceInput | BillingInvoiceLineCreateOrConnectWithoutInvoiceInput[]
    createMany?: BillingInvoiceLineCreateManyInvoiceInputEnvelope
    connect?: BillingInvoiceLineWhereUniqueInput | BillingInvoiceLineWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BillingCompanyUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<BillingCompanyCreateWithoutInvoicesInput, BillingCompanyUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: BillingCompanyCreateOrConnectWithoutInvoicesInput
    upsert?: BillingCompanyUpsertWithoutInvoicesInput
    connect?: BillingCompanyWhereUniqueInput
    update?: XOR<XOR<BillingCompanyUpdateToOneWithWhereWithoutInvoicesInput, BillingCompanyUpdateWithoutInvoicesInput>, BillingCompanyUncheckedUpdateWithoutInvoicesInput>
  }

  export type BillingCustomerUpdateOneWithoutInvoicesNestedInput = {
    create?: XOR<BillingCustomerCreateWithoutInvoicesInput, BillingCustomerUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: BillingCustomerCreateOrConnectWithoutInvoicesInput
    upsert?: BillingCustomerUpsertWithoutInvoicesInput
    disconnect?: BillingCustomerWhereInput | boolean
    delete?: BillingCustomerWhereInput | boolean
    connect?: BillingCustomerWhereUniqueInput
    update?: XOR<XOR<BillingCustomerUpdateToOneWithWhereWithoutInvoicesInput, BillingCustomerUpdateWithoutInvoicesInput>, BillingCustomerUncheckedUpdateWithoutInvoicesInput>
  }

  export type BillingInvoiceLineUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<BillingInvoiceLineCreateWithoutInvoiceInput, BillingInvoiceLineUncheckedCreateWithoutInvoiceInput> | BillingInvoiceLineCreateWithoutInvoiceInput[] | BillingInvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: BillingInvoiceLineCreateOrConnectWithoutInvoiceInput | BillingInvoiceLineCreateOrConnectWithoutInvoiceInput[]
    upsert?: BillingInvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput | BillingInvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: BillingInvoiceLineCreateManyInvoiceInputEnvelope
    set?: BillingInvoiceLineWhereUniqueInput | BillingInvoiceLineWhereUniqueInput[]
    disconnect?: BillingInvoiceLineWhereUniqueInput | BillingInvoiceLineWhereUniqueInput[]
    delete?: BillingInvoiceLineWhereUniqueInput | BillingInvoiceLineWhereUniqueInput[]
    connect?: BillingInvoiceLineWhereUniqueInput | BillingInvoiceLineWhereUniqueInput[]
    update?: BillingInvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput | BillingInvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: BillingInvoiceLineUpdateManyWithWhereWithoutInvoiceInput | BillingInvoiceLineUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: BillingInvoiceLineScalarWhereInput | BillingInvoiceLineScalarWhereInput[]
  }

  export type BillingInvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<BillingInvoiceLineCreateWithoutInvoiceInput, BillingInvoiceLineUncheckedCreateWithoutInvoiceInput> | BillingInvoiceLineCreateWithoutInvoiceInput[] | BillingInvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: BillingInvoiceLineCreateOrConnectWithoutInvoiceInput | BillingInvoiceLineCreateOrConnectWithoutInvoiceInput[]
    upsert?: BillingInvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput | BillingInvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: BillingInvoiceLineCreateManyInvoiceInputEnvelope
    set?: BillingInvoiceLineWhereUniqueInput | BillingInvoiceLineWhereUniqueInput[]
    disconnect?: BillingInvoiceLineWhereUniqueInput | BillingInvoiceLineWhereUniqueInput[]
    delete?: BillingInvoiceLineWhereUniqueInput | BillingInvoiceLineWhereUniqueInput[]
    connect?: BillingInvoiceLineWhereUniqueInput | BillingInvoiceLineWhereUniqueInput[]
    update?: BillingInvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput | BillingInvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: BillingInvoiceLineUpdateManyWithWhereWithoutInvoiceInput | BillingInvoiceLineUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: BillingInvoiceLineScalarWhereInput | BillingInvoiceLineScalarWhereInput[]
  }

  export type BillingInvoiceCreateNestedOneWithoutLinesInput = {
    create?: XOR<BillingInvoiceCreateWithoutLinesInput, BillingInvoiceUncheckedCreateWithoutLinesInput>
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutLinesInput
    connect?: BillingInvoiceWhereUniqueInput
  }

  export type BillingInvoiceUpdateOneRequiredWithoutLinesNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutLinesInput, BillingInvoiceUncheckedCreateWithoutLinesInput>
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutLinesInput
    upsert?: BillingInvoiceUpsertWithoutLinesInput
    connect?: BillingInvoiceWhereUniqueInput
    update?: XOR<XOR<BillingInvoiceUpdateToOneWithWhereWithoutLinesInput, BillingInvoiceUpdateWithoutLinesInput>, BillingInvoiceUncheckedUpdateWithoutLinesInput>
  }

  export type SubscriptionPricePointCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<SubscriptionPricePointCreateWithoutSubscriptionInput, SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput> | SubscriptionPricePointCreateWithoutSubscriptionInput[] | SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: SubscriptionPricePointCreateOrConnectWithoutSubscriptionInput | SubscriptionPricePointCreateOrConnectWithoutSubscriptionInput[]
    createMany?: SubscriptionPricePointCreateManySubscriptionInputEnvelope
    connect?: SubscriptionPricePointWhereUniqueInput | SubscriptionPricePointWhereUniqueInput[]
  }

  export type SubscriptionPricePointUncheckedCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<SubscriptionPricePointCreateWithoutSubscriptionInput, SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput> | SubscriptionPricePointCreateWithoutSubscriptionInput[] | SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: SubscriptionPricePointCreateOrConnectWithoutSubscriptionInput | SubscriptionPricePointCreateOrConnectWithoutSubscriptionInput[]
    createMany?: SubscriptionPricePointCreateManySubscriptionInputEnvelope
    connect?: SubscriptionPricePointWhereUniqueInput | SubscriptionPricePointWhereUniqueInput[]
  }

  export type SubscriptionPricePointUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<SubscriptionPricePointCreateWithoutSubscriptionInput, SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput> | SubscriptionPricePointCreateWithoutSubscriptionInput[] | SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: SubscriptionPricePointCreateOrConnectWithoutSubscriptionInput | SubscriptionPricePointCreateOrConnectWithoutSubscriptionInput[]
    upsert?: SubscriptionPricePointUpsertWithWhereUniqueWithoutSubscriptionInput | SubscriptionPricePointUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: SubscriptionPricePointCreateManySubscriptionInputEnvelope
    set?: SubscriptionPricePointWhereUniqueInput | SubscriptionPricePointWhereUniqueInput[]
    disconnect?: SubscriptionPricePointWhereUniqueInput | SubscriptionPricePointWhereUniqueInput[]
    delete?: SubscriptionPricePointWhereUniqueInput | SubscriptionPricePointWhereUniqueInput[]
    connect?: SubscriptionPricePointWhereUniqueInput | SubscriptionPricePointWhereUniqueInput[]
    update?: SubscriptionPricePointUpdateWithWhereUniqueWithoutSubscriptionInput | SubscriptionPricePointUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: SubscriptionPricePointUpdateManyWithWhereWithoutSubscriptionInput | SubscriptionPricePointUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: SubscriptionPricePointScalarWhereInput | SubscriptionPricePointScalarWhereInput[]
  }

  export type SubscriptionPricePointUncheckedUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<SubscriptionPricePointCreateWithoutSubscriptionInput, SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput> | SubscriptionPricePointCreateWithoutSubscriptionInput[] | SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: SubscriptionPricePointCreateOrConnectWithoutSubscriptionInput | SubscriptionPricePointCreateOrConnectWithoutSubscriptionInput[]
    upsert?: SubscriptionPricePointUpsertWithWhereUniqueWithoutSubscriptionInput | SubscriptionPricePointUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: SubscriptionPricePointCreateManySubscriptionInputEnvelope
    set?: SubscriptionPricePointWhereUniqueInput | SubscriptionPricePointWhereUniqueInput[]
    disconnect?: SubscriptionPricePointWhereUniqueInput | SubscriptionPricePointWhereUniqueInput[]
    delete?: SubscriptionPricePointWhereUniqueInput | SubscriptionPricePointWhereUniqueInput[]
    connect?: SubscriptionPricePointWhereUniqueInput | SubscriptionPricePointWhereUniqueInput[]
    update?: SubscriptionPricePointUpdateWithWhereUniqueWithoutSubscriptionInput | SubscriptionPricePointUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: SubscriptionPricePointUpdateManyWithWhereWithoutSubscriptionInput | SubscriptionPricePointUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: SubscriptionPricePointScalarWhereInput | SubscriptionPricePointScalarWhereInput[]
  }

  export type SubscriptionCreateNestedOneWithoutPriceHistoryInput = {
    create?: XOR<SubscriptionCreateWithoutPriceHistoryInput, SubscriptionUncheckedCreateWithoutPriceHistoryInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPriceHistoryInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type SubscriptionUpdateOneRequiredWithoutPriceHistoryNestedInput = {
    create?: XOR<SubscriptionCreateWithoutPriceHistoryInput, SubscriptionUncheckedCreateWithoutPriceHistoryInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPriceHistoryInput
    upsert?: SubscriptionUpsertWithoutPriceHistoryInput
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutPriceHistoryInput, SubscriptionUpdateWithoutPriceHistoryInput>, SubscriptionUncheckedUpdateWithoutPriceHistoryInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
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
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DriveItemCreateWithoutChildrenInput = {
    id: string
    name: string
    kind: string
    mimeType?: string | null
    extension?: string | null
    sizeBytes?: number
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: string | null
    previewType: string
    previewUrl?: string | null
    previewContent?: string | null
    previewLanguage?: string | null
    previewAccent: string
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: DriveItemCreateNestedOneWithoutChildrenInput
    activities?: DriveActivityCreateNestedManyWithoutItemInput
  }

  export type DriveItemUncheckedCreateWithoutChildrenInput = {
    id: string
    name: string
    kind: string
    mimeType?: string | null
    extension?: string | null
    sizeBytes?: number
    parentId?: string | null
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: string | null
    previewType: string
    previewUrl?: string | null
    previewContent?: string | null
    previewLanguage?: string | null
    previewAccent: string
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: DriveActivityUncheckedCreateNestedManyWithoutItemInput
  }

  export type DriveItemCreateOrConnectWithoutChildrenInput = {
    where: DriveItemWhereUniqueInput
    create: XOR<DriveItemCreateWithoutChildrenInput, DriveItemUncheckedCreateWithoutChildrenInput>
  }

  export type DriveItemCreateWithoutParentInput = {
    id: string
    name: string
    kind: string
    mimeType?: string | null
    extension?: string | null
    sizeBytes?: number
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: string | null
    previewType: string
    previewUrl?: string | null
    previewContent?: string | null
    previewLanguage?: string | null
    previewAccent: string
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: DriveItemCreateNestedManyWithoutParentInput
    activities?: DriveActivityCreateNestedManyWithoutItemInput
  }

  export type DriveItemUncheckedCreateWithoutParentInput = {
    id: string
    name: string
    kind: string
    mimeType?: string | null
    extension?: string | null
    sizeBytes?: number
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: string | null
    previewType: string
    previewUrl?: string | null
    previewContent?: string | null
    previewLanguage?: string | null
    previewAccent: string
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: DriveItemUncheckedCreateNestedManyWithoutParentInput
    activities?: DriveActivityUncheckedCreateNestedManyWithoutItemInput
  }

  export type DriveItemCreateOrConnectWithoutParentInput = {
    where: DriveItemWhereUniqueInput
    create: XOR<DriveItemCreateWithoutParentInput, DriveItemUncheckedCreateWithoutParentInput>
  }

  export type DriveItemCreateManyParentInputEnvelope = {
    data: DriveItemCreateManyParentInput | DriveItemCreateManyParentInput[]
  }

  export type DriveActivityCreateWithoutItemInput = {
    id: string
    actor: string
    action: string
    createdAt?: Date | string
  }

  export type DriveActivityUncheckedCreateWithoutItemInput = {
    id: string
    actor: string
    action: string
    createdAt?: Date | string
  }

  export type DriveActivityCreateOrConnectWithoutItemInput = {
    where: DriveActivityWhereUniqueInput
    create: XOR<DriveActivityCreateWithoutItemInput, DriveActivityUncheckedCreateWithoutItemInput>
  }

  export type DriveActivityCreateManyItemInputEnvelope = {
    data: DriveActivityCreateManyItemInput | DriveActivityCreateManyItemInput[]
  }

  export type DriveItemUpsertWithoutChildrenInput = {
    update: XOR<DriveItemUpdateWithoutChildrenInput, DriveItemUncheckedUpdateWithoutChildrenInput>
    create: XOR<DriveItemCreateWithoutChildrenInput, DriveItemUncheckedCreateWithoutChildrenInput>
    where?: DriveItemWhereInput
  }

  export type DriveItemUpdateToOneWithWhereWithoutChildrenInput = {
    where?: DriveItemWhereInput
    data: XOR<DriveItemUpdateWithoutChildrenInput, DriveItemUncheckedUpdateWithoutChildrenInput>
  }

  export type DriveItemUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: DriveItemUpdateOneWithoutChildrenNestedInput
    activities?: DriveActivityUpdateManyWithoutItemNestedInput
  }

  export type DriveItemUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: DriveActivityUncheckedUpdateManyWithoutItemNestedInput
  }

  export type DriveItemUpsertWithWhereUniqueWithoutParentInput = {
    where: DriveItemWhereUniqueInput
    update: XOR<DriveItemUpdateWithoutParentInput, DriveItemUncheckedUpdateWithoutParentInput>
    create: XOR<DriveItemCreateWithoutParentInput, DriveItemUncheckedCreateWithoutParentInput>
  }

  export type DriveItemUpdateWithWhereUniqueWithoutParentInput = {
    where: DriveItemWhereUniqueInput
    data: XOR<DriveItemUpdateWithoutParentInput, DriveItemUncheckedUpdateWithoutParentInput>
  }

  export type DriveItemUpdateManyWithWhereWithoutParentInput = {
    where: DriveItemScalarWhereInput
    data: XOR<DriveItemUpdateManyMutationInput, DriveItemUncheckedUpdateManyWithoutParentInput>
  }

  export type DriveItemScalarWhereInput = {
    AND?: DriveItemScalarWhereInput | DriveItemScalarWhereInput[]
    OR?: DriveItemScalarWhereInput[]
    NOT?: DriveItemScalarWhereInput | DriveItemScalarWhereInput[]
    id?: StringFilter<"DriveItem"> | string
    name?: StringFilter<"DriveItem"> | string
    kind?: StringFilter<"DriveItem"> | string
    mimeType?: StringNullableFilter<"DriveItem"> | string | null
    extension?: StringNullableFilter<"DriveItem"> | string | null
    sizeBytes?: IntFilter<"DriveItem"> | number
    parentId?: StringNullableFilter<"DriveItem"> | string | null
    pathJson?: StringFilter<"DriveItem"> | string
    ownerId?: StringFilter<"DriveItem"> | string
    ownerName?: StringFilter<"DriveItem"> | string
    ownerInitials?: StringFilter<"DriveItem"> | string
    isFavorite?: BoolFilter<"DriveItem"> | boolean
    isDeleted?: BoolFilter<"DriveItem"> | boolean
    storageKey?: StringNullableFilter<"DriveItem"> | string | null
    previewType?: StringFilter<"DriveItem"> | string
    previewUrl?: StringNullableFilter<"DriveItem"> | string | null
    previewContent?: StringNullableFilter<"DriveItem"> | string | null
    previewLanguage?: StringNullableFilter<"DriveItem"> | string | null
    previewAccent?: StringFilter<"DriveItem"> | string
    createdAt?: DateTimeFilter<"DriveItem"> | Date | string
    updatedAt?: DateTimeFilter<"DriveItem"> | Date | string
  }

  export type DriveActivityUpsertWithWhereUniqueWithoutItemInput = {
    where: DriveActivityWhereUniqueInput
    update: XOR<DriveActivityUpdateWithoutItemInput, DriveActivityUncheckedUpdateWithoutItemInput>
    create: XOR<DriveActivityCreateWithoutItemInput, DriveActivityUncheckedCreateWithoutItemInput>
  }

  export type DriveActivityUpdateWithWhereUniqueWithoutItemInput = {
    where: DriveActivityWhereUniqueInput
    data: XOR<DriveActivityUpdateWithoutItemInput, DriveActivityUncheckedUpdateWithoutItemInput>
  }

  export type DriveActivityUpdateManyWithWhereWithoutItemInput = {
    where: DriveActivityScalarWhereInput
    data: XOR<DriveActivityUpdateManyMutationInput, DriveActivityUncheckedUpdateManyWithoutItemInput>
  }

  export type DriveActivityScalarWhereInput = {
    AND?: DriveActivityScalarWhereInput | DriveActivityScalarWhereInput[]
    OR?: DriveActivityScalarWhereInput[]
    NOT?: DriveActivityScalarWhereInput | DriveActivityScalarWhereInput[]
    id?: StringFilter<"DriveActivity"> | string
    itemId?: StringFilter<"DriveActivity"> | string
    actor?: StringFilter<"DriveActivity"> | string
    action?: StringFilter<"DriveActivity"> | string
    createdAt?: DateTimeFilter<"DriveActivity"> | Date | string
  }

  export type DriveItemCreateWithoutActivitiesInput = {
    id: string
    name: string
    kind: string
    mimeType?: string | null
    extension?: string | null
    sizeBytes?: number
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: string | null
    previewType: string
    previewUrl?: string | null
    previewContent?: string | null
    previewLanguage?: string | null
    previewAccent: string
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: DriveItemCreateNestedOneWithoutChildrenInput
    children?: DriveItemCreateNestedManyWithoutParentInput
  }

  export type DriveItemUncheckedCreateWithoutActivitiesInput = {
    id: string
    name: string
    kind: string
    mimeType?: string | null
    extension?: string | null
    sizeBytes?: number
    parentId?: string | null
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: string | null
    previewType: string
    previewUrl?: string | null
    previewContent?: string | null
    previewLanguage?: string | null
    previewAccent: string
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: DriveItemUncheckedCreateNestedManyWithoutParentInput
  }

  export type DriveItemCreateOrConnectWithoutActivitiesInput = {
    where: DriveItemWhereUniqueInput
    create: XOR<DriveItemCreateWithoutActivitiesInput, DriveItemUncheckedCreateWithoutActivitiesInput>
  }

  export type DriveItemUpsertWithoutActivitiesInput = {
    update: XOR<DriveItemUpdateWithoutActivitiesInput, DriveItemUncheckedUpdateWithoutActivitiesInput>
    create: XOR<DriveItemCreateWithoutActivitiesInput, DriveItemUncheckedCreateWithoutActivitiesInput>
    where?: DriveItemWhereInput
  }

  export type DriveItemUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: DriveItemWhereInput
    data: XOR<DriveItemUpdateWithoutActivitiesInput, DriveItemUncheckedUpdateWithoutActivitiesInput>
  }

  export type DriveItemUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: DriveItemUpdateOneWithoutChildrenNestedInput
    children?: DriveItemUpdateManyWithoutParentNestedInput
  }

  export type DriveItemUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: DriveItemUncheckedUpdateManyWithoutParentNestedInput
  }

  export type BillingInvoiceCreateWithoutCompanyInput = {
    id: string
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: BillingCustomerCreateNestedOneWithoutInvoicesInput
    lines?: BillingInvoiceLineCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceUncheckedCreateWithoutCompanyInput = {
    id: string
    customerId?: string | null
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: BillingInvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceCreateOrConnectWithoutCompanyInput = {
    where: BillingInvoiceWhereUniqueInput
    create: XOR<BillingInvoiceCreateWithoutCompanyInput, BillingInvoiceUncheckedCreateWithoutCompanyInput>
  }

  export type BillingInvoiceCreateManyCompanyInputEnvelope = {
    data: BillingInvoiceCreateManyCompanyInput | BillingInvoiceCreateManyCompanyInput[]
  }

  export type BillingInvoiceUpsertWithWhereUniqueWithoutCompanyInput = {
    where: BillingInvoiceWhereUniqueInput
    update: XOR<BillingInvoiceUpdateWithoutCompanyInput, BillingInvoiceUncheckedUpdateWithoutCompanyInput>
    create: XOR<BillingInvoiceCreateWithoutCompanyInput, BillingInvoiceUncheckedCreateWithoutCompanyInput>
  }

  export type BillingInvoiceUpdateWithWhereUniqueWithoutCompanyInput = {
    where: BillingInvoiceWhereUniqueInput
    data: XOR<BillingInvoiceUpdateWithoutCompanyInput, BillingInvoiceUncheckedUpdateWithoutCompanyInput>
  }

  export type BillingInvoiceUpdateManyWithWhereWithoutCompanyInput = {
    where: BillingInvoiceScalarWhereInput
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyWithoutCompanyInput>
  }

  export type BillingInvoiceScalarWhereInput = {
    AND?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
    OR?: BillingInvoiceScalarWhereInput[]
    NOT?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
    id?: StringFilter<"BillingInvoice"> | string
    companyId?: StringFilter<"BillingInvoice"> | string
    customerId?: StringNullableFilter<"BillingInvoice"> | string | null
    customerName?: StringFilter<"BillingInvoice"> | string
    customerOrgNumber?: StringNullableFilter<"BillingInvoice"> | string | null
    customerEmail?: StringNullableFilter<"BillingInvoice"> | string | null
    customerPhone?: StringNullableFilter<"BillingInvoice"> | string | null
    customerAddress?: StringNullableFilter<"BillingInvoice"> | string | null
    customerPostalCode?: StringNullableFilter<"BillingInvoice"> | string | null
    customerCity?: StringNullableFilter<"BillingInvoice"> | string | null
    customerContactPerson?: StringNullableFilter<"BillingInvoice"> | string | null
    status?: StringFilter<"BillingInvoice"> | string
    vatRate?: FloatFilter<"BillingInvoice"> | number
    currency?: StringFilter<"BillingInvoice"> | string
    dueDate?: StringFilter<"BillingInvoice"> | string
    issuedDate?: StringFilter<"BillingInvoice"> | string
    paidDate?: StringNullableFilter<"BillingInvoice"> | string | null
    paymentTermsDays?: IntNullableFilter<"BillingInvoice"> | number | null
    notes?: StringNullableFilter<"BillingInvoice"> | string | null
    theirReference?: StringNullableFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"BillingInvoice"> | Date | string
  }

  export type BillingInvoiceCreateWithoutCustomerInput = {
    id: string
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: BillingCompanyCreateNestedOneWithoutInvoicesInput
    lines?: BillingInvoiceLineCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceUncheckedCreateWithoutCustomerInput = {
    id: string
    companyId: string
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: BillingInvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceCreateOrConnectWithoutCustomerInput = {
    where: BillingInvoiceWhereUniqueInput
    create: XOR<BillingInvoiceCreateWithoutCustomerInput, BillingInvoiceUncheckedCreateWithoutCustomerInput>
  }

  export type BillingInvoiceCreateManyCustomerInputEnvelope = {
    data: BillingInvoiceCreateManyCustomerInput | BillingInvoiceCreateManyCustomerInput[]
  }

  export type BillingInvoiceUpsertWithWhereUniqueWithoutCustomerInput = {
    where: BillingInvoiceWhereUniqueInput
    update: XOR<BillingInvoiceUpdateWithoutCustomerInput, BillingInvoiceUncheckedUpdateWithoutCustomerInput>
    create: XOR<BillingInvoiceCreateWithoutCustomerInput, BillingInvoiceUncheckedCreateWithoutCustomerInput>
  }

  export type BillingInvoiceUpdateWithWhereUniqueWithoutCustomerInput = {
    where: BillingInvoiceWhereUniqueInput
    data: XOR<BillingInvoiceUpdateWithoutCustomerInput, BillingInvoiceUncheckedUpdateWithoutCustomerInput>
  }

  export type BillingInvoiceUpdateManyWithWhereWithoutCustomerInput = {
    where: BillingInvoiceScalarWhereInput
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyWithoutCustomerInput>
  }

  export type BillingCompanyCreateWithoutInvoicesInput = {
    id: string
    name: string
    orgNumber?: string | null
    vatNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    postalCode?: string | null
    city?: string | null
    bank?: string | null
    iban?: string | null
    bankgiro?: string | null
    logoDataUrl?: string | null
    fSkatt?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingCompanyUncheckedCreateWithoutInvoicesInput = {
    id: string
    name: string
    orgNumber?: string | null
    vatNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    postalCode?: string | null
    city?: string | null
    bank?: string | null
    iban?: string | null
    bankgiro?: string | null
    logoDataUrl?: string | null
    fSkatt?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingCompanyCreateOrConnectWithoutInvoicesInput = {
    where: BillingCompanyWhereUniqueInput
    create: XOR<BillingCompanyCreateWithoutInvoicesInput, BillingCompanyUncheckedCreateWithoutInvoicesInput>
  }

  export type BillingCustomerCreateWithoutInvoicesInput = {
    id: string
    name: string
    orgNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    postalCode?: string | null
    city?: string | null
    contactPerson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingCustomerUncheckedCreateWithoutInvoicesInput = {
    id: string
    name: string
    orgNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    postalCode?: string | null
    city?: string | null
    contactPerson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingCustomerCreateOrConnectWithoutInvoicesInput = {
    where: BillingCustomerWhereUniqueInput
    create: XOR<BillingCustomerCreateWithoutInvoicesInput, BillingCustomerUncheckedCreateWithoutInvoicesInput>
  }

  export type BillingInvoiceLineCreateWithoutInvoiceInput = {
    id: string
    position: number
    description: string
    quantity: number
    unit?: string | null
    unitPriceOre: number
    articleNumber?: string | null
  }

  export type BillingInvoiceLineUncheckedCreateWithoutInvoiceInput = {
    id: string
    position: number
    description: string
    quantity: number
    unit?: string | null
    unitPriceOre: number
    articleNumber?: string | null
  }

  export type BillingInvoiceLineCreateOrConnectWithoutInvoiceInput = {
    where: BillingInvoiceLineWhereUniqueInput
    create: XOR<BillingInvoiceLineCreateWithoutInvoiceInput, BillingInvoiceLineUncheckedCreateWithoutInvoiceInput>
  }

  export type BillingInvoiceLineCreateManyInvoiceInputEnvelope = {
    data: BillingInvoiceLineCreateManyInvoiceInput | BillingInvoiceLineCreateManyInvoiceInput[]
  }

  export type BillingCompanyUpsertWithoutInvoicesInput = {
    update: XOR<BillingCompanyUpdateWithoutInvoicesInput, BillingCompanyUncheckedUpdateWithoutInvoicesInput>
    create: XOR<BillingCompanyCreateWithoutInvoicesInput, BillingCompanyUncheckedCreateWithoutInvoicesInput>
    where?: BillingCompanyWhereInput
  }

  export type BillingCompanyUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: BillingCompanyWhereInput
    data: XOR<BillingCompanyUpdateWithoutInvoicesInput, BillingCompanyUncheckedUpdateWithoutInvoicesInput>
  }

  export type BillingCompanyUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    bank?: NullableStringFieldUpdateOperationsInput | string | null
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    bankgiro?: NullableStringFieldUpdateOperationsInput | string | null
    logoDataUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fSkatt?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCompanyUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    bank?: NullableStringFieldUpdateOperationsInput | string | null
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    bankgiro?: NullableStringFieldUpdateOperationsInput | string | null
    logoDataUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fSkatt?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCustomerUpsertWithoutInvoicesInput = {
    update: XOR<BillingCustomerUpdateWithoutInvoicesInput, BillingCustomerUncheckedUpdateWithoutInvoicesInput>
    create: XOR<BillingCustomerCreateWithoutInvoicesInput, BillingCustomerUncheckedCreateWithoutInvoicesInput>
    where?: BillingCustomerWhereInput
  }

  export type BillingCustomerUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: BillingCustomerWhereInput
    data: XOR<BillingCustomerUpdateWithoutInvoicesInput, BillingCustomerUncheckedUpdateWithoutInvoicesInput>
  }

  export type BillingCustomerUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCustomerUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: BillingInvoiceLineWhereUniqueInput
    update: XOR<BillingInvoiceLineUpdateWithoutInvoiceInput, BillingInvoiceLineUncheckedUpdateWithoutInvoiceInput>
    create: XOR<BillingInvoiceLineCreateWithoutInvoiceInput, BillingInvoiceLineUncheckedCreateWithoutInvoiceInput>
  }

  export type BillingInvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: BillingInvoiceLineWhereUniqueInput
    data: XOR<BillingInvoiceLineUpdateWithoutInvoiceInput, BillingInvoiceLineUncheckedUpdateWithoutInvoiceInput>
  }

  export type BillingInvoiceLineUpdateManyWithWhereWithoutInvoiceInput = {
    where: BillingInvoiceLineScalarWhereInput
    data: XOR<BillingInvoiceLineUpdateManyMutationInput, BillingInvoiceLineUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type BillingInvoiceLineScalarWhereInput = {
    AND?: BillingInvoiceLineScalarWhereInput | BillingInvoiceLineScalarWhereInput[]
    OR?: BillingInvoiceLineScalarWhereInput[]
    NOT?: BillingInvoiceLineScalarWhereInput | BillingInvoiceLineScalarWhereInput[]
    id?: StringFilter<"BillingInvoiceLine"> | string
    invoiceId?: StringFilter<"BillingInvoiceLine"> | string
    position?: IntFilter<"BillingInvoiceLine"> | number
    description?: StringFilter<"BillingInvoiceLine"> | string
    quantity?: FloatFilter<"BillingInvoiceLine"> | number
    unit?: StringNullableFilter<"BillingInvoiceLine"> | string | null
    unitPriceOre?: IntFilter<"BillingInvoiceLine"> | number
    articleNumber?: StringNullableFilter<"BillingInvoiceLine"> | string | null
  }

  export type BillingInvoiceCreateWithoutLinesInput = {
    id: string
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: BillingCompanyCreateNestedOneWithoutInvoicesInput
    customer?: BillingCustomerCreateNestedOneWithoutInvoicesInput
  }

  export type BillingInvoiceUncheckedCreateWithoutLinesInput = {
    id: string
    companyId: string
    customerId?: string | null
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingInvoiceCreateOrConnectWithoutLinesInput = {
    where: BillingInvoiceWhereUniqueInput
    create: XOR<BillingInvoiceCreateWithoutLinesInput, BillingInvoiceUncheckedCreateWithoutLinesInput>
  }

  export type BillingInvoiceUpsertWithoutLinesInput = {
    update: XOR<BillingInvoiceUpdateWithoutLinesInput, BillingInvoiceUncheckedUpdateWithoutLinesInput>
    create: XOR<BillingInvoiceCreateWithoutLinesInput, BillingInvoiceUncheckedCreateWithoutLinesInput>
    where?: BillingInvoiceWhereInput
  }

  export type BillingInvoiceUpdateToOneWithWhereWithoutLinesInput = {
    where?: BillingInvoiceWhereInput
    data: XOR<BillingInvoiceUpdateWithoutLinesInput, BillingInvoiceUncheckedUpdateWithoutLinesInput>
  }

  export type BillingInvoiceUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: BillingCompanyUpdateOneRequiredWithoutInvoicesNestedInput
    customer?: BillingCustomerUpdateOneWithoutInvoicesNestedInput
  }

  export type BillingInvoiceUncheckedUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPricePointCreateWithoutSubscriptionInput = {
    id: string
    date: string
    amountSEK: number
    createdAt?: Date | string
  }

  export type SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput = {
    id: string
    date: string
    amountSEK: number
    createdAt?: Date | string
  }

  export type SubscriptionPricePointCreateOrConnectWithoutSubscriptionInput = {
    where: SubscriptionPricePointWhereUniqueInput
    create: XOR<SubscriptionPricePointCreateWithoutSubscriptionInput, SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput>
  }

  export type SubscriptionPricePointCreateManySubscriptionInputEnvelope = {
    data: SubscriptionPricePointCreateManySubscriptionInput | SubscriptionPricePointCreateManySubscriptionInput[]
  }

  export type SubscriptionPricePointUpsertWithWhereUniqueWithoutSubscriptionInput = {
    where: SubscriptionPricePointWhereUniqueInput
    update: XOR<SubscriptionPricePointUpdateWithoutSubscriptionInput, SubscriptionPricePointUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<SubscriptionPricePointCreateWithoutSubscriptionInput, SubscriptionPricePointUncheckedCreateWithoutSubscriptionInput>
  }

  export type SubscriptionPricePointUpdateWithWhereUniqueWithoutSubscriptionInput = {
    where: SubscriptionPricePointWhereUniqueInput
    data: XOR<SubscriptionPricePointUpdateWithoutSubscriptionInput, SubscriptionPricePointUncheckedUpdateWithoutSubscriptionInput>
  }

  export type SubscriptionPricePointUpdateManyWithWhereWithoutSubscriptionInput = {
    where: SubscriptionPricePointScalarWhereInput
    data: XOR<SubscriptionPricePointUpdateManyMutationInput, SubscriptionPricePointUncheckedUpdateManyWithoutSubscriptionInput>
  }

  export type SubscriptionPricePointScalarWhereInput = {
    AND?: SubscriptionPricePointScalarWhereInput | SubscriptionPricePointScalarWhereInput[]
    OR?: SubscriptionPricePointScalarWhereInput[]
    NOT?: SubscriptionPricePointScalarWhereInput | SubscriptionPricePointScalarWhereInput[]
    id?: StringFilter<"SubscriptionPricePoint"> | string
    subscriptionId?: StringFilter<"SubscriptionPricePoint"> | string
    date?: StringFilter<"SubscriptionPricePoint"> | string
    amountSEK?: IntFilter<"SubscriptionPricePoint"> | number
    createdAt?: DateTimeFilter<"SubscriptionPricePoint"> | Date | string
  }

  export type SubscriptionCreateWithoutPriceHistoryInput = {
    id: string
    name: string
    description?: string
    category: string
    status: string
    amountSEK: number
    billingCycle: string
    startedAt: string
    nextRenewal: string
    cancelledAt?: string | null
    website?: string | null
    notes?: string | null
    owner?: string | null
    businessExpense?: boolean
    reminderDaysBefore?: number | null
    archived?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUncheckedCreateWithoutPriceHistoryInput = {
    id: string
    name: string
    description?: string
    category: string
    status: string
    amountSEK: number
    billingCycle: string
    startedAt: string
    nextRenewal: string
    cancelledAt?: string | null
    website?: string | null
    notes?: string | null
    owner?: string | null
    businessExpense?: boolean
    reminderDaysBefore?: number | null
    archived?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutPriceHistoryInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutPriceHistoryInput, SubscriptionUncheckedCreateWithoutPriceHistoryInput>
  }

  export type SubscriptionUpsertWithoutPriceHistoryInput = {
    update: XOR<SubscriptionUpdateWithoutPriceHistoryInput, SubscriptionUncheckedUpdateWithoutPriceHistoryInput>
    create: XOR<SubscriptionCreateWithoutPriceHistoryInput, SubscriptionUncheckedCreateWithoutPriceHistoryInput>
    where?: SubscriptionWhereInput
  }

  export type SubscriptionUpdateToOneWithWhereWithoutPriceHistoryInput = {
    where?: SubscriptionWhereInput
    data: XOR<SubscriptionUpdateWithoutPriceHistoryInput, SubscriptionUncheckedUpdateWithoutPriceHistoryInput>
  }

  export type SubscriptionUpdateWithoutPriceHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    billingCycle?: StringFieldUpdateOperationsInput | string
    startedAt?: StringFieldUpdateOperationsInput | string
    nextRenewal?: StringFieldUpdateOperationsInput | string
    cancelledAt?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    businessExpense?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: NullableIntFieldUpdateOperationsInput | number | null
    archived?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateWithoutPriceHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    billingCycle?: StringFieldUpdateOperationsInput | string
    startedAt?: StringFieldUpdateOperationsInput | string
    nextRenewal?: StringFieldUpdateOperationsInput | string
    cancelledAt?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    businessExpense?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: NullableIntFieldUpdateOperationsInput | number | null
    archived?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveItemCreateManyParentInput = {
    id: string
    name: string
    kind: string
    mimeType?: string | null
    extension?: string | null
    sizeBytes?: number
    pathJson: string
    ownerId: string
    ownerName: string
    ownerInitials: string
    isFavorite?: boolean
    isDeleted?: boolean
    storageKey?: string | null
    previewType: string
    previewUrl?: string | null
    previewContent?: string | null
    previewLanguage?: string | null
    previewAccent: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DriveActivityCreateManyItemInput = {
    id: string
    actor: string
    action: string
    createdAt?: Date | string
  }

  export type DriveItemUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: DriveItemUpdateManyWithoutParentNestedInput
    activities?: DriveActivityUpdateManyWithoutItemNestedInput
  }

  export type DriveItemUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: DriveItemUncheckedUpdateManyWithoutParentNestedInput
    activities?: DriveActivityUncheckedUpdateManyWithoutItemNestedInput
  }

  export type DriveItemUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    pathJson?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerInitials?: StringFieldUpdateOperationsInput | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewType?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewContent?: NullableStringFieldUpdateOperationsInput | string | null
    previewLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    previewAccent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveActivityUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveActivityUncheckedUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveActivityUncheckedUpdateManyWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceCreateManyCompanyInput = {
    id: string
    customerId?: string | null
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingInvoiceUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: BillingCustomerUpdateOneWithoutInvoicesNestedInput
    lines?: BillingInvoiceLineUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: BillingInvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceCreateManyCustomerInput = {
    id: string
    companyId: string
    customerName: string
    customerOrgNumber?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerAddress?: string | null
    customerPostalCode?: string | null
    customerCity?: string | null
    customerContactPerson?: string | null
    status: string
    vatRate: number
    currency?: string
    dueDate: string
    issuedDate: string
    paidDate?: string | null
    paymentTermsDays?: number | null
    notes?: string | null
    theirReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingInvoiceUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: BillingCompanyUpdateOneRequiredWithoutInvoicesNestedInput
    lines?: BillingInvoiceLineUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: BillingInvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerOrgNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerPostalCode?: NullableStringFieldUpdateOperationsInput | string | null
    customerCity?: NullableStringFieldUpdateOperationsInput | string | null
    customerContactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    vatRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    issuedDate?: StringFieldUpdateOperationsInput | string
    paidDate?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsDays?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    theirReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceLineCreateManyInvoiceInput = {
    id: string
    position: number
    description: string
    quantity: number
    unit?: string | null
    unitPriceOre: number
    articleNumber?: string | null
  }

  export type BillingInvoiceLineUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    unitPriceOre?: IntFieldUpdateOperationsInput | number
    articleNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingInvoiceLineUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    unitPriceOre?: IntFieldUpdateOperationsInput | number
    articleNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingInvoiceLineUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    unitPriceOre?: IntFieldUpdateOperationsInput | number
    articleNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubscriptionPricePointCreateManySubscriptionInput = {
    id: string
    date: string
    amountSEK: number
    createdAt?: Date | string
  }

  export type SubscriptionPricePointUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPricePointUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPricePointUncheckedUpdateManyWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    amountSEK?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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