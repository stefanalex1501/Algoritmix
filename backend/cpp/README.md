C++ engine build

Option 1 (MinGW / g++):
- `npm run cpp:build`

Option 2 (Visual Studio Build Tools / cl):
- open "x64 Native Tools Command Prompt for VS"
- run: `npm run cpp:build:msvc`

After build, start backend:
- `npm run dev`

The API endpoint used by frontend:
- `POST /api/v1/simulate-cpp`
