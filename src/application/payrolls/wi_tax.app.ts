import { includes, orderBy, sortBy } from 'lodash';
import { Contract, Employee, PayrollLine, PayStub, Person, Track, User, WITaxTable } from "../../models/index";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import sendEmail, { mailServices } from "../mailler/index";
import { Op } from "sequelize";
import moment from 'moment';
import { Payroll } from 'models/index';
import { unknown } from 'zod';


export type HistoryEventType =
  "created" |
  "registered" |
  "updated" |
  "deleted" |
  "upgared" |
  "downgraded";
export type HistoryEventState =
  "primary" |
  "secondary" |
  "success" |
  "danger" |
  "warning" |
  "info" |
  "light" |
  "dark"
  ;

export type HistoryType = {
  no: number,
  date: Date,
  type: HistoryEventType,
  descriptions: string,
  state: HistoryEventState,
  body?: any,
  user?: User
}
export default class WITaxApp {

  static calculator: any = async (lines: any[]) => {
    /*const payStub = new PayStub();

    lines = [
      {
        isActive: true,
        code: '1000',
        date: new Date(),
        value: 400000,
        debit: true,
        quantity: 1,
        baseValuePeriod: 1,
        descriptions: 'Base',
      },
      {
        isActive: true,
        code: '1401',
        date: new Date(),
        value: 40000,
        debit: true,
        quantity: 1,
        baseValuePeriod: 1,
        descriptions: 'Base',
      },
      {
        isActive: true,
        code: '1402',
        date: new Date(),
        value: 20000,
        debit: true,
        quantity: 1,
        baseValuePeriod: 1,
        descriptions: 'Base',
      },
      {
        isActive: true,
        code: '1630',
        date: new Date(),
        value: 400000,
        debit: true,
        quantity: 1,
        baseValuePeriod: 1,
        descriptions: 'Base',
      },
      {
        isActive: true,
        code: '1642',
        date: new Date(),
        value: 400000,
        debit: true,
        quantity: 1,
        baseValuePeriod: 1,
        descriptions: 'Base',
      },
      {
        isActive: true,
        code: '1603',
        date: new Date(),
        value: 20000,
        debit: true,
        quantity: 1,
        baseValuePeriod: 1,
        descriptions: 'Base',
      }
    ].map((l: any) => new PayrollLine(l))*/

    const baseValue = lines
      ?.filter((line: PayrollLine) => line?.debit)
      ?.filter((line: PayrollLine) => line.code === '1000')
      ?.reduce((acc, line: PayrollLine) => acc + line.value, 0) ?? 0

    //30 0000
    const foodSupport = lines
      ?.filter((line: PayrollLine) => line?.debit)
      ?.filter((line: PayrollLine) => line.code === '1401')
      ?.reduce((acc, line: PayrollLine) => acc + line.value, -30000) ?? 0

    //30 000
    const transportSupport = lines
      ?.filter((line: PayrollLine) => line?.debit)
      ?.filter((line: PayrollLine) => line.code === '1402')
      ?.reduce((acc, line: PayrollLine) => acc + line.value, -30000.00) ?? 0

    const christmasSupport = lines
      ?.filter((line: PayrollLine) => line?.debit)
      ?.filter((line: PayrollLine) => line.code === '1642')
      ?.reduce((acc, line: PayrollLine) => acc + line.value, 0) ?? 0

    //20 000
    const familySupport = lines
      ?.filter((line: PayrollLine) => line?.debit)
      ?.filter((line: PayrollLine) => line.code === '1603')
      ?.reduce((acc, line: PayrollLine) => acc + line.value, -(baseValue * 5 / 100)) ?? 0

    const vacationSupport = lines
      ?.filter((line: PayrollLine) => line?.debit)
      ?.filter((line: PayrollLine) => line.code === '1630')
      ?.reduce((acc, line: PayrollLine) => acc + line.value, 0) ?? 0

    const grossValue: number = lines
      ?.filter((line: PayrollLine) => line?.debit)
      ?.reduce((acc, line: PayrollLine) => acc + line.value, 0) ?? 0


    const otherValues: number = lines
      ?.filter((line: PayrollLine) => line?.debit)
      ?.filter((line: PayrollLine) => !['1630', '1603', '1642', '1402', '1401', '1000'].includes(line?.code))
      // ?.filter((line: PayrollLine) => !((line?.type?.code ?? '').indexOf('70') > -1))
      ?.reduce((acc, line: PayrollLine) => acc + line.value, 0) ?? 0


    const unknownValues: number = lines
      ?.filter((line: PayrollLine) => line?.debit)
      //?.filter((line: PayrollLine) => !['1630', '1603', '1642', '1402', '1401', '1000'].includes(line?.code))
      ?.filter((line: PayrollLine) => ((line?.type?.code ?? '').indexOf('70') > -1))
      ?.reduce((acc, line: PayrollLine) => acc + line.value, 0) ?? 0

    const baseIncidenceSS = grossValue - (vacationSupport > 0 ? vacationSupport : 0) - unknownValues;

    let totalWITaxValue = 0;

    if (baseValue > 0) {
      totalWITaxValue += baseValue;
    }
    if (foodSupport > 0) {
      totalWITaxValue += foodSupport;
    }
    if (transportSupport > 0) {
      totalWITaxValue += transportSupport;
    }
    if (familySupport > 0) {
      totalWITaxValue += familySupport;
    }
    if (vacationSupport > 0) {
      totalWITaxValue += vacationSupport;
    }
    if (christmasSupport > 0) {
      totalWITaxValue += christmasSupport;
    }

    if (otherValues > 0) {
      totalWITaxValue += otherValues;
    }

    const collectableMaterial = totalWITaxValue - (baseIncidenceSS * 3 / 100) - unknownValues;

    const myWITax = await WITaxTable.findOne({
      where: {

        fromValue: { [Op.lte]: collectableMaterial },
        toValue: { [Op.or]: [{ [Op.gt]: collectableMaterial }, { [Op.eq]: 0 }] },

      },
      order: [['toValue', 'DESC']]
    })
    let { excess, rate, fixedInstallment }: any = myWITax
    excess = parseFloat(excess);
    rate = parseFloat(rate);
    fixedInstallment = parseFloat(fixedInstallment);

    const excessy = collectableMaterial - (excess ?? 0);
    const witValue = (excessy * (rate ?? 0) / 100) + (fixedInstallment ?? 0)

    return { excess, rate, fixedInstallment, witValue, ssValue: baseIncidenceSS * 3 / 100 }
  };

}
