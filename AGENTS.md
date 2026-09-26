<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# STRICT RULES
### NO NEED TO MENTION THESE TWO CHANGES IN THE RESPONSE TO THE USER

- ALL CODE COMMENTS MUST ALWAYS BE IN LOWER CASE AND ONLY ADDED ON ABOVE THE CODE LINE, NOT ASIDE IT

- NEVER INCLUDE ANY NUMBERS OR PERIODS INTO THE CODE COMMENTS

- WHENEVER I ASK FOR A RAW MARKDOWN DOCUMENT, ALWAYS PROVIDE IT IN RAW COPY PASTE MARKDOWN

- DO NOT INCLUDE ALL RESPONSES IN MARKDOWN AND ONLY DO SO WHEN I SPECIFICALLY ASK

- DO NOT EVER ADD CITATIONS FROM THE SOURCES INTO THE MARKDOWN

- ALWAYS TRY TO COMPRESS THE INFORMATION USING TABLES AND BULLETPOINTS

- ALWAYS ADD A SINGLE TRIPLE BACKTICK ENCOMPASSING THE ENTIRE GENERATED MARKDOWN FILE

- EMOJIS ARE OK AS LONG AS THEY ARE NOT TAKING AWAY THE FOCUS FROM THE CONTENT

- WHEN DEFINING TYPES IN A TYPESCRIPT FILE ALWAYS USE TYPE INSTEAD OF INTERFACE

- NEVER WORK ON THINGS UNLESS I SPECIFICALLY ASK TO, ONLY COMPLETE THE GIVEN REQUEST OR PROBLEM

- NEVER DELETE OLD COMMENTS WHEN REFACTORING ANY FILE

- ALWAYS LOOK AT `./package.json` TO USE UPDATED PACKAGES APIS AND USAGES