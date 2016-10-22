#include <node.h>
#include <iostream>
#include <nan.h>
#include <windows.h>
#include <vector>
#include <stdlib.h>

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

uv_async_t async;
uv_mutex_t lock;

uv_mutex_t event_lock;
uv_cond_t init_cond;
uv_mutex_t init_lock;
// uv_thread_t thread;

void HookLLKb(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  cout << "Hooking LL Kb" << endl;

  async->data = (void *)10;

  uv_async_init(uv_default_loop(), &async, LLKbHookHandleKeyEvent);
	uv_mutex_init(&lock);

	// hook_ref = MouseHookRegister(OnMouseEvent, this);


  int param = 0;
  uv_thread_t t_id;
  uv_thread_cb uvcb = (uv_thread_cb)RunThread;

  uv_thread_create(&thread, uvcb, param);

  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "World"));
}

void RunThread(void* arg) {
	// MouseHookManager* mouse = (MouseHookManager*) arg;
	// mouse->_Run();
  uv_mutex_init(&event_lock);
	uv_mutex_init(&init_lock);
	uv_cond_init(&init_cond);
  _Run();
}

void _Run() {
	MSG msg;
	BOOL val;

	uv_mutex_lock(&init_lock);

	PeekMessage(&msg, NULL, WM_USER, WM_USER, PM_NOREMOVE);
	thread_id = GetCurrentThreadId();

	uv_cond_signal(&init_cond);
	uv_mutex_unlock(&init_lock);

	HHOOK hook = SetWindowsHookEx(WH_MOUSE_LL, LowLevelMouseProc, (HINSTANCE) NULL, 0);

	while((val = GetMessage(&msg, NULL, 0, 0)) != 0) {
		if(val == -1) throw std::runtime_error("GetMessage failed (return value -1)");
		if(msg.message == WM_STOP_MESSAGE_LOOP) break;
	}

	UnhookWindowsHookEx(hook);

	uv_mutex_lock(&init_lock);
	// thread_id = NULL;
	uv_mutex_unlock(&init_lock);
}

void LLKbHookHandleKeyEvent(uv_async_t *handle) {
  cout << "LLKbHookHandleKeyEvent" << endl;
  // data_LLKbHook *data_t = (data_LLKbHook*)handle->data;

  // auto isolate = Isolate::GetCurrent();
  // auto context = isolate->GetCurrentContext();
  // auto global = context->Global();
  // HandleScope scope;
  //
  // Local<Object> obj = Object::New(isolate);
  // obj->Set(String::NewFromUtf8(isolate, "msg"), Number::New(isolate, data_t->msg));
  // obj->Set(String::NewFromUtf8(isolate, "vkCode"), Number::New(isolate, data_t->vkCode));
  //
  // const int argc = 1;
  // Handle<Value> argv[argc];
  // argv[0] = obj;
  //
  // auto fn = Local<Function>::New(isolate, LLKbPersistentCallback);
  // fn->Call(global, argc, argv);
  // free(data_t);
}

// uv_mutex_lock(&event_lock);
//
// for(std::list<MouseHookRef>::iterator it = listeners->begin(); it != listeners->end(); it++) {
//   (*it)->callback(type, point, (*it)->data);
// }
//
// uv_mutex_unlock(&event_lock);

HHOOK hhkLLKb;

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
            // data_LLKbHook *data_t = (data_LLKbHook*)malloc(sizeof(data_LLKbHook));
            // data_t->msg = (int)wParam;
            // data_t->vkCode = (int)p->vkCode;
            // async.data = (void*)data_t;
            // uv_async_send(&async);
            
            break;
          }
        }

        switch (wParam)
        {
          case WM_KEYDOWN:
          case WM_KEYUP:
          {
            // if(hkLLKbDisabledKeysVkCodes[(int)p->vkCode] == true){
            //   // fprintf(stderr, "LLKbHook Disabled key: %d\n", (int)p->vkCode);
            //   return 1;
            // }else{
            //   // fprintf(stderr, "LLKbHook Enabled key: %d\n", (int)p->vkCode);
            // }
            break;
          }
        }
    }
    return CallNextHookEx(NULL, nCode, wParam, lParam);
}






void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hookLLKb", HookLLKb);

}

NODE_MODULE(addon, init)

}  // namespace mbWinApi
