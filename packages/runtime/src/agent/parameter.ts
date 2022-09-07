export const Parameter = {
  get(name: string): string | null {
    return Deno.core.opSync("op_parameter_get", name);
  },
};
