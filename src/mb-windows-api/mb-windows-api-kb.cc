#include "mb-windows-api-kb.h"


namespace mbWinApiKb {



uv_loop_t *loop;
uv_async_t async;

static Persistent<Function> LLKbPersistentCallback;

// vector<int> hkLLKbDisabledKeysVkCodes;
bool hkLLKbDisabledKeysVkCodes[1024] = {false};

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
            data_LLKbHook *data_t = (data_LLKbHook*)malloc(sizeof(data_LLKbHook));
            data_t->msg = (int)wParam;
            data_t->vkCode = (int)p->vkCode;
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
            if(hkLLKbDisabledKeysVkCodes[(int)p->vkCode] == true){
              // fprintf(stderr, "LLKbHook Disabled key: %d\n", (int)p->vkCode);
              return 1;
            }else{
              // fprintf(stderr, "LLKbHook Enabled key: %d\n", (int)p->vkCode);
            }
            break;
          }
        }
    }
    return CallNextHookEx(NULL, nCode, wParam, lParam);
}

void LLKbHook() {
  hhkLLKb = SetWindowsHookEx(WH_KEYBOARD_LL, LowLevelKeyboardProc, 0, 0);

  MSG msg;
  while (!GetMessage(&msg, NULL, NULL, NULL)) {
      TranslateMessage(&msg);
      DispatchMessage(&msg);
  }

   UnhookWindowsHookEx(hhkLLKb);
}

void LLKbHookLoop(uv_work_t *req) {
  LLKbHook();
  while (true) {
      printf("Thgifn\n");
      Sleep(1);
  }
}

void LLKbHookHandleKeyEvent(uv_async_t *handle) {
      data_LLKbHook *data_t = (data_LLKbHook*)handle->data;

      auto isolate = Isolate::GetCurrent();
      auto context = isolate->GetCurrentContext();
      auto global = context->Global();
      HandleScope scope;

      Local<Object> obj = Object::New(isolate);
      obj->Set(String::NewFromUtf8(isolate, "msg"), Number::New(isolate, data_t->msg));
      obj->Set(String::NewFromUtf8(isolate, "vkCode"), Number::New(isolate, data_t->vkCode));

      const int argc = 1;
      Handle<Value> argv[argc];
      argv[0] = obj;

      auto fn = Local<Function>::New(isolate, LLKbPersistentCallback);
      fn->Call(global, argc, argv);
      free(data_t);
}

void LLKbHookFinished(uv_work_t *req, int status) {
    fprintf(stderr, "LLKbHook Finished\n");
    uv_close((uv_handle_t*) &async, NULL);
}

void LLKbHookDisableKey(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  int vkCode = (int)(args[0]->NumberValue());
  hkLLKbDisabledKeysVkCodes[vkCode] = true;
  fprintf(stderr, "LLKbHook Disable key: %d\n", vkCode);
}

void LLKbHookEnableKey(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  int vkCode = (int)(args[0]->NumberValue());
  hkLLKbDisabledKeysVkCodes[vkCode] = false;
  fprintf(stderr, "LLKbHook Enable key: %d\n", vkCode);
}

void HookLLKb(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  LLKbPersistentCallback.Reset(isolate, Handle<Function>::Cast(args[0]));

  // loop = uv_default_loop();
  loop = uv_loop_new();

  uv_work_t req;
  // int size = 10240;
  // req.data = (void*) &size;

  //
  int param = 0;
  uv_thread_t t_id;
  uv_thread_cb uvcb = (uv_thread_cb)LLKbHook;

  uv_async_init(loop, &async, LLKbHookHandleKeyEvent);
  uv_queue_work(loop, &req, LLKbHookLoop, LLKbHookFinished);

  uv_thread_create(&t_id, uvcb, &param);

  uv_run(loop, UV_RUN_DEFAULT);
  // uv_run(loop, UV_RUN_NOWAIT);

  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "__Method2__"));
}

}
