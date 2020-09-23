/**
 * @license
 * Copyright 2019 The Emscripten Authors
 * SPDX-License-Identifier: MIT
 */

#include "runtime_safe_heap.js"

#if ASSERTIONS
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) throw text;
}
#endif

/** @param {string|number=} what */
function abort(what) {
#if ASSERTIONS
  throw new Error(what);
#else
  throw what;
#endif
}

var tempRet0 = 0;
var setTempRet0 = function(value) {
  tempRet0 = value;
}
var getTempRet0 = function() {
  return tempRet0;
}

function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}

#if WASM != 2 && MAYBE_WASM2JS
#if !WASM2JS
if (Module['doWasm2JS']) {
#endif
#include "wasm2js.js"
#if !WASM2JS
}
#endif
#endif

#if SINGLE_FILE && WASM == 1 && !WASM2JS
#include "base64Decode.js"
Module['wasm'] = base64Decode('{{{ getQuoted("WASM_BINARY_DATA") }}}');
#endif

#include "runtime_functions.js"
#include "runtime_strings.js"

#if USE_PTHREADS
if (!ENVIRONMENT_IS_PTHREAD) {
#endif

#if ALLOW_MEMORY_GROWTH && MAXIMUM_MEMORY != -1
var wasmMaximumMemory = {{{ MAXIMUM_MEMORY >>> 16 }}};
#else
var wasmMaximumMemory = {{{ INITIAL_MEMORY >>> 16}}};
#endif

// These get assigned from the WebAssembly module exports
var wasmTable;
var wasmMemory;
var buffer;

#if USE_PTHREADS
}
#endif

var HEAP8, HEAP16, HEAP32, HEAPU8, HEAPU16, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(b) {
  buffer = b;
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  HEAP32 = new Int32Array(b);
  HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  HEAPU32 = new Uint32Array(b);
  HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
}

#if USE_PTHREADS && ((MEM_INIT_METHOD == 1 && !MEM_INIT_IN_WASM && !SINGLE_FILE) || USES_DYNAMIC_ALLOC)
if (!ENVIRONMENT_IS_PTHREAD) {
#endif

#if USE_PTHREADS && ((MEM_INIT_METHOD == 1 && !MEM_INIT_IN_WASM && !SINGLE_FILE) || USES_DYNAMIC_ALLOC)
}
#endif

#include "runtime_stack_check.js"
#include "runtime_assertions.js"

#if LOAD_SOURCE_MAP
var wasmSourceMap;
#include "source_map_support.js"
#endif

#if USE_OFFSET_CONVERTER
var wasmOffsetConverter;
#include "wasm_offset_converter.js"
#endif

#if EXIT_RUNTIME
var __ATEXIT__    = []; // functions called during shutdown
#endif

#if ASSERTIONS || SAFE_HEAP
var runtimeInitialized = false;

// This is always false in minimal_runtime - the runtime does not have a concept
// of exiting (keeping this variable here for now since it is referenced from
// generated code)
var runtimeExited = false;
#endif

#include "runtime_math.js"
#include "memoryprofiler.js"
#include "runtime_debug.js"

// === Body ===
