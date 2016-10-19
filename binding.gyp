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
    }
  ]
}
