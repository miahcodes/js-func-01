// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").InputQuery} InputQuery
* @typedef {import("../generated/api").FunctionResult} FunctionResult
* @typedef {import("../generated/api").Target} Target
* @typedef {import("../generated/api").ProductVariant} ProductVariant
* @typedef {import("../generated/api").CartLine} CartLine
* @typedef {import("../generated/api").Product} Product
*/

/**
* @type {FunctionResult}
*/
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// The @shopify/shopify_function package will use the default export as your function entrypoint
export default /**
* @param {InputQuery} input
* @returns {FunctionResult}
*/
  (input) => {
    const discounts_ = [];
    const linesArray = input.cart.lines
    for (let i = 0; i < linesArray.length; ++i) {
      const line = linesArray[i];
      const variant = /** @type {ProductVariant} */ (line.merchandise);
      const cost = parseFloat(line.cost.amountPerQuantity.amount.toString());
      const custom_price = parseFloat(variant.product.custom_price?.value ?? "0.00");
      const discount_value = (cost - custom_price) * line.quantity;
      if(variant.id == "gid://shopify/ProductVariant/44727126458671") {
        discounts_.push({
          targets: [{productVariant: {id: variant.id}}],
          value: {
            fixedAmount: { amount: discount_value.toString() }
          }
        });
      }
    }

    if (!discounts_.length) {
      // You can use STDERR for debug logs in your function
      console.error("No cart lines qualify for the discount.");
      return EMPTY_DISCOUNT;
    }

    // The @shopify/shopify_function package applies JSON.stringify() to your function result
    // and writes it to STDOUT
    return {
      discounts: discounts_,
      discountApplicationStrategy: DiscountApplicationStrategy.Maximum
    };
  };
