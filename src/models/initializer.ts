import Setting from "./Settings/Settings";
import Company from "./company/company";
import AdditionalPaymentType from "./employees/additional_payment_type";
import Department from "./employees/department";
import Role from "./employees/role";
import PayrollStatus from "./payroll/payroll_status";


const initialData = [
    {
        model: PayrollStatus, data: [
            { code: 0, name: 'Aberto' },
            { code: 1, name: 'Analise  ' },
            { code: 2, name: 'Confirmação' },
            { code: 3, name: 'Aprovação' },
            { code: 4, name: 'Execução' },
        ]
    },
    {
        model: AdditionalPaymentType, data: [

            { code: '1000', name: 'Vencimento Base', level: 1 },
            { code: '1401', level: 0, name: 'Almoço' },
            { code: '1406', level: 0, name: 'Competitividade' },
            { code: 'BN', level: 0, name: 'Bônus' },
            { code: 'HE', level: 0, name: 'Horas extras' },
            { code: 'AS', level: 0, name: 'Adiantamento salarial' },
            { code: 'TF', level: 0, name: 'Trabalho em feriados' },
            { code: 'VC', level: 0, name: 'Feriados' },
            { code: 'HE', level: 0, name: 'Horas extras' },
            { code: 'VA', level: 0, name: 'Variável' },
            { code: 'CM', level: 0, name: 'Comissões' },
            { code: 'CP', level: 0, name: 'Complemento' },
            { code: 'DS', level: 0, name: 'Disponibilidade' },
            { code: 'AC', level: 0, name: 'Acomodação' },
            { code: 'TR', level: 0, name: 'Transporte' },
            { code: 'ET', level: 0, name: 'Espaço de trabalho' },
            { code: 'RF', level: 0, name: 'Refeição' },
            { code: 'AP', level: 0, name: 'Aprendizado' },
            { code: 'OU', level: 0, name: 'Outro' }
        ]
    },
    {
        model: Role, data: [
            { code: '1', name: 'Project manager' },
            { code: '2', name: 'Software Architect' },
            { code: '3', name: 'Data science' },
            { code: '4', name: 'Front-end web development' },
            { code: '5', name: 'Software Testing' },
            { code: '6', name: 'Product Manager' },
            { code: '7', name: 'System Administrator' },
            { code: '8', name: 'Marketing' },
            { code: '9', name: 'Data analysis' },
            { code: '10', name: 'Technical Project Manager' },
            { code: '11', name: 'Machine learning' },
            { code: '12', name: 'Sales engineering' },
            { code: '13', name: 'Developer Analyst - Trainee' },
            { code: '14', name: 'Developer Analyst - Junior' },
            { code: '15', name: 'Developer Analyst - Full' },
            { code: '16', name: 'Developer Analyst - Senior' },
            { code: '17', name: 'Assistente Comercial I' },
            { code: '18', name: 'Assistente Comercial II' },
            { code: '19', name: 'Assistente Comercial III' },
            { code: '20', name: 'Commercial Manager' },
        ]
    },
    {
        model: Department, data: [
            {
                name: 'Executive Council', code: 'CEX',
                childs: [
                    { name: 'Direcção de Recursos Humanos', code: 'DRH' },
                    { name: 'Direcção Comercial', code: 'DCO' },
                    { name: 'Direcção Financeira e de Contabilidades', code: 'DFC' },
                    { name: 'Direcção de Tecnologia', code: 'DTI' }]
            }]
    },
    {
        model: Company, data: [
            {
                code: 'A',
                name: '',
                description: '',
                business: '',
                nif: '',
                socialCapital: 0,
                integrationToken: '',
                slogan: '',
                logos: ''
            }]
    },
    {
        model: Setting, data: [
            /*{
              code: 'NOVA',
        
              id: '028a5c78-710f-482c-a68d-b48cca54f35c',
        
              system: SystemSetting.create({ id: '028a5c78-710f-482c-a68d-b48cca54f35c' }).catch(console.log),
        
              documents: DocumentSetting.create({ id: '028a5c78-710f-482c-a68d-b48cca54f35c' }).catch(console.log),
        
              local: LocalSetting.create({ id: '028a5c78-710f-482c-a68d-b48cca54f35c' }).catch(console.log),
        
              classe: ClasseSetting.create({ id: '028a5c78-710f-482c-a68d-b48cca54f35c' }).catch(console.log),
        
              license: LicenseSetting.create({ id: '028a5c78-710f-482c-a68d-b48cca54f35c' }).catch(console.log)
            },*/

        ]
    }]

const initializer = (_?: any) =>
    initialData.forEach(({ model, data }: any) => data.forEach(async (d: any) => {
        try {

            model.find({ where: { code: d.code } }).then((f: any) => {
                if (f) {
                    model.create(d, { include: { all: true } }).catch(console.log)
                }
            }).catch(console.log)

        } catch (e: any) {
            let u = e;
        }
    }))


export { initializer }