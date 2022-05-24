import { Contract, ContractInterface } from 'ethers';
import { SignerOrProvider, typesafeContract } from './utils';

/**
 * ContractWrapper is an abstract class for implementing the decorator pattern on top of the ethers contract instance.
 * The additional functionality should be passed as the generic `A`, and when the `wrap` method is called, a decorated
 * version of the original contract will be returned.
 *
 * This can be used as a normal ethers contract anywhere in the applicaiton.
 *
 * @param A The additional wrapped functionality, it should be an interface or object type but can contain any number of properties or methods.
 **/
export abstract class ContractWrapper<A> {
  /**
   * Instantiates the contract if it has not been created already.
   * Will return a new ethers contract with additional functionality added, by calling the `wrap` method.
   */
  public create<C extends Contract>(
    address: string,
    abi: ContractInterface,
    signerOrProvider?: SignerOrProvider,
  ): C & A {
    const newContract = typesafeContract<C>(address, abi, signerOrProvider);
    return this.wrap(newContract);
  }

  /**
   * Decorate an existing ethers contract instance with additional properties.
   * Multiple wrap calls can be chained to add progressively more functionality, as needed.
   *
   * This allows you to chain the wrap method from different classes to create layers of additional functionality,
   * all of which will be typesafe.
   *
   * @param contract the original contract with the new functionality added.
   */
  public abstract wrap<C extends Contract>(contract: C): C & A;
}
