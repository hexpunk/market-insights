/**
 * A Thunk is a function that returns a Promise which resolves to an array of Thunks or void.
 * This can be used to represent asynchronous operations that may produce more Thunks to be executed.
 */
type Thunk = () => Promise<Thunk[] | void>;

export default Thunk;
