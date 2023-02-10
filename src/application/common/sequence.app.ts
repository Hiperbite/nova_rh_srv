import { Sequence } from "../../models/index";

class SequenceApp {
  constructor() {}

  public static count = async (code: string) => {
    const sequence: any = await Sequence.findOne({ where: { code } });

    sequence.update({ sequence: sequence?.sequence ?? 0 + 1 });

    return sequence.sequence;
  };
}

enum CODES {
  EMPLOYEE = "EMPLOYEE",
}

export default SequenceApp;
export { CODES };
