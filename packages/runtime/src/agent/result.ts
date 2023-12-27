export interface IResultAgent {
  finalize(value: object): IResultAgent;
  httpStatusCode(statusCode: number): IResultAgent;
}

// eslint-disable-next-line import/prefer-default-export
export const ResultAgent: IResultAgent = {
  finalize(value: object): IResultAgent {
    Deno.core.ops['op_result_agent_set']?.(value);
    return this;
  },

  httpStatusCode(statusCode: number): IResultAgent {
    Deno.core.ops['op_result_agent_set_http_status_code']?.(statusCode);
    return this;
  },
};
