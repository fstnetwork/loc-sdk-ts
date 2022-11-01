// reference: copy from https://github.com/denoland/deno/blob/v1.26.2/ext/fetch/26_fetch.js and edited

// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.

// @ts-check
/// <reference path="../../core/lib.deno_core.d.ts" />
/// <reference path="../web/internal.d.ts" />
/// <reference path="../url/internal.d.ts" />
/// <reference path="../web/lib.deno_web.d.ts" />
/// <reference path="../web/06_streams_types.d.ts" />
/// <reference path="./internal.d.ts" />
/// <reference path="./lib.deno_fetch.d.ts" />
/// <reference lib="esnext" />
'use strict';

((window) => {
  const core = window.Deno.core;
  const webidl = window.__bootstrap.webidl;
  const { byteLowerCase } = window.__bootstrap.infra;
  const { BlobPrototype } = window.__bootstrap.file;
  const { errorReadableStream, ReadableStreamPrototype, readableStreamForRid } =
    window.__bootstrap.streams;
  const { InnerBody, extractBody } = window.__bootstrap.fetchBody;
  const {
    toInnerRequest,
    toInnerResponse,
    fromInnerResponse,
    redirectStatus,
    nullBodyStatus,
    networkError,
    abortedNetworkError,
    processUrlList,
  } = window.__bootstrap.fetch;
  const abortSignal = window.__bootstrap.abortSignal;
  const {
    ArrayPrototypePush,
    ArrayPrototypeSplice,
    ArrayPrototypeFilter,
    ArrayPrototypeIncludes,
    ObjectPrototypeIsPrototypeOf,
    Promise,
    PromisePrototypeThen,
    PromisePrototypeCatch,
    SafeArrayIterator,
    String,
    StringPrototypeStartsWith,
    StringPrototypeToLowerCase,
    TypeError,
    Uint8Array,
    Uint8ArrayPrototype,
    WeakMap,
    WeakMapPrototypeDelete,
    WeakMapPrototypeGet,
    WeakMapPrototypeHas,
    WeakMapPrototypeSet,
  } = window.__bootstrap.primordials;

  const REQUEST_BODY_HEADER_NAMES = [
    'content-encoding',
    'content-language',
    'content-location',
    'content-type',
  ];

  const requestBodyReaders = new WeakMap();

  /**
   * @param {string} configurationId
   * @param {string} method
   * @param {string} path
   * @param {[string, string][]} headers
   * @param {number | null} clientRid
   * @param {boolean} hasBody
   * @param {number} bodyLength
   * @param {Uint8Array | null} body
   * @returns {{ requestRid: number, requestBodyRid: number | null }}
   */
  async function opFetch(
    configurationId,
    method,
    path,
    headers,
    clientRid,
    hasBody,
    bodyLength,
    body
  ) {
    const headersMap = {};
    headers.forEach(([name, value]) => {
      headersMap[name] = value;
    });

    return core.opAsync(
      'op_http_agent_prepare',
      {
        configurationId,
        method,
        path,
        headers: headersMap,
        hasBody,
        bodyLength,
      },
      body
    );
  }

  /**
   * @param {string} configurationId
   * @param {number} rid
   * @returns {Promise<{ status: number, statusText: string, headers: [string, string][], url: string, responseRid: number }>}
   */
  function opFetchSend(configurationId, rid) {
    return core.opAsync('op_http_agent_send', configurationId, rid);
  }

  /**
   * @param {number} responseBodyRid
   * @param {AbortSignal} [terminator]
   * @returns {ReadableStream<Uint8Array>}
   */
  function createResponseBodyStream(responseBodyRid, terminator) {
    const readable = readableStreamForRid(responseBodyRid);

    function onAbort() {
      errorReadableStream(readable, terminator.reason);
      core.tryClose(responseBodyRid);
    }

    // TODO(lucacasonato): clean up registration
    terminator[abortSignal.add](onAbort);

    return readable;
  }

  /**
   * @param {InnerRequest} req
   * @param {boolean} recursive
   * @param {AbortSignal} terminator
   * @returns {Promise<InnerResponse>}
   */
  async function mainFetch(configurationId, req, recursive, terminator) {
    /** @type {ReadableStream<Uint8Array> | Uint8Array | null} */
    let reqBody = null;

    if (req.body !== null) {
      if (
        ObjectPrototypeIsPrototypeOf(
          ReadableStreamPrototype,
          req.body.streamOrStatic
        )
      ) {
        if (
          req.body.length === null ||
          ObjectPrototypeIsPrototypeOf(BlobPrototype, req.body.source)
        ) {
          reqBody = req.body.stream;
        } else {
          const reader = req.body.stream.getReader();
          WeakMapPrototypeSet(requestBodyReaders, req, reader);
          const r1 = await reader.read();
          if (r1.done) {
            reqBody = new Uint8Array(0);
          } else {
            reqBody = r1.value;
            const r2 = await reader.read();
            if (!r2.done) throw new TypeError('Unreachable');
          }
          WeakMapPrototypeDelete(requestBodyReaders, req);
        }
      } else {
        req.body.streamOrStatic.consumed = true;
        reqBody = req.body.streamOrStatic.body;
        // TODO(@AaronO): plumb support for StringOrBuffer all the way
        reqBody = typeof reqBody === 'string' ? core.encode(reqBody) : reqBody;
      }
    }

    const { requestRid, requestBodyRid, cancelHandleRid } = await opFetch(
      configurationId,
      req.method,
      req.currentUrl(),
      req.headerList,
      req.clientRid,
      reqBody !== null,
      req.body?.length,
      ObjectPrototypeIsPrototypeOf(Uint8ArrayPrototype, reqBody)
        ? reqBody
        : null
    );

    function onAbort() {
      if (cancelHandleRid !== undefined && cancelHandleRid !== null) {
        core.tryClose(cancelHandleRid);
      }
      if (requestBodyRid !== null) {
        core.tryClose(requestBodyRid);
      }
    }
    terminator[abortSignal.add](onAbort);

    if (requestBodyRid !== null) {
      if (
        reqBody === null ||
        !ObjectPrototypeIsPrototypeOf(ReadableStreamPrototype, reqBody)
      ) {
        throw new TypeError('Unreachable');
      }
      const reader = reqBody.getReader();
      WeakMapPrototypeSet(requestBodyReaders, req, reader);
      (async () => {
        while (true) {
          const { value, done } = await PromisePrototypeCatch(
            reader.read(),
            (err) => {
              if (terminator.aborted) return { done: true, value: undefined };
              throw err;
            }
          );
          if (done) break;
          if (!ObjectPrototypeIsPrototypeOf(Uint8ArrayPrototype, value)) {
            await reader.cancel('value not a Uint8Array');
            break;
          }
          try {
            await PromisePrototypeCatch(
              core.writeAll(requestBodyRid, value),
              (err) => {
                if (terminator.aborted) return;
                throw err;
              }
            );
            if (terminator.aborted) break;
          } catch (err) {
            await reader.cancel(err);
            break;
          }
        }
        WeakMapPrototypeDelete(requestBodyReaders, req);
        core.tryClose(requestBodyRid);
      })();
    }

    let resp;
    try {
      resp = await PromisePrototypeCatch(
        opFetchSend(configurationId, requestRid),
        (err) => {
          if (terminator.aborted) return;
          throw err;
        }
      );
    } finally {
      if (cancelHandleRid !== undefined && cancelHandleRid !== null) {
        core.tryClose(cancelHandleRid);
      }
    }
    if (terminator.aborted) return abortedNetworkError();

    processUrlList(req.urlList, req.urlListProcessed);

    /** @type {InnerResponse} */
    const response = {
      headerList: resp.headers,
      status: resp.status,
      body: null,
      statusMessage: resp.statusText,
      type: 'basic',
      url() {
        if (this.urlList.length == 0) return null;
        return this.urlList[this.urlList.length - 1];
      },
      urlList: req.urlListProcessed,
    };

    if (nullBodyStatus(response.status)) {
      core.close(resp.responseRid);
    } else {
      if (req.method === 'HEAD' || req.method === 'CONNECT') {
        response.body = null;
        core.close(resp.responseRid);
      } else {
        response.body = new InnerBody(
          createResponseBodyStream(resp.responseRid, terminator)
        );
      }
    }

    if (recursive) return response;

    if (response.urlList.length === 0) {
      processUrlList(req.urlList, req.urlListProcessed);
      response.urlList = [...new SafeArrayIterator(req.urlListProcessed)];
    }

    return response;
  }

  /**
   * @param {string} configurationId
   * @param {RequestInfo} input
   * @param {RequestInit} init
   */
  function fetch(configurationId, input, init = {}) {
    // There is an async dispatch later that causes a stack trace disconnect.
    // We reconnect it by assigning the result of that dispatch to `opPromise`,
    // awaiting `opPromise` in an inner function also named `fetch()` and
    // returning the result from that.
    let opPromise = undefined;

    const result = new Promise((resolve, reject) => {
      const prefix = "Failed to call 'fetch'";
      webidl.requiredArguments(arguments.length, 1, { prefix });

      const requestObject = new Request(input, init);
      const request = toInnerRequest(requestObject);
      if (requestObject.signal.aborted) {
        reject(abortFetch(request, null, requestObject.signal.reason));
        return;
      }

      let responseObject = null;
      let locallyAborted = false;
      function onabort() {
        locallyAborted = true;
        reject(
          abortFetch(request, responseObject, requestObject.signal.reason)
        );
      }
      requestObject.signal[abortSignal.add](onabort);

      // 12.
      opPromise = PromisePrototypeCatch(
        PromisePrototypeThen(
          mainFetch(configurationId, request, false, requestObject.signal),
          (response) => {
            // 12.1.
            if (locallyAborted) return;
            // 12.2.
            if (response.aborted) {
              reject(
                abortFetch(request, responseObject, requestObject.signal.reason)
              );
              requestObject.signal[abortSignal.remove](onabort);
              return;
            }
            // 12.3.
            if (response.type === 'error') {
              const err = new TypeError(
                'Fetch failed: ' + (response.error ?? 'unknown error')
              );
              reject(err);
              requestObject.signal[abortSignal.remove](onabort);
              return;
            }
            responseObject = fromInnerResponse(response, 'immutable');
            resolve(responseObject);
            requestObject.signal[abortSignal.remove](onabort);
          }
        ),
        (err) => {
          reject(err);
          requestObject.signal[abortSignal.remove](onabort);
        }
      );
    });
    if (opPromise) {
      PromisePrototypeCatch(result, () => {});
      return (async function fetch() {
        await opPromise;
        return result;
      })();
    }
    return result;
  }

  function abortFetch(request, responseObject, error) {
    if (request.body !== null) {
      if (WeakMapPrototypeHas(requestBodyReaders, request)) {
        WeakMapPrototypeGet(requestBodyReaders, request).cancel(error);
      } else {
        request.body.cancel(error);
      }
    }
    if (responseObject !== null) {
      const response = toInnerResponse(responseObject);
      if (response.body !== null) response.body.error(error);
    }
    return error;
  }

  window.__bootstrap.fetch ??= {};
  window.__bootstrap.fetch.fetch = fetch;
})(this);
