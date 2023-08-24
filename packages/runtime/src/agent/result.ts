export class ResultAgent {
  finalize(value: object): void {
    Deno.core.ops["op_result_agent_set"]?.(value);
  }
}
