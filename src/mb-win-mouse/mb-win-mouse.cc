#include <node.h>
#include <iostream>
#include <nan.h>
#include <windows.h>
#include <vector>
#include <stdlib.h>

#include "mb-win-mouse.h"

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

DWORD thread_id;

uv_async_t async;

static Persistent<Function> MousePersistentCallback;


void HookMouse(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  cout << "Hooking Mouse" << endl;

  MousePersistentCallback.Reset(isolate, Handle<Function>::Cast(args[0]));

  // async.data = (void *)10;

  uv_async_init(uv_default_loop(), &async, MouseHookHandleKeyEvent);

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

	HHOOK hook = SetWindowsHookEx(WH_MOUSE_LL, LowLevelMouseProc, (HINSTANCE) NULL, 0);

	while((val = GetMessage(&msg, NULL, 0, 0)) != 0) {
		if(val == -1) throw std::runtime_error("GetMessage failed (return value -1)");
		// if(msg.message == WM_STOP_MESSAGE_LOOP) break;
	}

	UnhookWindowsHookEx(hook);
}

void MouseHookHandleKeyEvent(uv_async_t *handle) {
  cout << "MouseHookHandleKeyEvent" << endl;
  // data_MouseHook *data_t = (data_MouseHook*)handle->data;

  auto isolate = Isolate::GetCurrent();
  auto context = isolate->GetCurrentContext();
  auto global = context->Global();
  HandleScope scope;

  Local<Object> obj = Object::New(isolate);
  // obj->Set(String::NewFromUtf8(isolate, "msg"), Number::New(isolate, data_t->msg));
  // obj->Set(String::NewFromUtf8(isolate, "vkCode"), Number::New(isolate, data_t->vkCode));
  // obj->Set(String::NewFromUtf8(isolate, "scanCode"), Number::New(isolate, data_t->scanCode));

  const int argc = 1;
  Handle<Value> argv[argc];
  argv[0] = obj;

  auto fn = Local<Function>::New(isolate, MousePersistentCallback);
  fn->Call(global, argc, argv);
  // free(data_t);
}

// void LLKbHookDisableVkCodeKey(const FunctionCallbackInfo<Value>& args) {
//   Isolate* isolate = args.GetIsolate();
//   int vkCode = (int)(args[0]->NumberValue());
//   hkLLKbDisabledKeysVkCodes[vkCode] = true;
//   fprintf(stderr, "LLKbHook Disable key: %d\n", vkCode);
// }
//
// void LLKbHookEnableVkCodeKey(const FunctionCallbackInfo<Value>& args) {
//   Isolate* isolate = args.GetIsolate();
//   int vkCode = (int)(args[0]->NumberValue());
//   hkLLKbDisabledKeysVkCodes[vkCode] = false;
//   fprintf(stderr, "LLKbHook Enable key: %d\n", vkCode);
// }

bool IsTouchEvent() {
    const LONG_PTR c_SIGNATURE_MASK = 0xFFFFFF00;
    const LONG_PTR c_MOUSEEVENTF_FROMTOUCH = 0xFF515700;

    LONG_PTR extraInfo = GetMessageExtraInfo();
    return ( ( extraInfo & c_SIGNATURE_MASK ) == c_MOUSEEVENTF_FROMTOUCH );
}

LRESULT CALLBACK LowLevelMouseProc(int nCode, WPARAM wParam, LPARAM lParam)
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
            data_MouseHook *data_t = (data_MouseHook*)malloc(sizeof(data_MouseHook));
            data_t->msg = (int)wParam;
            // data_t->vkCode = (int)p->vkCode;
            // data_t->scanCode = (int)p->scanCode;
            async.data = (void*)data_t;
            uv_async_send(&async);

            break;
          }
          case WM_MOUSEMOVE:
          {
            // cout << "WM_MOUSEMOVE" << endl;
            // data_MouseHook *data_t = (data_MouseHook*)malloc(sizeof(data_MouseHook));
            // data_t->msg = (int)wParam;
            // data_t->vkCode = (int)p->vkCode;
            // data_t->scanCode = (int)p->scanCode;
            // async.data = (void*)data_t;
            // uv_async_send(&async);

            break;
          }
          case WM_LBUTTONDOWN:
          {
            cout << "WM_LBUTTONDOWN" << endl;
            // GetMessageExtraInfo(void);
            if(IsTouchEvent() == true){
              cout << "WM_LBUTTONDOWN  true" << endl;
            }else{
              cout << "WM_LBUTTONDOWN  false" << endl;
            }


            data_MouseHook *data_t = (data_MouseHook*)malloc(sizeof(data_MouseHook));
            data_t->msg = (int)wParam;
            // data_t->vkCode = (int)p->vkCode;
            // data_t->scanCode = (int)p->scanCode;
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
            // if(hkLLKbDisabledKeysVkCodes[(int)p->vkCode] == true){
            //   // fprintf(stderr, "LLKbHook Disabled key: %d\n", (int)p->vkCode);
            //   return 1;
            // }else{
            //   // fprintf(stderr, "LLKbHook Enabled key: %d\n", (int)p->vkCode);
            // }
            // uv_async_send(&async);
            break;
          }
        }
    }
    return CallNextHookEx(NULL, nCode, wParam, lParam);
}






void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hookMouse", HookMouse);
  // NODE_SET_METHOD(exports, "disableVkCodeKey", LLKbHookDisableVkCodeKey);
  // NODE_SET_METHOD(exports, "enableVkCodeKey", LLKbHookEnableVkCodeKey);

}

NODE_MODULE(addon, init)

}  // namespace mbWinMouse
