export const identification = `
    query user {
        user {
            id
            login
            firstName
            lastName
            auditRatio
            totalUp
            totalDown
            attrs
          
            audits (order_by: {createdAt: asc}) {
              grade
             group {
              path
            }
         
          }
        }
    }
`;


//need: received/done
export const auditsRatio = `
query audit {
    nonNullGrades: audit(where: { grade: { _is_null: false } }, order_by: { createdAt: asc }) {
      grade
      group {
        path
      }
      result {
        id
        object {
          name
id
        }
      }
    }
    nullGrades: audit(where: { grade: { _is_null: true } }, order_by: { createdAt: asc }) {
      grade
      group {
        path
      }
      result {
        id
        object {
          name
id
        }
      }
    }
  }
`;

//example
// export const userLevel = `
// query event_user {
//   event_user {
//       level
//     }
//   }
// `;



export const xpBoardDiv01 = `
query board {
    progress {
        path
        isDone
        group {
            object {
             id
            }
        }
    }
}
`;

//total xp progress, need: go/js/div-01
export const board = `
query transaction($order_by: [transaction_order_by!], $where: transaction_bool_exp) {
    transaction(order_by: $order_by, where: { type: { _eq: "xp" } }) {
        type
        amount
        path
    }
}
`;


