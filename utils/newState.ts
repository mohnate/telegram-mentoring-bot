import { State } from "types/state";
import { UtilsFunction } from "types/utils";

const newState: UtilsFunction<void, State> = () => {
  return {
    db: {
      connection: null,
      wasConnectionGenerated: false,
    },
  };
};

export default newState;
