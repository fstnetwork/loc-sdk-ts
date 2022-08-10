export namespace Parameter {
  export function get(name: string): string | null {
    return Deno.core.opSync("op_parameter_get", name);
  }
}
