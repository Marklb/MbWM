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
using v8::Context;
using v8::Global;

using Nan::AsyncQueueWorker;
using Nan::AsyncWorker;
using Nan::Callback;
using Nan::HandleScope;
using Nan::New;
using Nan::Null;
using Nan::To;

// TODO: Implement accelerator checks in c++ to block default input

using namespace std;

DWORD thread_id;

uv_async_t async;

static Persistent<Function> LLKbPersistentCallback;

Persistent<Array> persistPressedKeys;
Persistent<Array> persistDisabledVkCodes;


bool hkLLKbDisabledKeysVkCodes[VKCODES_BUFFSIZE] = {false};

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

  Local<String> keyMsg = String::NewFromUtf8(isolate, "msg");
  Local<String> keyVkCode = String::NewFromUtf8(isolate, "vkCode");
  Local<String> keyScanCode = String::NewFromUtf8(isolate, "scanCode");
  Local<String> keyIsRepeat = String::NewFromUtf8(isolate, "isRepeat");

  Local<Object> obj = Object::New(isolate);
  obj->Set(keyMsg, Number::New(isolate, data_t->msg));
  obj->Set(keyVkCode, Number::New(isolate, data_t->vkCode));
  obj->Set(keyScanCode, Number::New(isolate, data_t->scanCode));

  if(data_t->msg == WM_KEYDOWN){
    Local<Array> t = Local<Array>::New(isolate, persistPressedKeys);
    if(t->Get(data_t->vkCode) == v8::True(isolate)){
      obj->Set(keyIsRepeat, v8::True(isolate));
    }else{
      t->Set(data_t->vkCode, v8::True(isolate));
      obj->Set(keyIsRepeat, v8::False(isolate));
    }
  }else if(data_t->msg == WM_KEYUP){
    Local<Array> t = Local<Array>::New(isolate, persistPressedKeys);
    t->Set(data_t->vkCode, v8::False(isolate));
  }

  const int argc = 1;
  Handle<Value> argv[argc];
  argv[0] = obj;

  auto fn = Local<Function>::New(isolate, LLKbPersistentCallback);
  // fn->Call(global, argc, argv);
  fn->Call(context, global, argc, argv);




  // This is a way of reading the value after changing it in fn->Call()
  // int current = obj->ToObject()->Get(keyScanCode)->NumberValue();
  // cout << "Current: " << current << endl;

  // May be useful for getting the fn->Call()  return
  // double current = target->ToObject()->Get(key)->NumberValue();


  free(data_t);
}

void LLKbHookDisableVkCodeKey(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  int vkCode = (int)(args[0]->NumberValue());
  hkLLKbDisabledKeysVkCodes[vkCode] = true;
  // fprintf(stderr, "LLKbHook Disable key: %d\n", vkCode);

  Local<Array> target = Local<Array>::New(isolate, persistDisabledVkCodes);
  target->Set(vkCode, v8::True(isolate));
}

void LLKbHookEnableVkCodeKey(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  int vkCode = (int)(args[0]->NumberValue());
  hkLLKbDisabledKeysVkCodes[vkCode] = false;
  // fprintf(stderr, "LLKbHook Enable key: %d\n", vkCode);

  Local<Array> target = Local<Array>::New(isolate, persistDisabledVkCodes);
  target->Set(vkCode, v8::False(isolate));
}

void LLKBHookGetAsyncKeyState(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  int vkCode = (int)(args[0]->NumberValue());
  SHORT state = GetAsyncKeyState(vkCode);
  args.GetReturnValue().Set(Number::New(isolate, state));
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
  NODE_SET_METHOD(exports, "hookLLKb", HookLLKb);
  NODE_SET_METHOD(exports, "disableVkCodeKey", LLKbHookDisableVkCodeKey);
  NODE_SET_METHOD(exports, "enableVkCodeKey", LLKbHookEnableVkCodeKey);
  NODE_SET_METHOD(exports, "getAsyncKeyState", LLKBHookGetAsyncKeyState);

  Isolate* isolate = Isolate::GetCurrent();

  // Handle<Array> array = Array::New(isolate, 10);
  // array->Set(0, v8::True(isolate));
  // persistArray.Reset(isolate, array->ToObject());

  Handle<Array> array = Array::New(isolate, 256);
  Handle<Array> array2 = Array::New(isolate, 256);
  for(int i = 0; i < 256; i++){
    array->Set(i, v8::False(isolate));
    array2->Set(i, v8::False(isolate));
  }
  persistPressedKeys.Reset(isolate, array);
  persistDisabledVkCodes.Reset(isolate, array2);
  exports->Set(String::NewFromUtf8(isolate, "pressedKeys"), array);
  exports->Set(String::NewFromUtf8(isolate, "disabledVkCodes"), array2);


  ////////////////////////////////////////////
  // Set an addon variable
  //  Usage in javascript: console.log(addon.mehValue)  // prints 9753
  ////////////////////////////////////////////
  // exports->Set(String::NewFromUtf8(isolate, "mehValue"), Number::New(isolate, 9753));

  ////////////////////////////////////////////
  // Set a global variable
  //  Usage in javascript: console.log(global.mehValue)  // prints 1357
  ////////////////////////////////////////////
  Local<Object> global = isolate->GetCurrentContext()->Global();
  // global->Set(String::NewFromUtf8(isolate, "mehValue"), Number::New(isolate, 1357));
}

NODE_MODULE(addon, init)

}  // namespace mbWinLLKb
