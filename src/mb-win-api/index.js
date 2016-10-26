const bindings = require('bindings');
const mbWinApi = bindings('mb-win-api');

let CONSTANTS = {
  VK_LBUTTON: 1,
  VK_RBUTTON: 2,
  VK_CANCEL: 3,
  VK_MBUTTON: 4,
  VK_BACK: 8,
  VK_TAB: 9,
  VK_CLEAR: 12,
  VK_RETURN: 13,
  VK_SHIFT: 16,
  VK_CONTROL: 17,
  VK_MENU: 18,
  VK_PAUSE: 19,
  VK_CAPITAL: 20,
  VK_ESCAPE: 27,
  VK_SPACE: 32,
  VK_PRIOR: 33,
  VK_NEXT: 34,
  VK_END: 35,
  VK_HOME: 36,
  VK_LEFT: 37,
  VK_UP: 38,
  VK_RIGHT: 39,
  VK_DOWN: 40,
  VK_SELECT: 41,
  VK_PRINT: 42,
  VK_EXECUTE: 43,
  VK_SNAPSHOT: 44,
  VK_INSERT: 45,
  VK_DELETE: 46,
  VK_HELP: 47,
  VK_0: 48,
  VK_1: 49,
  VK_2: 50,
  VK_3: 51,
  VK_4: 52,
  VK_5: 53,
  VK_6: 54,
  VK_7: 55,
  VK_8: 56,
  VK_9: 57,
  VK_A: 65,
  VK_B: 66,
  VK_C: 67,
  VK_D: 68,
  VK_E: 69,
  VK_F: 70,
  VK_G: 71,
  VK_H: 72,
  VK_I: 73,
  VK_J: 74,
  VK_K: 75,
  VK_L: 76,
  VK_M: 77,
  VK_N: 78,
  VK_O: 79,
  VK_P: 80,
  VK_Q: 81,
  VK_R: 82,
  VK_S: 83,
  VK_T: 84,
  VK_U: 85,
  VK_V: 86,
  VK_W: 87,
  VK_X: 88,
  VK_Y: 89,
  VK_Z: 90,
  VK_LWIN: 91,
  VK_RWIN: 92,
  VK_APPS: 93,
  VK_NUMPAD0: 96,
  VK_NUMPAD1: 97,
  VK_NUMPAD2: 98,
  VK_NUMPAD3: 99,
  VK_NUMPAD4: 100,
  VK_NUMPAD5: 101,
  VK_NUMPAD6: 102,
  VK_NUMPAD7: 103,
  VK_NUMPAD8: 104,
  VK_NUMPAD9: 105,
  VK_MULTIPLY: 106,
  VK_ADD: 107,
  VK_SEPARATOR: 108,
  VK_SUBTRACT: 109,
  VK_DECIMAL: 110,
  VK_DIVIDE: 111,
  VK_F1: 112,
  VK_F2: 113,
  VK_F3: 114,
  VK_F4: 115,
  VK_F5: 116,
  VK_F6: 117,
  VK_F7: 118,
  VK_F8: 119,
  VK_F9: 120,
  VK_F10: 121,
  VK_F11: 122,
  VK_F12: 123,
  VK_F13: 124,
  VK_F14: 125,
  VK_F15: 126,
  VK_F16: 127,
  VK_F17: 128,
  VK_F18: 129,
  VK_F19: 130,
  VK_F20: 131,
  VK_F21: 132,
  VK_F22: 133,
  VK_F23: 134,
  VK_F24: 135,
  VK_NUMLOCK: 144,
  VK_SCROLL: 145,
  VK_LSHIFT: 160,
  VK_LCONTROL: 162,
  VK_LMENU: 164,
  VK_RSHIFT: 161,
  VK_RCONTROL: 163,
  VK_RMENU: 165,

  SWP_ASYNCWINDOWPOS: 0x4000,
  SWP_DEFERERASE: 0x2000,
  SWP_DRAWFRAME: 0x0020,
  SWP_FRAMECHANGED: 0x0020,
  SWP_HIDEWINDOW: 0x0080,
  SWP_NOACTIVATE: 0x0010,
  SWP_NOCOPYBITS: 0x0100,
  SWP_NOMOVE: 0x0002,
  SWP_NOOWNERZORDER: 0x0200,
  SWP_NOREDRAW: 0x0008,
  SWP_NOREPOSITION: 0x0200,
  SWP_NOSENDCHANGING: 0x0400,
  SWP_NOSIZE: 0x0001,
  SWP_NOZORDER: 0x0004,
  SWP_SHOWWINDOW: 0x0040,

  GWL_EXSTYLE: -20,
  GWLP_HINSTANCE: -6,
  GWLP_HWNDPARENT: -8,
  GWLP_ID: -12,
  GWL_STYLE: -16,
  GWLP_USERDATA: -21,
  GWLP_WNDPROC: -4,

  WS_BORDER: 0x800000,
  WS_POPUP: 0x80000000,
  WS_CAPTION: 0xC00000,
  WS_DISABLED: 0x8000000,
  WS_DLGFRAME: 0x400000,
  WS_GROUP: 0x20000,
  WS_HSCROLL: 0x100000,
  WS_MAXIMIZE: 0x1000000,
  WS_MAXIMIZEBOX: 0x10000,
  WS_MINIMIZE: 0x20000000,
  WS_MINIMIZEBOX: 0x20000,
  WS_OVERLAPPED: 0,
  WS_OVERLAPPEDWINDOW: 0xCF0000,
  WS_POPUPWINDOW: 0x80880000,
  WS_SIZEBOX: 0x40000,
  WS_SYSMENU: 0x80000,
  WS_TABSTOP: 0x10000,
  WS_THICKFRAME: 0x40000,
  WS_VSCROLL: 0x200000,
  WS_VISIBLE: 0x10000000,
  WS_CHILD: 0x40000000

};

CONSTANTS.WS_EX_ACCEPTFILES = 0x00000010;
CONSTANTS.WS_EX_APPWINDOW = 0x00040000;
CONSTANTS.WS_EX_CLIENTEDGE = 0x00000200;
CONSTANTS.WS_EX_COMPOSITED = 0x02000000;
CONSTANTS.WS_EX_CONTEXTHELP = 0x00000400;
CONSTANTS.WS_EX_CONTROLPARENT = 0x00010000;
CONSTANTS.WS_EX_DLGMODALFRAME = 0x00000001;
CONSTANTS.WS_EX_LAYERED = 0x00080000;
CONSTANTS.WS_EX_LAYOUTRTL = 0x00400000;
CONSTANTS.WS_EX_LEFT = 0x00000000;
CONSTANTS.WS_EX_LEFTSCROLLBAR = 0x00004000;
CONSTANTS.WS_EX_LTRREADING = 0x00000000;
CONSTANTS.WS_EX_MDICHILD = 0x00000040;
CONSTANTS.WS_EX_NOACTIVATE = 0x08000000;
CONSTANTS.WS_EX_NOINHERITLAYOUT = 0x00100000;
CONSTANTS.WS_EX_NOPARENTNOTIFY = 0x00000004;
CONSTANTS.WS_EX_NOREDIRECTIONBITMAP = 0x00200000;
CONSTANTS.WS_EX_RIGHT = 0x00001000;
CONSTANTS.WS_EX_RIGHTSCROLLBAR = 0x00000000;
CONSTANTS.WS_EX_RTLREADING = 0x00002000;
CONSTANTS.WS_EX_STATICEDGE = 0x00020000;
CONSTANTS.WS_EX_TOOLWINDOW = 0x00000080;
CONSTANTS.WS_EX_TOPMOST = 0x00000008;
CONSTANTS.WS_EX_TRANSPARENT = 0x00000020;
CONSTANTS.WS_EX_WINDOWEDGE = 0x00000100;
CONSTANTS.WS_EX_OVERLAPPEDWINDOW = (CONSTANTS.WS_EX_WINDOWEDGE | CONSTANTS.WS_EX_CLIENTEDGE);
CONSTANTS.WS_EX_PALETTEWINDOW = (CONSTANTS.WS_EX_WINDOWEDGE | CONSTANTS.WS_EX_TOOLWINDOW | CONSTANTS.WS_EX_TOPMOST);


mbWinApi.CONSTANTS = CONSTANTS;

module.exports = mbWinApi;