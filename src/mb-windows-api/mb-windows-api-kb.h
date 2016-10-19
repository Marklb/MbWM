#include <node.h>
#include <iostream>
#include <nan.h>
#include <windows.h>
#include <vector>
#include <stdlib.h>


namespace mbWinApiKb {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Array;
using v8::Persistent;
using v8::Number;
using v8::Function;
using v8::Handle;

using Nan::AsyncQueueWorker;
using Nan::AsyncWorker;
using Nan::Callback;
using Nan::HandleScope;
using Nan::New;
using Nan::Null;
using Nan::To;

using namespace std;

struct data_LLKbHook_t {
  int msg;
  int vkCode;
}typedef data_LLKbHook;


LRESULT CALLBACK LowLevelKeyboardProc(int nCode, WPARAM wParam, LPARAM lParam);

void LLKbHook();

void LLKbHookLoop(uv_work_t *req);

void LLKbHookHandleKeyEvent(uv_async_t *handle);

void LLKbHookFinished(uv_work_t *req, int status);

void LLKbHookDisableKey(const FunctionCallbackInfo<Value>& args);

void LLKbHookEnableKey(const FunctionCallbackInfo<Value>& args);

void HookLLKb(const FunctionCallbackInfo<Value>& args);

}
