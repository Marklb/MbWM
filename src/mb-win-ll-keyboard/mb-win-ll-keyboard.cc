#include <node.h>
#include <iostream>
#include <nan.h>
#include <windows.h>
#include <vector>
#include <stdlib.h>

#include "mb-win-ll-keyboard.h"

namespace mbWinLLKb {

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

DWORD thread_id;

uv_async_t async;

static Persistent<Function> LLKbPersistentCallback;

bool hkLLKbDisabledKeysVkCodes[256] = {false};

void HookLLKb(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  // cout << "Hooking LL Kb" << endl;

  LLKbPersistentCallback.Reset(isolate, Handle<Function>::Cast(args[0]));

  // async.data = (void *)10;

  uv_async_init(uv_default_loop(), &async, LLKbHookHandleKeyEvent);

  int param = 0;
  uv_thread_t t_id;
  uv_thread_cb uvcb = (uv_thread_cb)RunThread;

  uv_thread_create(&t_id, uvcb, &param);

  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "World"));
}

void RunThread(void* arg) {
	MSG msg;
	BOOL val;

	PeekMessage(&msg, NULL, WM_USER, WM_USER, PM_NOREMOVE);
	thread_id = GetCurrentThreadId();

	HHOOK hook = SetWindowsHookEx(WH_KEYBOARD_LL, LowLevelKeyboardProc, (HINSTANCE) NULL, 0);

	while((val = GetMessage(&msg, NULL, 0, 0)) != 0) {
		if(val == -1) throw std::runtime_error("GetMessage failed (return value -1)");
		// if(msg.message == WM_STOP_MESSAGE_LOOP) break;
	}

	UnhookWindowsHookEx(hook);
}

void LLKbHookHandleKeyEvent(uv_async_t *handle) {
  // cout << "LLKbHookHandleKeyEvent" << endl;
  data_LLKbHook *data_t = (data_LLKbHook*)handle->data;

  auto isolate = Isolate::GetCurrent();
  auto context = isolate->GetCurrentContext();
  auto global = context->Global();
  HandleScope scope;

  Local<Object> obj = Object::New(isolate);
  obj->Set(String::NewFromUtf8(isolate, "msg"), Number::New(isolate, data_t->msg));
  obj->Set(String::NewFromUtf8(isolate, "vkCode"), Number::New(isolate, data_t->vkCode));
  obj->Set(String::NewFromUtf8(isolate, "scanCode"), Number::New(isolate, data_t->scanCode));

  const int argc = 1;
  Handle<Value> argv[argc];
  argv[0] = obj;

  auto fn = Local<Function>::New(isolate, LLKbPersistentCallback);
  fn->Call(global, argc, argv);
  free(data_t);
}

void LLKbHookDisableVkCodeKey(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  int vkCode = (int)(args[0]->NumberValue());
  hkLLKbDisabledKeysVkCodes[vkCode] = true;
  fprintf(stderr, "LLKbHook Disable key: %d\n", vkCode);
}

void LLKbHookEnableVkCodeKey(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  int vkCode = (int)(args[0]->NumberValue());
  hkLLKbDisabledKeysVkCodes[vkCode] = false;
  fprintf(stderr, "LLKbHook Enable key: %d\n", vkCode);
}

LRESULT CALLBACK LowLevelKeyboardProc(int nCode, WPARAM wParam, LPARAM lParam)
{
    if (nCode == HC_ACTION)
    {
        PKBDLLHOOKSTRUCT p = (PKBDLLHOOKSTRUCT)lParam;
        switch (wParam)
        {
          case WM_KEYDOWN:
          case WM_KEYUP:
          {
            // cout << "Hooking LL Kb" << endl;
            data_LLKbHook *data_t = (data_LLKbHook*)malloc(sizeof(data_LLKbHook));
            data_t->msg = (int)wParam;
            data_t->vkCode = (int)p->vkCode;
            data_t->scanCode = (int)p->scanCode;
            async.data = (void*)data_t;
            uv_async_send(&async);

            break;
          }
        }

        switch (wParam)
        {
          case WM_KEYDOWN:
          case WM_KEYUP:
          {
            // cout << "WM_KEYDOWN" << endl;
            if(hkLLKbDisabledKeysVkCodes[(int)p->vkCode] == true){
              // fprintf(stderr, "LLKbHook Disabled key: %d\n", (int)p->vkCode);
              return 1;
            }else{
              // fprintf(stderr, "LLKbHook Enabled key: %d\n", (int)p->vkCode);
            }
            // uv_async_send(&async);
            break;
          }
        }
    }
    return CallNextHookEx(NULL, nCode, wParam, lParam);
}






void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hookLLKb", HookLLKb);
  NODE_SET_METHOD(exports, "disableVkCodeKey", LLKbHookDisableVkCodeKey);
  NODE_SET_METHOD(exports, "enableVkCodeKey", LLKbHookEnableVkCodeKey);

}

NODE_MODULE(addon, init)

}  // namespace mbWinLLKb
