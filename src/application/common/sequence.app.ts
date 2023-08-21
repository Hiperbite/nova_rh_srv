import { Sequence } from "../../models/index";

class SequenceApp {
  constructor() { }

  public static count = async (code: string, options:any = {}) => {
    let sequence: any = await Sequence.findOne({ where: { code } });
    if (sequence === null) {
      sequence = await Sequence.create({ code }, options)
    } {
      sequence.update({ sequence: (sequence?.sequence ?? 0) + 1 }, options).catch(console.log);
    }

    return sequence.sequence;
  };
}

enum CODES {
  STUDENT = "STUDENT",
  ENROLLMENT = "ENROLLMENT",
  REGISTRATION = "REGISTRATION",
  COURSE = "COURSE",
  DISCIPLINE = "DISCIPLINE",
  STAFF = "STAFF",
  TICKET = "TICKET",
  EVENT = "EVENT",
  SCHEDULE = "SCHEDULE"
}

export default SequenceApp;
export { CODES };
