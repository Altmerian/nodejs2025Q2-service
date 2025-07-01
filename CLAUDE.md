# Project-specific guidelines

- Code style guide: @docs/code-style.md
- Project requirements: @docs/project-requirements.md
- System design: @docs/system-design.md
- Source control: @docs/source-control.md
- Current task: @docs/current-task.md
- Task requirements: @docs/task-requirements.md
- Current progress: @docs/todo.md
- Implementation plan: @docs/plan.md

# Testing

- The current project already has test suites for all development phases in the @test/ folder, VERIFY the existing tests pass before committing and finishing the task.
- IMPORTANT: Do not change any existing files in the @test/ folder, you can add new tests alongside with the source code if needed.
- Use specific test suites to verify the changes you make. For e2e tests you should run the server beforehand `npm run start:dev` in another process and then run the test.

# Project workspace

This project could be developed both on WSL and Windows and the absolute path to the project for `Bash` commands could be different depending on how VsCode treats the Windows symbolic link `C:\Users\Altme` -> `C:\Users\Altmer`.

- For WSL: `/mnt/c/Users/Altme/JsProjects/NodeJsCourse/nodejs2025Q2-service`
- For Windows: `C:\Users\Altmer\JsProjects\NodeJsCourse\nodejs2025Q2-service`

# Guardrails

- Do not use `pkill -f node` for killing all node processes, check specific process id that you want to kill with `ps aux | grep node` and then kill it with `kill -9 <pid>`
