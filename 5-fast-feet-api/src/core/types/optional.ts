/**
 * Make some property optional on type
 *
 * @example
 * ```typescript
 * type Post {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optional<Post, 'id' | 'email'>
 * // Result:
 * // {
 * //   id?: string;
 * //   email?: string;
 * //   name: string;
 * // }
 * ```
 **/
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
