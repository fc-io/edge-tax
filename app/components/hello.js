import React from 'react'
import * as _ from 'immutable'
import Chart from './Chart'
import {css} from 'aphrodite/no-important'
import styles from './hello.styles'

const getProfitRegularReturns = (startValue, amount, cagr, yearsLeft) => {
  return yearsLeft ?
    getProfitRegularReturns(startValue, amount * (1 + cagr), cagr, yearsLeft - 1) :
    (amount - startValue) - Math.min((amount - startValue) * 0.3, (amount - amount * 0.2) * 0.3)
}

const getReturnsPerYear = (startAmount, inrestPerYear, years) => {
  return _.Range(0, years + 1).take(years + 1).map((year) => {
    return {
      year,
      returnAfterTax: getProfitRegularReturns(
        startAmount,
        startAmount,
        inrestPerYear,
        year
      )
    }
  })
}

const subtractCapTax = (amount) => {
  return amount - (amount * 0.0125 * 0.30)
}

const getProfitCapInsurance = (startValue, amount, cagr, years, yearsLeft) => {
  // adding to insurance/isk first time subtract tax
  const a = years === yearsLeft ? subtractCapTax(amount) : amount

  return yearsLeft ?
    getProfitCapInsurance(startValue, subtractCapTax(a * (1 + cagr)), cagr, years, yearsLeft - 1) :
    a - startValue
}

const getCapPerYear = (startAmount, inrestPerYear, years) => {
  return _.Range(0, years + 1).take(years + 1)
    .map((year) => {
      return {
        year,
        returnAfterTax: getProfitCapInsurance(
          startAmount,
          startAmount,
          inrestPerYear,
          year,
          year
        )
      }
    })
}

export default class Hello extends React.Component {
  constructor(props) {
    super(props)
    const endValue    = 2000
    const startValue  = 100
    const years = 40
    const profitCapInsurance = getProfitCapInsurance(
      startValue,
      startValue,
      cagr,
      years,
      years
    )

    const taxRegularAccount = (endValue - startValue)* 0.30
    const profitRegularAccount = endValue - startValue - taxRegularAccount

    const cagr = (endValue / startValue) ** (1 / years) - 1
    console.log('Compound Annual Growth Rate: ', cagr)

    this.state = {
      cagr,
      years,
      returnsPerYear: getReturnsPerYear(startValue, cagr, years),
      capPerYear: getCapPerYear(startValue, cagr, years),
    }
  }
  render() {
    // console.log('returnsPerYear', returnsPerYear.toJS())
    // // console.log('last returnsPerYear', returnsPerYear.last())
    // console.log('profitRegularAccount', profitRegularAccount)
    // console.log('per year profitCapInsurance', capPerYear.toJS())
    // console.log('profitCapInsurance', profitCapInsurance)
    return (
      <div>
        <div className={css(styles.chartContainer)}>
          <Chart
            cagr={this.state.cagr}
            returnsPerYear={this.state.returnsPerYear}
            capPerYear={this.state.capPerYear}
            years={this.state.years}
          />
        </div>
      </div>
    )
  }
}
