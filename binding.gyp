{
  "targets": [
    {
      "target_name": "mb-win-ll-keyboard",
      "sources": [
        "src/mb-win-ll-keyboard/mb-win-ll-keyboard.cc"
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    },
    {
      "target_name": "mb-win-api",
      "sources": [
        "src/mb-win-api/mb-win-api.cc"
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
