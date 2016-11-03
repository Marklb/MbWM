#include <stdio.h>
#include <windows.h>

int main() {
  printf("%x\n", WS_EX_TOPMOST); // 8
  printf("%x\n", 0x08000000);

  printf("%d\n", WS_EX_TOPMOST);
  printf("%d\n", 0x0FFFFFFF); // 268435455

  printf("%x\n", (0x00000008 | 0x00000080)); // 88
  printf("%d\n", (0x00000008 | 0x00000080)); // 136

  return 0;
}
