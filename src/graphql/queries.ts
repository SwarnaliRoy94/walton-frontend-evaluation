import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($pagination: PaginationInput, $filter: ProductFilterInput) {
    getProducts(pagination: $pagination, filter: $filter) {
      message
      statusCode
      result {
        count
        products {
          uid
          enName
          images {
            url
          }
          productAttributes {
            enLabel
            values {
              enName
            }
          }
          variants {
            mrpPrice
            ebsItemCode
            posItemCode
            quantity
            discount {
              amount
              value
              type
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_DETAIL = gql`
  query GetProductDetail($filter: ProductFilterInput) {
    getProducts(filter: $filter, pagination: { skip: 0, limit: 1 }) {
      message
      statusCode
      result {
        products {
          uid
          enName
          images {
            url
          }
          productAttributes {
            enLabel
            values {
              enName
            }
          }
          detailedDescriptions {
            enLabel
            values {
              enName
            }
          }
          deliveries {
            enLabel
            values {
              enName
            }
          }
          serviceAndDeliveries {
            enLabel
            values {
              enName
            }
          }
          priceAndStocks {
            enLabel
            values {
              enName
            }
          }
          variants {
            mrpPrice
            ebsItemCode
            posItemCode
            quantity
            discount {
              amount
              value
              type
            }
          }
        }
      }
    }
  }
`;
