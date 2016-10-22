{
  "targets": [
    {
      "target_name": "mb-windows-api",
      "sources": [
        "src/mb-windows-api/mb-windows-api.cc",
        "src/mb-windows-api/mb-windows-api-kb.cc"
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    },
    {
      "target_name": "mb-win-ll-keyboard",
      "sources": [
        "src/mb-win-ll-keyboard/mb-win-ll-keyboard.cc"
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
