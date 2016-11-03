#include <node.h>
#include <iostream>
#include <nan.h>
#include <windows.h>
#include <vector>
#include <stdlib.h>

// #include "mb-windows-api-kb.h"

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

void GetAllWindows(const FunctionCallbackInfo<Value>& args)
{
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

void mb_GetWindowText(const FunctionCallbackInfo<Value>& args)
{
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

void mb_ShowWindow(const FunctionCallbackInfo<Value>& args)
{
  Isolate* isolate = args.GetIsolate();

  int hwndInt = (int)(args[0]->NumberValue());
  HWND hwnd = (HWND)hwndInt;
  int nCmdShow = (int)(args[1]->NumberValue());
  ShowWindow(hwnd, nCmdShow);

}

void mb_SetForegroundWindow(const FunctionCallbackInfo<Value>& args)
{
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

void mb_GetWindowCoordinates(const FunctionCallbackInfo<Value>& args)
{
  Isolate* isolate = args.GetIsolate();

  int hwndInt = (int)(args[0]->NumberValue());
  HWND hwnd = (HWND)hwndInt;

  WINDOWINFO info;
  info.cbSize = sizeof(WINDOWINFO);
  GetWindowInfo(hwnd, &info);

  // cout <<"Info: "<< info.rcWindow.left << " " << info.rcWindow.top << " " << info.rcWindow.right << " " << info.rcWindow.bottom << endl;
  // fprintf(stdout, "left: %d, top: %d, right: %d, bottom: %d\n",
  //   info.rcWindow.left,
  //   info.rcWindow.top,
  //   info.rcWindow.right,
  //   info.rcWindow.bottom);

  // RECT r;
  // GetWindowRect(hwnd, &r);
  // cout <<"Rect: "<< r.left << " " << r.top << " " << r.right << " " << r.bottom << endl;
  //
  // char title[80];
	// GetWindowText(hwnd,title,sizeof(title));
  // cout <<"Window title: "<<title<<endl;

  Local<Object> obj = Object::New(isolate);
  obj->Set(String::NewFromUtf8(isolate, "left"), Number::New(isolate, info.rcWindow.left));
  obj->Set(String::NewFromUtf8(isolate, "top"), Number::New(isolate, info.rcWindow.top));
  obj->Set(String::NewFromUtf8(isolate, "right"), Number::New(isolate, info.rcWindow.right));
  obj->Set(String::NewFromUtf8(isolate, "bottom"), Number::New(isolate, info.rcWindow.bottom));

  // const int argc = 1;
  // Handle<Value> argv[argc];
  // argv[0] = obj;

  args.GetReturnValue().Set(obj);
}

void mb_SetWindowPos(const FunctionCallbackInfo<Value>& args)
{
  Isolate* isolate = args.GetIsolate();

  // int hWndInt = (int)(args[0]->NumberValue());
  HWND hWnd = (HWND)((int)(args[0]->NumberValue()));
  HWND hWndInsertAfter = (HWND)(((int)args[1]->NumberValue()));
  int X = (int)(args[2]->NumberValue());
  int Y = (int)(args[3]->NumberValue());
  int cx = (int)(args[4]->NumberValue());
  int cy = (int)(args[5]->NumberValue());
  UINT uFlags = (UINT)(args[6]->NumberValue());

  // WINDOWINFO info;
  // info.cbSize = sizeof(WINDOWINFO);
  // GetWindowInfo(hWnd, &info);

  SetWindowPos(hWnd, hWndInsertAfter, X, Y, cx, cy, uFlags);
    // SWP_ASYNCWINDOWPOS | SWP_NOACTIVATE | SWP_NOOWNERZORDER | SWP_NOZORDER);

  // UINT k = 0x4000 | 0x2000;
  // cout <<"k: "<< k <<endl;

  // SWP_ASYNCWINDOWPOS
  // SWP_NOACTIVATE
  // SWP_NOOWNERZORDER
  // SWP_NOZORDER

}

void mb_SetWindowLongPtr(const FunctionCallbackInfo<Value>& args)
{
  Isolate* isolate = args.GetIsolate();

  // int hWndInt = (int)(args[0]->NumberValue());
  HWND hWnd = (HWND)((int)(args[0]->NumberValue()));
  int nIndex = (int)(args[1]->NumberValue());
  DWORD dwNewLong = (DWORD)(args[2]->NumberValue());
  cout << dwNewLong << endl;

  SetWindowLongPtr(hWnd, nIndex, dwNewLong);

  // LONG nNewStyle = GetWindowLong(hWnd, GWL_STYLE) & ~WS_SYSMENU;
  // SetWindowLong(hWnd,GWL_STYLE,nNewStyle);

  // LONG_PTR nNewStyle = GetWindowLongPtr(hWnd, GWL_STYLE) & ~WS_SYSMENU;
  // SetWindowLongPtr(hWnd,GWL_STYLE,nNewStyle);

  // LONG_PTR nNewStyle = GetWindowLongPtr(hWnd, GWL_STYLE) & ~WS_SYSMENU;
  // SetWindowLongPtr(hWnd,GWL_STYLE,nNewStyle);

  // LONG nNewStyle = GetWindowLong(hWnd, GWL_EXSTYLE) & WS_EX_TOPMOST;
  // SetWindowLong(hWnd,GWL_EXSTYLE,nNewStyle);

  // SetWindowPos(hWnd,0,0,0,0,0,SWP_NOZORDER|SWP_NOMOVE|SWP_NOSIZE|SWP_NOACTIVATE|SWP_DRAWFRAME);

}

void mb_GetWindowLongPtr(const FunctionCallbackInfo<Value>& args)
{
  Isolate* isolate = args.GetIsolate();

  // int hWndInt = (int)(args[0]->NumberValue());
  HWND hWnd = (HWND)((int)(args[0]->NumberValue()));
  int nIndex = (int)(args[1]->NumberValue());

  DWORD prt = GetWindowLongPtr(hWnd, nIndex);
  cout << "GetWindowLongPrt" << endl;
  cout << "\t" << prt << endl;
  // cout << "\t" << &prt << endl;
  // cout << "\t" << *prt << endl;
  // fprintf(stderr, "Test\n");

  args.GetReturnValue().Set(Number::New(isolate, prt));
}

void mb_GetRgnBox(const FunctionCallbackInfo<Value>& args)
{
  Isolate* isolate = args.GetIsolate();

  int hwndInt = (int)(args[0]->NumberValue());
  HWND hWnd = (HWND)hwndInt;

  // WINDOWINFO info;
  // info.cbSize = sizeof(WINDOWINFO);
  // GetWindowInfo(hWnd, &info);

  // cout <<"Info: "<< info.rcWindow.left << " " << info.rcWindow.top << " " << info.rcWindow.right << " " << info.rcWindow.bottom << endl;
  // fprintf(stdout, "left: %d, top: %d, right: %d, bottom: %d\n",
  //   info.rcWindow.left,
  //   info.rcWindow.top,
  //   info.rcWindow.right,
  //   info.rcWindow.bottom);

  // RECT r;
  // GetWindowRect(hWnd, &r);
  // cout <<"Rect: "<< r.left << " " << r.top << " " << r.right << " " << r.bottom << endl;
  //
  // char title[80];
	// GetWindowText(hWnd,title,sizeof(title));
  // cout <<"Window title: "<<title<<endl;

  // HRGN rgn;
  // GetWindowRgn(hWnd, rgn);
  //
  // RECT r;
  // GetRgnBox(rgn, &r);
  // cout <<"Rect: "<< r.left << " " << r.top << " " << r.right << " " << r.bottom << endl;


  // Local<Object> obj = Object::New(isolate);
  // obj->Set(String::NewFromUtf8(isolate, "left"), Number::New(isolate, r.left));
  // obj->Set(String::NewFromUtf8(isolate, "top"), Number::New(isolate, r.top));
  // obj->Set(String::NewFromUtf8(isolate, "right"), Number::New(isolate, r.right));
  // obj->Set(String::NewFromUtf8(isolate, "bottom"), Number::New(isolate, r.bottom));
  //
  // // const int argc = 1;
  // // Handle<Value> argv[argc];
  // // argv[0] = obj;
  //
  // args.GetReturnValue().Set(obj);
}













void init(Local<Object> exports) {

  NODE_SET_METHOD(exports, "getAllWindows", GetAllWindows);
  NODE_SET_METHOD(exports, "getWindowText", mb_GetWindowText);
  NODE_SET_METHOD(exports, "showWindow", mb_ShowWindow);
  NODE_SET_METHOD(exports, "setForegroundWindow", mb_SetForegroundWindow);
  NODE_SET_METHOD(exports, "getWindowCoordinates", mb_GetWindowCoordinates);
  NODE_SET_METHOD(exports, "setWindowPos", mb_SetWindowPos);
  NODE_SET_METHOD(exports, "setWindowLongPtr", mb_SetWindowLongPtr);
  NODE_SET_METHOD(exports, "getWindowLongPtr", mb_GetWindowLongPtr);
  NODE_SET_METHOD(exports, "getRgnBox", mb_GetRgnBox);

}

NODE_MODULE(addon, init)

}  // namespace mbWinApi
