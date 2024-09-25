import { createSelector } from 'reselect';

// Selector dasar untuk mendapatkan debtPayments
const selectDebtPayments = (state) => state.debtPayments;

// Selector yang dimemoisasi
export const selectLatestOrderAndPayment = createSelector(
  [selectDebtPayments],
  (debtPayments) => ({
    latestOrder: debtPayments?.latestOrder || {},
    latestDebtPayment: debtPayments?.latestDebtPayment || {},
  })
);
