#include <node.h>
#include <iostream>
#include <nan.h>
#include <windows.h>
#include <vector>
#include <stdlib.h>

#include "mb-windows-api-kb.h"

namespace mbWinApi {

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



BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam)
{
  int length = GetWindowTextLength(hwnd);
  if (length == 0) return TRUE;

	char class_name[80];
	char title[80];
	GetClassName(hwnd,class_name, sizeof(class_name));
	GetWindowText(hwnd,title,sizeof(title));
  // cout <<"Window title: "<<title<<endl;
  // cout <<"Class name: "<<class_name<<endl<<endl;

  if(strcmp(class_name,"Windows.UI.Core.CoreWindow") == 0) return TRUE;
  if(strcmp(class_name,"TMainForm") == 0) return TRUE;
  if(strcmp(class_name,"Button") == 0) return TRUE;

  DWORD procId;
  GetWindowThreadProcessId(hwnd, &procId);

  char module[256];
  GetWindowModuleFileName(hwnd, module, 256);

  HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION, FALSE, procId);


  // BOOL isIconic = IsIconic(hwnd);
  HWND shellWindow = GetShellWindow();
  BOOL isWinVisible = IsWindowVisible(hwnd);
  if(isWinVisible && shellWindow != hwnd){ 
    // cout <<"[HWND]: "<<hwnd<<" [Window title]: "<<title<<" [Class name]: "<<class_name<<endl;
    // cout << "    ProcessId: " << procId << "  " << module << endl;
    // cout <<" [IsWindowVisible]: "<<isWinVisible<<endl;
    // ((vector<int>)lParam)->push_back(hwnd);
    vector<HWND> *list = ((vector<HWND> *)lParam);
    list->push_back(hwnd);
  }


	return TRUE;
}

void GetAllWindows(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  // HWND shellWindow = GetShellWindow();
  // cout <<"ShellWindow: "<<shellWindow<<endl;
  // cout <<"GetAllWindows: "<<endl;

  vector<HWND> hwndList;
  EnumWindows(EnumWindowsProc, (LPARAM)&hwndList);
  // cout <<"hwndList.Size(): "<<hwndList.size()<<endl;
  // cout <<endl;
  // args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world2"));

  Local<Array> result_list = Array::New(isolate);
  for (unsigned int i = 0; i < hwndList.size(); i++ ) {
    Local<Object> result = Object::New(isolate);
    // pack_rain_result(isolate, result, results[i]);
    result_list->Set(i, Number::New(isolate, (DWORD)hwndList[i]));
  }

  // Return the list
  args.GetReturnValue().Set(result_list);
}

void mb_GetWindowText(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  int hwndInt = (int)(args[0]->NumberValue());
  HWND hwnd = (HWND)hwndInt;

	char title[80];
	GetWindowText(hwnd,title,sizeof(title));
  // cout <<"Window title: "<<title<<endl;

  // char class_name[80];
	// GetClassName(hwnd,class_name,sizeof(class_name));

  // args.GetReturnValue().Set(String::NewFromUtf8(isolate, "worldly"));
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, title));
  // args.GetReturnValue().Set(String::NewFromUtf8(isolate, class_name));
}

void mb_ShowWindow(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  int hwndInt = (int)(args[0]->NumberValue());
  HWND hwnd = (HWND)hwndInt;
  int nCmdShow = (int)(args[1]->NumberValue());
  ShowWindow(hwnd, nCmdShow);

}

void mb_SetForegroundWindow(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  int hwndInt = (int)(args[0]->NumberValue());
  HWND hwnd = (HWND)hwndInt;
  int i;
  // Used to fix bug with focus going back to previous window
  for(i = 0; i < 5; i++){
    SetForegroundWindow(hwnd);
    Sleep(30);
  }

}


void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "World"));
}



//
// HHOOK _hook;
// LRESULT __stdcall HookMouseCallback(int nCode, WPARAM wParam, LPARAM lParam)
// {
//     if (nCode >= 0)
//     {
//         MessageBox(NULL, "Mouse", "Mouse Info", MB_ICONINFORMATION);
//         // return 1;
//     }
//
//     // call the next hook in the hook chain. This is nessecary or your hook chain will break and the hook stops
//     return CallNextHookEx(_hook, nCode, wParam, lParam);
// }
// void SetMouseHook()
// {
//     if (!(_hook = SetWindowsHookEx(WH_MOUSE_LL, HookMouseCallback, NULL, 0)))  // TODO: HOOK WndProc and look at sending WM_COPYDATA message
//     {
//         MessageBox(NULL, "Failed to install hook!", "Error", MB_ICONERROR);
//     }
//
// }
// void ReleaseMouseHook()
// {
//     UnhookWindowsHookEx(_hook);
// }
// void mwm_EnableMouse(const v8::FunctionCallbackInfo<v8::Value>& args){
//   cout << "ReleaseMouseHook" << endl;
//   ReleaseMouseHook();
// }
// void mwm_DisableMouse(const v8::FunctionCallbackInfo<v8::Value>& args){
//   cout << "SetMouseHook" << endl;
//   SetMouseHook();
// }










void init(Local<Object> exports) {
  // NODE_SET_METHOD(exports, "start", Start);

  NODE_SET_METHOD(exports, "getAllWindows", GetAllWindows);
  NODE_SET_METHOD(exports, "getWindowText", mb_GetWindowText);
  NODE_SET_METHOD(exports, "showWindow", mb_ShowWindow);
  NODE_SET_METHOD(exports, "setForegroundWindow", mb_SetForegroundWindow);


  // Hooking
  // NODE_SET_METHOD(exports, "enableMouse", mwm_EnableMouse);
  // NODE_SET_METHOD(exports, "disableMouse", mwm_DisableMouse);
  // NODE_SET_METHOD(module, "exports", RunCallback);


  NODE_SET_METHOD(exports, "hello", Method);

  NODE_SET_METHOD(exports, "hookLLKb", mbWinApiKb::HookLLKb);
  NODE_SET_METHOD(exports, "disableKeyLLKbHook", mbWinApiKb::LLKbHookDisableKey);
  NODE_SET_METHOD(exports, "enableKeyLLKbHook", mbWinApiKb::LLKbHookEnableKey);
}

NODE_MODULE(addon, init)

}  // namespace mbWinApi
