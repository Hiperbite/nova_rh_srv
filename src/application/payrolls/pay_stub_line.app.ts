import { PayrollLine, PayStub, SalaryPackage } from "../../models/index";
import moment from "moment";
import WITaxApp from "./wi_tax.app";

export default class PayStubLineApp {


    static updatePayStub = async (payrollLine: PayrollLine, { transaction }: any = { transaction: null }) => {

        if (["401", "350"].indexOf(payrollLine.code)>-1)
            return;
        let lines: any = await PayrollLine.findAll({ where: { payStubId: payrollLine?.payStubId } })//payStub?.payStub?.lines;

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