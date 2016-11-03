#include <node.h>
#include <iostream>
#include <nan.h>
#include <windows.h>
#include <vector>
#include <stdlib.h>


namespace mbWinMouse {

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

struct data_MouseHook_t {
  int msg;
  int vkCode;
  int scanCode;
}typedef data_MouseHook;

void HookMouse(const FunctionCallbackInfo<Value>& args);

void RunThread(void* arg);

void MouseHookHandleKeyEvent(uv_async_t *handle);

LRESULT CALLBACK LowLevelMouseProc(int nCode, WPARAM wParam, LPARAM lParam);



}  // namespace mbWinMouse
