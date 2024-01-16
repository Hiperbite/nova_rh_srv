import { PayrollLine, PayStub, SalaryPackage } from "../../models/index";
import moment from "moment";
import WITaxApp from "./wi_tax.app";

const PayStubLineTypeConst =
{
    Base: '1000',
    FoodSupport: '1401',
    TransportSupport: '1402',
    ChristmansSupport: '1642',
    FamilySupport: '1603',
    vocationSupport: '1630',

    WiTax: '401',
    SSValue: '350'
}

export default class PayStubLineApp {


    static updatePayStub = async (payrollLine: PayrollLine, { transaction }: any = { transaction: null }) => {

        if (["401", "350"].indexOf(payrollLine.code) > -1)
            return;
        let lines: any = await PayrollLine.scope('default').findAll({ where: { payStubId: payrollLine?.payStubId } })//payStub?.payStub?.lines;

        const { excess, rate, fixedInstallment, witValue, ssValue } = await WITaxApp.calculator(lines)

        const witTaxLine = lines.find(({ code }: any) => code == '401');//await PayrollLine.findOne({where:{}})
        if (witTaxLine) {
            witTaxLine.value = witValue;
            witTaxLine.save();
        }

        const ssTaxLine = lines.find(({ code }: any) => code == '350');//await PayrollLine.findOne({where:{}})
        if (ssTaxLine) {
            ssTaxLine.value = ssValue;
            ssTaxLine.save();
        }

    }
}

export { PayStubLineTypeConst }