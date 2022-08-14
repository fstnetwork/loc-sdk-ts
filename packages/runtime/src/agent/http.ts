export class HttpAgent {
  constructor(readonly configurationId?: string) {}

  async acquire(configurationName: string): Promise<HttpAgent> {
    const configurationId = await Deno.core.opAsync(
      "op_http_agent_acquire",
      configurationName
    );

    return new HttpAgent(configurationId);
  }

  async send(
    request: Http.Request,
    config: Http.Config | null
  ): Promise<Http.Response> {
    const { method, path, headers, contentType, body } = request;
    const req = {
      configurationId: this.configurationId,
      method,
      path,
      headers,
      contentType,
      config,
    };

    return Deno.core.opAsync("op_http_agent_send", req, body);
  }

  async get(
    path: string,
    headers: Record<string, string>,
    contentType: Http.ContentType,
    body: Uint8Array | null = null,
    config: Http.Config | null = null
  ): Promise<Http.Response> {
    return this.send(
      new Http.Request(Http.Method.GET, path, headers, contentType, body),
      config
    );
  }

  async post(
    path: string,
    headers: Record<string, string>,
    contentType: Http.ContentType,
    body: Uint8Array | null,
    config: Http.Config | null = null
  ): Promise<Http.Response> {
    return this.send(
      new Http.Request(Http.Method.POST, path, headers, contentType, body),
      config
    );
  }

  async patch(
    path: string,
    headers: Record<string, string>,
    contentType: Http.ContentType,
    body: Uint8Array | null,
    config: Http.Config | null = null
  ): Promise<Http.Response> {
    return this.send(
      new Http.Request(Http.Method.PATCH, path, headers, contentType, body),
      config
    );
  }

  async put(
    path: string,
    headers: Record<string, string>,
    contentType: Http.ContentType,
    body: Uint8Array | null,
    config: Http.Config | null = null
  ): Promise<Http.Response> {
    return this.send(
      new Http.Request(Http.Method.PUT, path, headers, contentType, body),
      config
    );
  }

  async delete(
    path: string,
    headers: Record<string, string>,
    contentType: Http.ContentType,
    body: Uint8Array | null,
    config: Http.Config | null = null
  ): Promise<Http.Response> {
    return this.send(
      new Http.Request(Http.Method.DELETE, path, headers, contentType, body),
      config
    );
  }
}

function urlQueryString(init: any): string {
  let params: [string, string][] = [];

  if (typeof init === "string") {
    if (init[0] === "?") {
      init = init.slice(1);
    }
    return init;
  } else if (Array.isArray(init)) {
    for (const pair of init) {
      // If pair does not contain exactly two items, then throw a TypeError.

      params.push([String(pair[0]), String(pair[1])]);
    }
  } else {
    for (const [key, value] of Object.entries(init)) {
      params.push([String(key), String(value)]);
    }
  }

  return params.map((p) => `${encodeURI(p[0])}=${encodeURI(p[1])}`).join("&");
}

export namespace Http {
  export enum Method {
    GET = "Get",
    POST = "Post",
    PATCH = "Patch",
    PUT = "Put",
    DELETE = "Delete",
  }

  export enum ContentType {
    None = "None",
    PlainText = "PlainText",
    Json = "Json",
    Form = "Form",
  }

  export class Request {
    method: Method;
    path: String;
    headers: Record<string, string>;
    contentType: ContentType;
    body: Uint8Array | null;

    constructor(
      method: Method = Method.GET,
      path: string = "",
      headers: Record<string, string> = {},
      contentType: ContentType = ContentType.None,
      body: Uint8Array | null = null
    ) {
      this.method = method;
      this.path = path;
      this.headers = headers;
      this.contentType = contentType;
      this.body = body;
    }

    setJson(body: any) {
      this.body = Deno.core.encode(JSON.stringify(body));
      this.contentType = ContentType.Json;
      return this;
    }

    setForm(body: any) {
      this.body = Deno.core.encode(urlQueryString(body));
      this.contentType = ContentType.Form;
      return this;
    }
  }

  export class Config {
    acceptInvalidCerts: boolean;

    constructor(acceptInvalidCerts: boolean = false) {
      this.acceptInvalidCerts = acceptInvalidCerts;
    }
  }

  export interface Response {
    status: number;
    headers: Record<string, string>;
    body: Uint8Array;
  }
}
