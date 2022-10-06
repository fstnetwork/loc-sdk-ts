export const LogicVariable = {
  get(name: string): string | null {
    return Deno.core.opSync('op_logic_variable_get', name);
  },
};
