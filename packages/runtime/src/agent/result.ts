// eslint-disable-next-line import/prefer-default-export
export const ResultAgent = {
  finalize(value: object): void {
    Deno.core.opSync('op_result_agent_set', value);
  },
};
