export class FenceparserError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, FenceparserError.prototype)
  }
}
