export const calculateFinanceDetails = ( {
    productPrice,
    discount = 0,
    downpayment = 0,
    tenure = 0,
    roi = 0
  }) => {
    const netPrice = productPrice - discount;
    const loanAmount = netPrice - downpayment;
  
    if (loanAmount <= 0 || tenure <= 0 || roi <= 0) {
      return {
        emi: 0,
        totalPayable: 0,
        interestAmount: 0,
        loanAmount,
      };
    }
  
    const monthlyRate = roi / 12 / 100; 
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
  
    const totalPayable = emi * tenure;
    const interestAmount = totalPayable - loanAmount;
  console.log({
    emi: parseFloat(emi.toFixed(2)),
    totalPayable: parseFloat(totalPayable.toFixed(2)),
    interestAmount: parseFloat(interestAmount.toFixed(2)),
    loanAmount: parseFloat(loanAmount.toFixed(2)),
  })
    return {
      emi: parseFloat(emi.toFixed(2)),
      totalPayable: parseFloat(totalPayable.toFixed(2)),
      interestAmount: parseFloat(interestAmount.toFixed(2)),
      loanAmount: parseFloat(loanAmount.toFixed(2)),
    };
  }